const State = (() => {
  const defaults = {
    // Setup
    playerCount: 5,
    roundCount: 5,
    timerEnabled: true,
    timerSecs: 20,
    selectedCategories: ['food','games','places'],
    difficulty: 'medium',

    // Players
    players: [],

    // Current round
    currentRound: 0,
    currentPlayerIndex: 0,
    imposterIndex: -1,
    secondImposterIndex: -1,
    secretWord: '',
    category: '',
    categoryIcon: '',
    clues: [],

    // Votes
    votes: {},        // { playerIdx: votedForIdx }
    votedOut: -1,

    // Scoring
    scores: [],       // parallel to players array
    roundWinner: null, // 'civilians' | 'imposter'
    gameWinner: null,

    // Imposter final guess
    imposterGuessWord: '',
    imposterGuessCorrect: null,

    // Meta
    revealIndex: 0,  // which player is viewing their role
    phase: 'splash', // tracks current screen
  };

  let _state = { ...defaults };

  return {
    get(key) { return key ? _state[key] : { ..._state }; },

    set(updates) { Object.assign(_state, updates); },

    reset() { _state = { ...defaults }; },

    // Init a new game round
    initPlayers(names) {
      _state.players = names.map((name, i) => ({
        name,
        emoji: PLAYER_EMOJIS[i % PLAYER_EMOJIS.length],
        color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      }));
      _state.scores = new Array(names.length).fill(0);
    },

    addScore(playerIdx, amount) {
      if (playerIdx >= 0 && playerIdx < _state.scores.length) {
        _state.scores[playerIdx] = Math.max(0, _state.scores[playerIdx] + amount);
      }
    },

    addScoreAll(excludeIdx, amount) {
      _state.scores = _state.scores.map((s, i) => i === excludeIdx ? s : Math.max(0, s + amount));
    },

    topScore() { return Math.max(..._state.scores); },

    leaderboard() {
      return _state.players
        .map((p, i) => ({ ...p, score: _state.scores[i], idx: i }))
        .sort((a, b) => b.score - a.score);
    },

    getImposters() {
      const imp = [_state.imposterIndex];
      if (_state.secondImposterIndex >= 0) imp.push(_state.secondImposterIndex);
      return imp.filter(i => i >= 0);
    },

    isImposter(idx) {
      return idx === _state.imposterIndex || idx === _state.secondImposterIndex;
    },
  };
})();
