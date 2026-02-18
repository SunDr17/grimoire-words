import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react'
import type { Language } from '@/shared/types'
import { loadDictionary, setActiveTrie } from './utils/dictionary'
import { buildTrie, type Trie } from './utils/trie'
import { useLanguage } from '@/shared/i18n/LanguageProvider'

const trieCache = new Map<Language, { trie: Trie; wordCount: number }>()

function getOrBuildTrie(language: Language): { trie: Trie; wordCount: number } {
  const cached = trieCache.get(language)
  if (cached) {
    setActiveTrie(cached.trie)
    return cached
  }

  const rawWords: string[] = language === 'ru'
    ? require('russian-words')
    : require('an-array-of-english-words')

  const wordSet = loadDictionary(rawWords, language)
  const trie = buildTrie(wordSet)
  const wordCount = wordSet.size

  setActiveTrie(trie)

  const entry = { trie, wordCount }
  trieCache.set(language, entry)
  return entry
}

interface DictionaryContextValue {
  readonly ready: boolean
  readonly trie: Trie | null
  readonly wordCount: number
  readonly error: string | null
}

const DictionaryContext = createContext<DictionaryContextValue>({
  ready: false,
  trie: null,
  wordCount: 0,
  error: null,
})

export function DictionaryProvider({ children }: { readonly children: ReactNode }) {
  const { language } = useLanguage()
  const [ready, setReady] = useState(false)
  const [trie, setTrie] = useState<Trie | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setReady(false)
    setError(null)

    try {
      const result = getOrBuildTrie(language)
      setTrie(result.trie)
      setWordCount(result.wordCount)
      setReady(true)
    } catch (err) {
      setError(String(err))
    }
  }, [language])

  const value = useMemo(() => ({ ready, trie, wordCount, error }), [ready, trie, wordCount, error])

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  )
}

export function useDictionary(): DictionaryContextValue {
  return useContext(DictionaryContext)
}
