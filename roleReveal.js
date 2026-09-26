Router.register('roleReveal', () => {
  const players  = State.get('players');
  const revIdx   = State.get('revealIndex');
  const player   = players[revIdx];
  const isImp    = State.isImposter(revIdx);
  const word     = State.get('secretWord');
  const catIcon  = State.get('categoryIcon');
  const round    = State.get('currentRound');
  const total    = State.get('roundCount');

  let revealed = false;

  // Card content (hidden initially, shown after tap)
  const hiddenState = el('div', { class: 'flex flex-col items-center gap-5' },
    el('div', { style: 'font-size:4rem;line-height:1' }, '🔒'),
    el('p', { class: 't-heading size-lg text-center' }, 'Tap to reveal your role'),
    el('p', { class: 't-mono size-xs text-center', style: 'color:var(--smoke)' }, 'Make sure no one else is watching'),
    el('button', {
      class: 'btn btn-primary btn-lg',
      onclick: () => {
        revealContent();
        Audio.reveal();
      }
    }, `👁 Reveal — ${player.name}`),
  );

  const revealedState = el('div', {
    class: 'flex flex-col items-center gap-5',
    style: 'display:none!important'
  });

  function buildReveal() {
    revealedState.style.display = '';
    revealedState.innerHTML = '';

    if (isImp) {
      revealedState.appendChild(el('div', { class: 'animate-badge-pop' },
        el('span', { class: 'badge badge-crimson', style: 'font-size:0.75rem;padding:6px 16px' }, '😈 Imposter')
      ));
      revealedState.appendChild(el('div', { style: 'font-size:5rem;text-align:center;line-height:1', class: 'animate-badge-pop delay-1' }, '🔴'));
      revealedState.appendChild(el('h2', { class: 't-heading size-2xl text-center t-crimson animate-fadeInUp delay-2' }, 'YOU ARE THE IMPOSTER'));
      revealedState.appendChild(el('div', { class: 'word-hidden-bar animate-fadeInUp delay-3' },
        el('span', { style: 'color:var(--crimson-bright);font-size:1.2rem' }, '🚫'),
        el('span', { class: 't-mono size-sm', style: 'color:var(--crimson-bright)' }, 'Word hidden from you'),
      ));
      revealedState.appendChild(el('p', { class: 't-body text-center size-sm animate-fadeInUp delay-4', style: 'color:var(--silver);max-width:280px' },
        'Listen to others\' clues. Blend in. Guess the word if caught.'
      ));
    } else {
      revealedState.appendChild(el('div', { class: 'animate-badge-pop' },
        el('span', { class: 'badge badge-emerald', style: 'font-size:0.75rem;padding:6px 16px' }, '🟢 Civilian')
      ));
      revealedState.appendChild(el('div', { style: 'font-size:4rem;text-align:center;line-height:1', class: 'animate-badge-pop delay-1' }, catIcon));
      revealedState.appendChild(el('p', { class: 't-label text-center animate-fadeInUp delay-2' }, 'the secret word is'));
      revealedState.appendChild(el('h2', { class: 'word-reveal animate-scale delay-3' }, word));
      revealedState.appendChild(el('p', { class: 't-body text-center size-sm animate-fadeInUp delay-4', style: 'color:var(--silver);max-width:280px' },
        'Give a clue — not too obvious! Find the Imposter.'
      ));
    }

    const isLast = revIdx >= players.length - 1;
    revealedState.appendChild(el('button', {
      class: `btn ${isLast ? 'btn-primary' : 'btn-ghost'} btn-lg animate-fadeInUp delay-5`,
      onclick: () => {
        Audio.click();
        if (isLast) {
          // All roles revealed → clue round
          State.set({ currentPlayerIndex: 0 });
          Router.go('clueRound');
        } else {
          State.set({ revealIndex: revIdx + 1 });
          Router.go('roleReveal');
        }
      }
    }, isLast ? 'All set — Start Clue Round →' : `Hide — Pass to ${players[revIdx + 1].name} →`));
  }

  function revealContent() {
    if (revealed) return;
    revealed = true;
    hiddenState.style.display = 'none';
    buildReveal();
  }

  const card = el('div', {
    class: `card text-center ${isImp ? 'role-card-imposter animate-pulse-crimson' : 'role-card-civilian'}`
  }, hiddenState, revealedState);

  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner' },
      // Header
      el('div', { class: 'flex justify-between items-center w-full' },
        el('span', { class: 't-label' }, `Round ${round} / ${total}`),
        el('div', { class: 'step-dots' }, ...players.map((_, i) => {
          const done = i < revIdx;
          const active = i === revIdx;
          return el('div', { class: `step-dot ${active ? 'active' : done ? 'done' : ''}` });
        })),
        el('span', { class: 't-label' }, `${player.name}`),
      ),

      // Avatar
      el('div', { class: 'flex flex-col items-center gap-2' },
        el('div', { class: `avatar avatar-xl avatar-${player.color}` }, player.emoji),
        el('p', { class: 't-heading size-lg' }, player.name),
        el('p', { class: 't-mono size-xs', style: 'color:var(--smoke)' }, 'your private screen'),
      ),

      card,
    )
  );
  return screen;
});
