Router.register('roundResult', () => {
  const players    = State.get('players');
  const scores     = State.get('scores') || [];
  const winner     = State.get('roundWinner');
  const word       = State.get('secretWord');
  const catIcon    = State.get('categoryIcon');
  const impIdx     = State.get('imposterIndex');
  const imp2Idx    = State.get('secondImposterIndex');
  const round      = State.get('currentRound');
  const total      = State.get('roundCount');
  const guessCorrect = State.get('imposterGuessCorrect');
  const guessWord  = State.get('imposterGuessWord');

  const isCivWin = winner === 'civilians';

  if (isCivWin) { Audio.success(); Confetti.celebrate(); }
  else           { Audio.imposter(); }

  const imp  = players[impIdx];
  const imp2 = imp2Idx >= 0 ? players[imp2Idx] : null;

  // Score rows
  const scoreRows = [...players]
    .map((p, i) => ({ ...p, score: scores[i] || 0, idx: i }))
    .sort((a, b) => b.score - a.score)
    .map((p, rank) => el('div', { class: 'stat-row' },
      el('div', { class: 'flex items-center gap-3' },
        el('span', { class: 't-mono size-xs', style: 'color:var(--smoke);width:20px' }, rank + 1),
        el('div', { class: `avatar avatar-${p.color}`, style: 'width:32px;height:32px;font-size:0.8rem' }, p.emoji),
        el('span', { class: 't-body size-sm' }, p.name),
        State.isImposter(p.idx) ? el('span', { class: 'badge badge-crimson', style: 'font-size:0.55rem;padding:2px 8px' }, '😈') : null,
      ),
      el('span', { class: 't-mono size-sm', style: 'color:var(--gold-bright);font-weight:700' }, `${formatScore(p.score)} pts`),
    ));

  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner stagger' },

      el('div', { class: 'flex justify-between items-center w-full' },
        el('span', { class: 't-label' }, `Round ${round} / ${total}`),
        el('span', { class: 't-label' }, `${total - round} left`),
      ),

      // Result banner
      el('div', { class: `result-banner ${isCivWin ? 'result-banner-civilian' : 'result-banner-imposter'} text-center w-full animate-scale` },
        el('div', { style: 'font-size:3.5rem;line-height:1;margin-bottom:8px' }, isCivWin ? '🕵️' : '😈'),
        el('h2', { class: `t-heading size-2xl ${isCivWin ? 't-emerald' : 't-crimson'}` },
          isCivWin ? 'Civilians Win!' : 'Imposter Wins!'
        ),
        guessWord && el('p', { class: 't-mono size-xs', style: 'color:var(--silver);margin-top:6px' },
          guessCorrect ? `"${guessWord}" — Correct guess!` : `Guessed "${guessWord}" — wrong!`
        ),
      ),

      // Word reveal
      el('div', { class: 'card text-center' },
        el('p', { class: 't-label', style: 'color:var(--smoke);margin-bottom:8px' }, 'The secret word was'),
        el('h3', { class: 'word-reveal' }, `${catIcon} ${word}`),
        el('div', { class: 'divider', style: 'margin:16px 0' }),
        el('p', { class: 't-label', style: 'color:var(--smoke);margin-bottom:8px' }, `Imposter${imp2 ? 's were' : ' was'}`),
        el('div', { class: 'flex gap-3 justify-center' },
          el('div', { class: `avatar avatar-lg avatar-crimson` }, imp.emoji),
          el('div', { class: 'flex flex-col justify-center', style: 'text-align:left' },
            el('p', { class: 't-heading' }, imp.name),
            imp2 && el('p', { class: 't-body size-sm', style: 'color:var(--silver)' }, `& ${imp2.name}`),
          )
        )
      ),

      // Scores
      el('div', { class: 'card w-full' },
        el('p', { class: 't-label', style: 'color:var(--smoke);margin-bottom:12px' }, 'Scoreboard'),
        el('div', { class: 'flex flex-col' }, ...scoreRows),
      ),

      round >= total
        ? el('button', { class: 'btn btn-primary btn-lg w-full', onclick: () => { Audio.click(); Engine.nextRound(); } }, '🏆 See Final Results')
        : el('button', { class: 'btn btn-primary btn-lg w-full', onclick: () => { Audio.click(); Engine.nextRound(); } }, `Next Round ${round + 1} →`),

    )
  );
  return screen;
});
