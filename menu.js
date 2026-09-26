Router.register('menu', () => {
  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner text-center stagger' },

      // Logo
      el('div', { class: 'flex flex-col items-center gap-3' },
        el('div', { style: 'font-size:3rem;line-height:1;animation:float 3s ease-in-out infinite' }, '🎭'),
        el('h1', { class: 't-display size-3xl text-shimmer', style: 'letter-spacing:-0.04em' }, 'IMPOSTER'),
        el('p', { class: 't-label', style: 'color:var(--smoke)' }, 'social deduction · up to 10 players'),
      ),

      // Main actions
      el('div', { class: 'flex flex-col gap-3 w-full' },
        el('button', {
          class: 'btn btn-primary btn-xl w-full animate-pulse-glow',
          onclick: () => { Audio.click(); Router.go('setup'); }
        }, '▶  Play Game'),
        el('button', {
          class: 'btn btn-ghost w-full',
          onclick: () => { Audio.click(); Router.go('howToPlay'); }
        }, '📖  How to Play'),
        el('button', {
          class: 'btn btn-ghost w-full',
          onclick: () => { Audio.click(); Router.go('stats'); }
        }, '📊  Stats & Records'),
      ),

      // Footer
      el('p', { class: 't-mono size-xs', style: 'color:var(--mist)' }, 'v1.0 · Pass the phone between players'),
    )
  );
  return screen;
});
