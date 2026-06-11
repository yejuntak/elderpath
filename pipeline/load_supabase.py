#!/usr/bin/env python3
"""
Bulk-load data/states/*.json into Supabase via PostgREST.
Requires a temporary anon INSERT policy on facilities/state_stats (dropped after load).
Usage: SUPABASE_URL=... SUPABASE_KEY=... python3 pipeline/load_supabase.py
"""
import json, os, glob, urllib.request, sys

URL = os.environ["SUPABASE_URL"].rstrip("/")
KEY = os.environ["SUPABASE_KEY"]
BASE = os.path.join(os.path.dirname(__file__), "..", "data", "states")

def post(path, payload):
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        URL + path, data=body, method="POST",
        headers={
            "apikey": KEY, "Authorization": "Bearer " + KEY,
            "Content-Type": "application/json",
            "Prefer": "return=minimal,resolution=merge-duplicates",
        })
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.status
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} on {path}: {e.read().decode()[:400]}")
        raise

def flatten(f):
    return {
        "ccn": f["ccn"], "name": f["name"], "addr": f["addr"], "city": f["city"],
        "zip": f["zip"], "county": f["county"], "phone": f["phone"],
        "own": f["own"], "chain": f["chain"], "beds": f["beds"], "res": f["res"],
        "r_overall": f["ratings"]["o"], "r_health": f["ratings"]["h"],
        "r_staff": f["ratings"]["s"], "r_qm": f["ratings"]["q"],
        "s_total": f["staff"]["total"], "s_rn": f["staff"]["rn"],
        "s_wkend": f["staff"]["wkend"], "s_turn": f["staff"]["turn"], "s_rnturn": f["staff"]["rnturn"],
        "i_date": f["insp"]["date"] or None, "i_def1": f["insp"]["def1"],
        "i_def23": f["insp"]["def23"], "i_infect": f["insp"]["infect"],
        "i_c1_std": f["insp"].get("c1_std"), "i_c1_complaint": f["insp"].get("c1_complaint"),
        "i_c1_score": f["insp"].get("c1_score"), "i_c2_date": f["insp"].get("c2_date") or None,
        "i_c23_std": f["insp"].get("c23_std"), "i_c23_complaint": f["insp"].get("c23_complaint"),
        "i_weighted": f["insp"].get("weighted"),
        "chain_id": f.get("chain_info", {}).get("id") or None,
        "chain_n": f.get("chain_info", {}).get("n"),
        "chain_avg_overall": f.get("chain_info", {}).get("avg_overall"),
        "chain_avg_health": f.get("chain_info", {}).get("avg_health"),
        "chain_avg_staff": f.get("chain_info", {}).get("avg_staff"),
        "gp_inspection": f.get("grade_parts", {}).get("inspection"),
        "gp_staffing": f.get("grade_parts", {}).get("staffing"),
        "gp_quality": f.get("grade_parts", {}).get("quality"),
        "gp_accountability": f.get("grade_parts", {}).get("accountability"),
        "p_fines": f["pen"]["fines"], "p_usd": f["pen"]["usd"], "p_denials": f["pen"]["denials"],
        "f_abuse": f["flags"]["abuse"], "f_sff": f["flags"]["sff"] or "",
        "f_oldinsp": f["flags"]["oldInsp"], "f_ownchg": f["flags"]["ownChg"],
        "grade": f["grade"]["letter"], "score": f["grade"].get("score"),
    }

total = 0
stats = []
for path in sorted(glob.glob(os.path.join(BASE, "*.json"))):
    st = json.load(open(path))
    code = st["state"]
    rows = [dict(flatten(f), state=code) for f in st["facilities"]]
    for i in range(0, len(rows), 800):
        chunk = rows[i:i+800]
        status = post("/rest/v1/facilities", chunk)
        if status not in (200, 201):
            print(f"FAIL {code} chunk {i}: {status}"); sys.exit(1)
    total += len(rows)
    a = st["avg"]
    stats.append({"state": code, "n": len(rows), "avg_hprd": a["hprd"], "avg_rn": a["rn"],
                  "avg_def1": a["def1"], "avg_fines": a["fines"], "avg_turn": a["turn"]})
    print(f"{code}: {len(rows)}")

post("/rest/v1/state_stats", stats)
print(f"DONE facilities={total} states={len(stats)}")
