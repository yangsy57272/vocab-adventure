# ✨ Vocab Adventure

A free vocabulary trainer for your own word lists, with a built-in **3,824-word SAT book** and its 20-day study plan. No install, account, ads, or backend.

**[Open Vocab Adventure](https://yangsy57272.github.io/vocab-adventure/)**

## Study any vocabulary book

Use the book selector to switch between SAT and your custom books. Open **My Books & Import**, enter a name (for example TOEFL, Biology, or French class), and create a book. Paste a list or open a `.txt` / `.tsv` file, then click **Import Words**.

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

Built with vanilla HTML/CSS/JavaScript in one static `index.html`. No build step or runtime dependencies. Hosted on GitHub Pages.
