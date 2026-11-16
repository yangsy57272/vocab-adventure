# Vocabulary sources and reuse

Checked 16 November 2026. The Barron’s collection below is transformed from a PDF supplied by the user. It is separate from the openly licensed and original datasets.

## Barron’s Essential Words for the TOEFL, sixth edition

- Author: Steven J. Matthiesen; Barron’s Educational Series. The supplied cover identifies this as the sixth edition, rather than the eighth edition linked in the companion resources.
- Source: PDF supplied by the user in this chat. Its SHA-256 digest is recorded in `barrons-toefl.json`; the original PDF is not uploaded to the repository.
- Scope: every main entry in the 30 lesson-opening bullet lists: 17 per lesson for lessons 1–20 and 16 per lesson for lessons 21–30, totaling 500 unique headwords and phrases. Related forms, synonyms, and example sentences are included as details, not counted as extra main entries. Exercise distractors and other running-text words are not treated as vocabulary entries.
- Extraction: `scripts/extract-barrons.py`. Original lessons and PDF entry-page references are retained; whitespace is normalized. Four explicitly identified primary-definition rows prevent related-form rows from replacing the actual definitions. Source wording is otherwise retained.
- Copyright: original publisher/author copyright retained. **No Creative Commons license is asserted for this dataset.** The licenses below apply only to their respective datasets.


## New Academic Word List (NAWL)

- Authors: Browne, C., Culligan, B., and Phillips, J.
- Official source and license statement: https://www.newgeneralservicelist.com/new-academic-word-list
- Download: https://www.newgeneralservicelist.com/s/NAWL_12_with_en_definitions.csv
- License: Creative Commons Attribution-ShareAlike 4.0 International, https://creativecommons.org/licenses/by-sa/4.0/
- Original downloaded file: `nawl-source.csv` (preserved including its original columns).
- Adaptations: keep word, part of speech, and English definition; map English meanings to the app's meaning field; omit Japanese translations from the app; skip empty entries and case-insensitive duplicates; group into sets of 30; assign neutral three-star priority. The processed dataset and its adaptations remain under CC BY-SA 4.0.
- The download produces 958 usable unique entries. This count describes the actual downloaded file; the project's current overview describes its list as 957 words. We do not silently drop entries to match the advertised count.
- NAWL is a general academic list, not an official TOEFL or IELTS list. No exam score or exam-specific coverage is promised.

## Original topic packs

TOEFL Academic & Science (50), IELTS Topics & Writing (50), Business Workplace Essentials (40), and Everyday Travel & Conversation (40) are original Vocab Adventure selections and definitions, 2026. Their vocabulary data in `curated-books.json` is made available under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). These are independent study supplements, not official exam materials or reproductions of the books below. The license applies to these vocabulary datasets, not to the existing SAT dataset or the app code.

## Researched companion books (external links only)

- Steven J. Matthiesen, *TOEFL Essential Words*, 8th edition, Barron's: https://www.simonandschuster.com/books/TOEFL-Essential-Words-Eighth-Edition/Steven-J-Matthiesen/Barrons-Test-Prep/9781506290577 — publisher describes 500 vocabulary words with definitions, examples, and practice.
- Pauline Cullen, *Cambridge Vocabulary for IELTS*: https://keytoielts.com/product/cambridge-vocabulary-for-ielts/ — author's description of topic-based vocabulary and exam practice.
- Further downloadable collections worth considering: NGSL (general English), NGSL-Spoken (conversation), BSL (business), and TSL (TOEIC): https://www.newgeneralservicelist.com/word-lists. These full datasets are not currently bundled.

## Existing SAT dataset

Preserved from the original repository without changes. The new dataset licenses above do not relicense the existing SAT data.
