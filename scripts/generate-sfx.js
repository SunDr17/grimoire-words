const fs = require('fs')
const path = require('path')

const SAMPLE_RATE = 22050
const outDir = path.join(__dirname, '..', 'assets', 'audio', 'sfx')

function writeWav(filename, samples) {
  const numSamples = samples.length
  const dataSize = numSamples * 2
  const buffer = Buffer.alloc(44 + dataSize)

  // RIFF header
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataSize, 4)
  buffer.write('WAVE', 8)

  // fmt chunk
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20) // PCM
  buffer.writeUInt16LE(1, 22) // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24)
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28) // byte rate
  buffer.writeUInt16LE(2, 32) // block align
  buffer.writeUInt16LE(16, 34) // bits per sample

  // data chunk
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataSize, 40)

  for (let i = 0; i < numSamples; i++) {
    const val = Math.max(-1, Math.min(1, samples[i]))
    buffer.writeInt16LE(Math.floor(val * 32767), 44 + i * 2)
  }

  fs.writeFileSync(path.join(outDir, filename), buffer)
}

function generateTone(freq, duration, volume = 0.5, decay = true) {
  const numSamples = Math.floor(SAMPLE_RATE * duration)
  const samples = new Float64Array(numSamples)
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE
    const envelope = decay ? Math.exp(-t * 4 / duration) : 1
    samples[i] = Math.sin(2 * Math.PI * freq * t) * volume * envelope
  }
  return samples
}

function mixSamples(...arrays) {
  const maxLen = Math.max(...arrays.map(a => a.length))
  const result = new Float64Array(maxLen)
  for (const arr of arrays) {
    for (let i = 0; i < arr.length; i++) {
      result[i] += arr[i]
    }
  }
  return result
}

function offsetSamples(samples, offsetSec) {
  const offsetSamples_ = Math.floor(SAMPLE_RATE * offsetSec)
  const result = new Float64Array(samples.length + offsetSamples_)
  for (let i = 0; i < samples.length; i++) {
    result[i + offsetSamples_] = samples[i]
  }
  return result
}

// Letter select - short bright click/ding
function generateSelect() {
  const tone1 = generateTone(880, 0.06, 0.3)
  const tone2 = generateTone(1320, 0.04, 0.2)
  return mixSamples(tone1, tone2)
}

// Valid word - ascending chime
function generateValid() {
  const t1 = generateTone(523, 0.1, 0.3) // C5
  const t2 = offsetSamples(generateTone(659, 0.1, 0.3), 0.08) // E5
  const t3 = offsetSamples(generateTone(784, 0.15, 0.35), 0.16) // G5
  const t4 = offsetSamples(generateTone(1047, 0.25, 0.4), 0.24) // C6
  return mixSamples(t1, t2, t3, t4)
}

// Invalid word - descending buzz
function generateInvalid() {
  const numSamples = Math.floor(SAMPLE_RATE * 0.2)
  const samples = new Float64Array(numSamples)
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE
    const freq = 300 - t * 400
    const envelope = Math.exp(-t * 6)
    // Square-ish wave for buzzy sound
    const wave = Math.sign(Math.sin(2 * Math.PI * freq * t))
    samples[i] = wave * 0.15 * envelope
  }
  return samples
}

// Bonus word - epic rising chord
function generateBonus() {
  const t1 = generateTone(440, 0.15, 0.25)
  const t2 = offsetSamples(generateTone(554, 0.15, 0.25), 0.06)
  const t3 = offsetSamples(generateTone(659, 0.15, 0.25), 0.12)
  const t4 = offsetSamples(generateTone(880, 0.3, 0.35), 0.18)
  const t5 = offsetSamples(generateTone(1109, 0.35, 0.3), 0.24)
  const t6 = offsetSamples(generateTone(1319, 0.4, 0.35), 0.3)
  return mixSamples(t1, t2, t3, t4, t5, t6)
}

// Level complete - fanfare
function generateComplete() {
  const notes = [
    { freq: 523, start: 0 },    // C5
    { freq: 659, start: 0.1 },  // E5
    { freq: 784, start: 0.2 },  // G5
    { freq: 1047, start: 0.3 }, // C6
    { freq: 784, start: 0.5 },  // G5
    { freq: 1047, start: 0.6 }, // C6
  ]
  const tones = notes.map(n =>
    offsetSamples(generateTone(n.freq, 0.2, 0.3), n.start)
  )
  return mixSamples(...tones)
}

// Level failed - sad descending
function generateFailed() {
  const t1 = generateTone(392, 0.2, 0.25) // G4
  const t2 = offsetSamples(generateTone(349, 0.2, 0.25), 0.15) // F4
  const t3 = offsetSamples(generateTone(311, 0.2, 0.25), 0.3) // Eb4
  const t4 = offsetSamples(generateTone(262, 0.4, 0.3), 0.45) // C4
  return mixSamples(t1, t2, t3, t4)
}

// Timer warning tick
function generateTick() {
  const numSamples = Math.floor(SAMPLE_RATE * 0.05)
  const samples = new Float64Array(numSamples)
  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE
    samples[i] = Math.sin(2 * Math.PI * 1000 * t) * 0.2 * Math.exp(-t * 40)
  }
  return samples
}

// Generate all SFX
fs.mkdirSync(outDir, { recursive: true })

writeWav('select.wav', generateSelect())
writeWav('valid.wav', generateValid())
writeWav('invalid.wav', generateInvalid())
writeWav('bonus.wav', generateBonus())
writeWav('complete.wav', generateComplete())
writeWav('failed.wav', generateFailed())
writeWav('tick.wav', generateTick())

console.log('Generated SFX files in', outDir)
console.log(fs.readdirSync(outDir).join(', '))
