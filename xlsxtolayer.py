import sys
import os
import re
import json
import math
import pandas as pd


def clean_value(value):
    """Convert NaN / empty strings to None so they serialize as null."""
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    if isinstance(value, str) and value.strip() == "":
        return None
    return value
 
 
def safe_get(row, *possible_names):
    """
    Try several possible column name spellings/variants and return
    the first one that exists and has a value. Helps survive messy
    spreadsheet headers without crashing.
    """
    for name in possible_names:
        if name in row.index:
            val = clean_value(row[name])
            if val is not None:
                return val
    return None
 
 
def build_feature(row):
    lat = safe_get(row, "Latitude")
    lon = safe_get(row, "Longitude")
 
    properties = {
        "Name": safe_get(row, "Name"),
        "Operator": safe_get(row, "Owner/Operator", "Operator"),
        "State": safe_get(row, "Region/State", "State"),
        "Country": safe_get(row, "Country"),
        "County": safe_get(row, "County"),  # may not exist outside the US
        "Latitude": lat,
        "Longitude": lon,
        "Commodity": safe_get(row, "Primary Product", "Commodity"),
        "Years of Operation": safe_get(row, "Years of Operation"),
        "Primary Product": safe_get(row, "Primary Product"),
        "Primary  Production (kt)": safe_get(row, "Primary Production (kt)", "Primary  Production (kt)"),
        "Secondary Product": safe_get(row, "Secondary Product(s)", "Secondary Product"),
        "Secondary Production (kt)": safe_get(row, "Secondary Production (kt)"),
        "Estimated Total Resources (Mt)": safe_get(row, "Estimated Total Resources (Mt)"),
        "Ore Grade": safe_get(row, "Ore Grade"),
        "Est. Reserves": safe_get(row, "Est. Reserves"),
        "Notes": safe_get(row, "Primary refineries and other notes", "Notes"),
        # Fields that exist on the US layer but may have no equivalent
        # reporting system elsewhere. Filled with "Not reported" to match
        # the existing convention used in the US dataset, rather than an
        # empty string, so the popup slider displays a dash correctly.
        "TRI Total Air Emissions (kg)": safe_get(row, "TRI Total Air Emissions (kg)") or "Not reported",
        "NEI Total Air Emissions (kg)": safe_get(row, "NEI Total Air Emissions (kg)") or "Not reported",
        "Total Air Emissions (kg)": safe_get(row, "Total Air Emissions (kg)") or "Not reported",
        "Total Water Emissions (kg)": safe_get(row, "Total Water Emissions (kg)") or "Not reported",
        "Total Land Emissions (kg)": safe_get(row, "Total Land Emissions (kg)") or "Not reported",
        "Total OffSite Emissions (kg)": safe_get(row, "Total OffSite Emissions (kg)") or "Not reported",
        "TRI Total Emissions (kg)": safe_get(row, "TRI Total Emissions (kg)") or "Not reported",
        "Total All Emissions (kg)": safe_get(row, "Total All Emissions (kg)") or "Not reported",
    }
 
    geometry = None
    if lat is not None and lon is not None:
        geometry = {
            "type": "Point",
            "coordinates": [lon, lat]  # GeoJSON order: [longitude, latitude]
        }
 
    return {
        "type": "Feature",
        "properties": properties,
        "geometry": geometry
    }
 
 
def sanitize_var_name(name):
    """Turn a filename into a safe JS variable name."""
    name = re.sub(r"[^A-Za-z0-9_]", "_", name)
    if re.match(r"^[0-9]", name):
        name = "_" + name
    return name
 
 
def main():
    if len(sys.argv) < 2:
        print("Usage: python3 convert_mines.py path/to/mines_file.xlsx")
        sys.exit(1)
 
    xlsx_path = sys.argv[1]
    base_name = os.path.splitext(os.path.basename(xlsx_path))[0]
    var_name = sanitize_var_name(base_name)
 
    df = pd.read_excel(xlsx_path)
    df = df.dropna(how="all")
    df.columns = [str(c).strip() for c in df.columns]
 
    features = []
    skipped = []
    for idx, row in df.iterrows():
        name = safe_get(row, "Name")
        if not name:
            continue  # skip blank rows
        feature = build_feature(row)
        if feature["geometry"] is None:
            skipped.append(name)
        features.append(feature)
 
    geojson = {
        "type": "FeatureCollection",
        "name": base_name,
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features
    }
 
    os.makedirs("geojsons", exist_ok=True)
    os.makedirs("layers", exist_ok=True)
 
    geojson_path = f"geojsons/{base_name}.geojson"
    js_path = f"layers/{base_name}.js"
 
    with open(geojson_path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, indent=2)
 
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(f"var json_{var_name} = " + json.dumps(geojson) + ";")
 
    print(f"Converted {len(features)} mines from '{xlsx_path}'")
    print(f"  -> {geojson_path}")
    print(f"  -> {js_path}  (variable: json_{var_name})")
    if skipped:
        print(f"WARNING: {len(skipped)} mines missing lat/lon and will not render on the map:")
        for s in skipped:
            print(f"  - {s}")
 
 
if __name__ == "__main__":
    main()
 