"""
Analyse der Excel-Dateistrukturen.

Dieses Skript analysiert alle Excel-Dateien und extrahiert:
- Dimensionen (Zeilen x Spalten)
- Header-Row-Position
- Verfügbare Jahre/Semester
- Spaltenstruktur

Verwendung:
    python scripts/exploration/analyze_excel_structure.py [--file FILENAME]
    python scripts/exploration/analyze_excel_structure.py --category wissensbilanz
    python scripts/exploration/analyze_excel_structure.py --category unidata

Output:
    - Strukturanalyse als Markdown
"""

import pandas as pd
from pathlib import Path
import argparse
import sys
import re


def find_header_row(df: pd.DataFrame) -> int | None:
    """
    Findet die Header-Zeile anhand von Schlüsselwörtern.

    Returns:
        Zeilennummer oder None
    """
    keywords = ['Universität', 'Frauen', 'Männer', 'Gesamt']

    for i in range(min(30, len(df))):
        row_str = ' '.join([str(x) for x in df.iloc[i].values if pd.notna(x)])
        if any(kw in row_str for kw in keywords):
            # Prüfe ob es wirklich die Daten-Header-Zeile ist
            if 'Universität' in row_str and ('Frauen' in row_str or 'Gesamt' in row_str):
                return i

    return None


def extract_years(df: pd.DataFrame) -> list[str]:
    """
    Extrahiert verfügbare Jahre/Semester aus dem DataFrame.

    Returns:
        Liste von Jahren/Semestern
    """
    years = set()

    for i in range(min(25, len(df))):
        for j in range(df.shape[1]):
            val = str(df.iloc[i, j]) if pd.notna(df.iloc[i, j]) else ''

            # Wintersemester Format
            match = re.search(r'Wintersemester (\d{4})', val)
            if match:
                years.add(f"WS {match.group(1)}")

            # Studienjahr Format
            match = re.search(r'Studienjahr (\d{4}/\d{2})', val)
            if match:
                years.add(f"STJ {match.group(1)}")

            # Jahr Format
            match = re.search(r'Jahr (\d{4})', val)
            if match:
                years.add(f"{match.group(1)}")

    return sorted(years, reverse=True)


def extract_stichtag(df: pd.DataFrame) -> str | None:
    """
    Extrahiert den Stichtag aus dem DataFrame.

    Returns:
        Stichtag-String oder None
    """
    for i in range(min(25, len(df))):
        for j in range(df.shape[1]):
            val = str(df.iloc[i, j]) if pd.notna(df.iloc[i, j]) else ''
            match = re.search(r'Stichtag: (\d{2}\.\d{2}\.\d{4})', val)
            if match:
                return match.group(1)
    return None


def analyze_file(file_path: Path) -> dict:
    """
    Analysiert eine einzelne Excel-Datei.

    Returns:
        Dictionary mit Analyseergebnissen
    """
    result = {
        'filename': file_path.name,
        'error': None,
        'sheets': [],
        'rows': 0,
        'cols': 0,
        'header_row': None,
        'years': [],
        'stichtag': None,
        'title': None,
        'category': 'wissensbilanz' if file_path.name[0].isdigit() else 'unidata'
    }

    try:
        xl = pd.ExcelFile(file_path)
        result['sheets'] = xl.sheet_names

        df = pd.read_excel(file_path, sheet_name='Tab', header=None)
        result['rows'] = df.shape[0]
        result['cols'] = df.shape[1]
        result['header_row'] = find_header_row(df)
        result['years'] = extract_years(df)
        result['stichtag'] = extract_stichtag(df)

        # Titel aus ersten Zeilen
        for i in range(min(5, len(df))):
            val = df.iloc[i, 0]
            if pd.notna(val) and str(val).strip():
                result['title'] = str(val).strip()[:80]
                break

    except Exception as e:
        result['error'] = str(e)

    return result


def print_analysis(results: list[dict], category: str | None = None):
    """
    Gibt die Analyse als Markdown aus.
    """
    if category:
        results = [r for r in results if r['category'] == category]

    print(f"# Excel-Struktur-Analyse")
    print()
    print(f"**Anzahl Dateien:** {len(results)}")
    print()

    # Gruppiere nach Kategorie
    wissensbilanz = [r for r in results if r['category'] == 'wissensbilanz']
    unidata = [r for r in results if r['category'] == 'unidata']

    if wissensbilanz and (category is None or category == 'wissensbilanz'):
        print("## Wissensbilanz-Kennzahlen")
        print()
        print("| Datei | Zeilen | Spalten | Header-Row | Jahre |")
        print("|-------|--------|---------|------------|-------|")
        for r in sorted(wissensbilanz, key=lambda x: x['filename']):
            years_str = ', '.join(r['years'][:3]) if r['years'] else '-'
            header = r['header_row'] if r['header_row'] is not None else '?'
            print(f"| {r['filename'][:45]} | {r['rows']} | {r['cols']} | {header} | {years_str} |")
        print()

    if unidata and (category is None or category == 'unidata'):
        print("## UniData-Kennzahlen")
        print()
        print("| Datei | Zeilen | Spalten | Header-Row | Jahre |")
        print("|-------|--------|---------|------------|-------|")
        for r in sorted(unidata, key=lambda x: x['filename']):
            years_str = ', '.join(r['years'][:3]) if r['years'] else '-'
            header = r['header_row'] if r['header_row'] is not None else '?'
            print(f"| {r['filename'][:45]} | {r['rows']} | {r['cols']} | {header} | {years_str} |")
        print()

    # Stichtage
    stichtage = set(r['stichtag'] for r in results if r['stichtag'])
    if stichtage:
        print("## Gefundene Stichtage")
        print()
        for s in sorted(stichtage):
            print(f"- {s}")
        print()

    # Fehler
    errors = [r for r in results if r['error']]
    if errors:
        print("## Fehler")
        print()
        for r in errors:
            print(f"- `{r['filename']}`: {r['error']}")
        print()

    print("---")
    print(f"*Generiert am: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')}*")


def main():
    parser = argparse.ArgumentParser(description='Analyse der Excel-Dateistrukturen')
    parser.add_argument('--file', help='Einzelne Datei analysieren')
    parser.add_argument('--category', choices=['wissensbilanz', 'unidata'],
                        help='Nur bestimmte Kategorie analysieren')
    args = parser.parse_args()

    # Finde data-Verzeichnis
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    data_dir = project_root / 'data'

    if not data_dir.exists():
        print(f"Fehler: Data-Verzeichnis nicht gefunden: {data_dir}", file=sys.stderr)
        sys.exit(1)

    if args.file:
        # Einzelne Datei
        file_path = data_dir / args.file
        if not file_path.exists():
            print(f"Fehler: Datei nicht gefunden: {file_path}", file=sys.stderr)
            sys.exit(1)
        results = [analyze_file(file_path)]
    else:
        # Alle Dateien
        results = []
        for f in sorted(data_dir.glob('*.xlsx')):
            results.append(analyze_file(f))

    print_analysis(results, args.category)


if __name__ == '__main__':
    main()
