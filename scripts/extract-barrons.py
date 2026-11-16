"""Extract all 500 lesson entries from the user-supplied sixth-edition PDF.

Usage: python3 scripts/extract-barrons.py /path/to/book.pdf
Requires pypdf. The source PDF is read locally and is not copied into the repo.
"""
import argparse
import bisect
import hashlib
import json
import re
from pathlib import Path
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('pdf', type=Path)
args = parser.parse_args()
pages = [p.extract_text() or '' for p in PdfReader(args.pdf).pages]
starts = [(i, int(m[1])) for i, text in enumerate(pages)
          if (m := re.match(r'LESSON (\d+)\n', text))]
assert [n for _, n in starts] == list(range(1, 31)), 'Expected 30 lesson-opening word lists'
# These entries put related forms AFTER the main definition. The normal last-POS
# rule would mistake obliviously, part, or severity for the definition.
PRIMARY_ROWS = {
    'oblivious': 'adj. to be unaware of or forgetful',
    'partially': 'adv. a part of the whole; incomplete',
    'negligible': 'adj. hardly noticeable; scarcely detectable',
    'severe': 'adj. extreme; harmful',
}
words = []
for index, (start, lesson) in enumerate(starts):
    end = starts[index+1][0] if index+1 < len(starts) else next(
        i for i in range(start+1, len(pages)) if re.match(r'CHAPTER 6\b', pages[i]))
    section_pages = pages[start:end]
    text = '\n'.join(section_pages)
    heads = re.findall(r'^• (.+)$', text, re.M)
    assert len(heads) == (17 if lesson <= 20 else 16), (lesson, len(heads))
    bullet_end = list(re.finditer(r'^• .+$', text, re.M))[-1].end()
    body_start = text.index(heads[0], bullet_end)
    body = text[body_start:].split('\nMATCHING')[0].strip()
    positions = []
    for head in heads:
        match = re.search(r'^'+re.escape(head)+r'\s*$', body, re.M)
        assert match, (lesson, head)
        positions.append(match.start())
    page_starts, offset = [], 0
    for page in section_pages:
        page_starts.append(offset)
        offset += len(page)+1
    for i, head in enumerate(heads):
        stop = min((p for p in positions if p > positions[i]), default=len(body))
        block = body[positions[i]:stop].strip()
        synonym = re.search(r'^\s*syn\.\s*(.+)', block, re.M)
        assert synonym, (lesson, head, 'missing synonym')
        before = block[:synonym.start()]
        rows = list(re.finditer(r'^\s*(adj|adv|n|v|conj|prep|ph)\.\s+(.+)', before, re.M))
        assert rows, (lesson, head, 'missing definition')
        chosen = next((r for r in rows if r.group().strip() == PRIMARY_ROWS.get(head)), rows[-1])
        row_index = rows.index(chosen)
        definition_end = rows[row_index+1].start() if row_index+1 < len(rows) else len(before)
        definition = re.sub(r'\s+', ' ', before[chosen.start():definition_end]).strip().split('.', 1)[1].strip()
        forms = [re.sub(r'\s+', ' ', before[r.start():rows[j+1].start() if j+1<len(rows) else len(before)]).strip()
                 for j, r in enumerate(rows) if r is not chosen]
        after = block[synonym.end():].strip().splitlines()
        syn = synonym[1].strip()
        while after and not re.match(r'^[A-Z“‘"\d]', after[0].strip()):
            syn += ' '+after.pop(0).strip()
        examples = re.sub(r'\s+', ' ', ' '.join(after)).strip()
        assert definition and syn and examples, (lesson, head, 'empty field')
        assert not re.search(r'MATCHING|MULTIPLE-CHOICE|\([A-D]\)', examples), (lesson, head, 'exercise leaked into examples')
        words.append(dict(w=head, p=chosen[1], zh=definition, en=definition, s=3, d=lesson,
                          src='Barron’s · Essential Words for the TOEFL · 6th edition',
                          synonyms=syn, examples=examples, forms=forms,
                          pdfPage=start+bisect.bisect_right(page_starts, body_start+positions[i])))
assert len(words) == len({w['w'].lower() for w in words}) == 500
book = dict(id='barrons-toefl', name='Barron’s TOEFL · All 500 Words (6th ed.)',
            description='All 500 main vocabulary entries from the user-provided sixth edition of Essential Words for the TOEFL, organized in the original 30 lessons. Includes English meanings, synonyms, related forms, and example sentences.',
            credit='Steven J. Matthiesen · Barron’s Educational Series. Extracted from the user-provided PDF; publisher copyright retained. Not an official ETS publication.',
            sourceNote='User-provided PDF · sixth edition',
            sourceSha256=hashlib.sha256(args.pdf.read_bytes()).hexdigest(),
            words=words)
(ROOT/'data/barrons-toefl.json').write_text(json.dumps(book, ensure_ascii=False, indent=2)+'\n')
print(f'Extracted {len(words)} complete entries from {len(starts)} lessons; first={words[0]["w"]}, last={words[-1]["w"]}.')
