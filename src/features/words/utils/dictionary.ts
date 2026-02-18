import type { Language } from '@/shared/types'
import type { Trie } from './trie'

const EN_PROFANITY_LIST = new Set([
  'ass', 'damn', 'hell', 'shit', 'fuck', 'bitch', 'crap', 'dick',
  'piss', 'slut', 'whore', 'cock', 'cunt', 'tits', 'arse',
  'bastard', 'bollocks', 'bugger', 'wank', 'twat', 'nigger',
  'fag', 'dyke', 'retard', 'spic', 'kike',
])

const RU_PROFANITY_LIST = new Set([
  'блять', 'блядь', 'хуй', 'пизда', 'ебать', 'сука',
  'мудак', 'залупа', 'хуйня', 'пиздец', 'ёбаный',
  'ебаный', 'пидор', 'пидар', 'шлюха', 'жопа',
])

function getProfanityList(language: Language): ReadonlySet<string> {
  return language === 'ru' ? RU_PROFANITY_LIST : EN_PROFANITY_LIST
}

function normalizeRussianWord(word: string): string {
  return word.replace(/ё/g, 'е').replace(/Ё/g, 'Е')
}

let activeTrie: Trie | null = null

export function loadDictionary(words: readonly string[], language: Language = 'en'): Set<string> {
  const profanity = getProfanityList(language)

  if (language === 'ru') {
    return new Set(
      words
        .map((w) => normalizeRussianWord(w))
        .filter(
          (word) => word.length >= 3 && !profanity.has(word.toLowerCase()),
        ),
    )
  }

  return new Set(
    words.filter(
      (word) => word.length >= 3 && !profanity.has(word.toLowerCase()),
    ),
  )
}

export function setActiveTrie(trie: Trie): void {
  activeTrie = trie
}

export function isValidWord(word: string): boolean {
  if (!activeTrie) {
    throw new Error('Dictionary not initialized. Call setActiveTrie() first.')
  }
  return activeTrie.hasWord(word.toLowerCase())
}
