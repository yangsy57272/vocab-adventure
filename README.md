# ✨ SAT Vocab Adventure — 20-Day Sprint

A free, kid-friendly SAT vocabulary trainer built around a **3,824-word, 20-day study plan**. Flashcards, quizzes, pronunciation, and automatic mistake tracking — all in one page. No install, no login, no ads.

**🔗 Open it here: [yangsy57272.github.io/vocab-adventure](https://yangsy57272.github.io/vocab-adventure/)**

---

## What's inside

**3,824 SAT words**, de-duplicated and ranked by exam frequency, split across 20 daily sets:

| Phase | Days | Words/day | Focus |
|---|---|---|---|
| 1 | Day 1–8 | 140 | Highest-frequency, multi-source, most-tested |
| 2 | Day 9–14 | 190 | Important but slightly lower overlap |
| 3 | Day 15–20 | 261 | Long-tail coverage |

Every word carries a **priority rating from ★ to ★★★★★** based on how often it appears across real SAT material — so you always know what to learn first. Each day also shows its **built-in 1/3/7 spaced-repetition review plan** (e.g. Day 4 → review Day 3 + Day 1).

## Features

### 🃏 Flashcards
Tap to flip: English word on the front (with part of speech and priority stars), Chinese meaning and English definition on the back. Tap 🔊 to hear the word pronounced. Mark words "I know this" to track progress.

Extras: **Shuffle**, **Hide known** (drill only what you haven't learned), and **Random jump**. Keyboard shortcuts on desktop — `←` `→` to move, `Space` to flip, `S` to speak, `K` to mark known.

### 🎯 Quiz — 4 modes
| Mode | What it tests |
|---|---|
| **中文 → 单词** | See the Chinese meaning, pick the English word |
| **单词 → 中文** | See the English word, pick the Chinese meaning |
| **English Definition** | Read the English definition, pick the word |
| **Hard Mode** | All wrong answers share the same part of speech — much trickier |

Quizzes respect your current Day and Priority filters, so you can drill exactly one day's set or just the ★★★★★ words. You can quit any quiz mid-round with the **✕ Quit** button.

### ❌ Automatic mistake tracking
Every word you miss is saved to a personal revision list, with a counter in the header. Open the **Mistakes** tab to see what you've missed and how many times, then hit **🩹 Practice Now** to quiz yourself on *only* those words. Get one right and it clears itself from the list automatically — no manual bookkeeping.

### 📊 Progress
A card per day showing how many words you've marked known, plus a breakdown by priority level. Tap any card to jump straight into studying that set.

### 📖 Word List & ⬆️ Import
Search all 3,824 words by English, Chinese, or definition. Add your own extra words (`word | 词性 | 中文 | English definition`, one per line) — they're saved permanently in your browser under a **Bonus** day and can be deleted individually or all at once.

## How it works — no server, no accounts

This is a single static HTML file. There's no backend and no database:

- **All progress lives in your own browser** (`localStorage`) — known words, stars, streaks, imported words, and your mistake list.
- **Nothing is uploaded anywhere.** Your data never leaves your device.
- **Everyone gets their own independent copy.** A parent and child, or a whole class, can use the same link simultaneously without progress mixing.
- Data survives refreshes, closing the tab, and restarting the computer. It's cleared only by clearing browser data, or by using a private/incognito window.

Because progress is per-browser, it does **not** sync across devices — studying on a laptop and a tablet keeps two separate records.

## Can the link be shared widely?

Yes. It's hosted on [GitHub Pages](https://pages.github.com/), served from GitHub's global CDN. There's no server to overload — every visitor just downloads one file and runs it locally in their browser — so a handful of people or an entire class is equally fine.

---

Built with vanilla HTML/CSS/JS. No frameworks, no build step, no dependencies.
