const Confetti = (() => {
  let particles = [];
  let animId = null;
  const canvas = document.getElementById('confetti-canvas');
  const ctx2d = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const COLORS_UV  = ['#A855F7','#7C3AED','#D4CFEA','#6D28D9','#F0EDF8'];
  const COLORS_WIN = ['#34D399','#A855F7','#FCD34D','#F0EDF8','#22D3EE'];
  const COLORS_IMP = ['#F87171','#DC2626','#A855F7','#F0EDF8','#FCD34D'];

  function makeParticle(colorSet) {
    return {
      x: Math.random() * canvas.width,
      y: -10,
      r: Math.random() * 7 + 3,
      d: Math.random() * 3 + 1,
      color: pick(colorSet),
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltSpeed: Math.random() * 0.1 + 0.05,
      spin: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.2,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    };
  }

  function step() {
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.y < canvas.height + 20);
    particles.forEach(p => {
      p.y += p.d + 1;
      p.x += Math.sin(p.tiltAngle) * 1.5;
      p.tiltAngle += p.tiltSpeed;
      p.spin += p.spinSpeed;
      ctx2d.save();
      ctx2d.translate(p.x, p.y);
      ctx2d.rotate(p.spin);
      ctx2d.fillStyle = p.color;
      ctx2d.globalAlpha = clamp(1 - (p.y / canvas.height) * 0.5, 0, 1);
      if (p.shape === 'rect') {
        ctx2d.fillRect(-p.r / 2, -p.r / 2, p.r * 2, p.r);
      } else {
        ctx2d.beginPath();
        ctx2d.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx2d.fill();
      }
      ctx2d.restore();
    });
    if (particles.length > 0) animId = requestAnimationFrame(step);
    else ctx2d.clearRect(0, 0, canvas.width, canvas.height);
  }

  function burst(n, colorSet) {
    for (let i = 0; i < n; i++) particles.push(makeParticle(colorSet));
    if (!animId) step();
    else if (animId) { cancelAnimationFrame(animId); animId = null; step(); }
  }

  return {
    win()     { burst(120, COLORS_WIN); },
    imposter(){ burst(120, COLORS_IMP); },
    celebrate(){ burst(80, COLORS_UV); },
    stop() {
      particles = [];
      if (animId) { cancelAnimationFrame(animId); animId = null; }
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
})();
