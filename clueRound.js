Router.register('clueRound', () => {
  const players     = State.get('players');
  const clues       = State.get('clues');
  const currIdx     = State.get('currentPlayerIndex');
  const player      = players[currIdx];
  const round       = State.get('currentRound');
  const total       = State.get('roundCount');
  const timerSecs   = State.get('timerEnabled') ? DIFFICULTY[State.get('difficulty')].timerSecs : 0;
  const catIcon     = State.get('categoryIcon');

  let timerVal = timerSecs;
  let timerInterval = null;
  let submitted = false;

  // Build previous clues list
  const prevCluesEl = el('div', { class: 'flex flex-col gap-2 w-full' });
  clues.forEach(c => {
    prevCluesEl.appendChild(el('div', { class: 'clue-item' },
      el('div', { class: `avatar avatar-${players[c.playerIdx].color}` }, players[c.playerIdx].emoji),
      el('div', { class: 'flex flex-col' },
        el('p', { class: 't-mono size-xs', style: 'color:var(--smoke)' }, players[c.playerIdx].name),
        el('p', { class: 't-body size-sm' }, escapeHTML(c.text)),
      )
    ));
  });

  // Timer
  const ringFill = el('circle', { class: 'ring-fill', cx:'40', cy:'40', r:'36' });
  ringFill.setAttribute('stroke-dasharray', '226');
  ringFill.setAttribute('stroke-dashoffset', '0');
  const timerNumEl = el('span', { class: 'timer-number' }, String(timerSecs));
  const ringEl = el('div', { class: 'timer-ring' },
    el('svg', { viewBox:'0 0 80 80' }, ...[
      el('circle', { class:'ring-bg', cx:'40', cy:'40', r:'36' }),
      ringFill,
    ]),
    timerNumEl,
  );

  const inputEl = el('input', {
    class: 'input-field',
    type: 'text',
    placeholder: 'Your clue…',
    maxlength: '60',
    autofocus: 'true',
  });

  function submit() {
    if (submitted) return;
    const text = inputEl.value.trim();
    if (!text) { showToast('Type a clue first!'); return; }
    submitted = true;
    if (timerInterval) clearInterval(timerInterval);
    Audio.click();
    Engine.submitClue(currIdx, text);
  }

  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

  function startTimer() {
    if (timerSecs <= 0) return;
    const total = timerSecs;
    timerInterval = setInterval(() => {
      timerVal--;
      timerNumEl.textContent = timerVal;
      const offset = 226 * (1 - timerVal / total);
      ringFill.setAttribute('stroke-dashoffset', offset.toFixed(2));
      if (timerVal <= 5) ringEl.className = 'timer-ring urgent';
      if (timerVal <= 3) Audio.tick();
      if (timerVal <= 0) {
        clearInterval(timerInterval);
        // Auto-submit with "…" if empty
        if (!submitted) {
          if (!inputEl.value.trim()) inputEl.value = '…';
          submit();
        }
      }
    }, 1000);
  }

  setTimeout(startTimer, 400);

  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner stagger' },

      el('div', { class: 'flex justify-between items-center w-full' },
        el('span', { class: 't-label' }, `Round ${round} / ${total}`),
        el('span', { class: 'badge badge-uv' }, `${catIcon} Clue Phase`),
        el('span', { class: 't-label' }, `${clues.length + 1} / ${players.length}`),
      ),

      // Current player
      el('div', { class: 'flex flex-col items-center gap-3' },
        el('div', { class: `avatar avatar-xl avatar-${player.color} animate-pulse-glow` }, player.emoji),
        el('h2', { class: 't-heading size-xl' }, player.name),
        el('p', { class: 't-mono size-xs', style: 'color:var(--smoke)' }, 'your turn to give a clue'),
      ),

      // Timer + input
      el('div', { class: 'card' },
        el('div', { class: 'flex flex-col gap-4' },
          timerSecs > 0
            ? el('div', { class: 'flex items-center justify-between' },
                el('p', { class: 't-body size-sm' }, 'Time remaining'),
                ringEl,
              )
            : el('p', { class: 't-label text-center' }, 'No time limit'),
          inputEl,
          el('button', { class: 'btn btn-primary w-full', onclick: submit }, 'Submit Clue'),
        )
      ),

      // Previous clues
      clues.length > 0 && el('div', { class: 'flex flex-col gap-2 w-full' },
        el('p', { class: 't-label', style: 'color:var(--smoke)' }, 'Previous clues'),
        prevCluesEl,
      ),
    )
  );
  return screen;
});
