const Engine = (() => {

  function pickWordAndCategory() {
    const cats = State.get('selectedCategories');
    const catId = pick(cats);
    const catData = CATEGORIES.find(c => c.id === catId);
    const word = pick(WORDS[catId]);
    State.set({
      secretWord: word,
      category: catId,
      categoryIcon: catData ? catData.icon : '🎲',
    });
    return { word, catId };
  }

  function assignRoles() {
    const count = State.get('playerCount');
    const diff = State.get('difficulty');
    const useTwo = diff === 'hard' && count >= 8;

    // Pick imposter(s) — never same index
    const impIdx = randInt(0, count - 1);
    let imp2Idx = -1;
    if (useTwo) {
      do { imp2Idx = randInt(0, count - 1); } while (imp2Idx === impIdx);
    }
    State.set({ imposterIndex: impIdx, secondImposterIndex: imp2Idx });
  }

  function startRound() {
    const round = State.get('currentRound') + 1;
    if (round === 1) History.reset();
    State.set({
      currentRound: round,
      clues: [],
      votes: {},
      votedOut: -1,
      roundWinner: null,
      imposterGuessWord: '',
      imposterGuessCorrect: null,
      revealIndex: 0,
    });
    pickWordAndCategory();
    assignRoles();
    Router.go('roleReveal');
  }

  function submitClue(playerIdx, clueText) {
    const clues = [...State.get('clues')];
    clues.push({ playerIdx, text: clueText.trim() });
    State.set({ clues });

    const count = State.get('playerCount');
    if (clues.length >= count) {
      Router.go('voting');
    } else {
      State.set({ currentPlayerIndex: playerIdx + 1 });
      Router.go('clueRound');
    }
  }

  function submitVote(voterIdx, targetIdx) {
    const votes = { ...State.get('votes') };
    votes[voterIdx] = targetIdx;
    State.set({ votes });

    const count = State.get('playerCount');
    if (Object.keys(votes).length >= count) {
      resolveVotes();
    }
  }

  function resolveVotes() {
    const votes = State.get('votes');
    const tally = {};
    Object.values(votes).forEach(v => { tally[v] = (tally[v] || 0) + 1; });

    let maxVotes = 0;
    let votedOut = -1;
    for (const [idx, count] of Object.entries(tally)) {
      if (count > maxVotes) { maxVotes = count; votedOut = parseInt(idx); }
    }

    State.set({ votedOut, votesTally: tally });

    // Is the voted-out player an imposter?
    const isImp = State.isImposter(votedOut);

    if (isImp) {
      // Give imposter a chance to guess
      Router.go('voteResult', { votedOut, isImposter: true });
    } else {
      // Wrong vote — imposter wins this round
      resolveRound('imposter');
    }
  }

  function resolveRound(winner) {
    State.set({ roundWinner: winner });
    const impIdx  = State.get('imposterIndex');
    const imp2Idx = State.get('secondImposterIndex');
    const players = State.get('players');
    const votedOut = State.get('votedOut');

    // Record round in history
    History.record({
      round:         State.get('currentRound'),
      word:          State.get('secretWord'),
      category:      State.get('category'),
      winner,
      imposterName:  players[impIdx]?.name || '?',
      votedOutName:  votedOut >= 0 ? players[votedOut]?.name : '—',
      guessWord:     State.get('imposterGuessWord'),
      guessCorrect:  State.get('imposterGuessCorrect'),
    });

    // Visual drama
    if (winner === 'imposter') Theme.flash('crimson', 500);
    else                       Theme.flash('emerald', 400);

    // Screen reader
    A11y.announce(winner === 'imposter' ? 'Imposter wins this round!' : 'Civilians win this round!', 'assertive');

    if (winner === 'civilians') {
      // Civilians get points
      State.addScoreAll(impIdx, SCORING.civilian.correctVote);
      if (imp2Idx >= 0) State.addScoreAll(imp2Idx, 0); // doesn't double-subtract
    } else {
      // Imposter wins
      State.addScore(impIdx, SCORING.imposter.surviveVote);
      if (imp2Idx >= 0) State.addScore(imp2Idx, SCORING.imposter.surviveVote);
      // Penalty for civilians
      const count = State.get('playerCount');
      for (let i = 0; i < count; i++) {
        if (!State.isImposter(i)) State.addScore(i, SCORING.civilian.penalty);
      }
    }
    Router.go('roundResult');
  }

  function submitImposterGuess(word) {
    const secret = State.get('secretWord').toLowerCase().trim();
    const guess = word.toLowerCase().trim();
    const correct = secret === guess || secret.includes(guess) || guess.includes(secret);
    State.set({ imposterGuessWord: word, imposterGuessCorrect: correct });

    const impIdx = State.get('imposterIndex');
    if (correct) {
      State.addScore(impIdx, SCORING.imposter.correctGuess);
      resolveRound('imposter');
    } else {
      Audio.wrong();
      Theme.shake();
      resolveRound('civilians');
    }
  }

  function nextRound() {
    const round = State.get('currentRound');
    const total = State.get('roundCount');
    if (round >= total) {
      endGame();
    } else {
      startRound();
    }
  }

  function endGame() {
    // Determine overall game winner (most points)
    const board = State.leaderboard();
    const winner = board[0];
    const isImpWin = State.isImposter(winner.idx);
    State.set({ gameWinner: winner.idx });

    Storage.recordGame({
      winner: isImpWin ? 'imposter' : 'civilians',
      highScoreThisGame: State.topScore(),
      roundsPlayed: State.get('currentRound'),
      category: State.get('category'),
    });

    if (isImpWin) Confetti.imposter();
    else Confetti.win();
    Audio.win();

    Router.go('gameOver');
  }

  return { startRound, submitClue, submitVote, submitImposterGuess, nextRound, resolveRound };
})();
