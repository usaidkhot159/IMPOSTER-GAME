Router.register('stats', () => {
  const s = Storage.load();
  const totalWins = s.gamesWonAsCivilian + s.gamesWonAsImposter;
  const winRate = s.gamesPlayed > 0 ? Math.round((totalWins / s.gamesPlayed) * 100) : 0;

  const catData = CATEGORIES.find(c => c.id === s.favoriteCategory);

  const statBlocks = [
    { val: s.gamesPlayed,           label: 'Games Played' },
    { val: `${winRate}%`,           label: 'Win Rate' },
    { val: s.gamesWonAsCivilian,    label: 'Civilian Wins' },
    { val: s.gamesWonAsImposter,    label: 'Imposter Wins' },
  ];

  const rows = [
    ['Total Rounds', s.totalRoundsPlayed],
    ['Best Score',   formatScore(s.highScore)],
    ['Best Streak',  `${s.longestWinStreak} wins`],
    ['Correct Votes',s.correctVotes],
    ['Imposter Guesses', s.successfulGuesses],
    ['Fav Category', catData ? `${catData.icon} ${catData.label}` : '—'],
  ];

  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner stagger' },

      el('div', { class: 'flex items-center gap-4 w-full' },
        el('button', { class: 'btn btn-ghost btn-sm', onclick: () => { Audio.click(); Router.go('menu'); } }, '← Back'),
        el('h2', { class: 't-heading size-xl' }, '📊 Your Stats'),
      ),

      // 4-block grid
      el('div', { class: 'card w-full' },
        el('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:20px 12px' },
          ...statBlocks.map(b => el('div', { class: 'stat-block' },
            el('div', { class: 'stat-block-value animate-scale' }, b.val),
            el('div', { class: 'stat-block-label' }, b.label),
          ))
        )
      ),

      // Detailed rows
      el('div', { class: 'card w-full' },
        el('div', { class: 'flex flex-col' },
          ...rows.map(([label, val]) => el('div', { class: 'stat-row' },
            el('span', { class: 't-body size-sm', style: 'color:var(--silver)' }, label),
            el('span', { class: 't-mono', style: 'color:var(--pure);font-weight:700' }, val),
          ))
        )
      ),

      // Progress bar: civilian vs imposter wins
      s.gamesPlayed > 0 && el('div', { class: 'card w-full flex flex-col gap-3' },
        el('div', { class: 'flex justify-between' },
          el('span', { class: 't-mono size-xs', style: 'color:var(--emerald-bright)' }, `🕵️ Civilian ${s.gamesWonAsCivilian}`),
          el('span', { class: 't-mono size-xs', style: 'color:var(--crimson-bright)' }, `😈 Imposter ${s.gamesWonAsImposter}`),
        ),
        el('div', { class: 'progress-bar', style: 'height:8px' },
          el('div', { class: 'progress-fill', style: `width:${Math.round(s.gamesWonAsCivilian/Math.max(1,totalWins)*100)}%;background:linear-gradient(90deg,var(--emerald),var(--emerald-bright))` })
        ),
      ),

      el('button', {
        class: 'btn btn-ghost btn-sm',
        style: 'color:var(--crimson-bright);border-color:var(--crimson)',
        onclick: () => {
          if (confirm('Reset all stats? This cannot be undone.')) {
            Storage.reset();
            Audio.wrong();
            Router.go('stats');
          }
        }
      }, '🗑 Reset Stats'),
    )
  );
  return screen;
});
