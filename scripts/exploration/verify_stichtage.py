"""
Verifikation der Stichtage aus Excel-Dateien.

Extrahiert alle Stichtage und deren Kontext (Personal, Studierende, etc.)
direkt aus den Excel-Quelldateien.

Verwendung:
    python scripts/exploration/verify_stichtage.py
"""

import pandas as pd
from pathlib import Path
import re
import sys


def extract_stichtage(file_path: Path) -> list[dict]:
    """
    Extrahiert alle Stichtage aus einer Excel-Datei.

    Returns:
        Liste von Dictionaries mit Stichtag-Informationen
    """
    results = []

    try:
        xl = pd.ExcelFile(file_path)
        sheet_name = 'Tab' if 'Tab' in xl.sheet_names else xl.sheet_names[0]
        df = pd.read_excel(file_path, sheet_name=sheet_name, header=None)
    except Exception as e:
        return []

    for i in range(min(30, len(df))):
        for j in range(df.shape[1]):
            val = str(df.iloc[i, j]) if pd.notna(df.iloc[i, j]) else ''

            # Stichtag-Pattern
            matches = re.findall(r'(Stichtag:\s*(\d{2}\.\d{2}\.\d{4}))', val)
            for full_match, date in matches:
                # Kontext ermitteln
                context = ''
                if 'Wintersemester' in val:
                    context = 'Wintersemester'
                elif 'Sommersemester' in val:
                    context = 'Sommersemester'
                elif 'Studienjahr' in val:
                    context = 'Studienjahr'

                # Semester/Jahr extrahieren
                semester_match = re.search(r'(Wintersemester|Sommersemester)\s+(\d{4})', val)
                year_match = re.search(r'Studienjahr\s+(\d{4}/\d{2})', val)

                period = ''
                if semester_match:
                    period = f"{semester_match.group(1)} {semester_match.group(2)}"
                elif year_match:
                    period = f"Studienjahr {year_match.group(1)}"

                results.append({
                    'file': file_path.name,
                    'stichtag': date,
                    'context': context,
                    'period': period,
                    'full_text': val[:100]
                })

    return results


def analyze_stichtage_patterns(all_stichtage: list[dict]) -> dict:
    """
    Analysiert Muster in den Stichtagen.
    """
    patterns = {}

    for s in all_stichtage:
        day_month = s['stichtag'][:5]  # DD.MM
        if day_month not in patterns:
            patterns[day_month] = {
                'count': 0,
                'contexts': set(),
                'examples': []
            }
        patterns[day_month]['count'] += 1
        if s['context']:
            patterns[day_month]['contexts'].add(s['context'])
        if len(patterns[day_month]['examples']) < 3:
            patterns[day_month]['examples'].append(s)

    return patterns


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    data_dir = project_root / 'data'

    if not data_dir.exists():
        print(f"Fehler: Data-Verzeichnis nicht gefunden: {data_dir}", file=sys.stderr)
        sys.exit(1)

    print("# Verifizierte Stichtage")
    print()
    print(f"**Quelle:** Alle Excel-Dateien in `{data_dir.name}/`")
    print()

    # Sammle alle Stichtage
    all_stichtage = []
    for f in sorted(data_dir.glob('*.xlsx')):
        stichtage = extract_stichtage(f)
        all_stichtage.extend(stichtage)

    print(f"**Gefundene Stichtag-Einträge:** {len(all_stichtage)}")
    print()

    # Analysiere Muster
    patterns = analyze_stichtage_patterns(all_stichtage)

    print("## Stichtag-Muster")
    print()
    print("| Tag.Monat | Anzahl | Kontext | Verwendung |")
    print("|-----------|--------|---------|------------|")

    for day_month in sorted(patterns.keys(), key=lambda x: (x[3:5], x[0:2])):
        p = patterns[day_month]
        contexts = ', '.join(sorted(p['contexts'])) if p['contexts'] else '-'

        # Bestimme Verwendung basierend auf Beispielen
        usage = []
        for ex in p['examples']:
            if 'Personal' in ex['file']:
                usage.append('Personal')
            elif 'Studier' in ex['file']:
                usage.append('Studierende')
            elif 'Studien' in ex['file']:
                usage.append('Studien')
            elif 'Abschl' in ex['file']:
                usage.append('Abschlüsse')
        usage = ', '.join(sorted(set(usage))) if usage else '-'

        print(f"| {day_month} | {p['count']} | {contexts} | {usage} |")

    print()
    print("## Detaillierte Beispiele")
    print()

    # Zeige Beispiele für jeden Stichtag-Typ
    shown_dates = set()
    for s in all_stichtage:
        if s['stichtag'] not in shown_dates and len(shown_dates) < 10:
            shown_dates.add(s['stichtag'])
            print(f"### {s['stichtag']}")
            print(f"- **Datei:** `{s['file']}`")
            print(f"- **Periode:** {s['period']}")
            print(f"- **Text:** {s['full_text'][:80]}...")
            print()

    print("---")
    print(f"*Generiert am: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')}*")


if __name__ == '__main__':
    main()
