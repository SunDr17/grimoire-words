import * as Localization from 'expo-localization'
import type { Language } from '@/shared/types'

interface LanguageOption {
  readonly value: Language
  readonly label: string
  readonly enabled: boolean
}

const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { value: 'ru', label: 'RU', enabled: true },
  { value: 'en', label: 'EN', enabled: true },
]

const SUPPORTED_LANGUAGES = new Set<string>(
  LANGUAGE_OPTIONS.filter((opt) => opt.enabled).map((opt) => opt.value),
)

function detectLanguage(): Language {
  const locale = Localization.getLocales()[0]?.languageCode ?? 'en'
  return SUPPORTED_LANGUAGES.has(locale) ? (locale as Language) : 'en'
}

export const DEFAULT_LANGUAGE: Language = detectLanguage()

export const ENABLED_LANGUAGES: readonly LanguageOption[] =
  LANGUAGE_OPTIONS.filter((opt) => opt.enabled)

export const SHOW_LANGUAGE_SELECTOR: boolean = ENABLED_LANGUAGES.length > 1
