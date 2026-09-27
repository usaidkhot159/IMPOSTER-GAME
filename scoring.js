const SCORING = {
  civilian: {
    correctVote:   100,
    surviveRound:   20,
    penalty:       -50,
  },
  imposter: {
    surviveVote:   150,
    correctGuess:  200,
    wrongGuess:      0,
    surviveRound:   30,
  },
};

const SCORE_MSGS = {
  civilian_win:  ['Well deduced! 🔍', 'The truth prevails! ⚖️', 'Justice served! ✅'],
  imposter_win:  ['Flawlessly deceptive! 😈', 'They never saw it coming…', 'The perfect crime! 🎭'],
  guess_correct: ['Mastermind! 🧠', 'Unbelievable guess!', 'Incredible instinct! 🔥'],
  guess_wrong:   ['So close… 💀', 'The word escapes you.', 'Mystery remains! 🌑'],
};
