const Audio = (() => {
  let ctx = null;
  let enabled = true;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function tone(freq, type = 'sine', duration = 0.15, vol = 0.18, delay = 0) {
    if (!enabled) return;
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      gain.gain.setValueAtTime(0, c.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + duration + 0.05);
    } catch(e) {}
  }

  return {
    toggle() { enabled = !enabled; return enabled; },
    isEnabled() { return enabled; },

    click() { tone(600, 'sine', 0.08, 0.12); },
    success() {
      tone(523, 'sine', 0.1, 0.15, 0);
      tone(659, 'sine', 0.1, 0.15, 0.1);
      tone(784, 'sine', 0.2, 0.15, 0.2);
    },
    reveal() {
      tone(261, 'triangle', 0.05, 0.1, 0);
      tone(330, 'triangle', 0.05, 0.1, 0.07);
      tone(392, 'triangle', 0.12, 0.1, 0.14);
    },
    imposter() {
      tone(220, 'sawtooth', 0.3, 0.12, 0);
      tone(180, 'sawtooth', 0.3, 0.12, 0.15);
    },
    vote() { tone(440, 'sine', 0.1, 0.1); },
    countdown() { tone(880, 'square', 0.08, 0.1); },
    wrong() {
      tone(300, 'sawtooth', 0.15, 0.12, 0);
      tone(250, 'sawtooth', 0.25, 0.12, 0.12);
    },
    win() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 'sine', 0.25, 0.15, i * 0.08));
    },
    tick() { tone(1200, 'sine', 0.04, 0.06); },
  };
})();
