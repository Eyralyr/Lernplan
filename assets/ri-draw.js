// Zeichnet R&I-Fließbilder (Rohrleitungs- und Instrumentenfließbild) als SVG. Frei erfundene Anlagen im Stil der Prüfungsunterlagen.
// Symbole (vereinfacht): Behälter, Pumpe, Ventile (Absperr-, Regel-, Rückflussverhinderer, Sicherheits-), Filter, Wärmetauscher, PCE-Kreise.
// Alle Koordinaten sind Pixel im viewBox des Schemas (W x H).
(function () {
  const f1 = n => (Math.round(n * 10) / 10).toString();
  const esc = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const pts = a => a.map(p => f1(p[0]) + "," + f1(p[1])).join(" ");

  // Hilfen: Richtung als Winkel: r=0, d=90, l=180, u=270
  const ANG = { r: 0, d: 90, l: 180, u: 270 };
  const rot = (x, y, dir) => ' transform="translate(' + f1(x) + " " + f1(y) + ") rotate(" + ANG[dir || "r"] + ')"';

  function text(x, y, t, o) {
    o = o || {};
    return '<text class="rt' + (o.b ? " b" : "") + (o.s ? " s" : "") + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (o.a || "start") + '">' + esc(t) + "</text>";
  }

  function symbol(it) {
    const x = it.x, y = it.y;
    let g = "", lab = "";
    switch (it.t) {
      case "vessel": {                                            // Behälter: liegend (h) oder stehend (v)
        const w = it.w, h = it.h, r = Math.min(w, h) / 2.6;
        g += '<rect class="sy bgf" x="' + f1(x - w / 2) + '" y="' + f1(y - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + f1(r) + '"/>';
        lab = text(x, y + 4, it.tag, { a: "middle", b: true });
        if (it.sub) lab += text(x, y + 17, it.sub, { a: "middle", s: true });
        break;
      }
      case "box": {                                               // Apparat als Kasten (z. B. Elektrolyseur)
        g += '<rect class="sy bgf" x="' + f1(x - it.w / 2) + '" y="' + f1(y - it.h / 2) + '" width="' + it.w + '" height="' + it.h + '" rx="3"/>';
        lab = text(x, y + 4, it.tag, { a: "middle", b: true });
        if (it.sub) lab += text(x, y + 17, it.sub, { a: "middle", s: true });
        break;
      }
      case "pump": {                                              // Kreis mit Dreieck in Förderrichtung
        const d = it.dir || "r";
        g += '<circle class="sy bgf" cx="' + f1(x) + '" cy="' + f1(y) + '" r="15"/><polygon class="sf"' + rot(x, y, d) + ' points="-7,-8 9,0 -7,8"/>';
        lab = text(x, y + 30, it.tag, { a: "middle", b: true });
        break;
      }
      case "valve": {                                             // Absperrarmatur (zwei Dreiecke)
        const o = it.o || "h", u = 10, w = 8;
        g += o === "h"
          ? '<polygon class="sy bgf" points="' + pts([[x - u, y - w], [x, y], [x - u, y + w]]) + '"/><polygon class="sy bgf" points="' + pts([[x + u, y - w], [x, y], [x + u, y + w]]) + '"/>'
          : '<polygon class="sy bgf" points="' + pts([[x - w, y - u], [x, y], [x + w, y - u]]) + '"/><polygon class="sy bgf" points="' + pts([[x - w, y + u], [x, y], [x + w, y + u]]) + '"/>';
        lab = it.tag ? text(it.tx !== undefined ? it.tx : x, it.ty !== undefined ? it.ty : (o === "h" ? y + 24 : y + 4), it.tag, { a: o === "h" ? "middle" : "start", b: true }) : "";
        break;
      }
      case "check": {                                             // Rückflussverhinderer: Dreieck mit Anschlag in Durchlassrichtung (vereinfacht)
        const d = it.dir || "r";
        g += '<polygon class="sy bgf"' + rot(x, y, d) + ' points="-9,-8 9,0 -9,8"/><line class="sy"' + rot(x, y, d) + ' x1="9" y1="-9" x2="9" y2="9"/>';
        lab = it.tag ? text(it.tx !== undefined ? it.tx : x, it.ty !== undefined ? it.ty : y + 24, it.tag, { a: "middle", b: true }) : "";
        break;
      }
      case "regel": {                                             // Regelarmatur: Ventil mit Stellantrieb (h = Antrieb oben, v = Antrieb rechts)
        const o = it.o || "h";
        if (o === "h") {
          g += '<polygon class="sy bgf" points="' + pts([[x - 10, y - 8], [x, y], [x - 10, y + 8]]) + '"/><polygon class="sy bgf" points="' + pts([[x + 10, y - 8], [x, y], [x + 10, y + 8]]) + '"/>' +
            '<line class="sy" x1="' + f1(x) + '" y1="' + f1(y) + '" x2="' + f1(x) + '" y2="' + f1(y - 20) + '"/><path class="sy bgf" d="M' + f1(x - 9) + " " + f1(y - 20) + " A9 9 0 0 1 " + f1(x + 9) + " " + f1(y - 20) + ' Z"/>';
          lab = it.tag ? text(it.tx !== undefined ? it.tx : x + 14, it.ty !== undefined ? it.ty : y - 24, it.tag, { b: true }) : "";
        } else {
          g += '<polygon class="sy bgf" points="' + pts([[x - 8, y - 10], [x, y], [x + 8, y - 10]]) + '"/><polygon class="sy bgf" points="' + pts([[x - 8, y + 10], [x, y], [x + 8, y + 10]]) + '"/>' +
            '<line class="sy" x1="' + f1(x) + '" y1="' + f1(y) + '" x2="' + f1(x + 20) + '" y2="' + f1(y) + '"/><path class="sy bgf" d="M' + f1(x + 20) + " " + f1(y - 9) + " A9 9 0 0 1 " + f1(x + 20) + " " + f1(y + 9) + ' Z"/>';
          lab = it.tag ? text(it.tx !== undefined ? it.tx : x - 14, it.ty !== undefined ? it.ty : y + 4, it.tag, { b: true, a: "end" }) : "";
        }
        break;
      }
      case "safety": {                                            // Sicherheitsventil (vereinfacht): Durchgangssymbol mit Zickzack = Feder
        g += '<polygon class="sy bgf" points="' + pts([[x - 8, y + 10], [x, y], [x + 8, y + 10]]) + '"/><polygon class="sy bgf" points="' + pts([[x - 8, y - 10], [x, y], [x + 8, y - 10]]) + '"/>' +
          '<polyline class="sy" points="' + pts([[x, y - 10], [x - 4, y - 14], [x + 4, y - 18], [x - 4, y - 22], [x + 4, y - 26]]) + '"/>';
        lab = it.tag ? text(x + 12, y + 4, it.tag, { b: true }) : "";
        break;
      }
      case "filter": {
        g += '<rect class="sy bgf" x="' + f1(x - 14) + '" y="' + f1(y - 9) + '" width="28" height="18"/><line class="sy" x1="' + f1(x - 14) + '" y1="' + f1(y + 9) + '" x2="' + f1(x + 14) + '" y2="' + f1(y - 9) + '"/>';
        lab = text(x, y + 26, it.tag, { a: "middle", b: true });
        break;
      }
      case "hx": {                                                // Wärmetauscher: Kasten mit Zickzack
        const w = it.w || 70, h = it.h || 26;
        g += '<rect class="sy bgf" x="' + f1(x - w / 2) + '" y="' + f1(y - h / 2) + '" width="' + w + '" height="' + h + '"/>' +
          '<polyline class="sy" points="' + pts([[x - w / 2, y], [x - w / 2 + 10, y], [x - w / 2 + 16, y - 8], [x - w / 2 + 28, y + 8], [x - w / 2 + 40, y - 8], [x - w / 2 + 52, y + 8], [x - w / 2 + 58, y], [x + w / 2, y]]) + '"/>';
        lab = text(x, y + h / 2 + 15, it.tag, { a: "middle", b: true });
        break;
      }
      case "pce": {                                               // PCE-Stelle: Kreis mit Funktion oben, Nummer unten
        const r = 13;
        if (it.src) g += '<line class="sg" x1="' + f1(x) + '" y1="' + f1(y) + '" x2="' + f1(it.src[0]) + '" y2="' + f1(it.src[1]) + '"/><circle class="sf" cx="' + f1(it.src[0]) + '" cy="' + f1(it.src[1]) + '" r="2.5"/>';
        g += '<circle class="sy bgf" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + r + '"/><line class="sy" x1="' + f1(x - r) + '" y1="' + f1(y) + '" x2="' + f1(x + r) + '" y2="' + f1(y) + '"/>';
        lab = text(x, y - 3, it.fn, { a: "middle", b: true, s: true }) + text(x, y + 10, it.nr, { a: "middle", s: true });
        if (it.al) lab += text(x + r + 3, y - 12, it.al, { b: true, s: true });
        break;
      }
      case "label": return text(x, y, it.text, { a: it.a, b: it.b, s: it.s });
      case "arrow": {                                             // Strömungspfeil auf der Leitung
        return '<polygon class="sf"' + rot(x, y, it.dir || "r") + ' points="-5,-4 5,0 -5,4"/>';
      }
      case "ext": {                                               // Anschluss nach außen mit Pfeil und Text
        const d = it.dir || "r";
        g += '<polygon class="sy bgf"' + rot(x, y, d) + ' points="-12,-8 4,-8 4,-12 14,0 4,12 4,8 -12,8"/>';
        lab = it.tag ? text(it.tx !== undefined ? it.tx : x, it.ty !== undefined ? it.ty : y - 16, it.tag, { a: it.ta || "middle", s: true }) : "";
        break;
      }
    }
    return "<g>" + g + lab + "</g>";
  }

  function render(sc) {
    let out = "";
    (sc.pipes || []).forEach(p => {
      out += '<polyline class="' + (p.sig ? "sg" : "pp") + (p.thick ? " thick" : "") + '" points="' + pts(p.pts) + '"/>';
      if (p.sig && p.pts.length > 1) {                              // Pfeilspitze am Ende der Signalleitung (zeigt zur beeinflussten Armatur oder Pumpe)
        const a = p.pts[p.pts.length - 2], b = p.pts[p.pts.length - 1], ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
        out += '<polygon class="sf" transform="translate(' + f1(b[0]) + " " + f1(b[1]) + ") rotate(" + f1(ang) + ')" points="0,0 -7,-3 -7,3"/>';
      }
      if (p.tag) out += text(p.tp[0], p.tp[1], p.tag, { a: p.ta || "start", s: true });
    });
    (sc.dots || []).forEach(d => { out += '<circle class="sf" cx="' + f1(d[0]) + '" cy="' + f1(d[1]) + '" r="3"/>'; });
    (sc.sym || []).forEach(it => { out += symbol(it); });
    return '<svg class="ri" viewBox="0 0 ' + sc.W + " " + sc.H + '" style="width:' + sc.W + 'px;max-width:none;display:block;margin:0 auto" role="img" aria-label="' + esc(sc.alt || "Fließbild") + '">' + out + "</svg>";
  }

  // Leitungsliste (Medientabelle)
  function pipeTable(rows) {
    return '<div class="tw"><table><tr><th>Leitung</th><th>Medium</th></tr>' + rows.map(r => "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td></tr>").join("") + "</table></div>";
  }

  window.RIDraw = { render, pipeTable };
})();
