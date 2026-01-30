"""
Verifikation der Universitäts-Codes aus Excel-Dateien.

Dieses Skript extrahiert alle Universitäts-Codes direkt aus den Excel-Quelldateien
und gibt sie in einem Format aus, das direkt in die Dokumentation übernommen werden kann.

Verwendung:
    python scripts/exploration/verify_university_codes.py

Output:
    - Markdown-Tabelle mit allen verifizierten Codes
    - Warnungen bei Inkonsistenzen zwischen Dateien
"""

import pandas as pd
from pathlib import Path
import sys

def extract_university_codes(file_path: Path) -> list[tuple[str, str, str]]:
    """
    Extrahiert Universitäts-Codes aus einer Excel-Datei.

    Returns:
        Liste von Tupeln: (Code, Kurztext, Langtext)
    """
    try:
        df = pd.read_excel(file_path, sheet_name='Tab', header=None)
    except Exception as e:
        print(f"Fehler beim Lesen von {file_path.name}: {e}", file=sys.stderr)
        return []

    found_unis = []
    for i in range(20, len(df)):
        row = df.iloc[i]
        col0 = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ''
        col1 = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ''
        col2 = str(row.iloc[2]).strip() if pd.notna(row.iloc[2]) else ''

        # Universitätszeilen: Code beginnt mit U, ist 2 Zeichen, Name ist nicht leer
        if col1.startswith('U') and len(col1) == 2 and col0:
            if col1 not in [u[0] for u in found_unis]:
                found_unis.append((col1, col0, col2))

    return sorted(found_unis)


def verify_codes_across_files(data_dir: Path) -> dict:
    """
    Verifiziert Codes über mehrere Dateien hinweg.

    Returns:
        Dictionary mit Code als Key und Liste von (Datei, Kurztext, Langtext) als Value
    """
    all_codes = {}

    # Prüfe mehrere Dateien für Konsistenz
    files_to_check = [
        '1-A-1 Personal - Köpfe.xlsx',
        'Ordentliche Studierende nach Universitäten.xlsx',
        'Studienabschlüsse nach Universitäten.xlsx',
    ]

    for filename in files_to_check:
        file_path = data_dir / filename
        if file_path.exists():
            codes = extract_university_codes(file_path)
            for code, kurz, lang in codes:
                if code not in all_codes:
                    all_codes[code] = []
                all_codes[code].append((filename, kurz, lang))

    return all_codes


def main():
    # Finde data-Verzeichnis
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    data_dir = project_root / 'data'

    if not data_dir.exists():
        print(f"Fehler: Data-Verzeichnis nicht gefunden: {data_dir}", file=sys.stderr)
        sys.exit(1)

    print("# Verifizierte Universitäts-Codes")
    print()
    print(f"**Quelle:** `{data_dir}`")
    print()

    # Extrahiere aus Hauptdatei
    main_file = data_dir / '1-A-1 Personal - Köpfe.xlsx'
    if main_file.exists():
        codes = extract_university_codes(main_file)

        print(f"**Primärquelle:** `{main_file.name}`")
        print(f"**Anzahl Universitäten:** {len(codes)}")
        print()
        print("| Code | Kurztext | Langtext |")
        print("|------|----------|----------|")
        for code, kurz, lang in codes:
            print(f"| {code} | {kurz} | {lang} |")
        print()

    # Konsistenzprüfung
    print("## Konsistenzprüfung")
    print()
    all_codes = verify_codes_across_files(data_dir)

    inconsistencies = []
    for code, entries in all_codes.items():
        kurztexte = set(e[1] for e in entries)
        if len(kurztexte) > 1:
            inconsistencies.append((code, entries))

    if inconsistencies:
        print("**Warnung:** Inkonsistenzen gefunden:")
        print()
        for code, entries in inconsistencies:
            print(f"- **{code}:**")
            for filename, kurz, lang in entries:
                print(f"  - `{filename}`: {kurz}")
    else:
        print("Keine Inkonsistenzen gefunden. Codes sind über alle geprüften Dateien konsistent.")

    print()
    print("---")
    print(f"*Generiert am: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')}*")


if __name__ == '__main__':
    main()
