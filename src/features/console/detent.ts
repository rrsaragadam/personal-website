// A short mechanical tick for detents and switches: a few milliseconds of
// filtered noise, plus a vibration pulse on phones. Silent until the visitor
// has interacted, as browsers require.
let audio: AudioContext | null = null

export function detent(strength = 1) {
  if (typeof window === 'undefined') return
  navigator.vibrate?.(6)
  try {
    audio ??= new AudioContext()
    const ctx = audio
    const len = Math.floor(ctx.sampleRate * 0.012)
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < len; i++)
      data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 4
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 3200
    const gain = ctx.createGain()
    gain.gain.value = 0.18 * strength
    src.connect(filter).connect(gain).connect(ctx.destination)
    src.start()
  } catch {
    // Audio is a nicety; ignore browsers that refuse it.
  }
}

// The key seating in its dock: a soft low thump, then a short rising hum as
// the cabin wakes.
export function ignition() {
  if (typeof window === 'undefined') return
  navigator.vibrate?.([12, 60, 20])
  try {
    audio ??= new AudioContext()
    const ctx = audio
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(70, t)
    osc.frequency.exponentialRampToValueAtTime(140, t + 1.2)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.04, t + 0.4)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 1.5)
  } catch {
    // Audio is a nicety; ignore browsers that refuse it.
  }
  detent(1.6)
}
