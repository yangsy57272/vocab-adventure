# ✨ Vocab Adventure

A free, kid-friendly SAT vocabulary trainer — flashcards, quizzes, pronunciation, and mistake tracking, all in one page. No install, no login, no ads.

**🔗 Try it now: [yangsy57272.github.io/vocab-adventure](https://yangsy57272.github.io/vocab-adventure/)**

---

## Why this exists

Vocabulary lists are boring. This turns a plain word list into something a kid actually wants to open — colorful flashcards, game-like quizzes, streaks, stars, and a built-in "revise your mistakes" loop, so studying feels like progress instead of homework.

## Features

### 🃏 Flashcards
Tap a card to flip it and reveal the definition, Chinese meaning, and an example sentence. Tap the speaker icon to hear the word pronounced aloud. Mark words as "known" to track your progress.

### 🎯 Quiz — 4 modes
| Mode | What it tests |
|---|---|
| **Chinese → Word** | See the Chinese meaning, pick the matching English word |
| **Word → Chinese** | See the English word, pick the matching Chinese meaning |
| **Similar Challenge** | Pick the right word from a definition, with tricky same-category distractors |
| **Mix & Match** | An easier warm-up round with varied distractors |

You can quit any quiz early with the **✕ Quit** button — no need to finish once you've started.

### ❌ Mistake tracking & revision
Every word you get wrong in a quiz is automatically saved to your personal "Mistakes" list. A badge in the header shows how many words are waiting to be revised. Open the **Mistakes** tab any time to:
- See exactly which words you've missed, and how many times
- Tap **🩹 Practice Now** to start a quiz using *only* those words
- Clear a word off the list once you've got it down

Get a mistaken word right in any quiz and it's automatically removed from the list — no manual bookkeeping needed.

### 📖 Word List & 📥 Import
Browse and search every word in a searchable table. Paste in your own vocabulary set (matching the standard `[pos] 「英义」definition 「中义」meaning` format) to add new words — they're saved permanently in your browser and show up everywhere: flashcards, quiz, word list. Imported words can be deleted individually or all at once.

### ⭐ Progress & rewards
Stars for correct answers, streak badges, and confetti for quiz mastery — small positive feedback loops to keep kids engaged.

## How it works (no server, no accounts)

This is a single static HTML file. There's no backend, no database, and no account system:

- **All progress is stored locally**, in your own browser (`localStorage`) — stars, streaks, known words, imported vocabulary, and your mistake list.
- **Nothing is uploaded anywhere.** Your data never leaves your device.
- Because there's no shared state, **everyone who opens the link gets their own independent copy** — a parent and child (or a whole classroom) can use the same link at the same time without their progress mixing together or overwriting each other.

## Can this link be shared with many people?

**Yes.** The site is hosted on [GitHub Pages](https://pages.github.com/), which serves the page from GitHub's global CDN — the same infrastructure that serves millions of open-source project sites. A handful of people or a whole class opening the link at once is a trivial load for it; there's no server to overload because there's no server at all, just a static file being downloaded and run entirely in each visitor's own browser.

The one thing to know: since progress is saved per-browser, it **won't sync across devices** for the same person, and different people's stats stay separate automatically (which is usually exactly what you want when sharing).

## Updating the content

The vocabulary set can be extended any time via the **Import** tab — paste new word lists in the same format as the originals and they're saved permanently in that browser. To push a code/feature update to the live link for everyone, the source file just needs to be redeployed to this repository's `main` branch.

---

Built with vanilla HTML/CSS/JS — no frameworks, no build step, no dependencies.
