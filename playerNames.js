Router.register('playerNames', () => {
  const count = State.get('playerCount');
  const inputs = [];

  const RANDOM_NAMES = ['Zara','Kai','Milo','Luna','Axel','Nova','Rex','Ivy','Jax','Wren','Cleo','Dex'];

  const nameFields = [];
  for (let i = 0; i < count; i++) {
    const input = el('input', {
      class: 'input-field',
      type: 'text',
      placeholder: `Player ${i + 1}`,
      maxlength: '16',
    });
    inputs.push(input);

    const row = el('div', { class: 'player-list-item' },
      el('div', { class: `avatar avatar-${PLAYER_COLORS[i % PLAYER_COLORS.length]}` }, PLAYER_EMOJIS[i % PLAYER_EMOJIS.length]),
      input,
    );
    nameFields.push(row);
  }

  const listEl = el('div', { class: 'flex flex-col gap-2 w-full stagger' }, ...nameFields);

  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner', style: 'padding-top:16px; padding-bottom:16px;' },

      el('div', { class: 'flex items-center gap-4 w-full' },
        el('button', { class: 'btn btn-ghost btn-sm', onclick: () => { Audio.click(); Router.go('setup'); } }, '← Back'),
        el('h2', { class: 't-heading size-xl' }, 'Player Names'),
      ),

      el('p', { class: 't-mono size-xs text-center', style: 'color:var(--smoke)' },
        'Enter a name for each player, or use random names'
      ),

      el('button', {
        class: 'btn btn-outline btn-sm',
        onclick: () => {
          const shuffled = shuffle(RANDOM_NAMES);
          inputs.forEach((inp, i) => { inp.value = shuffled[i] || `Player ${i+1}`; });
          Audio.click();
        }
      }, '🎲 Random Names'),

      listEl,

      el('button', {
        class: 'btn btn-primary btn-lg w-full',
        onclick: () => {
          const names = inputs.map((inp, i) => inp.value.trim() || `Player ${i + 1}`);
          State.initPlayers(names);
          Audio.click();
          Engine.startRound();
        }
      }, 'Start Game →'),
    )
  );
  return screen;
});
