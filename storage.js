const STORAGE_KEY = 'imposter_game_stats_v1';

const DEFAULT_STATS = {
  gamesPlayed: 0,
  gamesWonAsCivilian: 0,
  gamesWonAsImposter: 0,
  totalRoundsPlayed: 0,
  correctVotes: 0,
  successfulGuesses: 0,
  highScore: 0,
  longestWinStreak: 0,
  currentStreak: 0,
  favoriteCategory: null,
  categoryCounts: {},
  lastPlayed: null,
};

const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_STATS };
      return { ...DEFAULT_STATS, ...JSON.parse(raw) };
    } catch { return { ...DEFAULT_STATS }; }
  },

  save(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch { /* storage full or unavailable */ }
  },

  update(fn) {
    const current = this.load();
    const updated = fn(current);
    this.save(updated);
    return updated;
  },

  recordGame({ winner, highScoreThisGame, roundsPlayed, category }) {
    return this.update(s => {
      const isCivWin = winner === 'civilians';
      const isImpWin = winner === 'imposter';
      const catCounts = { ...s.categoryCounts };
      if (category) catCounts[category] = (catCounts[category] || 0) + 1;
      const favCat = Object.entries(catCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || null;
      const streak = (isCivWin || isImpWin) ? s.currentStreak + 1 : 0;
      return {
        ...s,
        gamesPlayed: s.gamesPlayed + 1,
        gamesWonAsCivilian: s.gamesWonAsCivilian + (isCivWin ? 1 : 0),
        gamesWonAsImposter: s.gamesWonAsImposter + (isImpWin ? 1 : 0),
        totalRoundsPlayed: s.totalRoundsPlayed + roundsPlayed,
        highScore: Math.max(s.highScore, highScoreThisGame),
        currentStreak: streak,
        longestWinStreak: Math.max(s.longestWinStreak, streak),
        categoryCounts: catCounts,
        favoriteCategory: favCat,
        lastPlayed: Date.now(),
      };
    });
  },

  reset() { this.save({ ...DEFAULT_STATS }); },
};
