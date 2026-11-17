// ==========================================================================
// ЗВУКОВОЙ ДВИЖОК WEB AUDIO API (Без сторонних mp3)
// ==========================================================================

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy
    }
  }

  click() {
    this.playTone(600, 'sine', 0.05, 0.08);
  }

  correct() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    // Pleasant two-tone chime
    this.playTone(523.25, 'sine', 0.12, 0.15); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.15), 100); // E5
  }

  error() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    // Low error buzz
    this.playTone(180, 'sawtooth', 0.2, 0.12);
  }

  fanfare() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.18), idx * 110);
    });
  }

  vibrate(pattern = 15) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }
}

export const sound = new SoundEngine();
