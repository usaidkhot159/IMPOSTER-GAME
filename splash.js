Router.register('splash', () => {
  const svgNS = 'http://www.w3.org/2000/svg';

  function svgEl(tag, attrs = {}) {
    const e = document.createElementNS(svgNS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  }

  const defs = svgEl('defs');
  const grad = svgEl('radialGradient', { id:'splashG', cx:'50%', cy:'50%', r:'50%' });
  const s1 = svgEl('stop'); s1.setAttribute('offset','0%'); s1.setAttribute('stop-color','#A855F7');
  const s2 = svgEl('stop'); s2.setAttribute('offset','100%'); s2.setAttribute('stop-color','#6D28D9');
  grad.appendChild(s1); grad.appendChild(s2); defs.appendChild(grad);

  const filter = svgEl('filter', { id:'splashGlow' });
  const blur = svgEl('feGaussianBlur', { stdDeviation:'4', result:'blur' });
  const merge = svgEl('feMerge');
  const mn1 = svgEl('feMergeNode'); mn1.setAttribute('in','blur');
  const mn2 = svgEl('feMergeNode'); mn2.setAttribute('in','SourceGraphic');
  merge.appendChild(mn1); merge.appendChild(mn2);
  filter.appendChild(blur); filter.appendChild(merge); defs.appendChild(filter);

  const svg = svgEl('svg', { width:'100', height:'100', viewBox:'0 0 100 100' });
  svg.appendChild(defs);

  const glow = svgEl('circle', { cx:'50', cy:'50', r:'48', fill:'url(#splashG)', filter:'url(#splashGlow)', opacity:'0.18' });
  const ring = svgEl('circle', { cx:'50', cy:'50', r:'46', fill:'none', stroke:'#7C3AED', 'stroke-width':'1.5', opacity:'0.5' });
  const face = svgEl('ellipse', { cx:'50', cy:'52', rx:'28', ry:'32', fill:'url(#splashG)', filter:'url(#splashGlow)' });
  const eye1bg = svgEl('ellipse', { cx:'38', cy:'44', rx:'7', ry:'10', fill:'#0A0812', opacity:'0.9' });
  const eye2bg = svgEl('ellipse', { cx:'62', cy:'44', rx:'7', ry:'10', fill:'#0A0812', opacity:'0.9' });
  const eye1 = svgEl('circle', { cx:'38', cy:'44', r:'4', fill:'#A855F7' });
  const eye2 = svgEl('circle', { cx:'62', cy:'44', r:'4', fill:'#A855F7' });
  const shine1 = svgEl('circle', { cx:'39', cy:'43', r:'1.5', fill:'#F0EDF8' });
  const shine2 = svgEl('circle', { cx:'63', cy:'43', r:'1.5', fill:'#F0EDF8' });
  const mouth = svgEl('path', { d:'M 38 62 Q 50 72 62 62', fill:'none', stroke:'#F0EDF8', 'stroke-width':'2.5', 'stroke-linecap':'round' });

  [glow, ring, face, eye1bg, eye2bg, eye1, eye2, shine1, shine2, mouth].forEach(n => svg.appendChild(n));

  const iconWrap = el('div', { class: 'splash-icon animate-float animate-logo' });
  iconWrap.appendChild(svg);

  const screen = el('div', { class: 'screen' },
    el('div', { class: 'screen-inner text-center stagger' },
      el('div', { class: 'splash-logo' },
        iconWrap,
        el('h1', { class: 'splash-name text-shimmer' }, 'IMPOSTER'),
        el('p', { class: 'splash-tagline' }, '— who is lying? —'),
      ),
      el('div', { class: 'splash-loader' },
        el('div', { class: 'splash-loader-fill' })
      ),
    )
  );

  setTimeout(() => Router.go('menu'), 2200);
  return screen;
});
