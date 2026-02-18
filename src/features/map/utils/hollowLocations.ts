import type { MapLocation } from './thornwallLocations'

export const HOLLOW_LOCATIONS: readonly MapLocation[] = [
  // Section 1: The Breach (51-55)
  { id: 51, name: { en: 'Rift Threshold', ru: 'Порог Разлома' }, x: 0.15, y: 0.06, isBoss: false, description: { en: 'Where reality cracks', ru: 'Где реальность трескается' } },
  { id: 52, name: { en: 'Shattered Gate', ru: 'Расколотые Врата' }, x: 0.35, y: 0.04, isBoss: false, description: { en: 'Torn between worlds', ru: 'Разорвано между мирами' } },
  { id: 53, name: { en: 'The Bleed', ru: 'Кровоточащий Край' }, x: 0.55, y: 0.06, isBoss: false, description: { en: 'Ink seeps into void', ru: 'Чернила сочатся в пустоту' } },
  { id: 54, name: { en: 'Void Landing', ru: 'Причал Пустоты' }, x: 0.75, y: 0.04, isBoss: false, description: { en: 'First steps into nothing', ru: 'Первые шаги в ничто' } },
  { id: 55, name: { en: 'The First Echo', ru: 'Первое Эхо' }, x: 0.9, y: 0.09, isBoss: true, description: { en: 'NULLWHISPER STIRS', ru: 'ШЁПОТ ПУСТОТЫ ШЕВЕЛИТСЯ' } },

  // Section 2: The Faded Quarter (56-60)
  { id: 56, name: { en: 'Ghost Script Lane', ru: 'Переулок Призрачных Букв' }, x: 0.1, y: 0.16, isBoss: false, description: { en: 'Words once lived here', ru: 'Когда-то здесь жили слова' } },
  { id: 57, name: { en: 'Erased Plaza', ru: 'Стёртая Площадь' }, x: 0.3, y: 0.14, isBoss: false, description: { en: 'Names forgotten', ru: 'Имена забыты' } },
  { id: 58, name: { en: 'The Pale Archive', ru: 'Бледный Архив' }, x: 0.5, y: 0.16, isBoss: false, description: { en: 'Empty shelves whisper', ru: 'Пустые полки шепчут' } },
  { id: 59, name: { en: 'Phantom Market', ru: 'Рынок Фантомов' }, x: 0.7, y: 0.14, isBoss: false, description: { en: 'Trading in memories', ru: 'Торгуют воспоминаниями' } },
  { id: 60, name: { en: 'The Blank Cathedral', ru: 'Пустой Собор' }, x: 0.88, y: 0.19, isBoss: true, description: { en: 'NULLWHISPER CALLS', ru: 'ШЁПОТ ПУСТОТЫ ЗОВЁТ' } },

  // Section 3: The Inkbleed Marshes (61-65)
  { id: 61, name: { en: 'Inkbleed Shore', ru: 'Берег Растёкших Чернил' }, x: 0.12, y: 0.25, isBoss: false, description: { en: 'Letters dissolve in mud', ru: 'Буквы растворяются в грязи' } },
  { id: 62, name: { en: 'The Dripping Glade', ru: 'Капающая Поляна' }, x: 0.32, y: 0.23, isBoss: false, description: { en: 'Ink rains from above', ru: 'Чернила льются сверху' } },
  { id: 63, name: { en: 'Smudge Bog', ru: 'Болото Клякс' }, x: 0.52, y: 0.25, isBoss: false, description: { en: 'Every step erases', ru: 'Каждый шаг стирает' } },
  { id: 64, name: { en: 'Blot Crossing', ru: 'Переправа Пятен' }, x: 0.72, y: 0.23, isBoss: false, description: { en: 'Dark waters swallow words', ru: 'Тёмные воды глотают слова' } },
  { id: 65, name: { en: 'The Dissolving Pool', ru: 'Растворяющий Омут' }, x: 0.9, y: 0.28, isBoss: true, description: { en: 'NULLWHISPER CONSUMES', ru: 'ШЁПОТ ПУСТОТЫ ПОГЛОЩАЕТ' } },

  // Section 4: The Static Fields (66-70)
  { id: 66, name: { en: 'White Noise Expanse', ru: 'Просторы Белого Шума' }, x: 0.1, y: 0.35, isBoss: false, description: { en: 'Static fills the air', ru: 'Статика заполняет воздух' } },
  { id: 67, name: { en: 'Scrambled Path', ru: 'Искажённая Тропа' }, x: 0.3, y: 0.33, isBoss: false, description: { en: 'Letters rearrange themselves', ru: 'Буквы переставляются сами' } },
  { id: 68, name: { en: 'The Garbled Tower', ru: 'Башня Помех' }, x: 0.5, y: 0.35, isBoss: false, description: { en: 'Signals from nowhere', ru: 'Сигналы из ниоткуда' } },
  { id: 69, name: { en: 'Distortion Field', ru: 'Поле Искажений' }, x: 0.7, y: 0.33, isBoss: false, description: { en: 'Reality bends', ru: 'Реальность изгибается' } },
  { id: 70, name: { en: "The Maw's Edge", ru: 'Край Пасти' }, x: 0.88, y: 0.38, isBoss: true, description: { en: 'VOIDMAW AWAKENS', ru: 'ПАСТЬ БЕЗДНЫ ПРОБУЖДАЕТСЯ' } },

  // Section 5: The Redacted Depths (71-75)
  { id: 71, name: { en: 'Redacted Corridor', ru: 'Засекреченный Коридор' }, x: 0.12, y: 0.44, isBoss: false, description: { en: 'Censored by the void', ru: 'Зацензурено пустотой' } },
  { id: 72, name: { en: 'Black Bar Hall', ru: 'Зал Чёрных Полос' }, x: 0.32, y: 0.42, isBoss: false, description: { en: 'Truth hidden beneath', ru: 'Правда скрыта за чернотой' } },
  { id: 73, name: { en: 'The Expunged Cell', ru: 'Вычеркнутая Камера' }, x: 0.52, y: 0.44, isBoss: false, description: { en: 'Once held forbidden words', ru: 'Здесь хранились запретные слова' } },
  { id: 74, name: { en: 'Censors Watch', ru: 'Пост Цензоров' }, x: 0.72, y: 0.42, isBoss: false, description: { en: 'They judge what remains', ru: 'Они судят то, что осталось' } },
  { id: 75, name: { en: 'The Sealed Verdict', ru: 'Запечатанный Вердикт' }, x: 0.9, y: 0.47, isBoss: true, description: { en: 'VOIDMAW HUNGERS', ru: 'ПАСТЬ БЕЗДНЫ ЖАЖДЕТ' } },

  // Section 6: The Null Garden (76-80)
  { id: 76, name: { en: 'Withered Roots', ru: 'Иссохшие Корни' }, x: 0.1, y: 0.54, isBoss: false, description: { en: 'Nothing grows here', ru: 'Здесь ничего не растёт' } },
  { id: 77, name: { en: 'The Absent Bloom', ru: 'Отсутствующий Цветок' }, x: 0.3, y: 0.52, isBoss: false, description: { en: 'Beauty of nothing', ru: 'Красота пустоты' } },
  { id: 78, name: { en: 'Hollow Trellis', ru: 'Полая Шпалера' }, x: 0.5, y: 0.54, isBoss: false, description: { en: 'Dead vines cling', ru: 'Мёртвые лозы цепляются' } },
  { id: 79, name: { en: 'Zero Blossom Path', ru: 'Тропа Нулевого Цветения' }, x: 0.7, y: 0.52, isBoss: false, description: { en: 'Petals of void', ru: 'Лепестки пустоты' } },
  { id: 80, name: { en: 'The Null Throne', ru: 'Нулевой Трон' }, x: 0.88, y: 0.57, isBoss: true, description: { en: 'VOIDMAW REIGNS', ru: 'ПАСТЬ БЕЗДНЫ ЦАРСТВУЕТ' } },

  // Section 7: The Void Spire (81-85)
  { id: 81, name: { en: 'Spire Base', ru: 'Подножие Шпиля' }, x: 0.12, y: 0.63, isBoss: false, description: { en: 'The tower of nothing rises', ru: 'Башня ничего поднимается' } },
  { id: 82, name: { en: 'The Hollow Stair', ru: 'Полая Лестница' }, x: 0.32, y: 0.61, isBoss: false, description: { en: 'Steps into darkness', ru: 'Ступени во тьму' } },
  { id: 83, name: { en: 'Echo Chamber', ru: 'Камера Эха' }, x: 0.52, y: 0.63, isBoss: false, description: { en: 'Your words return empty', ru: 'Твои слова возвращаются пустыми' } },
  { id: 84, name: { en: 'The Void Balcony', ru: 'Балкон Пустоты' }, x: 0.72, y: 0.61, isBoss: false, description: { en: 'Overlooking nothing', ru: 'Вид на ничто' } },
  { id: 85, name: { en: 'Spire Summit', ru: 'Вершина Шпиля' }, x: 0.9, y: 0.66, isBoss: true, description: { en: 'THE SILENCE DESCENDS', ru: 'БЕЗМОЛВИЕ НИСХОДИТ' } },

  // Section 8: The Lacuna (86-90)
  { id: 86, name: { en: 'The Great Gap', ru: 'Великий Провал' }, x: 0.1, y: 0.73, isBoss: false, description: { en: 'Where meaning vanishes', ru: 'Где смысл исчезает' } },
  { id: 87, name: { en: 'Forgotten Bridge', ru: 'Забытый Мост' }, x: 0.3, y: 0.71, isBoss: false, description: { en: 'Spans the abyss', ru: 'Соединяет бездну' } },
  { id: 88, name: { en: 'The Missing Passage', ru: 'Пропавший Проход' }, x: 0.5, y: 0.73, isBoss: false, description: { en: 'It was here once', ru: 'Когда-то он был здесь' } },
  { id: 89, name: { en: 'Lacuna Core', ru: 'Ядро Лакуны' }, x: 0.7, y: 0.71, isBoss: false, description: { en: 'The heart of absence', ru: 'Сердце отсутствия' } },
  { id: 90, name: { en: 'The Absent Throne', ru: 'Отсутствующий Трон' }, x: 0.88, y: 0.76, isBoss: true, description: { en: 'THE SILENCE WATCHES', ru: 'БЕЗМОЛВИЕ НАБЛЮДАЕТ' } },

  // Section 9: The Unwritten Wastes (91-95)
  { id: 91, name: { en: 'Blank Dunes', ru: 'Пустые Дюны' }, x: 0.15, y: 0.82, isBoss: false, description: { en: 'Sand of unwritten pages', ru: 'Песок ненаписанных страниц' } },
  { id: 92, name: { en: 'The Empty Oasis', ru: 'Пустой Оазис' }, x: 0.35, y: 0.80, isBoss: false, description: { en: 'Promise of words unfulfilled', ru: 'Невыполненное обещание слов' } },
  { id: 93, name: { en: 'Tabula Rasa', ru: 'Табула Раса' }, x: 0.55, y: 0.82, isBoss: false, description: { en: 'The clean slate', ru: 'Чистый лист' } },
  { id: 94, name: { en: 'The Unmarked Grave', ru: 'Безымянная Могила' }, x: 0.75, y: 0.80, isBoss: false, description: { en: 'No epitaph written', ru: 'Эпитафия не написана' } },
  { id: 95, name: { en: 'Wasteland Gate', ru: 'Врата Пустоши' }, x: 0.9, y: 0.85, isBoss: true, description: { en: 'THE SILENCE STRIKES', ru: 'БЕЗМОЛВИЕ НАНОСИТ УДАР' } },

  // Section 10: The Last Silence (96-100)
  { id: 96, name: { en: 'The Fading Path', ru: 'Исчезающая Тропа' }, x: 0.12, y: 0.92, isBoss: false, description: { en: 'Each step disappears', ru: 'Каждый шаг исчезает' } },
  { id: 97, name: { en: 'The Muted Hall', ru: 'Немой Зал' }, x: 0.32, y: 0.90, isBoss: false, description: { en: 'Sound cannot exist', ru: 'Звук не может существовать' } },
  { id: 98, name: { en: 'Void Heart', ru: 'Сердце Пустоты' }, x: 0.52, y: 0.92, isBoss: false, description: { en: 'The center of nothing', ru: 'Центр ничего' } },
  { id: 99, name: { en: 'The Final Page', ru: 'Последняя Страница' }, x: 0.72, y: 0.90, isBoss: false, description: { en: 'One word remains', ru: 'Осталось одно слово' } },
  { id: 100, name: { en: 'The Last Silence', ru: 'Последнее Безмолвие' }, x: 0.88, y: 0.95, isBoss: true, description: { en: 'SILENCE MUST BE BROKEN', ru: 'БЕЗМОЛВИЕ ДОЛЖНО БЫТЬ РАЗРУШЕНО' } },
]
