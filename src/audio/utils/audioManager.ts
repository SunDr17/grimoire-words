import { Audio } from 'expo-av'

const SFX_FILES: Record<string, number> = {
  select: require('../../../assets/audio/sfx/select.wav'),
  valid: require('../../../assets/audio/sfx/valid.wav'),
  invalid: require('../../../assets/audio/sfx/invalid.wav'),
  bonus: require('../../../assets/audio/sfx/bonus.wav'),
  complete: require('../../../assets/audio/sfx/complete.wav'),
  failed: require('../../../assets/audio/sfx/failed.wav'),
  tick: require('../../../assets/audio/sfx/tick.wav'),
}

const LIGHT_MUSIC: readonly number[] = [
  require('../../../assets/audio/music/light-music-1.mp3'),
  require('../../../assets/audio/music/light-music-2.mp3'),
  require('../../../assets/audio/music/light-music-3.mp3'),
  require('../../../assets/audio/music/light-music-4.mp3'),
]

const DARK_MUSIC: readonly number[] = [
  require('../../../assets/audio/music/dark-music-1.mp3'),
  require('../../../assets/audio/music/dark-music-2.mp3'),
]

// Shuffle-bag state: tracks remaining before reshuffle
let lightBag: number[] = []
let darkBag: number[] = []

function pickFromBag(bag: number[], pool: readonly number[]): { track: number; bag: number[] } {
  if (bag.length === 0) {
    bag = [...pool]
  }
  const index = Math.floor(Math.random() * bag.length)
  const track = bag[index]
  const nextBag = [...bag.slice(0, index), ...bag.slice(index + 1)]
  return { track, bag: nextBag }
}

let bgMusic: Audio.Sound | null = null
let isMuted = false
const sfxCache = new Map<string, Audio.Sound>()

export async function initAudio(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    })
  } catch {
    // Audio init is non-critical
  }
}

export async function playBackgroundMusic(mode: 'light' | 'dark'): Promise<void> {
  try {
    await stopBackgroundMusic()

    if (isMuted) return

    let source: number
    if (mode === 'dark') {
      const result = pickFromBag(darkBag, DARK_MUSIC)
      source = result.track
      darkBag = result.bag
    } else {
      const result = pickFromBag(lightBag, LIGHT_MUSIC)
      source = result.track
      lightBag = result.bag
    }

    const { sound } = await Audio.Sound.createAsync(source, {
      shouldPlay: true,
      isLooping: true,
      volume: 0.3,
    })

    bgMusic = sound
  } catch {
    // Music playback is non-critical
  }
}

export async function stopBackgroundMusic(): Promise<void> {
  try {
    if (bgMusic) {
      await bgMusic.stopAsync()
      await bgMusic.unloadAsync()
      bgMusic = null
    }
  } catch {
    // Audio cleanup is non-critical
  }
}

export async function playSoundEffect(sfx: string): Promise<void> {
  if (isMuted) return

  const source = SFX_FILES[sfx]
  if (!source) return

  try {
    // Reuse cached sound if available, otherwise create new
    const cached = sfxCache.get(sfx)
    if (cached) {
      try {
        await cached.setPositionAsync(0)
        await cached.playAsync()
        return
      } catch {
        // Sound may have been unloaded, recreate below
        sfxCache.delete(sfx)
      }
    }

    const { sound } = await Audio.Sound.createAsync(source, {
      shouldPlay: true,
      volume: 1.0,
    })

    sfxCache.set(sfx, sound)
  } catch {
    // SFX playback is non-critical
  }
}

export function setMuted(muted: boolean): void {
  isMuted = muted
  if (muted) {
    stopBackgroundMusic()
  }
}

export function getMuted(): boolean {
  return isMuted
}
