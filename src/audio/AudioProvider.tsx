import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react'
import { initAudio, playBackgroundMusic, stopBackgroundMusic, playSoundEffect, setMuted, getMuted } from './utils/audioManager'

interface AudioContextValue {
  readonly muted: boolean
  readonly toggleMute: () => void
  readonly playMusic: (mode: 'light' | 'dark') => void
  readonly stopMusic: () => void
  readonly playSfx: (sfx: string) => void
}

const AudioContext = createContext<AudioContextValue>({
  muted: false,
  toggleMute: () => {},
  playMusic: () => {},
  stopMusic: () => {},
  playSfx: () => {},
})

export function AudioProvider({ children }: { readonly children: ReactNode }) {
  const [muted, setMutedState] = useState(false)

  useEffect(() => {
    initAudio()
  }, [])

  const toggleMute = useCallback(() => {
    const next = !getMuted()
    setMuted(next)
    setMutedState(next)
  }, [])

  const playMusic = useCallback((mode: 'light' | 'dark') => {
    playBackgroundMusic(mode)
  }, [])

  const stopMusic = useCallback(() => {
    stopBackgroundMusic()
  }, [])

  const playSfx = useCallback((sfx: string) => {
    playSoundEffect(sfx)
  }, [])

  const value = useMemo(
    () => ({ muted, toggleMute, playMusic, stopMusic, playSfx }),
    [muted, toggleMute, playMusic, stopMusic, playSfx],
  )

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio(): AudioContextValue {
  return useContext(AudioContext)
}
