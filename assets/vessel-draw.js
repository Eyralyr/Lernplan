// Zeichnet einen liegenden zylindrischen Behälter in bis zu drei Ansichten (Projektionsmethode 1) mit Stutzen, Sätteln und Maßen.
// Frei erfundene Zeichnungen im Stil der Prüfungsunterlagen. Alle Maße in mm.
// Ansichten: Vorderansicht (front), Draufsicht (top) darunter, Ansicht von links (side) rechts daneben.
// Stutzenwinkel: 0° = oben, 90° = zur Vorderansicht hin (vorn), 180° = unten, 270° = hinten.
(function () {
  const f1 = n => (Math.round(n * 10) / 10).toString();
  const esc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const rad = d => d * Math.PI / 180;

  function render(sc) {
    const s = sc.scale || 0.18, D = sc.D, R = D / 2, hh = sc.hh || Math.round(D * 0.25), L = sc.L, Lg = L + 2 * hh;
    const ox = 70, oy = sc.oy || 150;                                  // Ursprung der Vorderansicht (oben links des Mantels)
    const gap = 80, topY = oy + D * s + (sc.hs || 160) * s + gap;   // Draufsicht darunter
    const sideX = ox + Lg * s + 110 + R * s;                 // Mittelpunkt der Seitenansicht
    const views = sc.views || ["front"];
    let out = "", lab = "", dim = "";
    const X = mm => ox + mm * s;                              // x in der Vorder- und Draufsicht
    const Yf = mm => oy + mm * s;                             // y in der Vorderansicht (0 = Oberkante Behälter)

    // ---------- Behälterkörper: Vorderansicht ----------
    const body = (cx, cy, hd) => "";                          // (Platzhalter)
    const hx = hh * s, rx = R * s;
    out += '<path class="vs bgf" d="M' + f1(X(hh)) + " " + f1(Yf(0)) + " H" + f1(X(hh + L)) + " A" + f1(hx) + " " + f1(rx) + " 0 0 1 " + f1(X(hh + L)) + " " + f1(Yf(D)) + " H" + f1(X(hh)) + " A" + f1(hx) + " " + f1(rx) + " 0 0 1 " + f1(X(hh)) + " " + f1(Yf(0)) + ' Z"/>';
    out += '<line class="vs" x1="' + f1(X(hh)) + '" y1="' + f1(Yf(0)) + '" x2="' + f1(X(hh)) + '" y2="' + f1(Yf(D)) + '"/><line class="vs" x1="' + f1(X(hh + L)) + '" y1="' + f1(Yf(0)) + '" x2="' + f1(X(hh + L)) + '" y2="' + f1(Yf(D)) + '"/>';
    out += '<line class="vc" x1="' + f1(X(-60)) + '" y1="' + f1(Yf(R)) + '" x2="' + f1(X(Lg + 60)) + '" y2="' + f1(Yf(R)) + '"/>';
    // Sättel
    (sc.saddles || []).forEach(x => {
      const w = (sc.sw || 260) * s, top = Yf(D * 0.88), base = Yf(D + (sc.hs || 160));
      out += '<polygon class="vs bgf" points="' + [[X(x) - w / 2, top], [X(x) + w / 2, top], [X(x) + w / 2 + 6, base], [X(x) - w / 2 - 6, base]].map(p => f1(p[0]) + "," + f1(p[1])).join(" ") + '"/>' +
        '<line class="vs" x1="' + f1(X(x) - w / 2 - 14) + '" y1="' + f1(base) + '" x2="' + f1(X(x) + w / 2 + 14) + '" y2="' + f1(base) + '"/>';
    });

    // ---------- Stutzen ----------
    const nz = sc.nozzles || [];
    const nw = n => Math.max(9, n.dn * s * 1.15), lnz = n => n.len * s;
    nz.forEach(n => {
      const a = n.ang, c = Math.cos(rad(a)), sn = Math.sin(rad(a)), x = X(n.x), w = nw(n);
      // Vorderansicht
      if (Math.abs(c) > 0.2) {                              // steht senkrecht (oben/unten): Rechteck
        const up = c > 0, y0 = Yf(R - R * c), len = lnz(n) * Math.abs(c) + (up ? 0 : 0);
        const ya = up ? y0 - len : y0, hgt = len;
        out += '<rect class="vs bgf" x="' + f1(x - w / 2) + '" y="' + f1(up ? y0 - len : y0) + '" width="' + f1(w) + '" height="' + f1(hgt) + '"/>';
        const fy = up ? y0 - len - 4 : y0 + len;
        out += '<rect class="vs bgf" x="' + f1(x - w / 2 - 5) + '" y="' + f1(fy) + '" width="' + f1(w + 10) + '" height="4"/>';
        lab += '<g><rect class="vb" x="' + f1(x - 8) + '" y="' + f1(up ? y0 - len - 28 : y0 + len + 8) + '" width="16" height="16"/><text class="vt b" x="' + f1(x) + '" y="' + f1((up ? y0 - len - 28 : y0 + len + 8) + 12) + '" text-anchor="middle">' + esc(n.id) + "</text></g>";
      } else {                                              // waagerecht (vorn/hinten): Kreis in der Vorderansicht
        const cy = Yf(R - R * c), vis = sn > 0;
        out += '<circle class="' + (vis ? "vs bgf" : "vd") + '" cx="' + f1(x) + '" cy="' + f1(cy) + '" r="' + f1(w / 2 + 4) + '"/><circle class="' + (vis ? "vs" : "vd") + '" cx="' + f1(x) + '" cy="' + f1(cy) + '" r="' + f1(w / 2) + '"/>';
        lab += '<g><rect class="vb" x="' + f1(x + w / 2 + 8) + '" y="' + f1(cy - 8) + '" width="16" height="16"/><text class="vt b" x="' + f1(x + w / 2 + 16) + '" y="' + f1(cy + 4) + '" text-anchor="middle">' + esc(n.id) + "</text></g>";
      }
    });

    // ---------- Draufsicht ----------
    if (views.includes("top")) {
      const yc = topY + R * s, ty = mm => yc + mm * s;      // y = 0 in der Mitte, nach unten = vorn
      out += '<path class="vs bgf" d="M' + f1(X(hh)) + " " + f1(yc - R * s) + " H" + f1(X(hh + L)) + " A" + f1(hx) + " " + f1(rx) + " 0 0 1 " + f1(X(hh + L)) + " " + f1(yc + R * s) + " H" + f1(X(hh)) + " A" + f1(hx) + " " + f1(rx) + " 0 0 1 " + f1(X(hh)) + " " + f1(yc - R * s) + ' Z"/>';
      out += '<line class="vc" x1="' + f1(X(-60)) + '" y1="' + f1(yc) + '" x2="' + f1(X(Lg + 60)) + '" y2="' + f1(yc) + '"/>';
      (sc.saddles || []).forEach(x => { const w = (sc.sw || 260) * s; out += '<rect class="vd" x="' + f1(X(x) - w / 2) + '" y="' + f1(yc - R * s * 0.78) + '" width="' + f1(w) + '" height="' + f1(R * s * 1.56) + '"/>'; });
      nz.forEach(n => {
        const a = n.ang, c = Math.cos(rad(a)), sn = Math.sin(rad(a)), x = X(n.x), w = nw(n);
        if (Math.abs(sn) > 0.2) {                             // vorn/hinten: Rechteck nach unten (vorn) oder oben (hinten)
          const front = sn > 0, y0 = yc + R * s * sn * (1), len = lnz(n) * Math.abs(sn);
          out += '<rect class="vs bgf" x="' + f1(x - w / 2) + '" y="' + f1(front ? y0 : y0 - len) + '" width="' + f1(w) + '" height="' + f1(len) + '"/>' +
            '<rect class="vs bgf" x="' + f1(x - w / 2 - 5) + '" y="' + f1(front ? y0 + len : y0 - len - 4) + '" width="' + f1(w + 10) + '" height="4"/>';
          lab += '<g><rect class="vb" x="' + f1(x + w / 2 + 8) + '" y="' + f1(front ? y0 + len - 8 : y0 - len - 8) + '" width="16" height="16"/><text class="vt b" x="' + f1(x + w / 2 + 16) + '" y="' + f1((front ? y0 + len - 8 : y0 - len - 8) + 12) + '" text-anchor="middle">' + esc(n.id) + "</text></g>";
        } else {                                              // oben/unten: Kreis (unten gestrichelt)
          const vis = c > 0;
          out += '<circle class="' + (vis ? "vs bgf" : "vd") + '" cx="' + f1(x) + '" cy="' + f1(yc) + '" r="' + f1(w / 2 + 4) + '"/><circle class="' + (vis ? "vs" : "vd") + '" cx="' + f1(x) + '" cy="' + f1(yc) + '" r="' + f1(w / 2) + '"/>';
          lab += '<g><rect class="vb" x="' + f1(x + w / 2 + 8) + '" y="' + f1(yc - 8) + '" width="16" height="16"/><text class="vt b" x="' + f1(x + w / 2 + 16) + '" y="' + f1(yc + 4) + '" text-anchor="middle">' + esc(n.id) + "</text></g>";
        }
      });
      lab += '<text class="vt s" x="' + f1(X(0)) + '" y="' + f1(topY - 14) + '">Draufsicht</text>';
    }
    lab += '<text class="vt s" x="' + f1(X(0)) + '" y="' + f1(oy - 134) + '">Vorderansicht</text>';

    // ---------- Seitenansicht (Ansicht von links) ----------
    if (views.includes("side")) {
      const cx = sideX, cy = oy + R * s;
      out += '<circle class="vs bgf" cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(R * s) + '"/><line class="vc" x1="' + f1(cx - R * s - 18) + '" y1="' + f1(cy) + '" x2="' + f1(cx + R * s + 18) + '" y2="' + f1(cy) + '"/><line class="vc" x1="' + f1(cx) + '" y1="' + f1(cy - R * s - 18) + '" x2="' + f1(cx) + '" y2="' + f1(cy + R * s + 18) + '"/>';
      const sadW = (sc.sw || 260) * s, base = oy + (D + (sc.hs || 160)) * s;
      out += '<polygon class="vs bgf" points="' + [[cx - sadW / 2 - 6, base], [cx + sadW / 2 + 6, base], [cx + R * s * 0.45, cy + R * s * 0.93], [cx - R * s * 0.45, cy + R * s * 0.93]].map(p => f1(p[0]) + "," + f1(p[1])).join(" ") + '"/>';
      nz.forEach(n => {
        const a = rad(n.ang), ux = Math.sin(a), uy = -Math.cos(a), w = nw(n), len = lnz(n);
        const x0 = cx + ux * R * s, y0 = cy + uy * R * s, x1 = cx + ux * (R * s + len), y1 = cy + uy * (R * s + len);
        const px = -uy, py = ux;                              // Querrichtung
        out += '<polygon class="vs bgf" points="' + [[x0 + px * w / 2, y0 + py * w / 2], [x1 + px * w / 2, y1 + py * w / 2], [x1 - px * w / 2, y1 - py * w / 2], [x0 - px * w / 2, y0 - py * w / 2]].map(p => f1(p[0]) + "," + f1(p[1])).join(" ") + '"/>' +
          '<line class="vs" style="stroke-width:3" x1="' + f1(x1 + px * (w / 2 + 5)) + '" y1="' + f1(y1 + py * (w / 2 + 5)) + '" x2="' + f1(x1 - px * (w / 2 + 5)) + '" y2="' + f1(y1 - py * (w / 2 + 5)) + '"/>';
        const lx = cx + ux * (R * s + len + 20), ly = cy + uy * (R * s + len + 20);
        lab += '<g><rect class="vb" x="' + f1(lx - 8) + '" y="' + f1(ly - 8) + '" width="16" height="16"/><text class="vt b" x="' + f1(lx) + '" y="' + f1(ly + 4) + '" text-anchor="middle">' + esc(n.id) + "</text></g>";
      });
      lab += '<text class="vt s" x="' + f1(cx - R * s) + '" y="' + f1(oy - 134) + '">Ansicht von links</text>';
    }

    // ---------- Maße ----------
    const hdim = (x1, x2, y, text, ext) => {                   // waagerechte Maßlinie mit Hilfslinien
      let g = '<line class="vm" x1="' + f1(x1) + '" y1="' + f1(y) + '" x2="' + f1(x2) + '" y2="' + f1(y) + '"/>' +
        '<polygon class="vf" points="' + f1(x1) + "," + f1(y) + " " + f1(x1 + 7) + "," + f1(y - 2.5) + " " + f1(x1 + 7) + "," + f1(y + 2.5) + '"/>' +
        '<polygon class="vf" points="' + f1(x2) + "," + f1(y) + " " + f1(x2 - 7) + "," + f1(y - 2.5) + " " + f1(x2 - 7) + "," + f1(y + 2.5) + '"/>' +
        '<text class="vt" x="' + f1((x1 + x2) / 2) + '" y="' + f1(y - 4) + '" text-anchor="middle">' + esc(text) + "</text>";
      if (ext) g += '<line class="vm" x1="' + f1(x1) + '" y1="' + f1(ext[0]) + '" x2="' + f1(x1) + '" y2="' + f1(y - 4) + '"/><line class="vm" x1="' + f1(x2) + '" y1="' + f1(ext[1]) + '" x2="' + f1(x2) + '" y2="' + f1(y - 4) + '"/>';
      return g;
    };
    const vdim = (x, y1, y2, text, ext) => {
      let g = '<line class="vm" x1="' + f1(x) + '" y1="' + f1(y1) + '" x2="' + f1(x) + '" y2="' + f1(y2) + '"/>' +
        '<polygon class="vf" points="' + f1(x) + "," + f1(y1) + " " + f1(x - 2.5) + "," + f1(y1 + 7) + " " + f1(x + 2.5) + "," + f1(y1 + 7) + '"/>' +
        '<polygon class="vf" points="' + f1(x) + "," + f1(y2) + " " + f1(x - 2.5) + "," + f1(y2 - 7) + " " + f1(x + 2.5) + "," + f1(y2 - 7) + '"/>' +
        '<text class="vt" transform="translate(' + f1(x - 5) + " " + f1((y1 + y2) / 2) + ') rotate(-90)" text-anchor="middle">' + esc(text) + "</text>";
      if (ext) g += '<line class="vm" x1="' + f1(ext[0]) + '" y1="' + f1(y1) + '" x2="' + f1(x + 4) + '" y2="' + f1(y1) + '"/><line class="vm" x1="' + f1(ext[1]) + '" y1="' + f1(y2) + '" x2="' + f1(x + 4) + '" y2="' + f1(y2) + '"/>';
      return g;
    };
    (sc.dims || []).forEach(d => {
      if (d.k === "h") dim += hdim(X(d.a), X(d.b), Yf(0) - d.off, d.text !== undefined ? d.text : String(Math.round(d.b - d.a)), [Yf(d.ea !== undefined ? d.ea : 0), Yf(d.eb !== undefined ? d.eb : 0)]);
      else if (d.k === "hb") dim += hdim(X(d.a), X(d.b), Yf(D + (sc.hs || 160)) + d.off, d.text !== undefined ? d.text : String(Math.round(d.b - d.a)), [Yf(D + (sc.hs || 160)), Yf(D + (sc.hs || 160))]);
      else if (d.k === "v") dim += vdim(X(0) - d.off, Yf(d.a), Yf(d.b), d.text !== undefined ? d.text : String(Math.round(d.b - d.a)), [X(0), X(0)]);
      else if (d.k === "ht") { const yc = topY + R * s; dim += hdim(X(d.a), X(d.b), yc + R * s + d.off, d.text !== undefined ? d.text : String(Math.round(d.b - d.a)), [yc, yc]); }
      else if (d.k === "vt") { const yc = topY + R * s; dim += vdim(X(d.x) + d.off, yc + d.a * s, yc + d.b * s, d.text !== undefined ? d.text : String(Math.round(Math.abs(d.b - d.a))), [X(d.x), X(d.x)]); }
      else if (d.k === "hs") { dim += hdim(sideX - R * s, sideX + R * s, oy + R * s - R * s - d.off, d.text, [oy, oy]); }
    });

    // ---------- Positionsnummern ----------
    (sc.callouts || []).forEach(c => {
      let px, py, tx, ty;
      if (c.v === "side") { px = sideX + c.x * s; py = oy + R * s + c.y * s; } else if (c.v === "top") { px = X(c.x); py = topY + R * s + c.y * s; } else { px = X(c.x); py = Yf(c.y); }
      tx = px + c.dx; ty = py + c.dy;
      lab += '<line class="vm" x1="' + f1(px) + '" y1="' + f1(py) + '" x2="' + f1(tx) + '" y2="' + f1(ty) + '"/><circle class="sf" cx="' + f1(px) + '" cy="' + f1(py) + '" r="2"/><text class="vt n" x="' + f1(tx + (c.dx < 0 ? -2 : 2)) + '" y="' + f1(ty + 4) + '" text-anchor="' + (c.dx < 0 ? "end" : "start") + '">' + esc(c.n) + "</text>";
    });

    let H = (views.includes("top") ? topY + D * s + 90 : oy + (D + (sc.hs || 160)) * s + 90), W = (views.includes("side") ? sideX + R * s + 80 : ox + Lg * s + 80);
    return '<svg class="ves" viewBox="0 0 ' + f1(W) + " " + f1(H) + '" style="width:' + Math.round(W) + 'px;max-width:none;display:block;margin:0 auto" role="img" aria-label="' + esc(sc.alt || "Behälterzeichnung") + '">' + out + dim + lab + "</svg>";
  }

  function nozzleTable(rows) {
    return '<div class="tw"><table><tr><th>Bez.</th><th>Funktion</th><th>DN</th><th>PN</th></tr>' + rows.map(r => "<tr><td>" + esc(r.id) + "</td><td>" + esc(r.fn) + "</td><td>" + r.dn + "</td><td>" + (r.pn || 16) + "</td></tr>").join("") + "</table></div>";
  }
  function partsList(rows) {
    return '<div class="tw"><table><tr><th>Pos.</th><th>Stück</th><th>Benennung</th><th>Norm / Maß</th><th>Werkstoff</th></tr>' + rows.map(r => "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td><td>" + esc(r[2]) + "</td><td>" + esc(r[3]) + "</td><td>" + esc(r[4]) + "</td></tr>").join("") + "</table></div>";
  }

  window.VesselDraw = { render, nozzleTable, partsList };
})();
