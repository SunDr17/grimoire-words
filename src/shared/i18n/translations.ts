import type { Language } from '@/shared/types'

type TranslationRecord = Record<string, string>

const en: TranslationRecord = {
  // Title screen
  'title.subtitle': "A Scribe's Journey Through Thornwall",
  'title.play': 'OPEN THE GRIMOIRE',
  'title.loading': 'BINDING WORDS...',
  'title.wordCount': '{count} words in the Grimoire',
  'title.footer': 'Swipe letters. Find words. Seal the Hollow.',

  // Daily screen
  'daily.label': 'DAILY QUEST',
  'daily.description': 'A unique word puzzle appears each day.\nAll scribes face the same board.\nHow many words can you find?',
  'daily.rewards': 'Rewards: XP + Rune',
  'daily.accept': 'ACCEPT QUEST',

  // Results screen
  'results.level': 'LEVEL {id}',
  'results.questComplete': 'QUEST COMPLETE',
  'results.questFailed': 'QUEST FAILED',
  'results.timeExpired': 'Time expired',
  'results.score': 'Score',
  'results.wordsFound': 'Words Found',
  'results.xpEarned': 'XP Earned',
  'results.nextLevel': 'NEXT LEVEL',
  'results.playAgain': 'PLAY AGAIN',
  'results.retry': 'RETRY',
  'results.campaignMap': 'CAMPAIGN MAP',
  'results.defeated': '{monster} DEFEATED!',

  // HUD / ObjectiveBar
  'hud.score': 'Score',
  'hud.bonus': 'Bonus: {label}',

  // Level intro
  'intro.level': 'LEVEL {id}',
  'intro.bonus': 'Bonus: {label}',
  'intro.boss': 'BOSS: {monster}',

  // Objectives
  'objective.scoreTarget': 'Score {target} pts',
  'objective.wordHunter': 'Find {target} words',
  'objective.linguist': 'Find {target} long words (5+ letters)',
  'objective.wordsmith': 'Find a {target}-letter word',
  'objective.clearTheWall': 'Use every letter',
  'objective.speedRun': 'Find {target} words quickly',

  // Bonus objectives
  'bonus.longWord': 'Find a {target}+ letter word',
  'bonus.highScore': 'Score {target}+ pts',
  'bonus.timeRemaining': 'Finish with {target}+ seconds left',
  'bonus.noPowerUps': 'Use no runes',

  // Power-ups
  'power.scatterRune': 'SCATTER',
  'power.sightRune': 'SIGHT',
  'power.stasisRune': 'STASIS',

  // Tab labels
  'tab.campaign': 'Campaign',
  'tab.quest': 'Quest',
  'tab.hero': 'Hero',

  // No Lives modal
  'noLives.title': 'OUT OF LIVES',
  'noLives.subtitle': 'Your ink has run dry.\nWait for it to replenish or watch an ad.',
  'noLives.nextLife': 'Next life',
  'noLives.watchAd': 'WATCH AD +1 LIFE',
  'noLives.close': 'Back to Map',

  // Continue modal
  'continue.title': "TIME'S UP!",
  'continue.subtitle': 'Watch an ad to continue with +30 seconds.',
  'continue.watchAd': 'WATCH AD +30s',
  'continue.decline': 'Accept Defeat',

  // Double score
  'results.doubleScore': 'DOUBLE SCORE',
  'results.doubleXp': 'DOUBLE XP',

  // Bonus rune
  'bonusRune.label': 'FREE RUNE',

  // Modifiers
  'modifier.longWordsOnly': 'LONG WORDS ONLY',
  'modifier.longWordsOnly.desc': 'Minimum 5-letter words',
  'modifier.speedRound': 'SPEED ROUND',
  'modifier.speedRound.desc': 'Half timer, half target',
  'modifier.goldenLetters': 'GOLDEN LETTERS',
  'modifier.goldenLetters.desc': 'Some letters score 2x',
  'modifier.noRunes': 'NO RUNES',
  'modifier.noRunes.desc': 'Power-ups disabled',

  // Star gates
  'starGate.required': 'Requires {stars} stars',

  // Login rewards
  'loginReward.title': 'DAILY REWARD',
  'loginReward.claim': 'CLAIM',
  'loginReward.day': 'Day {day}',
  'loginReward.claimed': 'Claimed!',
  'loginReward.runes': '{count} Rune',
  'loginReward.runesPlural': '{count} Runes',
  'loginReward.runesShort': 'runes',

  // Map - Thornwall
  'map.title': 'THORNWALL',
  'map.subtitle': 'CAMPAIGN MAP',
  'map.lore': 'The Hollow bleeds through...',
  'map.levelCount': 'Level {current} of {total}',
  'map.footer': 'Beyond lies the Hollow...',

  // Map - Hollow
  'map.hollow.title': 'THE HOLLOW',
  'map.hollow.subtitle': 'VOID MAP',
  'map.hollow.lore': 'Words cease to exist here...',
  'map.hollow.footer': 'Beyond lies only silence.',
  'map.hollow.locked': 'Defeat the Unwriter to enter',

  // Cities
  'city.thornwall': 'THORNWALL',
  'city.hollow': 'THE HOLLOW',

  // Hollow enter
  'results.enterHollow': 'ENTER THE HOLLOW',

  // HP
  'hp.next': 'Next:',

  // Bonus rune reward
  'bonusRune.rewarded': 'Rune received!',
  'bonusRune.rewardedType': '{rune} obtained!',

  // Profile / Character sheet
  'profile.characterSheet': 'SCRIBE LEDGER',
  'profile.wordWizard': 'WORD SCRIBE',
  'profile.stats': 'STATS',
  'profile.feats': 'SCRIBE MARKS',
  'profile.featsDescription': 'Complete quests to earn Scribe Marks!',
  'profile.campaignLevel': 'Campaign Level',
  'profile.totalStars': 'Total Stars',
  'profile.wordsDiscovered': 'Words Discovered',
  'profile.totalScore': 'Total Score',
  'profile.longestWord': 'Longest Word',
  'profile.monstersDefeated': 'Monsters Defeated',
  'profile.gamesPlayed': 'Games Played',
  'profile.currentStreak': 'Current Streak',
  'profile.bestStreak': 'Best Streak',
  'profile.days': '{count} days',
  'profile.language': 'Language',
  'profile.level': 'Level {level}',
}

const ru: TranslationRecord = {
  // Title screen
  'title.subtitle': 'Путешествие Писца по Торнволлу',
  'title.play': 'ОТКРЫТЬ ГРИМУАР',
  'title.loading': 'СВЯЗЫВАЮ СЛОВА...',
  'title.wordCount': '{count} слов в Гримуаре',
  'title.footer': 'Свайпай буквы. Ищи слова. Запечатай Пустошь.',

  // Daily screen
  'daily.label': 'ЕЖЕДНЕВНОЕ ЗАДАНИЕ',
  'daily.description': 'Каждый день — новая головоломка.\nВсе писцы видят одно поле.\nСколько слов ты найдёшь?',
  'daily.rewards': 'Награды: XP + Руна',
  'daily.accept': 'ПРИНЯТЬ ЗАДАНИЕ',

  // Results screen
  'results.level': 'УРОВЕНЬ {id}',
  'results.questComplete': 'ЗАДАНИЕ ВЫПОЛНЕНО',
  'results.questFailed': 'ЗАДАНИЕ ПРОВАЛЕНО',
  'results.timeExpired': 'Время вышло',
  'results.score': 'Очки',
  'results.wordsFound': 'Найдено слов',
  'results.xpEarned': 'Получено XP',
  'results.nextLevel': 'ДАЛЕЕ',
  'results.playAgain': 'ЗАНОВО',
  'results.retry': 'ПОВТОРИТЬ',
  'results.campaignMap': 'КАРТА КАМПАНИИ',
  'results.defeated': '{monster} ПОВЕРЖЕН!',

  // HUD / ObjectiveBar
  'hud.score': 'Очки',
  'hud.bonus': 'Бонус: {label}',

  // Level intro
  'intro.level': 'УРОВЕНЬ {id}',
  'intro.bonus': 'Бонус: {label}',
  'intro.boss': 'БОСС: {monster}',

  // Objectives
  'objective.scoreTarget': 'Набрать {target} очков',
  'objective.wordHunter': 'Найти {target} слов',
  'objective.linguist': 'Найти {target} длинных слов (5+ букв)',
  'objective.wordsmith': 'Найти слово из {target} букв',
  'objective.clearTheWall': 'Использовать все буквы',
  'objective.speedRun': 'Быстро найти {target} слов',

  // Bonus objectives
  'bonus.longWord': 'Найти слово из {target}+ букв',
  'bonus.highScore': 'Набрать {target}+ очков',
  'bonus.timeRemaining': 'Закончить с {target}+ сек.',
  'bonus.noPowerUps': 'Без рун',

  // Power-ups
  'power.scatterRune': 'ВИХРЬ',
  'power.sightRune': 'ВЗОР',
  'power.stasisRune': 'СТОП',

  // Tab labels
  'tab.campaign': 'Кампания',
  'tab.quest': 'Задание',
  'tab.hero': 'Герой',

  // No Lives modal
  'noLives.title': 'ЖИЗНИ КОНЧИЛИСЬ',
  'noLives.subtitle': 'Чернила высохли.\nПодожди восстановления или посмотри рекламу.',
  'noLives.nextLife': 'Следующая жизнь',
  'noLives.watchAd': 'РЕКЛАМА +1 ЖИЗНЬ',
  'noLives.close': 'На карту',

  // Continue modal
  'continue.title': 'ВРЕМЯ ВЫШЛО!',
  'continue.subtitle': 'Посмотри рекламу и получи +30 секунд.',
  'continue.watchAd': 'РЕКЛАМА +30сек',
  'continue.decline': 'Принять поражение',

  // Double score
  'results.doubleScore': 'ДВОЙНЫЕ ОЧКИ',
  'results.doubleXp': 'ДВОЙНОЙ XP',

  // Bonus rune
  'bonusRune.label': 'БОНУС РУНА',

  // Modifiers
  'modifier.longWordsOnly': 'ТОЛЬКО ДЛИННЫЕ',
  'modifier.longWordsOnly.desc': 'Минимум 5 букв',
  'modifier.speedRound': 'СКОРОСТНОЙ',
  'modifier.speedRound.desc': 'Полтаймера, полцели',
  'modifier.goldenLetters': 'ЗОЛОТЫЕ БУКВЫ',
  'modifier.goldenLetters.desc': 'Некоторые буквы x2',
  'modifier.noRunes': 'БЕЗ РУН',
  'modifier.noRunes.desc': 'Руны отключены',

  // Star gates
  'starGate.required': 'Нужно {stars} звёзд',

  // Login rewards
  'loginReward.title': 'ЕЖЕДНЕВНАЯ НАГРАДА',
  'loginReward.claim': 'ЗАБРАТЬ',
  'loginReward.day': 'День {day}',
  'loginReward.claimed': 'Получено!',
  'loginReward.runes': '{count} Руна',
  'loginReward.runesPlural': '{count} Рун',
  'loginReward.runesShort': 'руны',

  // Map - Thornwall
  'map.title': 'ТОРНВОЛЛ',
  'map.subtitle': 'КАРТА КАМПАНИИ',
  'map.lore': 'Пустошь просачивается...',
  'map.levelCount': 'Уровень {current} из {total}',
  'map.footer': 'За пределами — Пустошь...',

  // Map - Hollow
  'map.hollow.title': 'ПУСТОШЬ',
  'map.hollow.subtitle': 'КАРТА ПУСТОТЫ',
  'map.hollow.lore': 'Здесь слова перестают существовать...',
  'map.hollow.footer': 'Дальше — лишь тишина.',
  'map.hollow.locked': 'Победи Стирателя, чтобы войти',

  // Cities
  'city.thornwall': 'ТОРНВОЛЛ',
  'city.hollow': 'ПУСТОШЬ',

  // Hollow enter
  'results.enterHollow': 'В ПУСТОШЬ',

  // HP
  'hp.next': 'Далее:',

  // Bonus rune reward
  'bonusRune.rewarded': 'Руна получена!',
  'bonusRune.rewardedType': '{rune} получена!',

  // Profile / Character sheet
  'profile.characterSheet': 'КНИГА ПИСЦА',
  'profile.wordWizard': 'ПИСЕЦ СЛОВ',
  'profile.stats': 'ХАРАКТЕРИСТИКИ',
  'profile.feats': 'ЗНАКИ ПИСЦА',
  'profile.featsDescription': 'Завершайте задания и получайте Знаки Писца!',
  'profile.campaignLevel': 'Уровень кампании',
  'profile.totalStars': 'Всего звёзд',
  'profile.wordsDiscovered': 'Найдено слов',
  'profile.totalScore': 'Общий счёт',
  'profile.longestWord': 'Самое длинное слово',
  'profile.monstersDefeated': 'Монстров побеждено',
  'profile.gamesPlayed': 'Игр сыграно',
  'profile.currentStreak': 'Текущая серия',
  'profile.bestStreak': 'Лучшая серия',
  'profile.days': '{count} дн.',
  'profile.language': 'Язык',
  'profile.level': 'Уровень {level}',
}

const translations: Record<Language, TranslationRecord> = { en, ru }

export function translate(
  language: Language,
  key: string,
  params?: Record<string, string | number>,
): string {
  const template = translations[language][key] ?? translations.en[key] ?? key

  if (!params) return template

  return Object.entries(params).reduce<string>(
    (result, [paramKey, paramValue]) =>
      result.replace(`{${paramKey}}`, String(paramValue)),
    template,
  )
}
