# Grimoire

A dark-fantasy word puzzle game where players swipe letters on a grid to form words, defeat shadow creatures, and progress through a campaign across the forgotten town of Thornwall.

**Tagline:** "Spell the Dark Away"

Built with React Native + Expo. Supports English and Russian.

---

## Table of Contents

- [Gameplay](#gameplay)
- [Campaign & Levels](#campaign--levels)
- [Boss Fights](#boss-fights)
- [Runes (Power-Ups)](#runes-power-ups)
- [Daily Quest](#daily-quest)
- [Progression & Retention](#progression--retention)
- [Scoring](#scoring)
- [Language Support](#language-support)
- [Visual Design](#visual-design)
- [Audio & Haptics](#audio--haptics)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)

---

## Gameplay

Players swipe adjacent letters (including diagonals) on a grid to form words. Each level has a primary objective (e.g. reach a score target, find N words) and a bonus objective for extra stars. A countdown timer adds pressure.

- **Grid sizes**: 6x6 (standard), 7x7 (boss levels)
- **Minimum word length**: 3 letters
- **Dictionary**: ~35k English words or ~100k Russian words, profanity-filtered
- **Word lookup**: Trie data structure for instant prefix validation during DFS board solving

The board is procedurally generated each game. A solver verifies the board has enough words and achievable score before presenting it to the player. Up to 100 generation attempts; fallback boards guarantee playability.

---

## Campaign & Levels

50 campaign levels across 5 regions of Thornwall:

| Region | Levels | Locations |
|--------|--------|-----------|
| The Old Quarter | 1-10 | Scribe's Attic, Thornwall Academy, The Inkwell Tavern... |
| The Wychwood | 11-20 | Moss Gate, The Old Mill, Hollow Oak Inn... |
| The Undercroft | 21-30 | Catacombs Entrance, Ember Forge, Drowned Chapel... |
| The Ashen Heights | 31-40 | Windbreak Tower, The Burned Library, Thornwall Keep... |
| The Hollow Breach | 41-50 | Voidstone Steps, Glyph Hall, Ink Abyss... |

### Objective Types

| Type | Description |
|------|-------------|
| **Score Target** | Reach N points |
| **Word Hunter** | Find N words |
| **Linguist** | Find N long words (5+ letters) |
| **Wordsmith** | Find a single word of N letters |
| **Clear the Wall** | Use every letter on the grid |
| **Speed Run** | Find N words before time runs out |

### Star Rating

| Stars | Condition |
|-------|-----------|
| 1 | Primary objective completed |
| 2 | Exceeded 150% of score target or found 8+ words |
| 3 | Bonus objective completed |

---

## Boss Fights

Every 5th level is a boss fight with unique mechanics and dark-themed visuals.

### Gloomfang (Levels 5, 10, 15)

- Letters randomly flip hidden and reveal back
- Dark background with particle ash

### Blightworm (Levels 20, 25, 30)

- All Gloomfang effects plus letter decay
- Up to 25% of grid cells can decay (become unusable)
- Cells decay every 8-12 seconds

### Unwriter (Levels 35, 40, 45, 50)

- All previous effects plus time attacks
- Steals 3-8 seconds from the clock every 15-25 seconds
- Lightning flashes across the screen
- Fog overlay and particle ash intensified

Boss levels use dedicated WebP background images and atmospheric overlays (fog, ash particles, lightning).

---

## Runes (Power-Ups)

Three ancient rune abilities, one of each available per game:

| Rune | Effect |
|------|--------|
| **Scatter Rune** | Shuffles the entire grid with new letters |
| **Sight Rune** | Reveals valid word paths |
| **Stasis Rune** | Freezes the timer for 10 seconds |

A strain meter fills with each rune used (33% per use) as a visual indicator of magical effort.

---

## Daily Quest

A special level (ID 99) with a seed-based board that is the same for all players on a given calendar day.

- Grid: 6x6
- Timer: 180 seconds
- Objective: Score 80 points
- Bonus: Find a 6+ letter word
- Rewards: XP + Rune

---

## Progression & Retention

### Player Stats

Tracked persistently across sessions:

- Total words found
- Total score
- Longest word
- Monsters defeated
- Games played
- Current and best streak

### Hit Points

- 5 HP max, 1 spent per game
- Regenerates 1 HP every 30 minutes
- Displayed as hearts in the UI

### Streaks

- Increments for each consecutive day played
- Resets on a missed day
- Best streak recorded permanently

### Scribe Marks (Achievements)

| Mark | Requirement |
|------|-------------|
| Inkwell | Find 50 total words |
| Lexicon Keeper | Find 500 total words |
| Shadow Breaker | Defeat first boss |
| Bane of the Hollow | Defeat 5 bosses |
| Oath Keeper | 7-day streak |
| Page Turner | Play 10 games |
| Golden Quill | Earn 10,000 total points |
| Chronicler | Play 50 games |

---

## Scoring

Each word scores based on letter values + length bonus, with multipliers for longer words.

### Length Bonuses

| Word Length | Base Bonus | Multiplier |
|-------------|------------|------------|
| 3 letters | +8 | 1x |
| 4 letters | +12 | 1x |
| 5 letters | +18 | 1.5x |
| 6 letters | +25 | 2x |
| 7+ letters | +35 | 3x |

---

## Language Support

Switch between English and Russian from the Scribe Ledger (profile tab).

- **Dictionary**: `an-array-of-english-words` (EN) / `russian-words` (RU)
- **Letter distribution**: Frequency-weighted per language
- **Scoring**: Language-specific Scrabble values
- **UI text**: All gameplay strings translated (objectives, buttons, HUD, results, stats)
- **Russian specifics**: Normalizes letters, Russian profanity filter

Language preference persists across sessions via AsyncStorage.

---

## Visual Design

### Theme Zones

The app uses three visual themes depending on context:

**Thornwall** (campaign gameplay): Dark warm tones with goldenrod accents, VHS scanlines, CRT effect, flickering ward stones on the title screen.

**Hollow** (boss levels): Black/red palette, particle ash, fog overlay, lightning flashes, dedicated monster background images.

**Grimoire** (menus, daily quest, profile): Parchment tones with bronze accents, scroll-styled UI elements, medieval aesthetic.

### Effects

- **RuneText**: Neon glow text with configurable color and size
- **VHS Overlay**: Animated scanline + film grain
- **CRT Effect**: Horizontal scanlines across the screen
- **Neon Glow**: Shadow-based glow on interactive elements
- **Gradient Backgrounds**: Multi-layer SVG radial gradients per zone

### Typography

- **Title font**: Righteous (Google Fonts)
- **Monospace**: Courier (iOS) / monospace (Android)
- **Sizes**: 10px (xs) through 64px (hero)

---

## Audio & Haptics

### Sound Effects

| Event | Sound |
|-------|-------|
| Cell selected during swipe | `select.wav` |
| Valid word submitted | `valid.wav` |
| Invalid/rejected word | `invalid.wav` |
| Long word (6+ letters) | `bonus.wav` |
| Level completed | `complete.wav` |
| Level failed | `failed.wav` |
| Timer warning (last 10s) | `tick.wav` |

### Haptic Feedback

- Light tap on cell selection
- Medium impact on valid word
- Heavy impact on rune use
- Success notification on level win
- Error notification on level loss

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Expo | 54.0.33 | App framework |
| React Native | 0.81.5 | UI runtime |
| TypeScript | 5.9.2 | Type safety |
| Expo Router | 6.0.23 | File-based navigation |
| React Native Reanimated | 4.1.1 | Animations |
| React Native Gesture Handler | 2.28.0 | Touch input |
| React Native SVG | 15.12.1 | Vector graphics |
| Expo Linear Gradient | 15.0.8 | Gradient backgrounds |
| Expo AV | 16.0.8 | Audio playback |
| Expo Haptics | 15.0.8 | Haptic feedback |
| Expo Asset | 12.0.6 | Image preloading |
| AsyncStorage | 2.2.0 | Persistent storage |
| Jest | 30.2.0 | Testing |

---

## Project Structure

```
grimoire/
├── app/                           # Expo Router screens
│   ├── _layout.tsx               # Root layout (providers, fonts, asset preload)
│   ├── index.tsx                 # Title screen
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab navigation (Map / Daily / Hero)
│   │   ├── map.tsx               # Campaign map
│   │   ├── daily.tsx             # Daily quest
│   │   └── profile.tsx           # Scribe ledger + language selector
│   ├── level/[id].tsx            # Gameplay screen
│   └── results/[id].tsx          # Results screen
│
├── src/
│   ├── shared/
│   │   ├── types/                # Language, GridSize, LevelConfig, etc.
│   │   ├── constants/            # Colors, fonts, spacing, animations
│   │   ├── components/           # RuneText, VHSOverlay, CRTEffect, etc.
│   │   └── i18n/                 # LanguageProvider, translations (EN/RU)
│   │
│   ├── persistence/
│   │   ├── types.ts              # PlayerProgress, PlayerStats, AppSettings
│   │   ├── storage.ts            # AsyncStorage get/save functions
│   │   └── hooks/                # useGameProgress
│   │
│   ├── features/
│   │   ├── words/
│   │   │   ├── DictionaryProvider.tsx   # Word validation context
│   │   │   └── utils/
│   │   │       ├── dictionary.ts       # Load, filter, validate words
│   │   │       └── trie.ts             # Trie for prefix search
│   │   │
│   │   ├── board/
│   │   │   └── utils/
│   │   │       ├── letterDistribution.ts  # EN/RU letter weights
│   │   │       ├── boardSolver.ts         # DFS word finder + scoring
│   │   │       └── boardGenerator.ts      # Board creation + validation
│   │   │
│   │   ├── game/
│   │   │   ├── state/              # GameState, GameAction, gameReducer
│   │   │   ├── utils/              # Objectives, levelConfig, scoring
│   │   │   ├── hooks/              # useGameLoop, usePowerUps
│   │   │   └── components/         # ObjectiveBar, LevelIntro, RunePanel, etc.
│   │   │
│   │   ├── grid/
│   │   │   ├── utils/              # Adjacency logic
│   │   │   ├── hooks/              # useGridGesture, useLetterSelection
│   │   │   └── components/         # LetterGrid, LetterCell, SwipePath
│   │   │
│   │   ├── darkLevel/
│   │   │   ├── hooks/              # useDarkLevelEffects (boss mechanics)
│   │   │   └── components/         # DarkBackground, ParticleAsh, FogOverlay, Lightning
│   │   │
│   │   ├── retention/
│   │   │   └── utils/              # Streaks, HP, feats, daily seed
│   │   │
│   │   ├── map/                    # Campaign map visualization
│   │   └── audio/                  # AudioProvider, sound effects
│
├── assets/
│   ├── images/
│   │   ├── map-bg.png             # Campaign map background
│   │   └── dark-levels/           # 5 boss fight backgrounds (.webp)
│   └── audio/sfx/                 # 7 sound effect files (.wav)
│
├── __tests__/                     # Unit tests
├── app.json                       # Expo config
├── tsconfig.json                  # TypeScript strict mode, @ alias
├── jest.config.js                 # Jest + ts-jest config
└── babel.config.js                # Expo preset + module resolver
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- iOS Simulator, Android Emulator, or physical device with Expo Go

### Install

```bash
npm install
```

### Run

```bash
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Start on iOS simulator |
| `npm run android` | Start on Android emulator |
| `npx jest` | Run test suite |
| `npx tsc --noEmit` | Type check |
| `npx expo export --platform ios` | Production build |
