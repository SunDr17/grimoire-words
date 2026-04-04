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

export const DEFAULT_LANGUAGE: Language = 'ru'

export const ENABLED_LANGUAGES: readonly LanguageOption[] =
  LANGUAGE_OPTIONS.filter((opt) => opt.enabled)

export const SHOW_LANGUAGE_SELECTOR: boolean = ENABLED_LANGUAGES.length > 1
