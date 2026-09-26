Router.register('gameOver', () => {
  const board   = State.leaderboard();
  const players = State.get('players');
  const scores  = State.get('scores') || [];
  const winner  = board[0];
  const isImpWin = State.isImposter(winner.idx);

  // Medals
  const medals = ['🥇','🥈','🥉'];

  const podium = board.slice(0, 3).map((p, i) =>
    el('div', { class: 'flex flex-col items-center gap-2', style: `order:${i===0?2:i===1?1:3}` },
      i === 0 && el('div', { class: 'badge badge-gold animate-badge-pop', style: 'margin-bottom:4px' }, 'Winner'),
      el('div', {
        class: `avatar avatar-${i===0?'xl':'lg'} avatar-${p.color} ${i===0?'animate-pulse-glow':''}`,
        style: i===0?'':'opacity:0.85'
      }, p.emoji),
      el('p', { class: 't-mono size-xs text-center', style: 'color:var(--ghost);max-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap' }, p.name),
      el('p', { class: 't-mono size-sm', style: 'color:var(--gold-bright);font-weight:700' }, formatScore(p.score)),
      el('div', { style: `font-size:1.3rem` }, medals[i] || ''),
      State.isImposter(p.idx) ? el('span', { class: 'badge badge-crimson', style: 'font-size:0.55rem' }, '😈') : null,
    )
  );

  const allRows = board.map((p, i) =>
    el('div', { class: 'stat-row animate-fadeInUp', style: `animation-delay:${i*50}ms` },
      el('div', { class: 'flex items-center gap-3' },
        el('span', { class: 't-mono size-xs', style: 'color:var(--smoke);width:22px' }, medals[i] || `${i+1}.`),
        el('div', { class: `avatar avatar-${p.color}`, style: 'width:32px;height:32px;font-size:0.8rem' }, p.emoji),
        el('span', { class: 't-body' }, p.name),
        State.isImposter(p.idx) ? el('span', { class: 'badge badge-crimson', style: 'font-size:0.5rem;padding:2px 6px' }, '😈') : null,
      ),
      el('span', { class: 't-mono', style: 'color:var(--gold-bright);font-weight:700' }, `${formatScore(p.score)} pts`),
    )
  );

  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner stagger' },

      // Header
      el('div', { class: 'text-center flex flex-col items-center gap-3' },
        el('div', { style: 'font-size:4rem;line-height:1', class: 'animate-float' }, '🏆'),
        el('h1', { class: 't-display size-3xl text-shimmer' }, 'Game Over'),
        el('p', { class: 't-mono size-xs', style: 'color:var(--smoke)' }, `${State.get('roundCount')} rounds completed`),
      ),

      // Winner announce
      el('div', { class: `result-banner ${isImpWin ? 'result-banner-imposter' : 'result-banner-civilian'} text-center w-full` },
        el('p', { class: 't-label' }, isImpWin ? '😈 The Imposter triumphs' : '🕵️ The Civilians prevailed'),
        el('h2', { class: `t-heading size-2xl ${isImpWin ? 't-crimson' : 't-emerald'}` }, winner.name),
        el('p', { class: 't-mono size-sm', style: 'color:var(--silver);margin-top:4px' }, `${formatScore(winner.score)} points`),
      ),

      // Podium
      el('div', { class: 'flex items-end justify-center gap-6 w-full', style: 'padding:8px 0' }, ...podium),

      // Full leaderboard
      el('div', { class: 'card w-full' },
        el('p', { class: 't-label', style: 'color:var(--smoke);margin-bottom:12px' }, 'Full Leaderboard'),
        el('div', { class: 'flex flex-col' }, ...allRows),
      ),

      el('div', { class: 'flex gap-3 w-full' },
        el('button', {
          class: 'btn btn-ghost flex-1',
          onclick: () => { Audio.click(); State.reset(); Router.go('menu'); }
        }, '🏠 Menu'),
        el('button', {
          class: 'btn btn-primary flex-1',
          onclick: () => {
            Audio.click();
            const names = State.get('players').map(p => p.name);
            State.reset();
            State.initPlayers(names);
            Engine.startRound();
          }
        }, '🔄 Play Again'),
      ),
    )
  );
  return screen;
});
