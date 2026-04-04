# Grimoire

A dark-fantasy word puzzle game where players swipe letters on a grid to form words, defeat shadow creatures, and progress through a 100-level campaign across two cities: the forgotten town of Thornwall and the void-touched realm of the Hollow.

**Tagline:** "Spell the Dark Away"

Built with React Native + Expo. Supports English and Russian.

---

## Table of Contents

- [Gameplay](#gameplay)
- [Campaign & Levels](#campaign--levels)
- [Level Modifiers](#level-modifiers)
- [Star Gates](#star-gates)
- [Boss Fights](#boss-fights)
- [Runes (Power-Ups)](#runes-power-ups)
- [Daily Quest](#daily-quest)
- [Progression & Retention](#progression--retention)
- [Monetization & Ads](#monetization--ads)
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
- **Minimum word length**: 3 letters (5 letters on `longWordsOnly` modifier levels)
- **Dictionary**: ~35k English words or ~100k Russian words, profanity-filtered
- **Word lookup**: Trie data structure for instant prefix validation during DFS board solving

The board is procedurally generated each game. A solver verifies the board has enough words and achievable score before presenting it to the player. Up to 100 generation attempts; fallback boards guarantee playability.

---

## Campaign & Levels

100 campaign levels across two cities, each with 50 levels and 10 regions.

### Thornwall (Levels 1-50)

| Region | Levels | Locations |
|--------|--------|-----------|
| The Old Quarter | 1-10 | Scribe's Attic, Thornwall Academy, The Inkwell Tavern... |
| The Wychwood | 11-20 | Moss Gate, The Old Mill, Hollow Oak Inn... |
| The Undercroft | 21-30 | Catacombs Entrance, Ember Forge, Drowned Chapel... |
| The Ashen Heights | 31-40 | Windbreak Tower, The Burned Library, Thornwall Keep... |
| The Hollow Breach | 41-50 | Voidstone Steps, Glyph Hall, Ink Abyss... |

### The Hollow (Levels 51-100)

Unlocked after completing Thornwall (level 50). A separate city with cyan/red void aesthetics.

| Region | Levels | Locations |
|--------|--------|-----------|
| The Rift Threshold | 51-60 | Rift Threshold, Shattered Gate, The Bleed... |
| The Whispering Depths | 61-70 | Echo Chamber, Thought Siphon, Memory Drain... |
| The Null Expanse | 71-80 | Null Field, Entropy Well, Void Lattice... |
| The Silent Core | 81-90 | Silence Spire, Unwritten Hall, Blank Verse... |
| The Final Erasure | 91-100 | Last Word, The Absence, Total Erasure... |

All 100 locations have bilingual names (EN/RU).

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

### Results Screen

After each level:
- Stars animation (1-3 stars earned) or skull icon on loss
- Score and words found display
- XP earned on win (`score x 2`)
- Double Score option via rewarded ad
- Boss defeat message with monster name
- Next Level / Campaign Map navigation
- After level 50: "Enter the Hollow" transition
- After level 100: "Play Again" returns to map

---

## Level Modifiers

Non-boss levels may have special modifiers that alter gameplay:

| Modifier | Effect | Levels |
|----------|--------|--------|
| **Long Words Only** | Minimum 5-letter words | 11, 22, 31, 41, 61, 72, 81, 91 |
| **Speed Round** | Timer halved, objective target halved | 14, 24, 33, 43, 64, 74, 83, 93 |
| **Golden Letters** | Special golden cells on the grid | 17, 26, 36, 46, 67, 76, 86, 96 |
| **No Runes** | Rune panel disabled for this level | 19, 28, 38, 48, 69, 78, 88, 98 |

---

## Star Gates

Certain levels require a minimum number of total stars earned to unlock:

| Level | Stars Required | Gate |
|-------|---------------|------|
| 15 | 10 | Mid-Thornwall |
| 25 | 25 | |
| 35 | 45 | |
| 45 | 65 | |
| 50 | 80 | Thornwall finale |
| 65 | 90 | Mid-Hollow |
| 75 | 110 | |
| 85 | 130 | |
| 95 | 160 | |
| 100 | 190 | Hollow finale |

Players must replay earlier levels for more stars if gated.

---

## Boss Fights

Every 5th level is a boss fight with unique mechanics and dark-themed visuals.

### Thornwall Bosses

**Gloomfang** (Levels 5, 10, 15)
- Letters randomly flip hidden and reveal back
- Dark background with particle ash

**Blightworm** (Levels 20, 25, 30)
- All Gloomfang effects plus letter decay
- Up to 25% of grid cells can decay (become unusable)
- Cells decay every 8-12 seconds

**Unwriter** (Levels 35, 40, 45, 50)
- All previous effects plus time attacks
- Steals 3-8 seconds from the clock every 15-25 seconds
- Lightning flashes across the screen
- Fog overlay and particle ash intensified

### Hollow Bosses

**Nullwhisper** (Levels 55, 60, 65)
- Same mechanics as Gloomfang, void-themed visuals

**Voidmaw** (Levels 70, 75, 80)
- Same mechanics as Blightworm, void-themed visuals

**The Silence** (Levels 85, 90, 95, 100)
- Same mechanics as Unwriter, void-themed visuals

Boss levels use dedicated WebP background images (5 total, shared across cities) and atmospheric overlays (fog, ash particles, lightning).

---

## Runes (Power-Ups)

Three ancient rune abilities, one of each available per game (unless `noRunes` modifier is active):

| Rune | Effect |
|------|--------|
| **Scatter Rune** | Shuffles the entire grid with new letters |
| **Sight Rune** | Highlights a valid word path for 5 seconds |
| **Stasis Rune** | Freezes the timer for 10 seconds |

A strain meter fills with each rune used (33% per use) as a visual indicator of magical effort.

### Rune Inventory

Runes are consumable items tracked in the player's inventory:

- **Starting inventory**: 3 of each rune
- **Earning runes**: Daily login rewards, daily quest completion, bonus rune via rewarded ad
- **Bonus Rune button**: Appears on the campaign map when a rewarded ad is ready; grants 1 random rune

---

## Daily Quest

A special level (ID 999) with a seed-based board that is the same for all players on a given calendar day.

- Grid: 6x6
- Timer: 180 seconds
- Objective: Score 80 points
- Bonus: Find a 6+ letter word
- Rewards: XP + Rune
- Daily XP Multiplier: Watch rewarded ad on results to double XP earned

---

## Progression & Retention

### Player Stats

Tracked persistently across sessions:

- Campaign level reached
- Total stars earned (out of 300 max)
- Total words found
- Total score
- Longest word
- Monsters defeated
- Games played
- Current and best streak

Displayed on the Hero (profile) tab alongside earned feats.

### Hit Points

- 5 HP max, 1 spent per level attempt
- Regenerates 1 HP every 30 minutes (background timer with countdown display)
- Earned via daily login rewards (0-5 per day depending on streak day)
- Can watch a rewarded ad to restore 1 HP instantly
- Displayed as hearts in the HP bar on the campaign map

### Continue System

When a player loses a non-boss level:
- A modal offers to watch a rewarded ad for +30 seconds
- 10-second auto-decline timer
- Can only be used once per attempt
- Boss levels do not offer continue

### Streaks

- Increments for each consecutive day played
- Resets on a missed day
- Best streak recorded permanently

### Daily Login Rewards

A 7-day reward calendar (repeating cycle) shown as a modal on the campaign map:

| Day | Reward |
|-----|--------|
| 1 | Scatter Rune x1 |
| 2 | Sight Rune x1, +1 HP |
| 3 | Stasis Rune x1 |
| 4 | Scatter x1, Sight x1, +1 HP |
| 5 | Stasis x2 |
| 6 | All 3 runes x1, +2 HP |
| 7 | All 3 runes x2, +5 HP |

Claims happen once per calendar day. Visual calendar shows past (checked), current (highlighted), and future (locked) days.

### Feats (Achievements)

| Feat | Requirement |
|------|-------------|
| Inkwell | Find 50 total words |
| Lexicon Keeper | Find 500 total words |
| Shadow Breaker | Defeat first boss |
| Bane of the Hollow | Defeat 5 bosses |
| Oath Keeper | 7-day streak |
| Page Turner | Play 10 games |
| Golden Quill | Earn 10,000 total points |
| Chronicler | Play 50 games |

Displayed as shield badges on the Hero tab (earned/locked states).

---

## Monetization & Ads

Ad integration via Google AdMob with rewarded and interstitial placements.

### Rewarded Ads

| Placement | Reward | Where |
|-----------|--------|-------|
| **Continue** | +30 seconds on lost level | Loss modal (non-boss only) |
| **Double Score** | 2x final score | Results screen |
| **Daily Multiplier** | 2x XP earned | Daily quest results |
| **Bonus Rune** | 1 random rune | Campaign map button |
| **Restore Life** | +1 HP | Campaign map (when 0 HP) |

### Interstitial Ads

- Shown after every 3rd non-boss level completion
- Level counter tracked in ad service

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

### XP System

- XP earned on level win: `score x 2`
- Can be doubled via daily multiplier ad (daily quest only)
- Score itself can be doubled via rewarded ad (all levels)

---

## Language Support

Switch between English and Russian from the title screen or Hero tab.

- **Dictionary**: `an-array-of-english-words` (EN) / `russian-words` (RU)
- **Letter distribution**: Frequency-weighted per language
- **Scoring**: Language-specific Scrabble values
- **UI text**: All gameplay strings translated (objectives, buttons, HUD, results, stats, location names)
- **Russian specifics**: Normalizes letters, Russian profanity filter

Language preference persists across sessions via AsyncStorage.

---

## Visual Design

### Theme Zones

The app uses three visual themes depending on context:

**Thornwall** (campaign gameplay): Dark warm tones with goldenrod accents, VHS scanlines, CRT effect, flickering ward stones on the title screen. 7 light-level background images cycle per level.

**Hollow** (second city + boss levels): Black/red/cyan palette, particle ash, fog overlay, lightning flashes, dedicated monster background images (5 WebP).

**Grimoire** (menus, daily quest, profile): Parchment tones with bronze accents, scroll-styled UI elements, medieval aesthetic.

### Effects

- **RuneText**: Neon glow text with configurable color and size
- **VHS Overlay**: Animated scanline + film grain
- **CRT Effect**: Horizontal scanlines across the screen
- **Neon Glow**: Shadow-based glow on interactive elements
- **Gradient Backgrounds**: Multi-layer SVG radial gradients per zone
- **Particle Ash**: Floating ash particles on boss levels
- **Fog Overlay**: Creeping fog effect on boss levels
- **Lightning Effect**: Screen-wide lightning flashes (Unwriter/Silence bosses)

### Typography

- **Title font**: Righteous (Google Fonts)
- **Monospace**: Courier (iOS) / monospace (Android)
- **Sizes**: 10px (xs) through 64px (hero)

---

## Audio & Haptics

### Music

- **Light levels**: Ambient light track
- **Dark/boss levels**: Darker atmospheric track
- Music stops on level win/loss

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
| Google AdMob | - | Ad monetization |
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
│   │   ├── map.tsx               # Campaign map (city switcher)
│   │   ├── daily.tsx             # Daily quest
│   │   └── profile.tsx           # Scribe ledger + language selector
│   ├── level/[id].tsx            # Gameplay screen
│   └── results/[id].tsx          # Results screen
│
├── src/
│   ├── shared/
│   │   ├── types/                # Language, GridSize, LevelConfig, PowerUpType, etc.
│   │   ├── constants/            # Colors, fonts, spacing, animations
│   │   ├── components/           # RuneText, VHSOverlay, CRTEffect, GradientBackground
│   │   └── i18n/                 # LanguageProvider, translations (EN/RU)
│   │
│   ├── persistence/
│   │   ├── types.ts              # PlayerProgress, PlayerStats, PlayerInventory
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
│   │   │   ├── utils/              # Objectives, levelConfig, scoring, starGates
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
│   │   │   ├── utils/              # Streaks, HP, feats, daily seed, login rewards
│   │   │   └── hooks/              # useStreak
│   │   │
│   │   ├── map/
│   │   │   ├── components/         # CampaignMap, LocationNode
│   │   │   └── utils/              # cityConfigs, thornwallLocations, hollowLocations
│   │   │
│   │   ├── ads/
│   │   │   ├── components/         # ContinueModal
│   │   │   └── hooks/              # useAds
│   │   │
│   │   └── audio/                  # AudioProvider, sound effects
│
├── assets/
│   ├── images/
│   │   ├── map-bg.png             # Thornwall campaign map background
│   │   ├── map-bg-2.png           # Hollow campaign map background
│   │   ├── light-levels/          # 7 light-level backgrounds (.jpg)
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
