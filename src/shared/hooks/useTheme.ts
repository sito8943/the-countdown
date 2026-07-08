import { useCallback, useState } from 'react'
import { THEME_STORAGE_KEY } from '../constants'

export type Theme = 'light' | 'dark'

/**
 * Reads the theme the inline boot script in index.html already applied to
 * <html data-theme>. That script is the single source of truth for the initial
 * value (stored choice or OS preference), so this stays in sync with it.
 */
function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/**
 * Current theme plus a toggle. Persists the choice so it survives reloads and
 * updates <html data-theme>, which drives the color tokens in theme.css.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme)

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Ignore write failures (private mode, storage disabled): the attribute
      // above still applies the theme for this session.
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(readTheme() === 'dark' ? 'light' : 'dark')
  }, [setTheme])

  return { theme, toggleTheme }
}
