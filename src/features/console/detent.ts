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
