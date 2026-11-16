"""Rebuild bundled books from checked-in sources: python3 scripts/build-books.py."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
packs = json.loads((ROOT / 'data/curated-books.json').read_text())
words, seen = [], set()
with (ROOT / 'data/nawl-source.csv').open(encoding='utf-8-sig', newline='') as source:
    for row in csv.DictReader(source):
        word, meaning = row['Meanings'].strip(), row['English Definition'].strip()
        if not word or not meaning or word.lower() in seen:
            continue
        seen.add(word.lower())
        words.append(dict(w=word, p=row['POS'].strip(), zh=meaning, en=meaning,
                          s=3, d=len(words)//30+1, src='NAWL 1.2 · Browne, Culligan & Phillips'))
packs.append(dict(
    id='nawl', name='Academic English · NAWL',
    description=f'{len(words)} entries from the official NAWL 1.2 definitions download. A general academic foundation useful alongside TOEFL / IELTS practice; not an official exam list. Sets of 30.',
    license='CC BY-SA 4.0',
    credit='New Academic Word List by Browne, C., Culligan, B., and Phillips, J. English definitions from the official project download. Adapted to app fields, deduplicated, and grouped into study sets; no Japanese translations included.',
    source='https://www.newgeneralservicelist.com/new-academic-word-list', words=words))
(ROOT / 'data/books.js').write_text('// Bundled vocabulary; see data/SOURCES.md for attribution and licenses.\nconst BUILTIN_BOOKS = '+json.dumps(packs, ensure_ascii=False, separators=(',', ':'))+';\n')
print('Built', sum(len(p['words']) for p in packs), 'entries across', len(packs), 'books.')
