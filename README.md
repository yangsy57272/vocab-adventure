# ✨ Vocab Adventure

A free vocabulary trainer with a visual study dashboard, ready-to-study vocabulary books, and support for your own word lists. No install, account, ads, or backend.

**[Open Vocab Adventure](https://yangsy57272.github.io/vocab-adventure/)**

## Built-in library

| Book | Entries | Focus |
|---|---:|---|
| SAT | 3,824 | Original collection and 20-day plan |
| TOEFL · Academic & Science | 50 | Research, biology, earth science, history, campus life |
| IELTS · Topics & Writing | 50 | Environment, education, health, technology, data descriptions |
| Business · Workplace Essentials | 40 | Meetings, projects, finance, people |
| Everyday · Travel & Conversation | 40 | Travel, accommodation, daily needs, conversation |
| Academic English · NAWL | 958 | Official project's English definitions download, sets of 30 |

The TOEFL and IELTS packs are original independent supplements, not official lists or copies of commercial books. The library also links to Barron's *TOEFL Essential Words* and Pauline Cullen's *Cambridge Vocabulary for IELTS* for further study. [Sources, licenses, and the NAWL download count](data/SOURCES.md).

## Visual dashboard and review

- Known-word percentage ring for the selected book and progress bars across all books.
- Editable daily word goal (1–500) and a study-day streak across all books, separate from the header's consecutive-correct-answer streak.
- A 28-day activity calendar with details for each day; color reflects distinct words practiced that day.
- Seven daily quiz-accuracy bars with correct / total answer counts available in their accessible labels.
- Reviews due in the selected book, with a button to start a round of up to 20 words.

Reveal a flashcard, then use **Again** or **Got it** to record recall. Quiz answers and newly marking a word known also count as practice. Correct recalls schedule reviews after 1, 3, 7, 14, then 30 days; a missed word returns today. Repeating a correct answer before its due date does not advance the schedule. Dates follow the learner's device-local calendar. A one-word book can be reviewed with flashcards.

Daily goals count each book/word pair once per day; quiz accuracy counts all answered questions, including unfinished rounds. Known-word percentages are self-reported flashcard marks and are not inferred from quiz scores. Historic activity begins with this update; earlier progress remains, but old daily activity cannot be reconstructed.

## Study any vocabulary book

Use the book selector or Book Library to switch between built-in books and your custom books. Open **My Books & Import**, enter a name (for example TOEFL, Biology, or French class), and create a book. Paste a list or open a `.txt` / `.tsv` file, then click **Import Words**.

Supported formats, one entry per line, separated by pipes or tabs:

```text
lucid | clear and easy to understand
ubiquitous | adj. | 无处不在的 | present everywhere at once
bonjour | greeting | hello | a French greeting
```

Two fields mean word + meaning; three mean word + part of speech + meaning; four add an optional definition. Meanings can be in any language. Empty fields retain their positions. Each entry needs a word and meaning. Blank lines are ignored, and duplicate words are skipped within the selected book (case insensitive). The import result reports skipped lines. The same word can belong to different books.

Custom books have their own flashcards, quizzes, known-word progress, stars, streaks, and mistake lists. Import more words into an existing book at any time. Export the selected book as a TSV backup, remove individual imported words, clear its imported words, or delete a custom book.

## SAT stays built in

The original SAT collection remains available in the book selector, with priority ratings and 20 daily sets. The built-in words cannot be deleted. Existing SAT progress and legacy Bonus imports are preserved. New imports go into custom books.

## Learning tools

- Flashcards with pronunciation, shuffle, hide known, and random jump.
- Meaning → word, word → meaning, definition, and hard-mode quizzes. A normal quiz needs at least two matching words; smaller books have fewer answer choices.
- Automatic mistake tracking and practice rounds.
- Searchable word lists and progress by day / set and priority.
- Desktop shortcuts: arrows to move, Space to flip, S to speak, K to mark known.

## Storage and backups

All vocabulary and progress is stored in this browser using `localStorage`. Nothing is uploaded, and there is no cross-device sync. Clearing browser data or ending a private browsing session can remove your data. Export your books to keep a copy of the vocabulary; exports do not include learning progress.

Built with vanilla HTML/CSS/JavaScript and static data. No runtime dependencies or build step required for hosting on GitHub Pages. Serve the repository root (for example `python3 -m http.server 8765`).

## Development checks

```sh
npm ci
npx playwright install chromium
npm test
```

For an installed Google Chrome browser, use `BROWSER_CHANNEL=chrome npm test`. The browser suite starts its own local server, exercises storage and review scheduling, and saves desktop/mobile screenshots under ignored `test-results/`.

Regenerate bundled vocabulary from checked-in sources with `python3 scripts/build-books.py`. The original SAT dataset is preserved in `index.html`; the new built-in books are in `data/books.js`, and dashboard / review logic is in `dashboard.js`.
