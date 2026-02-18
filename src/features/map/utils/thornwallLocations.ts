import type { Language } from '@/shared/types'

export interface MapLocation {
  readonly id: number
  readonly name: Record<Language, string>
  readonly x: number
  readonly y: number
  readonly isBoss: boolean
  readonly description: Record<Language, string>
}

export const THORNWALL_LOCATIONS: readonly MapLocation[] = [
  // Section 1: The Academy Quarter
  { id: 1, name: { en: "Scribe's Attic", ru: 'Чердак Писца' }, x: 0.15, y: 0.06, isBoss: false, description: { en: 'Where the ink still flows', ru: 'Где чернила ещё текут' } },
  { id: 2, name: { en: 'Thornwall Academy', ru: 'Академия Торнволла' }, x: 0.35, y: 0.04, isBoss: false, description: { en: 'Hall of young scribes', ru: 'Зал юных писцов' } },
  { id: 3, name: { en: 'The Inkwell Tavern', ru: 'Таверна «Чернильница»' }, x: 0.55, y: 0.06, isBoss: false, description: { en: 'Words flow like ale', ru: 'Слова льются рекой' } },
  { id: 4, name: { en: 'Cobblestone Row', ru: 'Булыжная Улица' }, x: 0.75, y: 0.04, isBoss: false, description: { en: 'Ancient letters underfoot', ru: 'Древние буквы под ногами' } },
  { id: 5, name: { en: 'The Sunken Archive', ru: 'Затонувший Архив' }, x: 0.9, y: 0.09, isBoss: true, description: { en: 'GLOOMFANG LURKS', ru: 'МРАКОКЛЫК ТАИТСЯ' } },
  // Section 2: The Old Town
  { id: 6, name: { en: "Warden's Garden", ru: 'Сад Смотрителя' }, x: 0.1, y: 0.16, isBoss: false, description: { en: 'Runes grow on vines', ru: 'Руны растут на лозах' } },
  { id: 7, name: { en: 'Candlewick Lane', ru: 'Свечной Переулок' }, x: 0.3, y: 0.14, isBoss: false, description: { en: 'Light guides the way', ru: 'Свет указывает путь' } },
  { id: 8, name: { en: 'Market Square', ru: 'Рыночная Площадь' }, x: 0.5, y: 0.16, isBoss: false, description: { en: 'Trade in words and wares', ru: 'Торговля словами и товарами' } },
  { id: 9, name: { en: 'The Clocktower', ru: 'Часовая Башня' }, x: 0.7, y: 0.14, isBoss: false, description: { en: 'Time runs thin', ru: 'Время на исходе' } },
  { id: 10, name: { en: 'The Broken Bell', ru: 'Разбитый Колокол' }, x: 0.88, y: 0.19, isBoss: true, description: { en: 'GLOOMFANG HUNTS', ru: 'МРАКОКЛЫК ОХОТИТСЯ' } },
  // Section 3: The Wychwood
  { id: 11, name: { en: 'Moss Gate', ru: 'Врата Мха' }, x: 0.12, y: 0.25, isBoss: false, description: { en: 'Entrance to the Wychwood', ru: 'Вход в Колдолесье' } },
  { id: 12, name: { en: 'The Old Mill', ru: 'Старая Мельница' }, x: 0.32, y: 0.23, isBoss: false, description: { en: 'Grinding letters to dust', ru: 'Буквы перемалываются в пыль' } },
  { id: 13, name: { en: 'Hollow Oak Inn', ru: 'Трактир «Дуплистый Дуб»' }, x: 0.52, y: 0.25, isBoss: false, description: { en: 'Rest among whispers', ru: 'Отдых среди шёпота' } },
  { id: 14, name: { en: 'Lantern Bridge', ru: 'Фонарный Мост' }, x: 0.72, y: 0.23, isBoss: false, description: { en: 'Cross with caution', ru: 'Переходи осторожно' } },
  { id: 15, name: { en: 'The Whispering Well', ru: 'Шепчущий Колодец' }, x: 0.9, y: 0.28, isBoss: true, description: { en: 'GLOOMFANG CALLS', ru: 'МРАКОКЛЫК ЗОВЁТ' } },
  // Section 4: The Marshlands
  { id: 16, name: { en: 'Foxglove Marsh', ru: 'Болото Наперстянки' }, x: 0.1, y: 0.35, isBoss: false, description: { en: 'Toxic beauty', ru: 'Ядовитая красота' } },
  { id: 17, name: { en: 'Thornhedge Path', ru: 'Тернистая Тропа' }, x: 0.3, y: 0.33, isBoss: false, description: { en: 'Barbs and brambles', ru: 'Шипы и колючки' } },
  { id: 18, name: { en: 'Skull Hollow', ru: 'Черепная Лощина' }, x: 0.5, y: 0.35, isBoss: false, description: { en: 'Bones tell stories', ru: 'Кости рассказывают истории' } },
  { id: 19, name: { en: 'Moonrise Lake', ru: 'Озеро Восходящей Луны' }, x: 0.7, y: 0.33, isBoss: false, description: { en: 'Reflections lie', ru: 'Отражения лгут' } },
  { id: 20, name: { en: 'The Rotting Grove', ru: 'Гниющая Роща' }, x: 0.88, y: 0.38, isBoss: true, description: { en: 'BLIGHTWORM RISES', ru: 'ЧУМОЧЕРВЬ ВОССТАЁТ' } },
  // Section 5: The Catacombs
  { id: 21, name: { en: 'Catacombs Entrance', ru: 'Вход в Катакомбы' }, x: 0.12, y: 0.44, isBoss: false, description: { en: 'Descent begins', ru: 'Спуск начинается' } },
  { id: 22, name: { en: 'The Blind Passage', ru: 'Слепой Проход' }, x: 0.32, y: 0.42, isBoss: false, description: { en: 'No light reaches here', ru: 'Свет сюда не доходит' } },
  { id: 23, name: { en: 'Rusted Gate Hall', ru: 'Зал Ржавых Врат' }, x: 0.52, y: 0.44, isBoss: false, description: { en: 'Iron weeps with age', ru: 'Железо плачет от старости' } },
  { id: 24, name: { en: 'Ember Forge', ru: 'Угольная Кузница' }, x: 0.72, y: 0.42, isBoss: false, description: { en: 'Where runes are born', ru: 'Где рождаются руны' } },
  { id: 25, name: { en: "The Worm's Cradle", ru: 'Колыбель Червя' }, x: 0.9, y: 0.47, isBoss: true, description: { en: 'BLIGHTWORM COMMANDS', ru: 'ЧУМОЧЕРВЬ ПОВЕЛЕВАЕТ' } },
  // Section 6: The Deep Mines
  { id: 26, name: { en: 'Salt Vein Mines', ru: 'Соляные Шахты' }, x: 0.1, y: 0.54, isBoss: false, description: { en: 'Crystal and grime', ru: 'Кристаллы и грязь' } },
  { id: 27, name: { en: 'Drowned Chapel', ru: 'Затопленная Часовня' }, x: 0.3, y: 0.52, isBoss: false, description: { en: 'Prayers long silenced', ru: 'Молитвы давно замолкли' } },
  { id: 28, name: { en: 'Bone Lantern Way', ru: 'Дорога Костяных Фонарей' }, x: 0.5, y: 0.54, isBoss: false, description: { en: 'Light from the dead', ru: 'Свет от мёртвых' } },
  { id: 29, name: { en: 'The Frozen Vault', ru: 'Ледяное Хранилище' }, x: 0.7, y: 0.52, isBoss: false, description: { en: 'Sealed in ice', ru: 'Запечатано во льду' } },
  { id: 30, name: { en: 'The Blighted Core', ru: 'Чумное Ядро' }, x: 0.88, y: 0.57, isBoss: true, description: { en: 'BLIGHTWORM DEVOURS', ru: 'ЧУМОЧЕРВЬ ПОЖИРАЕТ' } },
  // Section 7: The High Reaches
  { id: 31, name: { en: 'Windbreak Tower', ru: 'Ветроломная Башня' }, x: 0.12, y: 0.63, isBoss: false, description: { en: 'Above the storm', ru: 'Над бурей' } },
  { id: 32, name: { en: 'The Burned Library', ru: 'Сожжённая Библиотека' }, x: 0.32, y: 0.61, isBoss: false, description: { en: 'Ashes of knowledge', ru: 'Пепел знаний' } },
  { id: 33, name: { en: "Raven's Perch", ru: 'Воронье Гнездо' }, x: 0.52, y: 0.63, isBoss: false, description: { en: 'Eyes on the heights', ru: 'Взгляд с высоты' } },
  { id: 34, name: { en: 'Ashfall Terrace', ru: 'Терраса Пепла' }, x: 0.72, y: 0.61, isBoss: false, description: { en: 'Cinders drift down', ru: 'Пепел оседает' } },
  { id: 35, name: { en: 'The Silent Scriptorium', ru: 'Безмолвный Скрипторий' }, x: 0.9, y: 0.66, isBoss: true, description: { en: 'UNWRITER AWAKENS', ru: 'СТИРАТЕЛЬ ПРОБУЖДАЕТСЯ' } },
  // Section 8: The Stormlands
  { id: 36, name: { en: 'Storm Cliffs', ru: 'Штормовые Утёсы' }, x: 0.1, y: 0.73, isBoss: false, description: { en: 'Wind howls the old words', ru: 'Ветер воет древние слова' } },
  { id: 37, name: { en: 'The Shattered Arch', ru: 'Разрушенная Арка' }, x: 0.3, y: 0.71, isBoss: false, description: { en: 'A broken passage', ru: 'Сломанный проход' } },
  { id: 38, name: { en: 'Thornwall Keep', ru: 'Крепость Торнволла' }, x: 0.5, y: 0.73, isBoss: false, description: { en: 'Last stronghold', ru: 'Последний оплот' } },
  { id: 39, name: { en: 'The Last Hearth', ru: 'Последний Очаг' }, x: 0.7, y: 0.71, isBoss: false, description: { en: 'Warmth fades here', ru: 'Тепло угасает здесь' } },
  { id: 40, name: { en: 'The Erasure Chamber', ru: 'Комната Стирания' }, x: 0.88, y: 0.76, isBoss: true, description: { en: 'UNWRITER WATCHES', ru: 'СТИРАТЕЛЬ НАБЛЮДАЕТ' } },
  // Section 9: The Void Approach
  { id: 41, name: { en: 'Voidstone Steps', ru: 'Ступени Пустокамня' }, x: 0.15, y: 0.82, isBoss: false, description: { en: 'Into the breach', ru: 'В пролом' } },
  { id: 42, name: { en: 'The Pale Market', ru: 'Бледный Рынок' }, x: 0.35, y: 0.80, isBoss: false, description: { en: 'Trade in shadows', ru: 'Торговля в тенях' } },
  { id: 43, name: { en: 'Glyph Hall', ru: 'Зал Глифов' }, x: 0.55, y: 0.82, isBoss: false, description: { en: 'Symbols of power', ru: 'Символы власти' } },
  { id: 44, name: { en: 'Ember Root Crossing', ru: 'Перекрёсток Углей' }, x: 0.75, y: 0.80, isBoss: false, description: { en: 'Fire below ground', ru: 'Огонь под землёй' } },
  { id: 45, name: { en: 'The Unwritten Page', ru: 'Ненаписанная Страница' }, x: 0.9, y: 0.85, isBoss: true, description: { en: 'UNWRITER STRIKES', ru: 'СТИРАТЕЛЬ АТАКУЕТ' } },
  // Section 10: The Final Chapter
  { id: 46, name: { en: 'Mirror Corridor', ru: 'Зеркальный Коридор' }, x: 0.12, y: 0.92, isBoss: false, description: { en: 'Reflections deceive', ru: 'Отражения обманывают' } },
  { id: 47, name: { en: 'The Fading Shelf', ru: 'Тускнеющая Полка' }, x: 0.32, y: 0.90, isBoss: false, description: { en: 'Words disappear', ru: 'Слова исчезают' } },
  { id: 48, name: { en: 'Ink Abyss', ru: 'Чернильная Бездна' }, x: 0.52, y: 0.92, isBoss: false, description: { en: 'Darkness incarnate', ru: 'Тьма во плоти' } },
  { id: 49, name: { en: 'Threshold of Ruin', ru: 'Порог Погибели' }, x: 0.72, y: 0.90, isBoss: false, description: { en: 'No turning back', ru: 'Назад пути нет' } },
  { id: 50, name: { en: 'The Final Word', ru: 'Последнее Слово' }, x: 0.88, y: 0.95, isBoss: true, description: { en: 'UNWRITER MUST FALL', ru: 'СТИРАТЕЛЬ ДОЛЖЕН ПАСТЬ' } },
]

export function getLocationName(location: MapLocation, language: Language): string {
  return location.name[language]
}
