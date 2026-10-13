// Zeichnet Rohrleitungs-Isometrien nach DIN ISO 6412-2 als SVG.
// Achsen wie Bild 1 der Norm: Z senkrecht, X nach rechts oben, Y nach links oben (je 30° über der Waagerechten).
// Symbole: Bogen = Knick, Schweißnaht = Punkt, Baustellenschweißung = Punkt mit Fähnchen, Flansch = Querstrich(e),
// Ventil = zwei Dreiecke (Bild 12), Reduzierstück = Kegel mit Nennweiten darüber (Bild 14), Unterbrechung bei Kreuzung (Bild 17).
(function () {
  const C = Math.cos(Math.PI / 6), S = 0.5;
  const f1 = n => (Math.round(n * 10) / 10).toString();
  const esc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const len = a => Math.hypot(a[0], a[1]);
  const unit = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
  const perp = u => [-u[1], u[0]];
  const pt = p => f1(p[0]) + "," + f1(p[1]);

  function dist3(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }

  function render(sc) {
    const s = 0.1;                                            // Pixel je mm (Symbole haben feste Pixelgrößen)
    const P3 = sc.points;
    const projP = p => [(p[0] - p[1]) * C * s, (-(p[0] + p[1]) * S - p[2]) * s];
    const proj = id => projP(P3[id]);
    const P = {}; Object.keys(P3).forEach(id => P[id] = proj(id));
    const at = (a, b, f) => add(P[a], mul(sub(P[b], P[a]), f));
    const dir = (a, b) => unit(sub(P[b], P[a]));
    const stats = { weld: 0, siteWeld: 0, flangePairs: 0, valves: { abs: 0, rueck: 0, regel: 0 }, pumps: 0, reducers: 0, supports: 0, bends: 0, tees: 0, length: 0, segments: [] };
    let out = "", dim = "", lab = "", pts = [];
    const dot = p => { stats.weld++; return '<circle class="dot" cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="4.2"/>'; };
    const stroke = (p, u, w) => { const n = perp(u); const a = add(p, mul(n, w || 11)), b = sub(p, mul(n, w || 11)); return '<line class="fl" x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '"/>'; };
    const nvert = (u) => (Math.abs(u[0]) < 0.05 ? [C, -S] : [0, 1]);   // Querrichtung der Dreiecke: senkrechte Rohre -> X-Richtung, sonst senkrecht
    const adjacency = {};
    const connect = (a, b) => { (adjacency[a] = adjacency[a] || []).push(b); (adjacency[b] = adjacency[b] || []).push(a); };

    // ---- Leitungen ----
    sc.lines.forEach(L => {
      const ids = L.pts;
      if (L.halo) out += '<polyline class="halo" points="' + ids.map(i => pt(P[i])).join(" ") + '"/>';
      out += '<polyline class="ln" points="' + ids.map(i => pt(P[i])).join(" ") + '"/>';
      for (let i = 0; i < ids.length - 1; i++) { connect(ids[i], ids[i + 1]); stats.length += dist3(P3[ids[i]], P3[ids[i + 1]]); stats.segments.push([ids[i], ids[i + 1], Math.round(dist3(P3[ids[i]], P3[ids[i + 1]]))]); }
    });
    // Bögen und T-Stücke: Schweißpunkte
    Object.keys(adjacency).forEach(id => {
      const nb = adjacency[id];
      if (nb.length === 2) {
        const u1 = dir(id, nb[0]), u2 = dir(id, nb[1]);
        if (Math.abs(u1[0] * u2[1] - u1[1] * u2[0]) > 0.05) {          // kein gerader Durchgang
          stats.bends++;
          out += dot(add(P[id], mul(u1, 12))) + dot(add(P[id], mul(u2, 12)));
        }
      } else if (nb.length === 3) {
        stats.tees++;
        nb.forEach(n => { out += dot(add(P[id], mul(dir(id, n), 12))); });
      }
    });

    // ---- Bauteile ----
    (sc.items || []).forEach(it => {
      if (it.t === "flange") {                                           // Flanschverbindung am Rohrende + Schweißpunkt
        const u = dir(it.at, it.toward);
        stats.flangePairs++;
        out += stroke(P[it.at], u) + stroke(add(P[it.at], mul(u, 6)), u) + dot(add(P[it.at], mul(u, 20)));
      } else if (it.t === "valve") {
        const c = at(it.a, it.b, it.f), u = dir(it.a, it.b), n = nvert(u), hl = 11, hw = 10;
        stats.valves[it.kind || "abs"]++;
        const tri = (sgn, fill) => '<polygon class="sym' + (fill ? " symf" : "") + '" points="' + pt(c) + " " + pt(add(c, add(mul(u, sgn * hl), mul(n, hw)))) + " " + pt(add(c, sub(mul(u, sgn * hl), mul(n, hw)))) + '"/>';
        out += '<g>' + '<line class="halo" x1="' + f1(c[0] - u[0] * 14) + '" y1="' + f1(c[1] - u[1] * 14) + '" x2="' + f1(c[0] + u[0] * 14) + '" y2="' + f1(c[1] + u[1] * 14) + '"/>';
        out += tri(1, it.kind === "rueck") + tri(-1, false);
        [hl + 3, -(hl + 3)].forEach(d => { const q = add(c, mul(u, d)); const a = add(q, mul(n, hw + 2)), b = sub(q, mul(n, hw + 2)); out += '<line class="fl" x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '"/>'; });
        if (it.kind === "regel") { out +='<line class="sym" x1="' + f1(c[0]) + '" y1="' + f1(c[1]) + '" x2="' + f1(c[0] + 0) + '" y2="' + f1(c[1] - 22) + '"/><circle class="sym" cx="' + f1(c[0]) + '" cy="' + f1(c[1] - 27) + '" r="5"/>'; }
        out += "</g>";
        if (it.label) lab += '<text class="t1" x="' + f1(c[0] + (it.lo ? it.lo[0] : 14)) + '" y="' + f1(c[1] + (it.lo ? it.lo[1] : 27)) + '">' + esc(it.label) + "</text>";
      } else if (it.t === "pump") {
        const c = at(it.a, it.b, it.f), u = dir(it.a, it.b), r = 15;
        stats.pumps++;
        out += '<circle class="halo2" cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + r + '"/><circle class="sym" cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + r + '"/>' +
          '<polygon class="sym" points="' + pt(add(c, [0, -10])) + " " + pt(add(c, [9, 6])) + " " + pt(add(c, [-9, 6])) + '"/>' +
          '<line class="sym" x1="' + f1(c[0]) + '" y1="' + f1(c[1] - r) + '" x2="' + f1(c[0]) + '" y2="' + f1(c[1] - r - 12) + '"/><rect class="sym" x="' + f1(c[0] - 8) + '" y="' + f1(c[1] - r - 22) + '" width="16" height="10" rx="2"/>';
        [r + 3, -(r + 3)].forEach(d => { out += stroke(add(c, mul(u, d)), u, 10); });
        lab += '<text class="t1" x="' + f1(c[0] + (it.lo ? it.lo[0] : -46)) + '" y="' + f1(c[1] + (it.lo ? it.lo[1] : 34)) + '">' + esc(it.label || "Pumpe") + "</text>";
      } else if (it.t === "reducer") {
        const c = at(it.a, it.b, it.f), u = dir(it.a, it.b), n = nvert(u), L2 = 17;
        stats.reducers++;
        const bigEnd = add(c, mul(u, it.bigFirst === false ? L2 : -L2)), smallEnd = add(c, mul(u, it.bigFirst === false ? -L2 : L2));
        out += '<line class="halo" x1="' + f1(bigEnd[0]) + '" y1="' + f1(bigEnd[1]) + '" x2="' + f1(smallEnd[0]) + '" y2="' + f1(smallEnd[1]) + '"/>' +
          '<polygon class="sym" points="' + pt(add(bigEnd, mul(n, 10))) + " " + pt(sub(bigEnd, mul(n, 10))) + " " + pt(sub(smallEnd, mul(n, 5))) + " " + pt(add(smallEnd, mul(n, 5))) + '"/>';
        out += dot(add(bigEnd, mul(u, it.bigFirst === false ? 10 : -10))) + dot(add(smallEnd, mul(u, it.bigFirst === false ? -10 : 10)));
        lab += '<text class="t1" x="' + f1(c[0] + (it.lo ? it.lo[0] : 16)) + '" y="' + f1(c[1] + (it.lo ? it.lo[1] : -16)) + '">' + esc(it.text) + "</text>";
      } else if (it.t === "support") {
        const c = at(it.a, it.b, it.f);
        stats.supports++;
        out += '<line class="sym" x1="' + f1(c[0]) + '" y1="' + f1(c[1]) + '" x2="' + f1(c[0]) + '" y2="' + f1(c[1] + 22) + '"/><line class="sym" x1="' + f1(c[0] - 10) + '" y1="' + f1(c[1] + 22) + '" x2="' + f1(c[0] + 10) + '" y2="' + f1(c[1] + 22) + '"/>' +
          '<line class="sym" x1="' + f1(c[0] - 6) + '" y1="' + f1(c[1] + 22) + '" x2="' + f1(c[0] - 10) + '" y2="' + f1(c[1] + 28) + '"/><line class="sym" x1="' + f1(c[0]) + '" y1="' + f1(c[1] + 22) + '" x2="' + f1(c[0] - 4) + '" y2="' + f1(c[1] + 28) + '"/><line class="sym" x1="' + f1(c[0] + 6) + '" y1="' + f1(c[1] + 22) + '" x2="' + f1(c[0] + 2) + '" y2="' + f1(c[1] + 28) + '"/>';
        if (it.label) lab += '<text class="t1" x="' + f1(c[0] + 14) + '" y="' + f1(c[1] + 24) + '">' + esc(it.label) + "</text>";
      } else if (it.t === "weld") {                                      // einzelne Schweißnaht (optional Baustelle)
        const c = at(it.a, it.b, it.f);
        out += dot(c);
        if (it.site) {                                                    // Fähnchen: Stab quer zum Rohr, Fahne als Dreieck
          stats.siteWeld++;
          const su = dir(it.a, it.b); let sv = nvert(su); if (sv[1] > 0) sv = mul(sv, -1);
          const top = add(c, mul(sv, 24)), pv = perp(sv);
          out += '<line class="ln" style="stroke-width:1.8" x1="' + f1(c[0]) + '" y1="' + f1(c[1]) + '" x2="' + f1(top[0]) + '" y2="' + f1(top[1]) + '"/>' +
            '<polygon class="symf" points="' + pt(top) + " " + pt(add(sub(top, mul(sv, 9)), mul(pv, 14))) + " " + pt(sub(top, mul(sv, 17))) + '"/>';
        }
      } else if (it.t === "tank") {
        const p = P[it.at], w = 38, h = 46, cx = p[0] + (it.side === "right" ? w + 8 : -(w + 8)), cy = p[1] - 8;
        out += '<g class="tank"><ellipse class="sym" cx="' + f1(cx) + '" cy="' + f1(cy - h) + '" rx="' + w + '" ry="12"/>' +
          '<path class="sym" d="M' + f1(cx - w) + " " + f1(cy - h) + " V" + f1(cy) + " A" + w + " 12 0 0 0 " + f1(cx + w) + " " + f1(cy) + " V" + f1(cy - h) + '"/>' +
          '<line class="dashdot" x1="' + f1(cx) + '" y1="' + f1(cy - h - 20) + '" x2="' + f1(cx) + '" y2="' + f1(cy + 18) + '"/></g>';
        lab += '<text class="t1" x="' + f1(cx - 10) + '" y="' + f1(cy - h + 4) + '" style="font-weight:700">' + esc(it.label) + "</text>";
      } else if (it.t === "box") {                                       // Verbraucher (z. B. Wärmetauscher)
        const p = P[it.at], w = 34, h = 34, cx = p[0] + (it.side === "left" ? -(w + 8) : w + 8), cy = p[1];
        out += '<rect class="sym" x="' + f1(cx - w) + '" y="' + f1(cy - h / 2) + '" width="' + (2 * w) + '" height="' + h + '" rx="6"/>';
        lab += '<text class="t1" x="' + f1(cx - 14) + '" y="' + f1(cy + 5) + '" style="font-weight:700">' + esc(it.label) + "</text>";
      } else if (it.t === "aux") {                                       // Hilfsebene (schraffiertes Dreieck) wie Bild 3/7
        const A = P[it.a], B = P[it.b], Cc = proj_corner(it.corner);
        let hatch = "";
        for (let k = 1; k < 12; k++) { const t = k / 12; const q1 = add(A, mul(sub(Cc, A), t)), q2 = add(A, mul(sub(B, A), t)); hatch += '<line class="hatch" x1="' + f1(q1[0]) + '" y1="' + f1(q1[1]) + '" x2="' + f1(q2[0]) + '" y2="' + f1(q2[1]) + '"/>'; }
        const ua = unit(sub(A, Cc)), ub = unit(sub(B, Cc));               // kleines Quadrat = rechter Winkel (Norm 6.5)
        const sq = '<polyline class="auxp" points="' + pt(add(Cc, mul(ua, 9))) + " " + pt(add(add(Cc, mul(ua, 9)), mul(ub, 9))) + " " + pt(add(Cc, mul(ub, 9))) + '"/>';
        out = '<polygon class="auxp" points="' + pt(A) + " " + pt(Cc) + " " + pt(B) + '"/>' + hatch + sq + out;
      } else if (it.t === "dim") {
        const a = P[it.a], b = P[it.b], u = unit(sub(b, a)), n = perp(u), off = it.off || 24, o = mul(n, off);
        const a2 = add(a, o), b2 = add(b, o), mid = mul(add(a2, b2), 0.5);
        const text = it.text !== undefined ? it.text : String(Math.round(dist3(P3[it.a], P3[it.b])));
        let ang = Math.atan2(u[1], u[0]) * 180 / Math.PI; if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
        const tx = add(mid, mul(unit(o), -4));
        dim += '<line class="dim" x1="' + pt(a).split(",")[0] + '" y1="' + pt(a).split(",")[1] + '" x2="' + f1(a2[0] + n[0] * Math.sign(off) * 5) + '" y2="' + f1(a2[1] + n[1] * Math.sign(off) * 5) + '"/>' +
          '<line class="dim" x1="' + f1(b[0]) + '" y1="' + f1(b[1]) + '" x2="' + f1(b2[0] + n[0] * Math.sign(off) * 5) + '" y2="' + f1(b2[1] + n[1] * Math.sign(off) * 5) + '"/>' +
          '<line class="dim" x1="' + f1(a2[0]) + '" y1="' + f1(a2[1]) + '" x2="' + f1(b2[0]) + '" y2="' + f1(b2[1]) + '"/>' +
          '<polygon class="symf" points="' + pt(a2) + " " + pt(add(a2, add(mul(u, 8), mul(n, 2.5)))) + " " + pt(add(a2, sub(mul(u, 8), mul(n, 2.5)))) + '"/>' +
          '<polygon class="symf" points="' + pt(b2) + " " + pt(sub(b2, sub(mul(u, 8), mul(n, 2.5)))) + " " + pt(sub(b2, add(mul(u, 8), mul(n, 2.5)))) + '"/>' +
          '<text class="t1 dimt" transform="translate(' + f1(tx[0]) + " " + f1(tx[1]) + ") rotate(" + f1(ang) + ')" text-anchor="middle">' + esc(text) + "</text>";
      } else if (it.t === "height") {
        // Höhenangabe (vereinfacht): kurzer Strich am Punkt, Hinweislinie waagerecht nach links oder rechts, Dreieck und Zahl
        const p = P[it.at], sg = it.side === "l" ? -1 : 1, y = p[1] + (it.dy || 0), xa = p[0] + sg * 10, xb = p[0] + sg * 74;
        dim += '<line class="dim" x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(xa) + '" y2="' + f1(y) + '"/>' +
          '<line class="dim" x1="' + f1(xa) + '" y1="' + f1(y) + '" x2="' + f1(xb) + '" y2="' + f1(y) + '"/>' +
          '<polygon class="symf" points="' + pt([xa + sg * 10, y - 1]) + " " + pt([xa + sg * 4, y - 9]) + " " + pt([xa + sg * 16, y - 9]) + '"/>' +
          '<text class="t1" x="' + f1(sg > 0 ? xa + 20 : xb) + '" y="' + f1(y - 4) + '">' + esc(it.text) + "</text>";
      } else if (it.t === "slope") {
        const c = at(it.a, it.b, it.f || 0.5), u = dir(it.a, it.b), A1 = sub(c, mul(u, 24)), A2 = add(c, mul(u, 24)), A3 = add(A1, [0, -11]);
        dim += '<polygon class="sym" points="' + pt(A1) + " " + pt(A2) + " " + pt(A3) + '"/><text class="t1" x="' + f1(A3[0] - 6) + '" y="' + f1(A3[1] - 6) + '">' + esc(it.text) + "</text>";
      } else if (it.t === "flow") {
        const c = at(it.a, it.b, it.f), u = dir(it.a, it.b), tip = add(c, mul(u, it.rev ? -9 : 9)), base = sub(c, mul(u, it.rev ? -9 : 9)), n = perp(u);
        out += '<polygon class="symf" points="' + pt(tip) + " " + pt(add(base, mul(n, 4.5))) + " " + pt(sub(base, mul(n, 4.5))) + '"/>';
      }
    });
    function proj_corner(c) { return projP(c); }

    // Positionsnummern an den Knickstellen/Anschlüssen
    if (sc.posLabels !== false) {
      Object.keys(P).forEach(id => {
        if ((sc.hidden || []).indexOf(id) > -1) return;
        const nb = adjacency[id] || [], p = P[id];
        let v = [0, 0]; nb.forEach(n => { v = add(v, dir(id, n)); });
        const away = len(v) < 0.1 ? [0.7, -0.7] : mul(unit(v), -1);
        let q = add(p, mul(away, 20));
        if (nb.length === 1) { let n = perp(dir(id, nb[0])); if (n[1] > 0) n = mul(n, -1); q = add(add(p, mul(n, 22)), mul(away, 6)); }
        lab += '<g><circle class="poscirc" cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" r="9.5"/><text class="pos" x="' + f1(q[0]) + '" y="' + f1(q[1] + 4) + '" text-anchor="middle">' + esc(id) + "</text></g>";
        pts.push(q);
      });
    }
    // Koordinatenkreuz oben links (wie Bild 24)
    const all = []; Object.keys(P).forEach(id => all.push(P[id]));
    let minx = Math.min.apply(null, all.map(p => p[0])) - 120, maxx = Math.max.apply(null, all.map(p => p[0])) + 120;
    let miny = Math.min.apply(null, all.map(p => p[1])) - 90, maxy = Math.max.apply(null, all.map(p => p[1])) + 80;
    const ox = minx + 56, oy = miny + 70, L = 34;
    const axis = (vx, vy, t) => '<line class="ax" x1="' + ox + '" y1="' + oy + '" x2="' + f1(ox + vx * L) + '" y2="' + f1(oy + vy * L) + '"/><text x="' + f1(ox + vx * (L + 9) - 4) + '" y="' + f1(oy + vy * (L + 9) + 4) + '">' + t + "</text>";
    const axes = axis(0, -1, "Z") + axis(C, -S, "X") + axis(-C, -S, "Y");
    const W = maxx - minx, H = maxy - miny;
    const svg = '<svg class="iso isobig" viewBox="' + f1(minx) + " " + f1(miny) + " " + f1(W) + " " + f1(H) + '" role="img" aria-label="' + esc(sc.alt || sc.title) + '" style="max-height:none;max-width:none;display:block;margin:0 auto;width:' + Math.round(W) + 'px">' +
      '<g>' + out + '</g><g>' + dim + "</g><g>" + lab + "</g><g>" + axes + "</g></svg>";
    stats.length = Math.round(stats.length);
    return { svg, stats };
  }

  // Koordinatentabelle (wie in Bild 23 der Norm)
  function coordTable(sc) {
    return '<div class="tw"><table><tr><th>Punkt</th><th>x</th><th>y</th><th>z</th></tr>' +
      Object.keys(sc.points).filter(id => (sc.hidden || []).indexOf(id) < 0).map(id => "<tr><td>" + id + "</td><td>" + sc.points[id][0] + "</td><td>" + sc.points[id][1] + "</td><td>" + sc.points[id][2] + "</td></tr>").join("") + "</table></div>";
  }

  window.IsoDraw = { render, coordTable, dist3 };
})();
