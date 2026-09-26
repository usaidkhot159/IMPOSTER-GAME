Router.register('setup', () => {
  let players = State.get('playerCount');
  let rounds  = State.get('roundCount');
  let diff    = State.get('difficulty');
  let selCats = [...State.get('selectedCategories')];

  function makeSelector(val, min, max, onChange) {
    const valEl = el('span', { class: 'selector-val' }, String(val));
    const dec = el('button', { class: 'selector-btn', onclick: () => {
      val = Math.max(min, val - 1);
      valEl.textContent = val;
      onChange(val);
      Audio.click();
    }}, '−');
    const inc = el('button', { class: 'selector-btn', onclick: () => {
      val = Math.min(max, val + 1);
      valEl.textContent = val;
      onChange(val);
      Audio.click();
    }}, '+');
    return el('div', { class: 'selector' }, dec, valEl, inc);
  }

  const diffBtns = {};
  const diffRow = el('div', { class: 'flex gap-2 w-full' });
  ['easy','medium','hard'].forEach(d => {
    const info = DIFFICULTY[d];
    const btn = el('button', {
      class: `btn btn-sm flex-1 ${d === diff ? 'btn-primary' : 'btn-ghost'}`,
      onclick: () => {
        diff = d;
        Object.entries(diffBtns).forEach(([k, b]) => {
          b.className = `btn btn-sm flex-1 ${k === d ? 'btn-primary' : 'btn-ghost'}`;
        });
        Audio.click();
      }
    }, `${info.icon} ${info.label}`);
    diffBtns[d] = btn;
    diffRow.appendChild(btn);
  });

  const catGrid = el('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%' });
  CATEGORIES.forEach(cat => {
    const pill = el('button', {
      class: `category-pill ${selCats.includes(cat.id) ? 'selected' : ''}`,
      onclick: () => {
        if (selCats.includes(cat.id)) {
          if (selCats.length <= 1) { showToast('Need at least 1 category'); return; }
          selCats = selCats.filter(c => c !== cat.id);
          pill.className = 'category-pill';
        } else {
          selCats.push(cat.id);
          pill.className = 'category-pill selected';
        }
        Audio.click();
      }
    }, `${cat.icon} ${cat.label}`);
    catGrid.appendChild(pill);
  });

  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner stagger', style: 'padding-top: 16px; padding-bottom: 16px;' },

      el('div', { class: 'flex items-center gap-4 w-full' },
        el('button', { class: 'btn btn-ghost btn-sm', onclick: () => { Audio.click(); Router.go('menu'); } }, '← Back'),
        el('h2', { class: 't-heading size-xl' }, 'Game Setup'),
      ),

      el('div', { class: 'card' },
        el('div', { class: 'flex flex-col gap-5' },

          el('div', { class: 'flex justify-between items-center' },
            el('div', {},
              el('p', { class: 't-heading' }, 'Players'),
              el('p', { class: 't-mono size-xs', style: 'color:var(--smoke)' }, '3 – 10 supported'),
            ),
            makeSelector(players, 3, 10, v => players = v),
          ),

          el('div', { class: 'divider' }),

          el('div', { class: 'flex justify-between items-center' },
            el('div', {},
              el('p', { class: 't-heading' }, 'Rounds'),
              el('p', { class: 't-mono size-xs', style: 'color:var(--smoke)' }, '1 – 10 rounds'),
            ),
            makeSelector(rounds, 1, 10, v => rounds = v),
          ),

          el('div', { class: 'divider' }),

          el('div', { class: 'flex flex-col gap-3' },
            el('p', { class: 't-heading' }, 'Difficulty'),
            diffRow,
          ),

          el('div', { class: 'divider' }),

          el('div', { class: 'flex flex-col gap-3' },
            el('p', { class: 't-heading' }, 'Categories'),
            el('p', { class: 't-mono size-xs', style: 'color:var(--smoke)' }, 'select one or more'),
            catGrid,
          ),
        )
      ),

      el('button', {
        class: 'btn btn-primary btn-lg w-full',
        onclick: () => {
          Audio.click();
          State.set({ playerCount: players, roundCount: rounds, difficulty: diff, selectedCategories: selCats });
          Router.go('playerNames');
        }
      }, 'Next — Enter Names →'),
    )
  );
  return screen;
});
