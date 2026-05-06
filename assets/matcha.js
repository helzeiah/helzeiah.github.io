(function () {
  'use strict';

  // SVG viewBox is 0 0 110 125; transform-origin: 50% 84% → pivot at (55, 105)
  const PX = 55, PY = 105;
  const SPILL_ANGLE = 88;
  const POUR_RATE   = 0.012;
  const COLORS = {
    bg:     ['#f5edda', '#74c87a'],
    line:   ['#d9cebc', '#58b060'],
    codeBg: ['#ece2cc', '#84cc88'],
  };

  const st = { mode: 'idle', angle: 0, spill: 0, pourId: null, dropX: 0, dropY: 0 };
  const drops = [];
  let frame = 0;

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    const scene = document.createElement('div');
    scene.id = 'matcha-scene';
    const headerInner = document.querySelector('.site-header-inner');
    (headerInner || document.body).appendChild(scene);

    injectStyles();
    scene.innerHTML = buildHTML();

    const reset = scene.querySelector('#mc-reset');
    const floatEl = scene.querySelector('#mc-float');

    // Restore persisted spill level
    const saved = parseFloat(localStorage.getItem('mc-spill') || '0');
    if (saved > 0) {
      st.spill = saved;
      st.mode = saved >= 1 ? 'done' : 'idle';
      applySpill(saved);
      if (saved >= 1) reset.hidden = false;
    }

    bindEvents(scene);

    // Social icons — separate fixed element, bottom center
    const socials = document.createElement('nav');
    socials.id = 'mc-socials';
    socials.setAttribute('aria-label', 'Social links');
    socials.innerHTML =
      `<a href="https://github.com/helzeiah" aria-label="GitHub" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>` +
      `<a href="https://youtube.com/@helzeiah" aria-label="YouTube" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg></a>` +
      `<a href="https://instagram.com/helzeiah" aria-label="Instagram" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12c0 3.259.014 3.668.072 4.948.058 1.277.26 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24c3.259 0 3.668-.014 4.948-.072 1.277-.058 2.148-.26 2.913-.558.788-.306 1.459-.717 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.059-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg></a>` +
      `<a href="https://linkedin.com/in/helzeiah" aria-label="LinkedIn" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>`;
    document.body.appendChild(socials);

    requestAnimationFrame(tick);
  }

  // ── Main loop ────────────────────────────────────────────────────────────
  function tick() {
    requestAnimationFrame(tick);
    frame++;

    const active = st.mode === 'tilt' || st.mode === 'pouring';

    // Only do SVG mutations when cup is in use or drops are falling
    if (active) {
      drawStream(st.angle, true);
      if (st.mode === 'pouring' && Math.abs(st.angle) >= SPILL_ANGLE && frame % 3 === 0) {
        spawnDrop();
      }
    }

    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.vy  += 0.32;
      d.y   += d.vy;
      d.life -= 0.022;
      d.el.setAttribute('cy', d.y.toFixed(1));
      d.el.setAttribute('opacity', Math.max(0, d.life).toFixed(2));
      if (d.life <= 0 || d.y > 200) { d.el.remove(); drops.splice(i, 1); }
    }
  }

  // ── Stream ───────────────────────────────────────────────────────────────
  function rimPos(angle) {
    const a  = angle * Math.PI / 180;
    const rx = angle < 0 ? 22 : 88;
    const ry = 50;
    const dx = rx - PX, dy = ry - PY;
    return {
      x: dx * Math.cos(a) - dy * Math.sin(a) + PX,
      y: dx * Math.sin(a) + dy * Math.cos(a) + PY,
    };
  }

  function drawStream(angle, visible) {
    const grp  = document.getElementById('mc-pour-group');
    const path = document.getElementById('mc-pour-path');
    const glow = document.getElementById('mc-pour-glow');
    if (!grp || !path || !glow) return;

    grp.setAttribute('transform', `rotate(${-angle},${PX},${PY})`);

    const absA = Math.abs(angle);
    if (!visible || absA < 30) {
      path.setAttribute('opacity', '0');
      glow.setAttribute('opacity', '0');
      return;
    }

    const frac   = Math.min(1, (absA - 30) / 60);
    const rim    = rimPos(angle);
    const sign   = angle < 0 ? -1 : 1;
    const len    = 24 + frac * 82 + st.spill * 32;

    // Wobble: oscillate control points over time for organic feel
    const wobble = Math.sin(frame * 0.13) * 3.0 * frac;
    const pulse  = Math.sin(frame * 0.19) * 0.35;  // slight width pulse

    // Neck: wide at pour mouth, narrow midstream, slight splay at end
    const hwTop  = 3.8 + pulse;   // at rim
    const hwMid  = 1.4 + pulse * 0.5; // narrowest point mid-stream
    const hwEnd  = 2.6 + pulse;   // spreads slightly at end

    const ex = sign * 0.38, ey = 0.58;
    const cp1x = rim.x + ex * len * 0.36 + wobble, cp1y = rim.y + ey * len * 0.36;
    const cp2x = rim.x + ex * len * 0.13 - wobble, cp2y = rim.y + len * 0.73;
    const endX  = rim.x + ex * len * 0.09,          endY  = rim.y + len;

    // Path uses varying hw at top/mid/bottom via cubic bezier left & right edges
    const d =
      `M ${rim.x - hwTop},${rim.y}` +
      ` C ${cp1x - hwTop},${cp1y} ${cp2x - hwMid},${cp2y} ${endX - hwEnd},${endY}` +
      ` Q ${endX},${endY + 6} ${endX + hwEnd},${endY}` +
      ` C ${cp2x + hwMid},${cp2y} ${cp1x + hwTop},${cp1y} ${rim.x + hwTop},${rim.y} Z`;

    const alpha = 0.25 + frac * 0.68;
    path.setAttribute('d', d);
    path.setAttribute('fill', '#2d5e22');
    path.setAttribute('opacity', alpha.toFixed(2));

    // Soft outer glow: same shape, wider, lighter, more transparent
    const gd =
      `M ${rim.x - hwTop - 2},${rim.y}` +
      ` C ${cp1x - hwTop - 2},${cp1y} ${cp2x - hwMid - 1.5},${cp2y} ${endX - hwEnd - 2},${endY}` +
      ` Q ${endX},${endY + 8} ${endX + hwEnd + 2},${endY}` +
      ` C ${cp2x + hwMid + 1.5},${cp2y} ${cp1x + hwTop + 2},${cp1y} ${rim.x + hwTop + 2},${rim.y} Z`;
    glow.setAttribute('d', gd);
    glow.setAttribute('fill', '#5aaa3a');
    glow.setAttribute('opacity', (alpha * 0.38).toFixed(2));

    st.dropX = endX;
    st.dropY = endY;
  }

  // ── Droplets ─────────────────────────────────────────────────────────────
  function spawnDrop() {
    const g = document.getElementById('mc-droplet-group');
    if (!g) return;
    const r  = 1.2 + Math.random() * 3.2;
    const cx = st.dropX + (Math.random() - 0.5) * 8;
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    el.setAttribute('cx',   cx.toFixed(1));
    el.setAttribute('cy',   st.dropY.toFixed(1));
    el.setAttribute('r',    r.toFixed(1));
    el.setAttribute('fill', r > 3 ? '#3a6e28' : '#5aaa3a');
    g.appendChild(el);
    drops.push({ el, y: st.dropY, vy: 0.8 + Math.random() * 2.8, life: 1.0 });
  }

  // ── HTML ─────────────────────────────────────────────────────────────────
  function buildHTML() {
    return `
<div id="mc-float">
  <svg id="mc-svg" viewBox="0 0 110 125" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="mc-glow" x="-55%" y="-55%" width="210%" height="210%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
        <feColorMatrix in="b" type="matrix"
          values="0.8 0.4 0 0 0.12  0.2 1.1 0 0 0.06  0 0.3 0.6 0 0  0 0 0 0.55 0" result="g"/>
        <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <clipPath id="mc-clip">
        <ellipse cx="55" cy="50" rx="27" ry="7.5"/>
      </clipPath>
    </defs>

    <!-- Saucer (stays flat, does not tilt with cup) -->
    <ellipse cx="55" cy="113" rx="40" ry="7.5" fill="#b8865a"/>
    <ellipse cx="55" cy="111" rx="37" ry="5.8" fill="#d4a870"/>
    <ellipse cx="55" cy="109.5" rx="23" ry="3.2" fill="#bf9660"/>
    <path d="M 20,109 Q 55,104 90,109" fill="none" stroke="#e8c898" stroke-width="1" opacity="0.4"/>

    <!-- Tilting cup group — rotates around pivot (55,105) -->
    <g id="mc-cup">
      <!-- Cup body: warm ivory ceramic -->
      <path d="M 22,50 L 29,106 Q 55,117 81,106 L 88,50 Q 55,58 22,50 Z" fill="#ecdcc0"/>

      <!-- Left highlight (glaze) -->
      <path d="M 22,50 L 29,106 Q 37,111 44,113 L 38,52 Z" fill="#f8eedd" opacity="0.45"/>
      <!-- Right shadow -->
      <path d="M 75,53 L 82,109 Q 78,111 73,112 L 68,52 Z" fill="#c4a070" opacity="0.32"/>

      <!-- Specular gloss — small bright arc upper-left -->
      <path d="M 27,58 Q 32,54 40,57" fill="none" stroke="#fffaf3" stroke-width="2.2" stroke-linecap="round" opacity="0.28"/>

      <!-- Interior rim depth -->
      <ellipse cx="55" cy="50" rx="33" ry="9" fill="#b08050"/>
      <ellipse cx="55" cy="50" rx="33" ry="9" fill="none" stroke="#8a6030" stroke-width="2" opacity="0.22"/>

      <!-- Matcha surface -->
      <ellipse id="mc-fill" cx="55" cy="50" rx="27" ry="7.5" fill="#4a7a3a"/>

      <!-- Matcha details: swirl + foam -->
      <g clip-path="url(#mc-clip)" opacity="0.92">
        <path d="M 36,49 Q 46,42 55,50 Q 64,57 74,49" fill="none" stroke="#62aa4a" stroke-width="1.9" stroke-linecap="round"/>
        <path d="M 44,54 Q 50,51 56,54" fill="none" stroke="#78c25a" stroke-width="1.1" stroke-linecap="round" opacity="0.6"/>
        <circle cx="40" cy="47" r="2.3" fill="#58a848" opacity="0.52"/>
        <circle cx="68" cy="52" r="1.7" fill="#58a848" opacity="0.42"/>
        <circle cx="57" cy="44" r="1.3" fill="#8ad060" opacity="0.38"/>
        <circle cx="46" cy="54" r="1.1" fill="#58a848" opacity="0.30"/>
      </g>

      <!-- Rim lip highlight -->
      <ellipse cx="55" cy="50" rx="33" ry="9" fill="none" stroke="#f5e8d2" stroke-width="1.4" opacity="0.48"/>

      <!-- Handle: layered for ceramic depth -->
      <path d="M 88,65 Q 109,65 109,83 Q 109,102 88,102" fill="none" stroke="#ddc8a0" stroke-width="11.5" stroke-linecap="round"/>
      <path d="M 88,65 Q 102,65 102,83 Q 102,102 88,102" fill="none" stroke="#c8a870" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M 88,67 Q 98,67 98,83 Q 98,100 88,102" fill="none" stroke="#9a7838" stroke-width="2.2" stroke-linecap="round" opacity="0.38"/>
      <path d="M 88,65 Q 107,66 107,83 Q 107,100 88,102" fill="none" stroke="#f2dfca" stroke-width="1.6" stroke-linecap="round" opacity="0.52"/>

      <!-- Base ring -->
      <ellipse cx="55" cy="107" rx="27" ry="5.2" fill="#c09060"/>
      <ellipse cx="55" cy="106" rx="20" ry="3.2" fill="#a87845" opacity="0.55"/>

      <!-- Pour group: counter-rotated so stream always falls screen-aligned -->
      <g id="mc-pour-group" transform="rotate(0,55,105)">
        <path id="mc-pour-glow" opacity="0"/>
        <path id="mc-pour-path" opacity="0"/>
        <g id="mc-droplet-group"/>
      </g>
    </g>
  </svg>
</div>
<button id="mc-reset" hidden>mop up</button>`;
  }

  // ── Styles ───────────────────────────────────────────────────────────────
  function injectStyles() {
    const el = document.createElement('style');
    el.textContent = `
      #mc-float {
        display: flex;
        align-items: center;
        overflow: visible;
      }
      #mc-float {
        display: inline-block;
        overflow: visible;
      }
      #mc-float.bobbing {
        animation: mc-bob 3.4s ease-in-out infinite;
      }
      @keyframes mc-bob {
        0%, 100% { transform: translateY(0);    }
        50%       { transform: translateY(-7px); }
      }
      #mc-svg {
        width: auto; height: 2.6rem; display: block;
        overflow: visible;
      }
      #mc-cup {
        transform-box: view-box;
        transform-origin: 50% 84%;
        cursor: pointer;
        overflow: visible;
        transition: filter 0.28s ease;
      }
      #mc-reset {
        display: block;
        margin-top: 0.5rem;
        background: none;
        border: 1px solid var(--line); color: var(--muted);
        font-size: 0.72rem; font-family: inherit;
        padding: 0.22rem 0.8rem; border-radius: 3px; cursor: pointer;
        transition: color 0.2s, border-color 0.2s;
        width: 100%;
      }
      #mc-reset:hover { color: var(--text); border-color: var(--text); }
      #mc-reset[hidden] { display: none; }
      body {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        position: relative;
      }
      .site-header, main.content {
        width: 100%;
      }
      main.content {
        flex-grow: 1;
      }
      #mc-socials {
        display: flex;
        justify-content: center;
        gap: 1.2rem;
        align-items: center;
        padding-bottom: 1.5rem;
        user-select: none;
        -webkit-user-select: none;
      }
      #mc-socials a {
        display: inline-flex;
        color: var(--muted);
        transition: color 0.18s ease;
      }
      #mc-socials a:hover { color: var(--text); }
      #mc-socials svg {
        width: 19px;
        height: 19px;
        fill: currentColor;
      }
    `;
    document.head.appendChild(el);
  }

  // ── Events ───────────────────────────────────────────────────────────────
  function bindEvents(scene) {
    const svg   = scene.querySelector('#mc-svg');
    const cup   = scene.querySelector('#mc-cup');
    const reset = scene.querySelector('#mc-reset');
    const floatEl = scene.querySelector('#mc-float');

    cup.addEventListener('mouseenter', () => {
      if (st.mode === 'idle') {
        cup.style.filter = 'url(#mc-glow)';
        floatEl.classList.add('bobbing');
      }
    });
    cup.addEventListener('mouseleave', () => {
      if (st.mode === 'idle') {
        cup.style.filter = '';
        floatEl.classList.remove('bobbing');
      }
    });

    cup.addEventListener('mousedown', (e) => {
      if (st.mode !== 'idle') return;
      e.preventDefault();
      enterTilt(cup, floatEl);

      const onMove = (e) => {
        if (st.mode !== 'tilt' && st.mode !== 'pouring') return;
        const r  = svg.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        st.angle = clamp((e.clientX - cx) / 190 * 115, -115, 115);
        cup.style.transform = `rotate(${st.angle}deg)`;
        const over = Math.abs(st.angle) >= SPILL_ANGLE;
        if (over && st.mode === 'tilt') { st.mode = 'pouring'; startPour(reset); }
        else if (!over && st.mode === 'pouring') { stopPour(); st.mode = 'tilt'; }
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (st.mode === 'tilt' || st.mode === 'pouring') exitTilt(cup, floatEl, reset);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    reset.addEventListener('click', (e) => {
      e.stopPropagation();
      doReset(cup, floatEl, reset);
    });
  }

  // ── Mode transitions ─────────────────────────────────────────────────────
  function enterTilt(cup, floatEl) {
    st.mode = 'tilt';
    floatEl.classList.remove('bobbing');
    cup.style.filter = '';
  }

  function exitTilt(cup, floatEl, reset) {
    stopPour();
    const done = st.spill >= 1;
    st.mode = done ? 'done' : 'idle';
    st.angle = 0;
    clearStream();
    snapBack(cup);
    if (done) reset.hidden = false;
  }

  function snapBack(cup) {
    cup.style.transition = 'transform 0.48s cubic-bezier(0.34,1.56,0.64,1), filter 0.28s ease';
    cup.style.transform  = 'rotate(0deg)';
    setTimeout(() => {
      cup.style.transition = 'filter 0.28s ease';
      st.angle = 0;
    }, 490);
  }

  // ── Pouring ──────────────────────────────────────────────────────────────
  function startPour(reset) {
    if (st.pourId) return;
    st.pourId = setInterval(() => {
      st.spill = Math.min(1, st.spill + POUR_RATE);
      applySpill(st.spill);
      if (st.spill >= 1) {
        stopPour();
        st.mode = 'done';
        reset.hidden = false;
        clearStream();
      }
    }, 40);
  }

  function stopPour() { clearInterval(st.pourId); st.pourId = null; }

  function clearStream() {
    const p = document.getElementById('mc-pour-path');
    const g = document.getElementById('mc-pour-glow');
    if (p) p.setAttribute('opacity', '0');
    if (g) g.setAttribute('opacity', '0');
  }

  // ── Spill colours ────────────────────────────────────────────────────────
  function applySpill(t) {
    localStorage.setItem('mc-spill', String(t));
    const r = document.documentElement, c = COLORS;
    r.style.setProperty('--bg',      lerp(c.bg[0],     c.bg[1],     t));
    r.style.setProperty('--line',    lerp(c.line[0],   c.line[1],   t * 0.85));
    r.style.setProperty('--code-bg', lerp(c.codeBg[0], c.codeBg[1], t * 0.65));
    const fill = document.getElementById('mc-fill');
    if (fill) fill.setAttribute('fill', lerp('#4a7a3a', '#263c20', t));
  }

  // ── Reset ────────────────────────────────────────────────────────────────
  function doReset(cup, floatEl, reset) {
    stopPour();
    st.mode = 'idle'; st.angle = 0; st.spill = 0;
    drops.forEach(d => d.el.remove()); drops.length = 0;
    clearStream();
    localStorage.removeItem('mc-spill');
    cup.style.filter = '';
    reset.hidden = true;
    applySpill(0);
    snapBack(cup);
  }

  // ── Utils ────────────────────────────────────────────────────────────────
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function lerp(h1, h2, t) {
    t = clamp(t, 0, 1);
    const a = hex3(h1), b = hex3(h2);
    return `rgb(${~~(a[0]+(b[0]-a[0])*t)},${~~(a[1]+(b[1]-a[1])*t)},${~~(a[2]+(b[2]-a[2])*t)})`;
  }
  function hex3(h) { const n = parseInt(h.slice(1), 16); return [(n>>16)&255,(n>>8)&255,n&255]; }

  document.addEventListener('DOMContentLoaded', init);
})();
