// Hint system — gives contextual hints based on the category
const Hints = (() => {
  const categoryHints = {
    food:    ['It can be eaten', 'People order or cook this', 'It involves flavour and texture'],
    college: ['It happens in an academic setting', 'Students deal with this regularly', 'Related to studying or campus life'],
    games:   ['People play this for fun or competition', 'It can be physical or digital', 'Involves rules and a goal'],
    places:  ['It is a location you can visit', 'People travel to or through here', 'Has a distinct atmosphere or purpose'],
    animals: ['It is a living creature', 'Found in the wild or kept as a pet', 'Has a unique behaviour or appearance'],
    movies:  ['It is a film or cinematic work', 'People watch this in a theatre or at home', 'Has actors, a plot, and a director'],
    tech:    ['It is a device, software, or concept', 'Related to computers or digital life', 'Used by millions of people daily'],
    sports:  ['It is a physical activity or competition', 'Has rules and often a score', 'Can be a team or individual pursuit'],
  };

  const imposterHints = {
    food:    ['Something people consume', 'Can be warm or cold', 'Found in kitchens or restaurants'],
    college: ['Part of school life', 'Involves people and knowledge', 'Can be stressful or rewarding'],
    games:   ['A form of entertainment or challenge', 'Involves participation', 'Has winners and losers'],
    places:  ['Somewhere specific', 'People go here for a reason', 'Has a particular feel to it'],
    animals: ['A living thing', 'Has a body and can move', 'Exists somewhere in nature'],
    movies:  ['A form of storytelling', 'Involves characters and narrative', 'Created for an audience'],
    tech:    ['Something modern and digital', 'Used for communication or work', 'Has changed how we live'],
    sports:  ['Involves movement and effort', 'Often competitive', 'Has passionate fans'],
  };

  return {
    // Returns a civilian-level hint (specific)
    getCivilianHint(category) {
      const hints = categoryHints[category] || ['It is a well-known concept', 'Many people know what it is'];
      return pick(hints);
    },

    // Returns a weaker imposter hint (vague)
    getImposterHint(category) {
      const hints = imposterHints[category] || ['It is something familiar', 'Think broadly about the category'];
      return pick(hints);
    },

    // Generate a display card for a hint
    buildHintCard(text, isImposter = false) {
      return el('div', {
        class: `card ${isImposter ? 'card--crimson' : 'card--glow'} flex flex-col gap-2`,
        style: 'padding:16px 20px'
      },
        el('p', { class: 't-label', style: `color:var(--${isImposter ? 'crimson' : 'uv'}-bright)` }, '💡 Hint'),
        el('p', { class: 't-body size-sm', style: 'color:var(--silver)' }, text),
      );
    },
  };
})();
