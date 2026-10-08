(function () {
  const PORTAL_DISTANCE = 3.2;
  const PANEL_DISTANCE  = 2.3;
  const PANEL_WIDTH     = 1.7;
  const AMBER = '#ffa24a';
  const AMBER_DIM = '#b8772f';
  const CREAM = '#f3e8d6';
  const BODY = '#e6dac6';
  const INK = 'rgba(10, 6, 4, 0.9)';
    const SERIF = 'Georgia, "Times New Roman", serif';
  const SANS = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  const MONO = '"Cascadia Mono", Consolas, "Courier New", monospace';

  const $ = (id) => document.getElementById(id);
  const rad = (d) => (d * Math.PI) / 180;

  function polar(az, el, r) {
    return {
      x: r * Math.sin(rad(az)) * Math.cos(rad(el)),
      y: r * Math.sin(rad(el)),
      z: -r * Math.cos(rad(az)) * Math.cos(rad(el))
    };
  }
  const toStr = (p) => `${p.x.toFixed(3)} ${p.y.toFixed(3)} ${p.z.toFixed(3)}`;
  const facing = (az, el) => `${el} ${-az} 0`;

  function mk(tag, attrs) {
    const e = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    return e;
  }

  function wrap(ctx, text, maxW) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; }
      else line = t;
    }
    if (line) lines.push(line);
    return lines;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function hline(ctx, x0, x1, y, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  }

  function frame(ctx, W, H) {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255, 162, 74, 0.45)'; ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, W - 20, H - 20);
    ctx.strokeStyle = AMBER; ctx.lineWidth = 5;
    const L = 44, o = 10;
    [[o, o, 1, 1], [W - o, o, -1, 1], [o, H - o, 1, -1], [W - o, H - o, -1, -1]].forEach(([x, y, sx, sy]) => {
      ctx.beginPath(); ctx.moveTo(x + sx * L, y); ctx.lineTo(x, y); ctx.lineTo(x, y + sy * L); ctx.stroke();
    });
  }

  function panelCanvas(s, index, total) {
    const W = 1360, P = 76, maxW = W - 2 * P;
    const FTOP = `500 32px ${MONO}`, FT = `500 84px ${SERIF}`, FB = `400 54px ${SANS}`;
    const FL = `400 30px ${MONO}`, FV = `500 40px ${MONO}`, FC = `400 32px ${MONO}`;
    const lhT = 98, lhB = 76, lhC = 42;
    const data = s.data || [];
    const c = document.createElement('canvas');
    c.width = W; c.height = 10;
    let ctx = c.getContext('2d');
    ctx.font = FT; const tl = wrap(ctx, s.title, maxW);
    ctx.font = FB; const bl = wrap(ctx, s.body, maxW);
    ctx.font = FC; const cl = wrap(ctx, 'Foto: ' + s.credit, maxW);
    const ROW = 104, rows = Math.ceil(data.length / 2);
    const dataH = data.length ? rows * ROW + 34 : 0;
    const H = P + 40 + 26 + tl.length * lhT + 18 + bl.length * lhB + 30 + dataH + 16 + cl.length * lhC + P - 20;
    c.height = H;
    ctx = c.getContext('2d');
    frame(ctx, W, H);
    ctx.textBaseline = 'top';
    let y = P - 4;
    ctx.font = FTOP; ctx.fillStyle = AMBER;
    ctx.fillText('ATACAMA  ·  CHILE', P, y);
    ctx.textAlign = 'right';
    ctx.fillText(String(index).padStart(2, '0') + ' / ' + String(total).padStart(2, '0'), W - P, y);
    ctx.textAlign = 'left';
    y += 40; hline(ctx, P, W - P, y, 'rgba(255, 162, 74, 0.5)'); y += 26;
    ctx.fillStyle = CREAM; ctx.font = FT;
    tl.forEach((l) => { ctx.fillText(l, P, y); y += lhT; });
    y += 18;
    ctx.fillStyle = BODY; ctx.font = FB;
    bl.forEach((l) => { ctx.fillText(l, P, y); y += lhB; });
    y += 30;
    if (data.length) {
      hline(ctx, P, W - P, y, 'rgba(255, 162, 74, 0.5)'); y += 16;
      const colW = maxW / 2;
      data.forEach(([label, value], i) => {
        const x = P + (i % 2) * colW, yy = y + Math.floor(i / 2) * ROW;
        ctx.font = FL; ctx.fillStyle = AMBER_DIM; ctx.fillText(label, x, yy);
        ctx.font = FV; ctx.fillStyle = CREAM; ctx.fillText(value, x, yy + 38);
      });
      y += rows * ROW + 18;
    }
    y += 16;
    ctx.font = FC; ctx.fillStyle = AMBER_DIM;
    cl.forEach((l) => { ctx.fillText(l, P, y); y += lhC; });
    return c;
  }

  function introCanvas(intro) {
    const W = 1360, P = 76, maxW = W - 2 * P;
    const FTOP = `500 32px ${MONO}`, FT = `500 66px ${SERIF}`, FB = `400 46px ${SANS}`;
    const lhT = 78, lhB = 62;
    const c = document.createElement('canvas');
    c.width = W; c.height = 10;
    let ctx = c.getContext('2d');
    ctx.font = FT; const tl = wrap(ctx, intro.title, maxW);
    ctx.font = FB; const bl = wrap(ctx, intro.body, maxW);
    const H = P + 40 + 26 + tl.length * lhT + 14 + bl.length * lhB + P - 24;
    c.height = H;
    ctx = c.getContext('2d');
    frame(ctx, W, H);
    ctx.textBaseline = 'top';
    let y = P - 4;
    ctx.font = FTOP; ctx.fillStyle = AMBER;
    ctx.fillText('INTRODUÇÃO', P, y);
    y += 40; hline(ctx, P, W - P, y, 'rgba(255, 162, 74, 0.5)'); y += 26;
    ctx.fillStyle = CREAM; ctx.font = FT;
    tl.forEach((l) => { ctx.fillText(l, P, y); y += lhT; });
    y += 14;
    ctx.fillStyle = BODY; ctx.font = FB;
    bl.forEach((l) => { ctx.fillText(l, P, y); y += lhB; });
    return c;
  }

  function labelCanvas(top, bottom) {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 256;
    const ctx = c.getContext('2d');
    frame(ctx, 1024, 256);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = AMBER; ctx.font = `500 44px ${MONO}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '8px';
    ctx.fillText(top, 512 + 4, 70);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    let size = 80;
    ctx.font = `500 ${size}px ${SERIF}`;
    while (ctx.measureText(bottom).width > 880 && size > 40) { size -= 4; ctx.font = `500 ${size}px ${SERIF}`; }
    ctx.fillStyle = CREAM;
    ctx.fillText(bottom, 512, 164);
    return c;
  }

  function capTexture(color) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    const clear = color.replace('rgb(', 'rgba(').replace(')', ',0)');
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, color); g.addColorStop(0.5, color); g.addColorStop(1, clear);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
    return c;
  }

  function darken(rgb, k) {
    const m = rgb.match(/\d+/g);
    if (!m) return rgb;
    return `rgb(${Math.round(m[0] * k)},${Math.round(m[1] * k)},${Math.round(m[2] * k)})`;
  }

  const analysisCache = {};
  function analyse(url) {
    if (analysisCache[url]) return Promise.resolve(analysisCache[url]);
    return new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => {
        const w = im.naturalWidth, h = im.naturalHeight;
        const vfov = Math.min(180, (360 * h) / w);
        let top = '#05070d', bottom = '#05070d';
        try {
          const cw = 64, ch = Math.max(2, Math.round((64 * h) / w));
          const c = document.createElement('canvas'); c.width = cw; c.height = ch;
          const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(im, 0, 0, cw, ch);
          const avg = (y) => {
            const d = ctx.getImageData(0, y, cw, 1).data; let r = 0, g = 0, b = 0;
            for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
            const n = d.length / 4; return `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`;
          };
          top = avg(0); bottom = avg(ch - 1);
        } catch (e) {}
        const res = { w, h, vfov, thetaStart: (180 - vfov) / 2, top, bottom };
        analysisCache[url] = res; resolve(res);
      };
      im.onerror = () => reject(new Error('Could not load ' + url));
      im.src = url;
    });
  }

  function applyCanvas(el, canvas) {
    const apply = () => {
      const mesh = el.getObject3D('mesh');
      if (!mesh) return;
      if (mesh.material.map) mesh.material.map.dispose();
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      mesh.material.map = tex;
      mesh.material.needsUpdate = true;
    };
    if (el.hasLoaded) apply(); else el.addEventListener('loaded', apply, { once: true });
  }

  const fade = () => $('fade');
  function tweenFade(to, ms) {
    const el = fade();
    const from = parseFloat(el.getAttribute('material').opacity) || 0;
    el.setAttribute('visible', true);
    return new Promise((resolve) => {
      const t0 = performance.now();
      (function step(t) {
        const k = Math.min(1, (t - t0) / ms);
        el.setAttribute('material', 'opacity', from + (to - from) * k);
        if (k < 1) requestAnimationFrame(step);
        else { if (to === 0) el.setAttribute('visible', false); resolve(); }
      })(t0);
    });
  }

  function makePanel(s) {
    const c = panelCanvas(s, SCENES.indexOf(s) + 1, SCENES.length);
    const h = (PANEL_WIDTH * c.height) / c.width;
    const p = s.panel || { az: 0, el: -4 };
    const e = mk('a-plane', {
      width: PANEL_WIDTH, height: h,
      position: toStr(polar(p.az, p.el, PANEL_DISTANCE)),
      rotation: facing(p.az, p.el),
      material: 'shader: flat; transparent: true; side: front'
    });
    applyCanvas(e, c);
    return e;
  }

  function makeIntro(s, panelH) {
    const c = introCanvas(s.intro);
    const h = (PANEL_WIDTH * c.height) / c.width;
    const p = s.panel || { az: 0, el: -4 };
    const pos = polar(p.az, p.el, PANEL_DISTANCE);
    pos.y += panelH / 2 + 0.08 + h / 2;
    const e = mk('a-plane', {
      width: PANEL_WIDTH, height: h,
      position: toStr(pos),
      rotation: facing(p.az, p.el),
      material: 'shader: flat; transparent: true; side: front'
    });
    applyCanvas(e, c);
    return e;
  }

  function makePortal(def, target) {
    const el = def.el !== undefined ? def.el : -4;
    const g = mk('a-entity', {
      position: toStr(polar(def.az, el, PORTAL_DISTANCE)),
      rotation: facing(def.az, el),
      animation__in:  'property: scale; to: 1.15 1.15 1.15; dur: 150; easing: easeOutQuad; startEvents: pin',
      animation__out: 'property: scale; to: 1 1 1; dur: 150; easing: easeOutQuad; startEvents: pout'
    });
    const disc = mk('a-circle', {
      class: 'clickable', radius: 0.32,
      material: `shader: flat; src: ${target.thumb}; color: #8c8378; side: double`
    });
    const ring = mk('a-torus', {
      radius: 0.335, 'radius-tubular': 0.008, 'segments-tubular': 96,
      material: `shader: flat; color: ${AMBER}`
    });
    const outer = mk('a-torus', {
      radius: 0.4, 'radius-tubular': 0.0035, 'segments-tubular': 96,
      material: `shader: flat; color: ${AMBER}; opacity: 0.6; transparent: true`
    });
    const ticks = mk('a-entity', {
      animation__spin: 'property: rotation; from: 0 0 0; to: 0 0 -360; loop: true; dur: 90000; easing: linear'
    });
    const tickEls = [];
    for (let i = 0; i < 24; i++) {
      const major = i % 6 === 0, a = i * 15, len = major ? 0.08 : 0.035, r = 0.41 + len / 2;
      const t = mk('a-plane', {
        width: major ? 0.01 : 0.005, height: len,
        position: `${(r * Math.sin(rad(a))).toFixed(4)} ${(r * Math.cos(rad(a))).toFixed(4)} 0`,
        rotation: `0 0 ${-a}`,
        material: `shader: flat; color: ${AMBER}; opacity: ${major ? 1 : 0.65}; transparent: true`
      });
      tickEls.push(t); ticks.appendChild(t);
    }
    const label = mk('a-plane', {
      width: 1.2, height: 0.3, position: '0 -0.72 0',
      material: 'shader: flat; transparent: true'
    });
    applyCanvas(label, labelCanvas('IR PARA', target.short || target.title));

    const paint = (color) => {
      ring.setAttribute('material', 'color', color);
      outer.setAttribute('material', 'color', color);
      tickEls.forEach((t) => t.setAttribute('material', 'color', color));
    };
    disc.addEventListener('mouseenter', () => {
      g.emit('pin');
      disc.setAttribute('material', 'color', '#ffffff');
      paint(CREAM);
    });
    disc.addEventListener('mouseleave', () => {
      g.emit('pout');
      disc.setAttribute('material', 'color', '#8c8378');
      paint(AMBER);
    });
    disc.addEventListener('click', () => goTo(def.to));

    g.append(disc, ring, outer, ticks, label);
    return g;
  }

  let current = null, busy = false;

  async function goTo(id) {
    const s = SCENES.find((x) => x.id === id);
    if (!s || busy || (current && current.id === id)) return;
    busy = true;
    try {
      const sceneEl = $('scene');
      const sky = $('sky');
      const info = await analyse(s.img);

      if (current) await tweenFade(1, 250);
      $('dyn').innerHTML = '';

      sky.setAttribute('geometry', { thetaStart: info.thetaStart, thetaLength: info.vfov });
      await new Promise((resolve) => {
        const t = setTimeout(resolve, 8000);
        sky.addEventListener('materialtextureloaded', () => { clearTimeout(t); resolve(); }, { once: true });
        sky.setAttribute('material', 'src', s.img);
      });

      sceneEl.setAttribute('background', 'color', darken(info.top, 0.5));
      const cap = $('cap'), capTop = $('capTop');
      if (info.thetaStart > 0.5) {
        const k = Math.tan(rad(info.thetaStart)) * 2.2;
        cap.setAttribute('radius', 1.6 * k);
        applyCanvas(cap, capTexture(info.bottom));
        cap.setAttribute('visible', true);
        capTop.setAttribute('radius', 10 * k);
        applyCanvas(capTop, capTexture(darken(info.top, 0.5)));
        capTop.setAttribute('visible', true);
      } else { cap.setAttribute('visible', false); capTop.setAttribute('visible', false); }

      const dyn = $('dyn');
      const panel = makePanel(s);
      dyn.appendChild(panel);
      if (s.intro) dyn.appendChild(makeIntro(s, parseFloat(panel.getAttribute('height'))));
      s.portals.forEach((p) => dyn.appendChild(makePortal(p, SCENES.find((x) => x.id === p.to))));

      current = s;
      await tweenFade(0, 400);
    } catch (e) {
      console.error('Erro ao mudar para a cena ' + id + ':', e);
    } finally {
      busy = false;
    }
  }
  window.goTo = goTo;

  const start = () => {
    const q = new URLSearchParams(location.search).get('scene');
    goTo(SCENES.some((x) => x.id === q) ? q : SCENES[0].id);
  };
  const sceneEl = $('scene');
  if (sceneEl.hasLoaded) start(); else sceneEl.addEventListener('loaded', start);
})();
