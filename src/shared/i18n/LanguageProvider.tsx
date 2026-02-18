import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import type { Language } from '@/shared/types'
import { getSettings, saveSettings } from '@/persistence/storage'
import { translate } from './translations'

interface LanguageContextValue {
  readonly language: Language
  readonly setLanguage: (lang: Language) => void
  readonly t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { readonly children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    getSettings().then((settings) => {
      setLanguageState(settings.language)
    })
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    saveSettings({ language: lang })
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      translate(language, key, params),
    [language],
  )

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext)
}
