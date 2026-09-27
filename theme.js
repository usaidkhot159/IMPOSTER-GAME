// Theme utility — controls accent mode shifts during key moments
const Theme = (() => {
  const root = document.documentElement;

  return {
    // Flash the background with a color pulse for dramatic moments
    flash(color = 'uv', duration = 400) {
      const overlay = el('div', {
        style: `position:fixed;inset:0;pointer-events:none;z-index:500;
          background:var(--${color}-soft);
          animation:fadeIn 80ms ease-out, fadeIn ${duration}ms ease-out ${duration - 80}ms reverse both;`
      });
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), duration + 100);
    },

    // Briefly shake the screen
    shake() {
      document.getElementById('screen-container').classList.add('animate-shake');
      setTimeout(() => document.getElementById('screen-container').classList.remove('animate-shake'), 600);
    },

    // Set a CSS variable override
    setVar(name, value) { root.style.setProperty(name, value); },
    resetVar(name)      { root.style.removeProperty(name); },
  };
})();
