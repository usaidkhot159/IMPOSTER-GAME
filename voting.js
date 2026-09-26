Router.register('voting', () => {
  const players = State.get('players');
  const clues   = State.get('clues');
  const votes   = State.get('votes');
  const voterIdx = Object.keys(votes).length; // next voter

  if (voterIdx >= players.length) {
    Engine.resolveVotes && setTimeout(() => Engine.resolveVotes(), 100);
    return el('div', { class: 'screen' }, el('div', { class: 'screen-inner' }, el('p', {}, 'Tallying...')));
  }

  const voter = players[voterIdx];
  let selectedTarget = -1;

  const voteOptions = [];
  players.forEach((p, i) => {
    if (i === voterIdx) return; // can't vote for yourself

    const clue = clues.find(c => c.playerIdx === i);
    const option = el('div', {
      class: 'vote-option',
      onclick: () => {
        voteOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedTarget = i;
        Audio.vote();
      }
    },
      el('div', { class: `avatar avatar-${p.color}` }, p.emoji),
      el('div', { class: 'flex flex-col gap-1', style: 'flex:1' },
        el('p', { class: 't-heading' }, p.name),
        clue ? el('p', { class: 't-mono size-xs', style: 'color:var(--smoke)' }, `"${escapeHTML(clue.text)}"`) : null,
      ),
      el('div', { class: 'vote-tally', id: `tally-${i}` }),
    );
    voteOptions.push(option);
  });

  // Count existing votes
  Object.values(votes).forEach(targetIdx => {
    const tallyEl = document.getElementById(`tally-${targetIdx}`);
    if (tallyEl) tallyEl.appendChild(el('div', { class: 'vote-dot' }));
  });

  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner stagger' },

      el('div', { class: 'flex items-center gap-3 w-full' },
        el('span', { class: 'badge badge-crimson' }, '🗳 Vote'),
        el('span', { class: 't-label', style: 'margin-left:auto' }, `${voterIdx + 1} of ${players.length}`),
      ),

      el('div', { class: 'flex flex-col items-center gap-3' },
        el('div', { class: `avatar avatar-xl avatar-${voter.color} animate-pulse-glow` }, voter.emoji),
        el('h2', { class: 't-heading size-xl' }, voter.name),
        el('p', { class: 't-mono size-xs', style: 'color:var(--smoke)' }, 'who do you think is the Imposter?'),
      ),

      el('div', { class: 'flex flex-col gap-2 w-full' }, ...voteOptions),

      el('button', {
        class: 'btn btn-danger btn-lg w-full',
        onclick: () => {
          if (selectedTarget < 0) { showToast('Select a player to vote for'); return; }
          Audio.click();
          Engine.submitVote(voterIdx, selectedTarget);
        }
      }, '🗳 Cast Vote'),

      // All clues
      el('div', { class: 'card', style: 'width:100%' },
        el('p', { class: 't-label', style: 'margin-bottom:12px;color:var(--smoke)' }, 'All clues'),
        el('div', { class: 'flex flex-col gap-2' },
          ...clues.map(c => el('div', { class: 'flex gap-3 items-start' },
            el('div', { class: `avatar avatar-${players[c.playerIdx].color}`, style: 'width:28px;height:28px;font-size:0.8rem' }, players[c.playerIdx].emoji),
            el('div', {},
              el('p', { class: 't-mono size-xs', style: 'color:var(--smoke)' }, players[c.playerIdx].name),
              el('p', { class: 't-body size-sm' }, escapeHTML(c.text)),
            )
          ))
        )
      ),
    )
  );
  return screen;
});
