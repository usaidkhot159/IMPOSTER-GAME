const Particles = (() => {
  const container = document.getElementById('particles');
  const items = [];
  let frame = null;

  function make() {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      width:${randInt(2,4)}px;
      height:${randInt(2,4)}px;
      border-radius:50%;
      background:rgba(124,58,237,${(Math.random()*0.4+0.1).toFixed(2)});
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      box-shadow:0 0 6px rgba(124,58,237,0.4);
      animation: particle-drift ${randInt(6,14)}s linear infinite;
      animation-delay:${-randInt(0,12)}s;
      pointer-events:none;
    `;
    container.appendChild(p);
    return p;
  }

  return {
    init(count = 20) {
      for (let i = 0; i < count; i++) items.push(make());
    },
    clear() {
      items.forEach(p => p.remove());
      items.length = 0;
    },
  };
})();
