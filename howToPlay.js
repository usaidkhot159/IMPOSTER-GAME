Router.register('howToPlay', () => {
  const steps = [
    { icon: '⚙️', title: 'Setup',        body: 'Choose player count (3–10), number of rounds, difficulty, and word categories.' },
    { icon: '🎭', title: 'Roles',         body: 'Each player privately views their role on the same device. Civilians see the secret word — the Imposter does not.' },
    { icon: '💬', title: 'Give Clues',    body: 'Everyone gives one clue about the secret word. Civilians: be specific but not obvious. Imposter: blend in and guess from context.' },
    { icon: '🗳️', title: 'Vote',          body: 'After all clues, each player privately votes for who they think is the Imposter. Most votes = suspected.' },
    { icon: '😈', title: 'Final Guess',   body: 'If the Imposter is voted out, they get one last chance: guess the secret word. Correct = Imposter wins. Wrong = Civilians win.' },
    { icon: '🏆', title: 'Scoring',       body: 'Civilians earn 100 pts for a correct vote. Imposter earns 150 for surviving the vote, 200 for a correct final guess.' },
  ];

  const tips = [
    '🔍 As a Civilian: avoid clues that give the word away too easily.',
    '😈 As Imposter: ask yourself — "what would someone say about this?"',
    '👁 Watch for vague, overly generic clues — that\'s the Imposter!',
    '⏱ On Hard mode, the timer adds serious pressure. Stay sharp.',
    '🤝 Two Imposters on Hard mode? They know each other — watch for coordinated red herrings.',
  ];

  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner stagger', style: 'padding-bottom:24px' },

      el('div', { class: 'flex items-center gap-4 w-full' },
        el('button', { class: 'btn btn-ghost btn-sm', onclick: () => { Audio.click(); Router.go('menu'); } }, '← Back'),
        el('h2', { class: 't-heading size-xl' }, '📖 How to Play'),
      ),

      el('div', { class: 'card w-full' },
        el('div', { class: 'flex flex-col' },
          ...steps.map((s, i) => el('div', { class: 'how-step' },
            el('div', { class: 'how-step-num' }, String(i + 1)),
            el('div', { class: 'flex flex-col gap-1' },
              el('p', { class: 't-heading size-sm' }, `${s.icon}  ${s.title}`),
              el('p', { class: 't-body size-sm', style: 'color:var(--silver)' }, s.body),
            )
          ))
        )
      ),

      el('div', { class: 'card w-full' },
        el('p', { class: 't-label', style: 'color:var(--uv-bright);margin-bottom:12px' }, '💡 Tips'),
        el('div', { class: 'flex flex-col gap-3' },
          ...tips.map(t => el('p', { class: 't-body size-sm', style: 'color:var(--silver);line-height:1.5' }, t))
        )
      ),

      el('button', {
        class: 'btn btn-primary btn-lg w-full',
        onclick: () => { Audio.click(); Router.go('setup'); }
      }, '▶  Start Playing'),
    )
  );
  return screen;
});
