Router.register('voteResult', ({ votedOut, isImposter }) => {
  const players  = State.get('players');
  const tally    = State.get('votesTally') || {};
  const player   = players[votedOut];
  const votes    = tally[votedOut] || 0;

  if (isImposter) {
    Audio.imposter();
  }

  // Build vote breakdown
  const breakdown = Object.entries(tally)
    .sort((a, b) => b[1] - a[1])
    .map(([idx, count]) => {
      const p = players[parseInt(idx)];
      return el('div', { class: 'flex justify-between items-center gap-3', style: 'padding:8px 0' },
        el('div', { class: 'flex items-center gap-3' },
          el('div', { class: `avatar avatar-${p.color}`, style: 'width:32px;height:32px;font-size:0.9rem' }, p.emoji),
          el('span', { class: 't-body size-sm' }, p.name),
        ),
        el('div', { class: 'flex gap-1 items-center' },
          ...(Array.from({ length: count }, () => el('div', { class: 'vote-dot' }))),
          el('span', { class: 't-mono size-xs', style: 'color:var(--smoke);margin-left:4px' }, `${count}`),
        )
      );
    });

  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner text-center stagger' },

      el('div', { class: `avatar avatar-xl avatar-${player.color} animate-pulse-${isImposter ? 'crimson' : 'glow'}` }, player.emoji),
      el('h2', { class: 't-heading size-2xl' }, player.name),
      el('span', { class: 'badge badge-crimson animate-badge-pop' }, `${votes} vote${votes !== 1 ? 's' : ''}`),

      el('p', { class: 't-heading size-lg', style: 'color:var(--crimson-bright)' }, 'was suspected!'),

      isImposter
        ? el('div', { class: 'card card--crimson text-center flex flex-col gap-4' },
            el('p', { class: 't-label', style: 'color:var(--crimson-bright)' }, '🎭 The Imposter is caught!'),
            el('h3', { class: 't-heading size-xl' }, 'One last chance'),
            el('p', { class: 't-body size-sm', style: 'color:var(--silver)' }, 'Guess the secret word correctly to steal victory from the Civilians.'),
            el('button', {
              class: 'btn btn-danger btn-lg',
              onclick: () => { Audio.click(); Router.go('imposterGuess'); }
            }, '🎲 Make Your Guess'),
          )
        : el('div', { class: 'card card--emerald text-center flex flex-col gap-4' },
            el('p', { class: 't-label', style: 'color:var(--emerald-bright)' }, '✅ Correct vote!'),
            el('p', { class: 't-body' }, 'The voted-out player was not the Imposter. Moving on...'),
            el('button', {
              class: 'btn btn-success btn-lg',
              onclick: () => { Engine.resolveRound('imposter'); }
            }, 'Continue →'),
          ),

      // Vote breakdown
      el('div', { class: 'card w-full' },
        el('p', { class: 't-label', style: 'color:var(--smoke);margin-bottom:12px' }, 'Vote Breakdown'),
        el('div', { class: 'flex flex-col' }, ...breakdown),
      ),
    )
  );
  return screen;
});
