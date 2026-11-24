/* Atomic Policy project page.
   Clips, order, captions and marks follow atomic-policy-film (film.html, s06–s23); the charts are the film's own code,
   driven by a clock that starts when the chart scrolls into view. */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp01 = x => Math.max(0, Math.min(1, x));
const easeOut = x => 1 - Math.pow(1 - x, 3);
const easeInOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const prog = (t, s, d) => clamp01((t - s) / d);
const pi = s => s.replace(/π0\.5/g, 'π<sub>0.5</sub>');
const NS = 'http://www.w3.org/2000/svg';
const el = (k, a) => { const e = document.createElementNS(NS, k); for (const q in a) e.setAttribute(q, a[q]); return e; };

/* ───────── result sections (film s14–s21b) ───────── */
// card: [clip, caption, small line, mark (1 ✓ / 0 ✗), options]
const card = ([n, cap, small, m, o = {}], i = 0, ar = '16/9') =>
  `<figure class="vc${o.hl ? ' hl' : ''}${o.cls ? ' ' + o.cls : ''}" data-r="fade" style="--d:${(i * .06).toFixed(2)}s;--ar:${ar}${o.b ? ';--b:' + o.b : ''}">
     <div class="vf"><video muted playsinline preload="none" poster="media/${n}.jpg" src="media/${n}.mp4"></video>${m == null ? '' : `<span class="mark ${m ? 'ok' : 'no'}">${m ? '✓' : '✗'}</span>`}</div>
     ${cap ? `<figcaption class="cap${o.at ? ' at' : ''}${o.hl ? ' hl' : ''}">${pi(cap)}${small ? `<small>${small}</small>` : ''}</figcaption>` : ''}</figure>`;
const head = (tag, kind, h, p) => `<span class="tag sm" data-r="fade">${tag} <i>· ${kind}</i></span><h3 class="hd" data-r style="--d:.1s">${h}</h3><p class="prompt" data-r style="--d:.25s">${p}</p>`;
const rowh = (t, cls = '', replay = false) => `<div class="rowh ${cls}" data-r="fade">${t}${replay ? '<button type="button" class="replay">↻ Replay</button>' : ''}</div>`;
const AT = { at: 1 };
const eight = (pre, ar, speed) => `<div data-group>
  ${rowh('Atomic Policy', 'at', true)}
  <div class="grid c4">${[['atomic_clip', 'Atomic + DP (CLIP)'], ['atomic_dino', 'Atomic + DP (DINOv3)'], ['atomic_resnet', 'Atomic + DP (ResNet)'], ['atomic_pi05', 'Atomic + π0.5']].map(([k, c], i) => card([pre + k, c, '', 1, AT], i, ar)).join('')}</div>
  ${rowh('End-to-end baselines')}
  <div class="grid c4">${[['vla', 'VLA U-Net (scratch text enc.)'], ['vla_clip', 'VLA U-Net (CLIP text enc.)'], ['pi05_lora', 'π0.5 (LoRA)'], ['pi05_full', 'π0.5 (full FT)']].map(([k, c], i) => card([pre + k, c, '', 0], i + 4, ar)).join('')}</div>
  <p class="label">${speed} · same instruction</p></div>`;
const three = (items, ar, label, chartId, title) => `<div class="split">
  <div data-group><div class="rows">${items.map(([n, ep, txt], i) => `<div class="rowc">${card([n, '', '', 1], i, ar)}<div class="ord" data-r style="--d:${(.1 + i * .12).toFixed(2)}s"><span class="ep">${ep}</span>${txt}</div></div>`).join('')}</div>
    <div class="rowh" style="margin-bottom:0"><span style="text-transform:none;letter-spacing:0;font-weight:500">${label}</span><button type="button" class="replay">↻ Replay</button></div></div>
  <div data-r="fade"><div class="ct">${title}</div><div class="cs2">Table 1 · mean over up to ten evaluations × ten held-out episodes</div><div id="${chartId}"></div></div></div>`;

$('#push5').innerHTML = `<div class="wrap">
  ${head('PUSH 5 BLOCKS', 'Simulation', 'Follow the order, and push it.', '“Push the blocks onto the matching target circles from left to right: purple pentagon, red square, grey circle, green star, yellow heart.”')}
  ${eight('push_', '410/234', '18×')}
  <h3 class="hd second" data-r>When the order changes.</h3><p class="prompt" data-r style="--d:.15s">“Push the blocks onto the matching target circles from left to right: …”</p>
  ${three([['push_100004', 'order', '<b>green star</b> → <b>purple pentagon</b> → <b>red square</b> → <b>yellow heart</b> → <b>grey circle</b>'],
           ['push_100005', 'order', '<b>red square</b> → <b>green star</b> → <b>purple pentagon</b> → <b>grey circle</b> → <b>yellow heart</b>'],
           ['push_100008', 'order', '<b>grey circle</b> → <b>green star</b> → <b>yellow heart</b> → <b>purple pentagon</b> → <b>red square</b>']],
          '380/217', 'Atomic + DP (CLIP) · 18× · different instructions', 'bars-push', 'Success rate on Push 5 Blocks')}
</div>`;

$('#tabletop').innerHTML = `<div class="wrap">
  ${head('TABLETOP MANIPULATION', 'Simulation', 'Localize the target, and grasp it.', '“Open the drawer, put the purple cube into the drawer, then close the drawer.”')}
  ${eight('table_', '4/3', '16×')}
  <h3 class="hd second" data-r>When the target changes.</h3><p class="prompt" data-r style="--d:.15s">“Open the drawer, put the … cube into the drawer, then close the drawer.”</p>
  ${three([['table_100000', 'target', 'the <b>purple</b> cube'], ['table_100002', 'target', 'the <b>yellow</b> cube'], ['table_100003', 'target', 'the <b>green</b> cube']],
          '4/3', 'Atomic + DP (CLIP) · 16× · different instructions', 'bars-table', 'Success rate on Tabletop Manipulation')}
</div>`;

$('#molmo').innerHTML = `<div class="wrap">
  ${head('MOLMOSPACES · PNP NEXT-TO', 'Simulation', 'Read the scene, and place it there.', '“Pick up the birthday card with rabbit and fox and place it next to the round olive ceramic plate.”')}
  <div class="split" style="align-items:start">
    <div data-group>
      <div class="rowh" data-r="fade"><span><span style="color:var(--gold)">Atomic Policy</span> &nbsp;·&nbsp; Baselines: same backbone, and π<sub>0.5</sub></span></div>
      <div class="grid c3">${[['molmo_a1', 'MolmoBot FT + Point<br>+ Atomic Policy', '', 1, { hl: 1 }], ['molmo_a2', 'MolmoBot FT + Point', '', 0], ['molmo_a3', 'MolmoBot FT', '', 1],
        ['molmo_a4', 'MolmoBot zero-shot', '', 0], ['molmo_a5', 'π0.5 zero-shot', '', 0], ['molmo_a6', 'π0.5 FT', '', 0]].map((c, i) => card(c, i, '300/172')).join('')}</div>
      <div class="rowh" style="margin-bottom:0"><span style="text-transform:none;letter-spacing:0;font-weight:500">6× · same instruction</span><button type="button" class="replay">↻ Replay</button></div>
    </div>
    <div data-r="fade"><div class="ct">Success rate during fine-tuning</div><div class="cs2">moving average over the last ten checkpoints · 200 rollouts per point</div>
      <div class="leg" id="line-leg"></div>
      <div class="lchart" id="lchart"><svg id="line" viewBox="0 0 710 390"><defs><clipPath id="reveal"><rect id="rv" x="0" y="0" width="0" height="396"/></clipPath></defs>
        <g id="l-grid"></g><g clip-path="url(#reveal)"><polygon id="l-band" fill="#D9433B" opacity=".14"/><g id="l-lines"></g><g id="l-dots"></g></g><g id="l-labels"></g></svg>
        <div class="hlb" id="hlb">Best at every checkpoint</div></div></div>
  </div>
  <h3 class="hd second" data-r>Different scenes, same policy.</h3>
  <p class="prompt" data-r style="--d:.15s">“Pick up the <b>object</b> and place it next to the <b>receptacle</b>.”</p>
  <div data-group>
    <div class="rowh" data-r="fade"><span style="text-transform:none;letter-spacing:0;font-weight:500">MolmoBot FT + Point + Atomic Policy · held-out episodes · 8×</span><button type="button" class="replay">↻ Replay</button></div>
    <div class="grid c3">${[['molmo_s0015', '<b>coil spring</b> → <b>futuristic vehicle</b>'], ['molmo_s0030', '<b>metallic stake</b> → <b>desk calendar</b>'], ['molmo_s0068', '<b>red keychain</b> → <b>blue bowl</b>'],
      ['molmo_s0069', '<b>tennis racket</b> → <b>origami crane</b>'], ['molmo_s0170', '<b>webcam</b> → <b>cooking pan</b>'], ['molmo_s0185', '<b>folding camera</b> → <b>hardcover book</b>']].map(([n, c], i) => card([n, c, '', 1], i, '520/293')).join('')}</div>
  </div>
</div>`;

// real-robot tasks: [clip, caption, small, mark, brightness]; first three of the ID row are Atomic, the last two the end-to-end baselines
const real = (id, tag, h, p, idLabel, ID, OOD, changed) => {
  const c = ([n, cap, s, m, b], i) => card(['real_' + n, cap, s, m, { at: cap.startsWith('Atomic'), b }], i);
  $(id).innerHTML = `<div class="wrap">
    ${head(tag, 'Real Franka Panda', h, p)}
    <div data-group>${rowh(idLabel, '', true)}
      <div class="grid c6">${ID.map((x, i) => c(x, i).replace('class="vc', i === 3 ? 'class="vc off1' : 'class="vc')).join('')}</div></div>
    <div data-group>${rowh('Out of distribution', '', true)}
      <div class="split ood"><div class="grid c2">${OOD.map(c).join('')}</div>
      <div class="note" data-r style="--d:.2s"><div class="kt">What changed</div>${changed.map(([k, v]) => `<div class="kr"><span class="kl">${k}</span><span class="ch">${v.map(x => `<span class="chip2">${x}</span>`).join('')}</span></div>`).join('')}</div></div></div>
  </div>`;
};
real('#drawer', 'MULTI-DRAWER', 'The target is hidden. Open, check, replan.',
  '“Find the chicken leg hidden in one of the two drawers: open one drawer at a time and check inside, then pick up the chicken leg and place it in the blue bin.”', 'In distribution',
  [['5185', 'Atomic + DP', '17× · regrasp after a drop', 1, 1.21], ['5183', 'Atomic + MolmoBot', '7× · right drawer', 1, 1.18], ['5186', 'Atomic + π0.5', '7× · left drawer', 1, 1.21],
   ['5147', 'Fine-tuned MolmoBot', '30× · right drawer', 1, 1.12], ['5181', 'Fine-tuned π0.5', '9× · right drawer', 1, 1.19]],
  [['5194', 'Atomic + DP', '10× · grapes', 1, 1.2], ['5175', 'Atomic + DP', '24× · lemon', 1, 1.21], ['5149', 'Fine-tuned MolmoBot', '32× · grapes', 0, 1.15], ['5158', 'Fine-tuned π0.5', '13× · grapes', 1, 1.19]],
  [['Objects', ['grapes', 'lemon']], ['Receptacle', ['white bowl']]]);
real('#stacking', 'STACKING', 'Stack in order. If a cube falls, replan.',
  '“Pick up the block and stack it on top of the other block in the order of yellow, blue, red from bottom to top.”', 'In distribution',
  [['5202', 'Atomic + DP', '16×', 0, 1.22], ['5203', 'Atomic + MolmoBot', '9×', 1, 1.22], ['5199', 'Atomic + π0.5', '7×', 1, 1.25],
   ['5112', 'Fine-tuned MolmoBot', '25×', 0, 1.37], ['5197', 'Fine-tuned π0.5', '10×', 1, 1.23]],
  [['5200', 'Atomic + π0.5', '7×', 1, 1.23], ['5117', 'Atomic + π0.5 ｜ replan', '35×', 1, 1.39], ['5119', 'Fine-tuned MolmoBot', '19×', 0, 1.42], ['5107', 'Fine-tuned π0.5', '20×', 1, 1.16]],
  [['Cube colors', ['<i style="background:#7B4FD1"></i>purple', '<i style="background:#3BB8C9"></i>cyan', '<i style="background:#E8832A"></i>orange']], ['Recovery', ['replan after a fall']]]);
real('#crossword', 'CROSSWORD', 'The word is on the whiteboard, not in the prompt.',
  '“Rearrange the letter cubes to spell the word written on the whiteboard. Place cubes in the numbered tiles on the table.”', 'In distribution · MARS',
  [['5133', 'Atomic + DP', '42×', 1, 1.33], ['5097', 'Atomic + MolmoBot', '42×', 1, 1.28], ['5134', 'Atomic + π0.5', '42×', 1, 1.37],
   ['5089', 'Fine-tuned MolmoBot', '19× · M A', 0, 1.28], ['5232', 'Fine-tuned π0.5', '87× · M T O', 0, 1.31]],
  [['5224', 'Atomic + DP', '53× · ROBO', 1, 1.27], ['5137', 'Atomic + DP', '98× · COKE', 1, 1.19], ['5222', 'Fine-tuned MolmoBot', '44× · ROBO', 0, 1.22], ['5205', 'Fine-tuned π0.5', '17× · COKE', 0, 1.25]],
  [['Word', ['ROBO']], ['Goal cue', ['a Coke can on the table']]]);

/* ───────── reveal on scroll ───────── */
const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -7% 0px' });
$$('[data-r]').forEach(e => rio.observe(e));
$$('#newplan .chain > *').forEach((e, i) => e.style.setProperty('--i', i));

/* ───────── a clock that starts when its element scrolls into view ───────── */
function timeline(target, dur, fn, loop = false) {
  let t0 = null, raf = 0, vis = false, acc = 0, last = 0;
  fn(0);
  const step = now => {
    if (!vis) { raf = 0; return; }
    acc += Math.min(.5, (now - last) / 1000); last = now;
    fn(loop ? acc : Math.min(acc, dur));
    raf = (loop || acc < dur) ? requestAnimationFrame(step) : 0;
  };
  new IntersectionObserver(es => es.forEach(e => {
    vis = e.isIntersecting;
    if (vis && !raf && (loop || acc < dur)) { last = performance.now(); raf = requestAnimationFrame(step); }
  }), { threshold: .3 }).observe(target);
}

/* ───────── bar charts (film s15, s17) ───────── */
function bars(id, data, best) {
  const box = $('#' + id);
  box.innerHTML = `<div class="bars">${[100, 75, 50, 25, 0].map((v, i) => `<span class="gt" style="top:${i * 25}%">${v}</span>`).join('')}
    ${data.map((d, i) => `<div class="b${i === 4 ? ' gap' : ''}"><div class="bar${d[2] ? ' at' : ''}${d[1] === best ? ' best' : ''}"><span class="val"></span></div><span class="nm">${pi(d[0]).replace('\n', '<br>')}</span></div>`).join('')}</div>
    <div class="grps"><span>End-to-end baselines</span><span>Atomic Policy</span></div>`;
  const bs = $$('.bar', box), vs = $$('.val', box), ns = $$('.nm', box);
  timeline(box, 4.2, t => data.forEach((d, i) => {
    const s0 = .3 + i * .25, k = easeOut(prog(t, s0, 1.2));
    bs[i].style.height = `max(3px, ${(d[1] * k).toFixed(2)}%)`; bs[i].style.opacity = t >= s0 ? 1 : 0;
    vs[i].textContent = (d[1] * k).toFixed(1); vs[i].style.opacity = easeOut(prog(t, s0 + .2, .5));
    ns[i].style.opacity = easeOut(prog(t, s0, .6));
  }));
}
bars('bars-push', [['VLA U-Net\n(scratch text)', 1.0, 0], ['VLA U-Net\n(CLIP text)', 0.0, 0], ['π0.5\n(LoRA)', 8.0, 0], ['π0.5\n(full FT)', 1.0, 0], ['π0.5 +\natomic', 26.0, 1], ['DP +\nResNet', 71.0, 1], ['DP +\nDINOv3', 66.7, 1], ['DP +\nCLIP', 78.7, 1]], 78.7);
bars('bars-table', [['VLA U-Net\n(scratch text)', 8.3, 0], ['VLA U-Net\n(CLIP text)', 5.0, 0], ['π0.5\n(LoRA)', 0.0, 0], ['π0.5\n(full FT)', 40.0, 0], ['π0.5 +\natomic', 16.3, 1], ['DP +\nResNet', 48.8, 1], ['DP +\nDINOv3', 64.0, 1], ['DP +\nCLIP', 64.0, 1]], 64.0);

/* ───────── fine-tuning curves (film s18) ───────── */
(() => {
  const X0 = 64, X1 = 560, Y0 = 14, Y1 = 330, ymax = 65, xs = [...Array(16)].map((_, i) => i + 1);
  const S = {
    atomic: { c: '#D9433B', w: 4.5, v: [35, 40, 38.3, 35, 35, 38.3, 40, 38.8, 39.5, 41, 41, 41, 43, 45.5, 48, 48.5], n: 'MolmoBot FT + Point + Atomic (ours)' },
    ft: { c: '#3B7DD8', w: 3, v: [30, 35, 30, 28.8, 29, 28.3, 30.5, 33.8, 34.5, 35.5, 37, 37, 39.5, 40, 41, 43.5], n: 'MolmoBot FT' },
    ftp: { c: '#3BA55D', w: 3, v: [35, 35, 30, 27.5, 28, 28.3, 29.5, 31.3, 31, 30, 30, 29, 30.5, 30, 29, 27.5], n: 'MolmoBot FT + Point' },
    pi: { c: '#8E5BD6', w: 3, v: [5, 2.5, 3.3, 2.5, 3, 4, 5.7, 5.6, 5.6, 5.5, 6, 6.5, 8, 8, 8, 7.5], n: 'π0.5 FT' } };
  const Z = { mz: { c: '#7FB3EE', v: 37.0, n: 'MolmoBot zero-shot' }, pz: { c: '#B9A1E6', v: 3.0, n: 'π0.5 zero-shot' } };
  const px = i => X0 + (X1 - X0) * (i - 1) / 15, py = v => Y1 - (Y1 - Y0) * v / ymax;
  const grid = $('#l-grid'), lines = $('#l-lines'), dots = $('#l-dots'), labels = $('#l-labels');
  for (let v = 0; v <= 60; v += 10) { grid.appendChild(el('line', { x1: X0, x2: X1, y1: py(v), y2: py(v), stroke: '#EEE' })); const tx = el('text', { x: X0 - 10, y: py(v) + 5, 'text-anchor': 'end', 'font-size': 15, fill: '#999' }); tx.textContent = v; grid.appendChild(tx); }
  xs.forEach(i => { const tx = el('text', { x: px(i), y: Y1 + 22, 'text-anchor': 'middle', 'font-size': 13, fill: '#999' }); tx.textContent = i + 'k'; grid.appendChild(tx); });
  const ax = el('text', { x: (X0 + X1) / 2, y: Y1 + 48, 'text-anchor': 'middle', 'font-size': 15, fill: '#777' }); ax.textContent = 'training steps'; grid.appendChild(ax);
  const ay = el('text', { x: 14, y: (Y0 + Y1) / 2, 'text-anchor': 'middle', 'font-size': 15, fill: '#777', transform: 'rotate(-90 14 ' + ((Y0 + Y1) / 2) + ')' }); ay.textContent = 'success rate (%)'; grid.appendChild(ay);
  for (const k in Z) lines.appendChild(el('line', { x1: X0, x2: X1, y1: py(Z[k].v), y2: py(Z[k].v), stroke: Z[k].c, 'stroke-width': 2.5, 'stroke-dasharray': '9 7' }));
  $('#l-band').setAttribute('points', xs.map(i => px(i) + ',' + py(S.atomic.v[i - 1])).join(' ') + ' ' + xs.slice().reverse().map(i => px(i) + ',' + py(Math.max(S.ft.v[i - 1], S.ftp.v[i - 1]))).join(' '));
  for (const k in S) { const s = S[k]; lines.appendChild(el('polyline', { points: xs.map(i => px(i) + ',' + py(s.v[i - 1])).join(' '), fill: 'none', stroke: s.c, 'stroke-width': s.w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })); xs.forEach(i => dots.appendChild(el('circle', { cx: px(i), cy: py(s.v[i - 1]), r: k === 'atomic' ? 4.5 : 3.5, fill: s.c }))); }
  const lab = [['atomic', 48.5, 0], ['ft', 43.5, 0], ['mz', 37.0, 0], ['ftp', 27.5, 0], ['pi', 7.5, -3], ['pz', 3.0, 9]].map(([k, v, dy]) => { const tx = el('text', { x: X1 + 26, y: py(v) + 8 + dy, 'font-size': 23, 'font-weight': 800, fill: (S[k] || Z[k]).c }); tx.textContent = v.toFixed(1) + '%'; labels.appendChild(tx); return tx; });
  $('#line-leg').innerHTML = [[S.atomic, 1, 0], [S.ft, 0, 0], [S.ftp, 0, 0], [S.pi, 0, 0], [Z.mz, 0, 1], [Z.pz, 0, 1]].map(([s, b, d]) => `<span style="font-weight:${b ? 700 : 500}"><i style="border-top:3px ${d ? 'dashed' : 'solid'} ${s.c}"></i><span>${pi(s.n)}</span></span>`).join('');
  timeline($('#lchart'), 5, t => {
    $('#rv').setAttribute('width', (X0 + (X1 - X0) * prog(t, .3, 3.4) + 8).toFixed(1));
    lab.forEach(x => x.style.opacity = easeOut(prog(t, 3.7, .5)));
    $('#hlb').classList.toggle('on', t >= 4.1);
  });
})();

/* ───────── per-trial box plots (film s22, appendix Figure 5) ───────── */
(() => {
  const M = [['Atomic + DP', '#E6B422'], ['Atomic + MolmoBot', '#C99A00'], ['Atomic + π0.5', '#F3D36B'], ['MolmoBot (fine-tuned)', '#B9B9BE'], ['π0.5 (fine-tuned)', '#7F7F85']];
  const T = ['Multi-drawer', 'Stacking', 'Crossword'];
  const ID = [
    [[1, 1, 1, 1, 1, 1, 1, 1, 1, .5], [1, .67, 1, 1, 1, 1, 1, .25, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, .625, 1, 1, 1, 1, 1, .5], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    [[.125, .375, .625, .625, .375, .875, 1, 1, .625, .625], [1, 1, .875, 1, .875, 1, 1, 1, .875, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, .875], [1, 1, 0, 1, 0, 1, 1, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, .875, 1]],
    [[.875, .75, 1, .875, 1, 1, .625, 1, 1, 1], [.75, 1, .75, 1, 1, 1, 1, .625, .25, .875], [1, .5, 1, 1, 1, 1, .5, .5, 1, .25], [0, .5, .25, .875, .25, .25, .25, 0, .125, .5], [.25, .375, .5, .625, .75, .875, .625, .875, .625, 1]]];
  const OOD = [
    [[1, 1, 1, 1, .625, 1, 1, 1, 1, 1], [1, .75, 1, 1, 1, .33, .67, .5, .5, 1], [1, .75, 1, .625, .625, 1, 1, .5, .83, 1], [.625, .75, .75, .625, .75, .67, .67, 1, .5, .67], [.625, 1, 1, .25, 1, 1, 1, 1, 1, 1]],
    [[.625, 1, .375, .875, .375, .375, .375, .375, .625, .625], [.5, .875, 1, .875, .875, 1, 1, .875, .875, .625], [.5, 1, 1, 1, 1, 1, 1, 0, 1, 1], [.875, 1, 1, 0, 0, .875, 1, 0, .5, 1], [1, 1, 1, 1, 0, 0, 1, 1, 0, 1]],
    [[.75, .875, .625, 1, 1, 1, 1, .875, .875, 1], [1, .5, .25, .75, .75, .875, 1, .75, .375, 1], [1, .75, 1, .5, .5, 1, 1, .25, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]];
  $('#box-lg').innerHTML = M.map(([n, c]) => `<span><i style="background:${c}"></i><span>${pi(n)}</span></span>`).join('') + '<span><i class="mn"></i>mean</span>';
  const q = (v, p) => { const s = [...v].sort((a, b) => a - b); const i = (s.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (s[hi] - s[lo]) * (i - lo); };
  const X0 = 70, H = 250, PAD = 16, GW = 540, BX = 140, STEP = 72, BW = 44;
  function build(svg, D, names) {
    const items = []; const ax = el('g', {}); svg.appendChild(ax);
    [0, 25, 50, 75, 100].forEach(v => { const y = PAD + H - H * v / 100; ax.appendChild(el('line', { x1: X0, x2: 1700, y1: y, y2: y, stroke: v ? '#EEE' : '#DDD', 'stroke-width': v ? 1 : 2 }));
      if (v % 50 == 0) { const t = el('text', { x: X0 - 12, y: y + 6, 'text-anchor': 'end', 'font-size': 17, fill: '#AAA' }); t.textContent = v; ax.appendChild(t); } });
    const Y = x => PAD + H - H * x;
    D.forEach((grp, gi) => { grp.forEach((v, mi) => { const cx = X0 + BX + gi * GW + mi * STEP; const c = M[mi][1];
      const q1 = q(v, .25), q3 = q(v, .75), md = q(v, .5), iqr = q3 - q1, mean = v.reduce((a, b) => a + b) / v.length;
      const lo = Math.min(...v.filter(x => x >= q1 - 1.5 * iqr)), hi = Math.max(...v.filter(x => x <= q3 + 1.5 * iqr));
      const it = { cx, c, Y1: Y(q1), Y3: Y(q3), Ym: Y(md), Ya: Y(mean), Ylo: Y(lo), Yhi: Y(hi) };
      const g = el('g', {}); svg.appendChild(g);
      it.wu = el('line', { x1: cx, x2: cx, stroke: '#666', 'stroke-width': 1.5 }); it.wd = el('line', { x1: cx, x2: cx, stroke: '#666', 'stroke-width': 1.5 });
      it.cu = el('line', { x1: cx - 10, x2: cx + 10, stroke: '#666', 'stroke-width': 1.5 }); it.cd = el('line', { x1: cx - 10, x2: cx + 10, stroke: '#666', 'stroke-width': 1.5 });
      it.box = el('rect', { x: cx - BW / 2, width: BW, rx: 4, fill: c, 'fill-opacity': .32, stroke: c, 'stroke-width': 2 });
      it.med = el('line', { x1: cx - BW / 2, x2: cx + BW / 2, stroke: '#333', 'stroke-width': 3 });
      [it.wu, it.wd, it.cu, it.cd, it.box, it.med].forEach(e => g.appendChild(e));
      const dg = el('g', {}); svg.appendChild(dg); it.dots = [];
      const byv = {}; v.forEach((x, i) => { (byv[x] = byv[x] || []).push(i); });
      for (const key in byv) { const idx = byv[key]; const n = idx.length, rows = Math.ceil(n / 5); idx.forEach((i, k) => { const col = k % 5, row = Math.floor(k / 5); const inrow = row < rows - 1 ? 5 : n - 5 * (rows - 1); const dx = (col - (inrow - 1) / 2) * 8.5, dy = (row - (rows - 1) / 2) * 7; const d = el('circle', { cx: cx + dx, cy: Y(+key) + dy, r: 0, fill: c, stroke: '#fff', 'stroke-width': 1.2, opacity: .92 }); dg.appendChild(d); it.dots.push(d); }); }
      it.dm = el('polygon', { points: [[cx, it.Ya - 7], [cx + 7, it.Ya], [cx, it.Ya + 7], [cx - 7, it.Ya]].map(p => p.join(',')).join(' '), fill: '#fff', stroke: '#333', 'stroke-width': 1.8, opacity: 0, style: 'transform-origin:' + cx + 'px ' + it.Ya + 'px' }); svg.appendChild(it.dm);
      items.push(it); });
      if (names) { const t = el('text', { x: X0 + BX + gi * GW + 2 * STEP, y: PAD + H + 44, 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 700, fill: '#333' }); t.textContent = T[gi]; ax.appendChild(t); } });
    return items;
  }
  function draw(items, t, s0) { items.forEach((it, i) => {
    it.dots.forEach((d, k) => { const e = easeOut(prog(t, s0 + k * .035 + (i % 5) * .04, .4)); d.setAttribute('r', (4.5 * (1.15 - .15 * e) * e).toFixed(2)); });
    const km = easeOut(prog(t, s0 + .7, .5)); it.dm.setAttribute('opacity', km.toFixed(3)); it.dm.style.scale = (.6 + .4 * km).toFixed(3);
    const kb = easeInOut(prog(t, s0 + .9, .7)); const top = it.Ya + (it.Y3 - it.Ya) * kb, bot = it.Ya + (it.Y1 - it.Ya) * kb;
    it.box.setAttribute('y', top); it.box.setAttribute('height', Math.max(2.5, bot - top)); it.box.setAttribute('opacity', kb > 0 ? 1 : 0);
    const ym = it.Ya + (it.Ym - it.Ya) * kb; it.med.setAttribute('y1', ym); it.med.setAttribute('y2', ym); it.med.setAttribute('opacity', kb > 0 ? 1 : 0);
    const kw = easeOut(prog(t, s0 + 1.5, .6)); const yu = it.Y3 + (it.Yhi - it.Y3) * kw, yd = it.Y1 + (it.Ylo - it.Y1) * kw;
    it.wu.setAttribute('y1', it.Y3); it.wu.setAttribute('y2', yu); it.wd.setAttribute('y1', it.Y1); it.wd.setAttribute('y2', yd);
    it.cu.setAttribute('y1', yu); it.cu.setAttribute('y2', yu); it.cd.setAttribute('y1', yd); it.cd.setAttribute('y2', yd);
    [it.wu, it.wd, it.cu, it.cd].forEach(e => e.setAttribute('opacity', kw > 0 ? 1 : 0)); }); }
  const P1 = build($('#bp1'), ID, false), P2 = build($('#bp2'), OOD, true);
  timeline($('#boxplots'), 5, t => { draw(P1, t, .3); draw(P2, t, 1.8); });
})();

/* ───────── closing ring (film s23) ───────── */
(() => {
  const svg = $('#ring'), CX = 960, CY = 540, R = 400;
  const P = a => [CX + R * Math.cos(a), CY + R * Math.sin(a)], d2r = d => d * Math.PI / 180;
  const SEG = [['Plan', '#3B7DD8', -90], ['Ground', '#3BA55D', 0], ['Execute', '#E6B422', 90], ['Check', '#E8832A', 180]];
  const base = el('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: '#E9E9EC', 'stroke-width': 6, pathLength: 1, 'stroke-dasharray': 1, transform: `rotate(-90 ${CX} ${CY})` }); svg.appendChild(base);
  const arcs = [], labels = [], chev = [];
  SEG.forEach(([n, c, a0]) => { const [x0, y0] = P(d2r(a0)), [x1, y1] = P(d2r(a0 + 90));
    const p = el('path', { d: `M${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1}`, fill: 'none', stroke: c, 'stroke-width': 8, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, opacity: 0 }); svg.appendChild(p); arcs.push(p);
    const g = el('g', { transform: `translate(${x0},${y0}) rotate(${a0 + 90})`, opacity: 0 }); g.appendChild(el('polyline', { points: '-9,-13 4,0 -9,13', fill: 'none', stroke: '#fff', 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })); g.appendChild(el('polyline', { points: '-9,-13 4,0 -9,13', fill: 'none', stroke: '#9A9AA0', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })); svg.appendChild(g); chev.push(g);
    const [lx, ly] = P(d2r(a0 + 45)); const lg = el('g', { opacity: 0, style: `transform-origin:${lx}px ${ly}px` });
    const w = n.length * 21 + 44; lg.appendChild(el('rect', { x: lx - w / 2, y: ly - 27, width: w, height: 54, rx: 27, fill: '#fff', stroke: c, 'stroke-width': 3 }));
    const tx = el('text', { x: lx, y: ly + 12, 'text-anchor': 'middle', 'font-size': 32, 'font-weight': 700, fill: c, 'letter-spacing': '.02em' }); tx.textContent = n; lg.appendChild(tx); svg.appendChild(lg); labels.push(lg); });
  const glow = el('circle', { r: 26, opacity: 0 }), dot = el('circle', { r: 12, stroke: '#fff', 'stroke-width': 3, opacity: 0 }); svg.appendChild(glow); svg.appendChild(dot);
  const t1 = $('.ringtext .t1'), t2 = $('.ringtext .t2');
  timeline($('#ringbox'), 0, t => {
    base.setAttribute('stroke-dashoffset', (1 - easeOut(prog(t, .1, .9))).toFixed(4));
    SEG.forEach((s, i) => { const s0 = .6 + i * .45, k = easeOut(prog(t, s0, .55)); arcs[i].setAttribute('opacity', k > 0 ? 1 : 0); arcs[i].setAttribute('stroke-dashoffset', (1 - k).toFixed(4));
      chev[i].setAttribute('opacity', easeOut(prog(t, s0, .3)).toFixed(3));
      const kl = easeOut(prog(t, s0 + .35, .4)); labels[i].setAttribute('opacity', kl.toFixed(3)); labels[i].style.scale = (.7 + .3 * kl).toFixed(3); });
    const td = t - 2.4, on = td >= 0, ang = -90 + 360 * (td / 2.6); const [dx, dy] = P(d2r(ang));
    const qd = Math.floor(((ang + 90) % 360 + 360) % 360 / 90), col = SEG[qd][1], mid = ((ang + 90) % 90 + 90) % 90 - 45, pulse = 1 + .45 * Math.max(0, 1 - Math.abs(mid) / 14), kin = easeOut(prog(t, 2.4, .4));
    dot.setAttribute('cx', dx); dot.setAttribute('cy', dy); dot.setAttribute('fill', col); dot.setAttribute('r', (12 * pulse * kin).toFixed(2)); dot.setAttribute('opacity', on ? 1 : 0);
    glow.setAttribute('cx', dx); glow.setAttribute('cy', dy); glow.setAttribute('fill', col); glow.setAttribute('r', (26 * pulse * kin).toFixed(2)); glow.setAttribute('opacity', on ? .22 : 0);
    const k1 = easeOut(prog(t, 1.2, .8)); t1.style.opacity = k1; t1.style.scale = (.92 + .08 * k1).toFixed(4);
    const k2 = easeOut(prog(t, 1.8, .7)); t2.style.opacity = k2; t2.style.translate = `0 ${((1 - k2) * 20).toFixed(1)}px`;
  }, true);
})();

/* ───────── ambient clips: play while on screen, hold on the last frame, start over ───────── */
$$('video[data-auto]').forEach(v => {
  const hold = +v.dataset.hold || 0, delay = +v.dataset.delay || 0;
  const go = () => { if (v._vis && v._armed && !v._hold && !v._user) v.play().catch(() => {}); };
  new IntersectionObserver(es => es.forEach(e => {
    v._vis = e.isIntersecting;
    if (!v._vis) return v.pause();
    if (!v._seen) { v._seen = true; setTimeout(() => { v._armed = true; go(); }, delay); } else go();
  }), { threshold: .35 }).observe(v);
  if (!v.loop) v.addEventListener('ended', () => { v._hold = true; setTimeout(() => { v._hold = false; v.currentTime = 0; go(); }, hold * 1000); });
});
$('#v-arch').parentElement.addEventListener('click', () => { const v = $('#v-arch'); v._user = !v.paused; v.paused ? v.play() : v.pause(); });

/* ───────── result groups: every clip of a group starts together, each gets its mark when its run ends ───────── */
$$('[data-group]').forEach(g => {
  const vs = $$('video', g); let started = false, vis = false;
  const start = () => vs.forEach(v => { v.closest('.vc').classList.remove('done'); v._done = false; v.currentTime = 0; v.play().catch(() => {}); });
  vs.forEach(v => v.addEventListener('ended', () => { v._done = true; v.closest('.vc').classList.add('done'); }));
  new IntersectionObserver(es => es.forEach(e => {
    vis = e.isIntersecting;
    if (vis && !started) { started = true; setTimeout(() => vis ? start() : (started = false), 900); }
    else if (started) vs.forEach(v => { if (v._done) return; vis ? v.play().catch(() => {}) : v.pause(); });
  }), { threshold: .25 }).observe(g);
  $$('.replay', g).forEach(b => b.addEventListener('click', () => { started = true; start(); }));
});

/* ───────── method scenes: text follows the clip ───────── */
const chainV = $('#v-chain'), chainChips = $$('#chain .chip'), chainOn = [0, 1.1, 2.1, 4.3, 6.1, 7.0];
const pickV = $('#v-pick'), ticks = $$('#checklist .bx'), tickAt = [.39, 1.3, 2.21], done = $('#done');
const repV = $('#v-replan'), rep = $('#rep'), newplan = $('#newplan');
const bub = $('#bub'); let bubT0 = 0;
function frame(now) {
  let t = chainV.currentTime; chainChips.forEach((c, i) => c.classList.toggle('on', t > .03 && t >= chainOn[i]));
  t = pickV.currentTime; ticks.forEach((b, i) => b.classList.toggle('on', t >= tickAt[i])); done.classList.toggle('on', pickV.ended || (pickV.duration && t >= pickV.duration - .05));
  t = repV.currentTime; rep.classList.toggle('on', t >= 4.97); newplan.classList.toggle('on', t >= 6.3);
  if (bub.classList.contains('in')) { bubT0 = bubT0 || now; const n = Math.floor(Math.max(0, (now - bubT0) / 1000 - .7) * 24); const full = bub.dataset.text; if (n <= full.length + 1) bub.textContent = full.slice(0, n) || ' '; }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ───────── opening: the video settles into a card as the page scrolls; nav turns solid after it ───────── */
const hero = $('.hero'), heroCard = $('.hero-card'), heroV = $('#hero-video'), nav = $('#nav');
const anchors = [['#method', '#method'], ['#sim', '#sim'], ['#real', '#real'], ['#video', '#video']].map(([h, s]) => [$(`#nav a[href="${h}"]`), $(s)]);
let heroHold = false;
heroV.addEventListener('ended', () => { heroHold = true; setTimeout(() => { heroHold = false; heroV.currentTime = 0; if (scrollY <= hero.offsetHeight) heroV.play().catch(() => {}); }, 1000); });
function onScroll() {
  const vh = innerHeight, y = scrollY, span = hero.offsetHeight - vh;
  heroCard.style.setProperty('--p', easeInOut(clamp01(y / span)).toFixed(4));
  nav.classList.toggle('solid', y > hero.offsetHeight - 70);
  y > hero.offsetHeight ? heroV.pause() : heroV.paused && !heroHold && heroV.play().catch(() => {});
  let cur = null; anchors.forEach(([a, s]) => { if (s.getBoundingClientRect().top < vh * .4) cur = a; });
  anchors.forEach(([a]) => a.classList.toggle('on', a === cur));
}
addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();

$('#copy').addEventListener('click', e => { navigator.clipboard.writeText($('#bibtex').textContent).then(() => { e.target.textContent = 'Copied'; setTimeout(() => e.target.textContent = 'Copy', 1500); }); });
})();
