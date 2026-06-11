#!/usr/bin/env python3
"""
ElderPath data pipeline.
Input:  pipeline/NH_ProviderInfo.csv  (CMS Provider Data Catalog, dataset 4pq5-n9py)
Output: data/index.json + data/states/XX.json — one shard per state, consumed by /report/.

Grade methodology (mirrors the published weights on the landing page):
  40% inspections (CMS Health Inspection Rating)
  25% staffing    (CMS Staffing Rating)
  20% quality     (CMS QM Rating)
  15% accountability (fines, payment denials — fewer/lower = better)
Caps: CMS Abuse Icon -> max C. Special Focus Facility status -> max D.
Missing components renormalize the remaining weights; no health-inspection
rating at all -> grade "ND" (not enough data).
"""
import csv, json, os, re
from collections import defaultdict

SRC = os.path.join(os.path.dirname(__file__), "NH_ProviderInfo.csv")
OUT = os.path.join(os.path.dirname(__file__), "..", "data")

def num(v):
    if v is None: return None
    v = v.strip().replace(",", "").replace("$", "")
    if v == "" or v == ".": return None
    try:
        f = float(v)
        return int(f) if f == int(f) else round(f, 2)
    except ValueError:
        return None

def title_case(s):
    s = s.strip()
    if not s: return s
    out = s.title()
    # keep common abbreviations readable
    out = re.sub(r"\bLlc\b", "LLC", out)
    out = re.sub(r"\bIi\b", "II", out)
    out = re.sub(r"\bIii\b", "III", out)
    out = re.sub(r"\bIv\b", "IV", out)
    return out

def accountability_score(fines, fines_usd, denials):
    score = 100.0
    score -= 20 * (fines or 0)
    score -= 25 * (denials or 0)
    score -= min(30.0, (fines_usd or 0) / 10000.0)
    return max(0.0, score)

def star_score(r):
    return None if r is None else (r - 1) / 4.0 * 100.0

def compute_grade(h, s, q, fines, fines_usd, denials, abuse, sff):
    if h is None:
        return {"letter": "ND", "score": None}
    parts = [(star_score(h), 0.40), (star_score(s), 0.25), (star_score(q), 0.20),
             (accountability_score(fines, fines_usd, denials), 0.15)]
    avail = [(v, w) for v, w in parts if v is not None]
    total_w = sum(w for _, w in avail)
    score = sum(v * w for v, w in avail) / total_w
    if abuse: score = min(score, 55.0)
    if sff:   score = min(score, 45.0)
    for cut, letter in ((88, "A"), (80, "A-"), (70, "B"), (58, "C"), (45, "D")):
        if score >= cut:
            return {"letter": letter, "score": round(score)}
    return {"letter": "F", "score": round(score)}

rows = []
with open(SRC, encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        rows.append(r)

processing_date = rows[0].get("Processing Date", "") if rows else ""

states = defaultdict(list)
for r in rows:
    st = r["State"].strip()
    abuse = r["Abuse Icon"].strip().upper() == "Y"
    sff_raw = r["Special Focus Status"].strip()
    sff = sff_raw != ""
    h = num(r["Health Inspection Rating"])
    s = num(r["Staffing Rating"])
    q = num(r["QM Rating"])
    fines = num(r["Number of Fines"])
    fines_usd = num(r["Total Amount of Fines in Dollars"])
    denials = num(r["Number of Payment Denials"])
    fac = {
        "ccn": r["CMS Certification Number (CCN)"].strip(),
        "name": title_case(r["Provider Name"]),
        "addr": title_case(r["Provider Address"]),
        "city": title_case(r["City/Town"]),
        "zip": r["ZIP Code"].strip(),
        "county": title_case(r["County/Parish"]),
        "phone": r["Telephone Number"].strip(),
        "own": r["Ownership Type"].strip(),
        "chain": title_case(r.get("Chain Name", "") or ""),
        "beds": num(r["Number of Certified Beds"]),
        "res": num(r["Average Number of Residents per Day"]),
        "ratings": {"o": num(r["Overall Rating"]), "h": h, "s": s, "q": q},
        "staff": {
            "total": num(r["Reported Total Nurse Staffing Hours per Resident per Day"]),
            "rn": num(r["Reported RN Staffing Hours per Resident per Day"]),
            "wkend": num(r["Total number of nurse staff hours per resident per day on the weekend"]),
            "turn": num(r["Total nursing staff turnover"]),
            "rnturn": num(r["Registered Nurse turnover"]),
        },
        "insp": {
            "date": r["Rating Cycle 1 Standard Survey Health Date"].strip(),
            "def1": num(r["Rating Cycle 1 Total Number of Health Deficiencies"]),
            "def23": num(r["Rating Cycle 2/3 Total Number of Health Deficiencies"]),
            "infect": num(r["Number of Citations from Infection Control Inspections"]),
        },
        "pen": {"fines": fines, "usd": fines_usd, "denials": denials},
        "flags": {
            "abuse": abuse,
            "sff": sff_raw if sff else "",
            "oldInsp": r["Most Recent Health Inspection More Than 2 Years Ago"].strip().upper() == "Y",
            "ownChg": r["Provider Changed Ownership in Last 12 Months"].strip().upper() == "Y",
        },
        "grade": compute_grade(h, s, q, fines, fines_usd, denials, abuse, sff),
    }
    states[st].append(fac)

def avg(vals):
    vals = [v for v in vals if v is not None]
    return round(sum(vals) / len(vals), 2) if vals else None

os.makedirs(os.path.join(OUT, "states"), exist_ok=True)
index = {"updated": processing_date, "source": "CMS Provider Data Catalog — Nursing Home Provider Information (4pq5-n9py)", "states": []}

national_hprd = []; national_def = []
for st in sorted(states):
    fs = sorted(states[st], key=lambda x: x["name"])
    st_avg = {
        "hprd": avg([f["staff"]["total"] for f in fs]),
        "rn": avg([f["staff"]["rn"] for f in fs]),
        "def1": avg([f["insp"]["def1"] for f in fs]),
        "fines": avg([f["pen"]["fines"] for f in fs]),
        "turn": avg([f["staff"]["turn"] for f in fs]),
    }
    national_hprd += [f["staff"]["total"] for f in fs]
    national_def += [f["insp"]["def1"] for f in fs]
    with open(os.path.join(OUT, "states", f"{st}.json"), "w") as fp:
        json.dump({"state": st, "updated": processing_date, "avg": st_avg, "facilities": fs}, fp, separators=(",", ":"))
    index["states"].append({"code": st, "n": len(fs)})

index["national"] = {"hprd": avg(national_hprd), "def1": avg(national_def), "n": sum(s["n"] for s in index["states"])}
with open(os.path.join(OUT, "index.json"), "w") as fp:
    json.dump(index, fp, separators=(",", ":"))

grades = defaultdict(int)
for st in states:
    for f in states[st]:
        grades[f["grade"]["letter"]] += 1
print(f"facilities: {index['national']['n']}  states: {len(index['states'])}  updated: {processing_date}")
print("grade distribution:", dict(sorted(grades.items())))
