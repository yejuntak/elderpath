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
            "Content-Type": "application/json", "Prefer": "return=minimal",
        })
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.status

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
