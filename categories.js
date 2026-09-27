const CATEGORIES = [
  { id: 'food',    label: 'Food',    icon: '🍔', color: 'gold' },
  { id: 'college', label: 'College', icon: '🏫', color: 'uv' },
  { id: 'games',   label: 'Games',   icon: '🎮', color: 'emerald' },
  { id: 'places',  label: 'Places',  icon: '🌍', color: 'cyan' },
  { id: 'animals', label: 'Animals', icon: '🐾', color: 'gold' },
  { id: 'movies',  label: 'Movies',  icon: '🎬', color: 'crimson' },
  { id: 'tech',    label: 'Tech',    icon: '💻', color: 'uv' },
  { id: 'sports',  label: 'Sports',  icon: '⚽', color: 'emerald' },
];

const DIFFICULTY = {
  easy:   { label: 'Easy',   icon: '🟢', players: 4, rounds: 3, timerSecs: 0,  imposters: 1 },
  medium: { label: 'Medium', icon: '🟡', players: 5, rounds: 5, timerSecs: 20, imposters: 1 },
  hard:   { label: 'Hard',   icon: '🔴', players: 6, rounds: 7, timerSecs: 12, imposters: 2 },
};

const PLAYER_EMOJIS = ['🎩','🦊','🐺','🎭','🔮','👁️','🗡️','🔑','💎','🌙','⚡','🎲'];
const PLAYER_COLORS = ['uv','crimson','emerald','gold','cyan','uv','crimson','emerald','gold','cyan','uv','crimson'];
