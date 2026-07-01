import sys
import os
import re
import json
import math
import pandas as pd


COMMODITY_MAP = {
    "Cu": "Copper",
    "Li": "Lithium",
    "Ni": "Nickel",
    "Au": "Gold",
    "Ag": "Silver",
    "Mo": "Molybdenum",
    "Fe": "Iron",
    "Zn": "Zinc",
    "Pb": "Lead",
    "Co": "Cobalt",
    "REE": "Rare Earth Elements",
}


def translate_commodity(value):
    if value is None:
        return None
    if isinstance(value, str):
        return COMMODITY_MAP.get(value.strip(), value)
    return value


def clean_value(value):
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    if isinstance(value, str) and value.strip() == "":
        return None
    return value


def safe_get(row, *possible_names):
    for name in possible_names:
        if name in row.index:
            val = clean_value(row[name])
            if val is not None:
                return val
    return None


def build_feature(row, default_country=None):
    lat = safe_get(row, "Latitude")
    lon = safe_get(row, "Longitude")

    properties = {
        "Name": safe_get(row, "Name"),
        "Operator": safe_get(row, "Owner/Operator", "Operator"),
        "State": safe_get(row, "Region/State", "State"),
        "Country": safe_get(row, "Country") or default_country,
        "County": safe_get(row, "County"),
        "Latitude": lat,
        "Longitude": lon,
        "Commodity": translate_commodity(safe_get(row, "Primary Product", "Commodity")),
        "Years of Operation": safe_get(row, "Years of Operation"),
        "Primary Product": translate_commodity(safe_get(row, "Primary Product")),
        "Primary  Production (kt)": safe_get(row, "Primary Production (kt)", "Primary  Production (kt)"),
        "Secondary Product": safe_get(row, "Secondary Products", "Secondary Product(s)", "Secondary Product"),
        "Secondary Production (kt)": safe_get(row, "Secondary Production (kt)"),
        "Estimated Total Resources (Mt)": safe_get(row, "Estimated Total Resources (Mt)"),
        "Ore Grade": safe_get(row, "Ore Grade"),
        "Est. Reserves": safe_get(row, "Est. Reserves"),
        "Notes": safe_get(row, "Primary refineries and other notes", "Notes"),
        "Status": safe_get(row, "Status"),
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
            "coordinates": [lon, lat]
        }

    return {
        "type": "Feature",
        "properties": properties,
        "geometry": geometry
    }


def sanitize_var_name(name):
    name = re.sub(r"[^A-Za-z0-9_]", "_", name)
    if re.match(r"^[0-9]", name):
        name = "_" + name
    return name


def convert_dataframe(df, layer_name):
    df = df.dropna(how="all")
    df.columns = [str(c).strip() for c in df.columns]

    features = []
    skipped = []
    for idx, row in df.iterrows():
        name = safe_get(row, "Name")
        if not name:
            continue
        feature = build_feature(row, default_country=layer_name)
        if feature["geometry"] is None:
            skipped.append(name)
        features.append(feature)

    geojson = {
        "type": "FeatureCollection",
        "name": layer_name,
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features
    }

    var_name = sanitize_var_name(layer_name)

    os.makedirs("geojsons", exist_ok=True)
    os.makedirs("layers", exist_ok=True)

    geojson_path = f"geojsons/{layer_name}.geojson"
    js_path = f"layers/{layer_name}.js"

    with open(geojson_path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, indent=2)

    with open(js_path, "w", encoding="utf-8") as f:
        f.write(f"var json_{var_name} = " + json.dumps(geojson, indent=2) + ";")

    print(f"  [{layer_name}] Converted {len(features)} mines")
    print(f"    -> {geojson_path}")
    print(f"    -> {js_path}  (variable: json_{var_name})")
    if skipped:
        print(f"    WARNING: {len(skipped)} mines missing lat/lon, will not render:")
        for s in skipped:
            print(f"      - {s}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 convert_mines.py path/to/mines_file.xlsx")
        sys.exit(1)

    path = sys.argv[1]
    ext = os.path.splitext(path)[1].lower()

    if ext == ".csv":
        layer_name = os.path.splitext(os.path.basename(path))[0]
        df = pd.read_csv(path)
        print(f"Reading single-sheet CSV as layer '{layer_name}'")
        convert_dataframe(df, layer_name)

    elif ext in (".xlsx", ".xls"):
        sheets = pd.read_excel(path, sheet_name=None)
        print(f"Found {len(sheets)} tab(s) in '{path}': {', '.join(sheets.keys())}")
        for sheet_name, df in sheets.items():
            layer_name = sheet_name.strip()
            convert_dataframe(df, layer_name)

    else:
        print(f"ERROR: Unsupported file type '{ext}'. Use .csv, .xlsx, or .xls")
        sys.exit(1)

    print("Done.")


if __name__ == "__main__":
    main()