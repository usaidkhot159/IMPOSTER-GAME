Router.register('imposterGuess', () => {
  const players  = State.get('players');
  const impIdx   = State.get('imposterIndex');
  const imp      = players[impIdx];
  const catIcon  = State.get('categoryIcon');
  const category = State.get('category');

  const guessInput = el('input', {
    class: 'input-field guess-input',
    type: 'text',
    placeholder: 'Type your guess…',
    maxlength: '30',
    autofocus: 'true',
  });

  guessInput.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

  function submit() {
    const word = guessInput.value.trim();
    if (!word) { showToast('Enter your guess!'); return; }
    Audio.click();
    Engine.submitImposterGuess(word);
  }

  const catData = CATEGORIES.find(c => c.id === category);

  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner text-center stagger' },

      el('div', { class: 'card card--crimson flex flex-col items-center gap-5' },
        el('div', { class: 'animate-pulse-crimson', style: 'font-size:4rem;line-height:1' }, '😈'),
        el('span', { class: 'badge badge-crimson' }, 'Final Chance'),
        el('h2', { class: 't-heading size-2xl' }, imp.name),
        el('p', { class: 't-heading size-lg', style: 'color:var(--crimson-bright)' }, 'You were caught!'),
        el('div', { class: 'divider' }),
        el('p', { class: 't-body text-center', style: 'color:var(--silver)' },
          `Guess the secret word correctly and you still win.`
        ),

        catData ? el('div', { class: 'flex items-center gap-2 justify-center' },
          el('span', { style: 'font-size:1.5rem' }, catData.icon),
          el('p', { class: 't-mono size-xs', style: 'color:var(--smoke)' }, `Category: ${catData.label}`),
        ) : null,

        el('div', { class: 'guess-input-wrap w-full' }, guessInput),
        el('button', {
          class: 'btn btn-danger btn-xl w-full',
          onclick: submit
        }, '🎲 Final Guess'),
      ),

      el('p', { class: 't-mono size-xs', style: 'color:var(--mist)' }, 'Correct guess = Imposter wins · Wrong = Civilians win'),
    )
  );
  return screen;
});
