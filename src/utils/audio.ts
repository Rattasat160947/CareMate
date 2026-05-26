let audioCtx: AudioContext | null = null
let isAudioEnabled = true

function getAudioContext(): AudioContext | null {
  if (!isAudioEnabled) return null
  if (typeof window === 'undefined') return null

  if (!audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      audioCtx = new AudioContextClass()
    } catch (error) {
      console.warn('Web Audio API not supported in this browser:', error)
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }

  return audioCtx
}

export function setAudioEnabled(enabled: boolean) {
  isAudioEnabled = enabled
  if (!enabled && audioCtx) {
    audioCtx.close().catch(() => {})
    audioCtx = null
  }
}

export function playTapSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(1400, ctx.currentTime)
  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.05)
}

export function playHeartbeatSound(accented = false) {
  const ctx = getAudioContext()
  if (!ctx) return

  const playPulse = (timeOffset: number, freq: number, volume: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset)
    gain.gain.setValueAtTime(volume, ctx.currentTime + timeOffset)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.12)

    osc.start(ctx.currentTime + timeOffset)
    osc.stop(ctx.currentTime + timeOffset + 0.15)
  }

  const multiplier = accented ? 1.5 : 1.0
  playPulse(0, 65, 0.4 * multiplier)
  playPulse(0.12, 55, 0.25 * multiplier)
}

export function playOximeterSound(spo2Percentage: number) {
  const ctx = getAudioContext()
  if (!ctx) return

  const percent = Math.max(80, Math.min(100, spo2Percentage))
  const minFreq = 350
  const maxFreq = 950
  const factor = (percent - 80) / 20
  const frequency = minFreq + factor * (maxFreq - minFreq)

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)
  gain.gain.setValueAtTime(0.06, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.2)
}

export function playSuccessSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  const playChime = (timeOffset: number, pitch: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(pitch, ctx.currentTime + timeOffset)
    gain.gain.setValueAtTime(0.08, ctx.currentTime + timeOffset)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.18)

    osc.start(ctx.currentTime + timeOffset)
    osc.stop(ctx.currentTime + timeOffset + 0.2)
  }

  playChime(0, 784)
  playChime(0.1, 1046)
}

export function playWarningSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  const playTone = (timeOffset: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(800, ctx.currentTime + timeOffset)
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1200, ctx.currentTime + timeOffset)

    gain.gain.setValueAtTime(0.07, ctx.currentTime + timeOffset)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.15)

    osc.start(ctx.currentTime + timeOffset)
    osc.stop(ctx.currentTime + timeOffset + 0.16)
  }

  playTone(0)
  playTone(0.2)
  playTone(0.4)
}