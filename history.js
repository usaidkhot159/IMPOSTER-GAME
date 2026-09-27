// Tracks per-game round history for end-game recap
const History = (() => {
  let rounds = [];

  return {
    reset() { rounds = []; },

    record(roundData) {
      rounds.push({
        round:     roundData.round,
        word:      roundData.word,
        category:  roundData.category,
        winner:    roundData.winner,      // 'civilians' | 'imposter'
        imposter:  roundData.imposterName,
        votedOut:  roundData.votedOutName,
        guessWord: roundData.guessWord || null,
        guessOk:   roundData.guessCorrect || false,
        timestamp: Date.now(),
      });
    },

    getAll()    { return [...rounds]; },
    getLast()   { return rounds[rounds.length - 1] || null; },
    count()     { return rounds.length; },

    civilianWins()  { return rounds.filter(r => r.winner === 'civilians').length; },
    imposterWins()  { return rounds.filter(r => r.winner === 'imposter').length; },

    // Most common word guessed (for stats display)
    topWord() {
      const counts = {};
      rounds.forEach(r => { if (r.word) counts[r.word] = (counts[r.word] || 0) + 1; });
      return Object.entries(counts).sort((a,b) => b[1]-a[1])[0]?.[0] || null;
    },
  };
})();
