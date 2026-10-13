// Vier Rohrleitungs-Isometrien (frei erfunden) nach DIN ISO 6412-2 mit Fragen zum Lesen.
// Alle Maße in mm. Koordinaten x, y, z wie in der Norm (Bild 23): Z senkrecht, X nach rechts oben, Y nach links oben.
(function () {
  const Q = (t, q, right, wrongs, why) => ({ t, q, o: [right, ...wrongs], why });
  const mm = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " mm";
  // Antwortliste mit Zahl als richtiger Antwort und passenden falschen Zahlen (alle verschieden, nie negativ)
  function numOpts(ans, deltas, fmt) {
    const w = []; deltas.forEach(d => { [ans + d, ans - d].forEach(v => { if (v >= 0 && v !== ans && !w.includes(v)) w.push(v); }); });
    return [fmt(ans), ...w.slice(0, 4).map(fmt)];
  }
  const cnt = ans => numOpts(ans, [1, 2, 3], String);
  const AX = {
    "+x": "In +X-Richtung (im Bild nach rechts oben)", "-x": "In −X-Richtung (im Bild nach links unten)",
    "+y": "In +Y-Richtung (im Bild nach links oben)", "-y": "In −Y-Richtung (im Bild nach rechts unten)",
    "+z": "In +Z-Richtung (senkrecht nach oben)", "-z": "In −Z-Richtung (senkrecht nach unten)"
  };
  const axOpts = key => [AX[key], ...Object.keys(AX).filter(k => k !== key).sort(() => Math.random() - 0.5).slice(0, 4).map(k => AX[k])];

  // Text in der Sprache der Prüfung: rechts/links = X, hinten/vorn = Y, oben/unten = Z
  const WORD = { x: ["rechts", "links"], y: ["hinten", "vorn"], z: ["oben", "unten"] };
  const meter = n => (Math.round(n / 100) / 10).toString().replace(".", ",") + " m";
  function stepText(v) {
    const parts = [];
    ["x", "y", "z"].forEach((a, i) => { if (v[i]) parts.push(meter(Math.abs(v[i])) + " nach " + WORD[a][v[i] > 0 ? 0 : 1]); });
    return parts.length === 1 ? parts[0] : "über Eck: " + parts.join(" und ");
  }
  const routeText = steps => steps.map(stepText).join(", dann ");
  function routeWrongs(steps) {
    const out = new Set(), correct = routeText(steps);
    const tries = [
      s => s.map((v, i) => i === 1 ? [v[0], -v[1], v[2]] : v),                                      // vorn und hinten vertauscht
      s => s.map((v, i) => i === 0 ? [v[1], v[0], v[2]] : v),                                       // erste Richtung auf der falschen Achse
      s => { const c = s.map(v => v.slice()); [c[0], c[c.length - 1]] = [c[c.length - 1], c[0]]; return c; }, // Reihenfolge getauscht
      s => s.map((v, i) => i === 2 ? v.map(n => Math.round(n * 2 / 3 / 100) * 100) : v),            // ein Maß zu kurz
      s => s.map((v, i) => i === 0 ? v.map(n => -n) : v),                                           // erste Richtung umgekehrt
      s => s.map((v, i) => i === s.length - 1 ? v.map(n => -n) : v)                                 // letzte Richtung umgekehrt
    ];
    tries.forEach(t => { const txt = routeText(t(steps)); if (txt !== correct) out.add(txt); });
    // Reserve: einzelne Maße um 500 mm ändern, bis vier falsche Beschreibungen da sind
    for (let i = 0; out.size < 4 && i < steps.length * 2; i++) {
      const k = i % steps.length, d = i < steps.length ? 500 : -500;
      const c = steps.map((v, j) => j === k ? v.map(n => n === 0 ? 0 : n + Math.sign(n) * d) : v);
      const txt = routeText(c); if (txt !== correct) out.add(txt);
    }
    return [...out].slice(0, 4);
  }

  window.SCHEMES = [
    // ---------------------------------------------------------------- 1
    {
      title: "Schema 1 · Pumpenleitung", level: "Einstieg", alt: "Isometrie einer Pumpenleitung vom Behälter B1 zum Verbraucher",
      desc: "Eine Pumpenleitung vom Behälter B1 zu einem Verbraucher. Alle Längen sind eingetragen. Die Pfeile zeigen die Strömungsrichtung.",
      points: { 1: [0, 0, 0], 2: [0, 0, 1500], 3: [2000, 0, 1500], 4: [2000, 1500, 1500], 5: [2000, 1500, 3000], 6: [3500, 1500, 3000] },
      lines: [{ pts: ["1", "2", "3", "4", "5", "6"] }],
      items: [
        { t: "tank", at: "1", label: "B1" }, { t: "flange", at: "1", toward: "2" },
        { t: "valve", a: "1", b: "2", f: 0.5, kind: "abs", label: "V1" },
        { t: "pump", a: "2", b: "3", f: 0.5, label: "P1" },
        { t: "valve", a: "3", b: "4", f: 0.55, kind: "rueck", label: "V2" },
        { t: "reducer", a: "4", b: "5", f: 0.5, text: "DN 80 / DN 50", bigFirst: true },
        { t: "flange", at: "6", toward: "5" }, { t: "box", at: "6", label: "Verbraucher", side: "right" },
        { t: "dim", a: "1", b: "2", off: 34 }, { t: "dim", a: "2", b: "3", off: -46 }, { t: "dim", a: "3", b: "4", off: -36 },
        { t: "dim", a: "4", b: "5", off: -34 }, { t: "dim", a: "5", b: "6", off: -30 },
        { t: "flow", a: "1", b: "2", f: 0.82 }, { t: "flow", a: "3", b: "4", f: 0.18 }, { t: "flow", a: "5", b: "6", f: 0.5 }
      ],
      legend: ["axes", "flansch", "punkt", "abs", "rueck", "pumpe", "red", "flow", "behaelter", "dim", "pos"],
      textRoute: { steps: [[0, 0, 1500], [2000, 0, 0], [0, 1500, 0], [0, 0, 1500]] },
      questions(st) {
        const T = "Schema 1";
        const nv = st.valves.abs + st.valves.rueck + st.valves.regel;
        const tr = this.textRoute.steps;
        return [
          Q(T, "Wie viele Ventile (ohne Pumpe) sind in der Leitung eingebaut?", cnt(nv)[0], cnt(nv).slice(1),
            "Es gibt das Absperrventil V1 und den Rückflussverhinderer V2. Die Pumpe P1 ist kein Ventil."),
          Q(T, "Welche Armatur sitzt in Strömungsrichtung direkt hinter der Pumpe P1?",
            "Der Rückflussverhinderer V2", ["Das Absperrventil V1", "Das Reduzierstück", "Die Pumpe P1 selbst", "Der Verbraucher"],
            "Die Strömung läuft vom Behälter B1 über V1 und die Pumpe P1. Danach sitzt V2. Der Rückflussverhinderer (Rückschlagventil) sorgt dafür, dass beim Stillstand nichts zurückläuft."),
          Q(T, "Wie lang ist die gesamte Rohrleitung von Punkt 1 bis Punkt 6 (Summe der Maße)?",
            ...(o => [o[0], o.slice(1), "Summe der fünf Maße: 1500 + 2000 + 1500 + 1500 + 1500 = 8000 mm."])(numOpts(st.length, [500, 1000, 1500], mm))),
          Q(T, "In welche Richtung verläuft der Abschnitt von Punkt 3 nach Punkt 4?",
            ...(o => [o[0], o.slice(1), "Bei Punkt 3 ist y = 0, bei Punkt 4 ist y = 1500. Das Rohr verläuft also in +Y-Richtung. Im Bild geht Y nach links oben."])(axOpts("+y"))),
          Q(T, "Welche Nennweite hat die Leitung hinter dem Reduzierstück (in Strömungsrichtung)?",
            "DN 50", ["DN 80", "DN 100", "DN 65", "DN 40"],
            "Über dem Reduzierstück steht DN 80 / DN 50. Die Strömung läuft von der breiten Seite (DN 80) zur schmalen (DN 50). Hinter dem Reduzierstück hat die Leitung DN 50."),
          Q(T, "Wie hoch liegt Punkt 6 über Punkt 1?",
            ...(o => [o[0], o.slice(1), "Die senkrechten Abschnitte sind 1500 mm (Punkt 1 bis 2) und 1500 mm (Punkt 4 bis 5). Zusammen sind es 3000 mm. Die waagerechten Abschnitte ändern die Höhe nicht."])(numOpts(3000, [500, 1500, 2000], mm))),
          Q(T, "Wie viele Bögen (Richtungswechsel) hat die Leitung?",
            ...(o => [o[0], o.slice(1), "Knickstellen sind Punkt 2, 3, 4 und 5. Punkt 1 und Punkt 6 sind die Enden."])(cnt(st.bends))),
          Q(T, "Welche Beschreibung passt zur Leitung von Punkt 1 bis Punkt 5?",
            routeText(tr), routeWrongs(tr),
            "Ab Punkt 1: 1,5 m senkrecht nach oben, dann 2 m nach rechts (+X), dann 1,5 m nach hinten (+Y, im Bild links oben), dann wieder 1,5 m nach oben.")
        ];
      }
    },

    // ---------------------------------------------------------------- 2
    {
      title: "Schema 2 · Kühlkreis mit Abzweig", level: "Mittel", alt: "Isometrie einer Kühlleitung mit T-Abzweig zum Wärmetauscher WT1",
      desc: "Eine Hauptleitung mit Abzweig (T-Stück) zum Wärmetauscher WT1. Die Höhenangabe steht an Punkt 1. Die Pfeile zeigen die Strömungsrichtung.",
      points: { 1: [0, 0, 0], 2: [2000, 0, 0], 3: [4000, 0, 0], 4: [2000, 0, 1800], 5: [2000, 1500, 1800], 6: [2000, 1500, 3000] },
      lines: [{ pts: ["1", "2", "3"] }, { pts: ["2", "4", "5", "6"] }],
      items: [
        { t: "flange", at: "1", toward: "2" }, { t: "flange", at: "3", toward: "2" }, { t: "flange", at: "6", toward: "5" },
        { t: "valve", a: "1", b: "2", f: 0.5, kind: "abs", label: "V1" },
        { t: "valve", a: "2", b: "3", f: 0.5, kind: "abs", label: "V2" },
        { t: "valve", a: "2", b: "4", f: 0.5, kind: "abs", label: "V3" },
        { t: "reducer", a: "4", b: "5", f: 0.5, text: "DN 65 / DN 40", bigFirst: true },
        { t: "support", a: "4", b: "5", f: 0.85, label: "St" },
        { t: "box", at: "6", label: "WT1", side: "right" },
        { t: "dim", a: "1", b: "2", off: -36 }, { t: "dim", a: "2", b: "3", off: -36 }, { t: "dim", a: "2", b: "4", off: -34 },
        { t: "dim", a: "4", b: "5", off: -36 }, { t: "dim", a: "5", b: "6", off: -34 },
        { t: "height", at: "1", text: "+450", side: "l", dy: 0 },
        { t: "flow", a: "1", b: "2", f: 0.82 }, { t: "flow", a: "2", b: "3", f: 0.75 }, { t: "flow", a: "2", b: "4", f: 0.8 }, { t: "flow", a: "5", b: "6", f: 0.5 }
      ],
      legend: ["axes", "flansch", "punkt", "abs", "red", "stuetze", "flow", "behaelter", "dim", "hoehe", "pos"],
      textRoute: { steps: [[0, 0, 1800], [0, 1500, 0], [0, 0, 1200]] },
      questions(st) {
        const T = "Schema 2";
        const nv = st.valves.abs + st.valves.rueck + st.valves.regel;
        const tr = this.textRoute.steps;
        return [
          Q(T, "Wie viele Ventile sind in diesem Schema eingebaut?", cnt(nv)[0], cnt(nv).slice(1),
            "V1 und V2 liegen in der Hauptleitung, V3 im Abzweig. Zusammen sind es 3."),
          Q(T, "Welches Ventil muss man schließen, um nur den Abzweig zum Wärmetauscher WT1 abzusperren, ohne die Hauptleitung zu stoppen?",
            "Das Ventil V3", ["Das Ventil V1", "Das Ventil V2", "V1 und V2 gleichzeitig", "Das Reduzierstück"],
            "V3 sitzt im Abzweig zwischen Punkt 2 und Punkt 4. V1 und V2 liegen in der Hauptleitung und würden den Hauptstrom unterbrechen."),
          Q(T, "Wie lang ist der Abzweig von Punkt 2 bis Punkt 6 insgesamt?",
            ...(o => [o[0], o.slice(1), "1800 mm (Punkt 2 bis 4) + 1500 mm (Punkt 4 bis 5) + 1200 mm (Punkt 5 bis 6) = 4500 mm."])(numOpts(4500, [500, 1000, 1800], mm))),
          Q(T, "Wie lang sind alle Rohrstücke zusammen (Hauptleitung und Abzweig)?",
            ...(o => [o[0], o.slice(1), "Hauptleitung: 2000 + 2000 = 4000 mm. Abzweig: 1800 + 1500 + 1200 = 4500 mm. Zusammen 8500 mm."])(numOpts(st.length, [500, 1000, 1800], mm))),
          Q(T, "An Punkt 1 steht die Höhenangabe +450. In welcher Höhe liegt dann Punkt 6?",
            ...(o => [o[0], o.slice(1), "Punkt 6 liegt 3000 mm über Punkt 1 (1800 mm + 1200 mm). Mit der Höhe +450 von Punkt 1 ergibt das 450 + 3000 = 3450 mm über dem Bezug."])(numOpts(3450, [450, 1000, 1500], mm))),
          Q(T, "Zähle die Schweißpunkte rund um das T-Stück bei Punkt 2. Wie viele sind es?",
            "3", ["1", "2", "4", "6"],
            "Ein T-Stück hat drei Anschlüsse. An jedem sitzt eine Schweißnaht, also drei Punkte. Ein Bogen hat dagegen zwei Anschlüsse und zwei Punkte."),
          Q(T, "Welche Nennweite hat der Abzweig hinter dem Reduzierstück (in Strömungsrichtung zum Wärmetauscher)?",
            "DN 40", ["DN 65", "DN 50", "DN 100", "DN 25"],
            "Über dem Kegel stehen die Nennweiten: DN 65 auf der breiten Seite, DN 40 auf der schmalen. Die Strömung läuft zum Wärmetauscher WT1, dort hat die Leitung DN 40."),
          Q(T, "Welche Beschreibung passt zum Abzweig von Punkt 2 bis Punkt 6?",
            routeText(tr), routeWrongs(tr),
            "Ab Punkt 2: 1,8 m senkrecht nach oben, 1,5 m nach hinten (+Y, im Bild links oben), dann 1,2 m nach oben.")
        ];
      }
    },

    // ---------------------------------------------------------------- 3
    {
      title: "Schema 3 · Gefälle und Hilfsebene", level: "Anspruchsvoll", alt: "Isometrie einer Ablaufleitung mit Gefälle und schräg verlaufendem Abschnitt in einer Hilfsebene",
      desc: "Eine Ablaufleitung mit Gefälle. Ein Abschnitt verläuft waagerecht über Eck, in keiner Achsrichtung. Dafür ist die schraffierte Hilfsebene mit den beiden Teilmaßen gezeichnet. Die Maße gelten für die Zeichnung, das Gefälle von 2 % wird nicht mitgezeichnet.",
      points: { 1: [0, 0, 3200], 2: [3000, 0, 3200], 3: [3000, 0, 1200], 4: [4500, -1500, 1200], 5: [4500, -1500, 0], c: [4500, 0, 1200] },
      hidden: ["c"],
      lines: [{ pts: ["1", "2", "3", "4", "5"] }],
      items: [
        { t: "aux", a: "3", b: "4", corner: [4500, 0, 1200] },
        { t: "tank", at: "1", label: "B1" }, { t: "flange", at: "1", toward: "2" },
        { t: "slope", a: "1", b: "2", f: 0.5, text: "2 %" },
        { t: "support", a: "1", b: "2", f: 0.8, label: "St1" },
        { t: "valve", a: "2", b: "3", f: 0.5, kind: "abs", label: "V1" },
        { t: "support", a: "3", b: "4", f: 0.5, label: "St2" },
        { t: "flange", at: "5", toward: "4" },
        { t: "dim", a: "1", b: "2", off: 36 }, { t: "dim", a: "2", b: "3", off: -34 },
        { t: "dim", a: "3", b: "c", off: -30, text: "1500" }, { t: "dim", a: "c", b: "4", off: -30, text: "1500" },
        { t: "dim", a: "4", b: "5", off: 34 },
        { t: "height", at: "1", text: "+3200", side: "r", dy: 18 }, { t: "height", at: "3", text: "+1200", side: "l", dy: 0 }, { t: "height", at: "5", text: "±0", side: "l", dy: 0 },
        { t: "flow", a: "1", b: "2", f: 0.3 }, { t: "flow", a: "3", b: "4", f: 0.78 }
      ],
      legend: ["axes", "flansch", "punkt", "abs", "stuetze", "flow", "behaelter", "dim", "hoehe", "neig", "aux", "pos"],
      textRoute: { steps: [[3000, 0, 0], [0, 0, -2000], [1500, -1500, 0]] },
      questions(st) {
        const T = "Schema 3";
        const diag = Math.round(Math.hypot(1500, 1500));
        const tr = this.textRoute.steps;
        return [
          Q(T, "Wie lang ist der Abschnitt zwischen Punkt 3 und Punkt 4 (über Eck, ca.)?",
            ...(o => [o[0], o.slice(1), "Die beiden Katheten sind je 1500 mm lang (siehe Hilfsebene). Pythagoras: √(1500² + 1500²) = √4 500 000 ≈ 2121 mm. Das schräge Stück ist die lange Seite des schraffierten Dreiecks."])(numOpts(diag, [379, 621, 1000], mm))),
          Q(T, "Die Leitung zwischen Punkt 1 und Punkt 2 hat 2 % Gefälle. Das heißt 2 mm auf 100 mm Länge. Um wie viel fällt sie auf den 3000 mm?",
            ...(o => [o[0], o.slice(1), "2 % = 2 mm je 100 mm = 20 mm je Meter. Auf 3000 mm sind das 3000 · 0,02 = 60 mm. Im Bild bleibt die Leitung trotzdem waagerecht, nur das Dreieck zeigt das Gefälle (Norm 7.7)."])(numOpts(60, [6, 20, 30], n => n + " mm"))),
          Q(T, "Welches Ende der Leitung zwischen Punkt 1 und Punkt 2 liegt tiefer?",
            "Punkt 2", ["Punkt 1", "Beide gleich hoch", "Das hängt von der Stütze St1 ab", "Das kann man nicht erkennen"],
            "Das Neigungsdreieck hat eine Spitze. Sie zeigt zum tieferen Ende, hier zu Punkt 2. Dort fließt das Wasser hin."),
          Q(T, "Wofür dient das schraffierte Dreieck zwischen Punkt 3 und Punkt 4?",
            "Es ist eine Hilfsebene, die zeigt, dass das Rohr in keiner Achsrichtung verläuft", ["Es kennzeichnet einen Schweißbereich", "Es zeigt eine Isolierung", "Es ist ein Schnitt durch das Rohr", "Es markiert eine Rohrstütze"],
            "Ein Rohr, das nicht parallel zu einer Achse verläuft, wird mit einer Hilfsebene (schraffiertes Dreieck) dargestellt. Die Katheten liegen parallel zu den Achsen und lassen sich bemaßen. Das kleine Quadrat markiert den rechten Winkel."),
          Q(T, "Wie lang sind alle Rohrstücke zusammen (Summe aller Abschnitte, ca.)?",
            ...(o => [o[0], o.slice(1), "3000 + 2000 + 2121 + 1200 = 8321 mm. Der schräge Abschnitt ist 2121 mm lang (Pythagoras)."])(numOpts(st.length, [321, 1000, 2000], mm))),
          Q(T, "Wie viel mm liegt Punkt 5 tiefer als Punkt 3 (die Höhen stehen im Bild)?",
            ...(o => [o[0], o.slice(1), "Punkt 3 liegt auf +1200, Punkt 5 auf ±0. Der Unterschied ist 1200 mm."])(numOpts(1200, [200, 1000, 2000], mm))),
          Q(T, "Wie viele Rohrstützen sind eingezeichnet?",
            ...(o => [o[0], o.slice(1), "St1 stützt die lange Leitung mit Gefälle, St2 den schrägen Abschnitt."])(cnt(st.supports))),
          Q(T, "Welche Beschreibung passt zur Leitung von Punkt 1 bis Punkt 4?",
            routeText(tr), routeWrongs(tr),
            "Ab Punkt 1: 3 m nach rechts (+X), 2 m nach unten, dann über Eck: 1,5 m nach rechts (+X) und 1,5 m nach vorn (−Y, im Bild nach rechts unten). Das ist der Abschnitt in der Hilfsebene.")
        ];
      }
    },

    // ---------------------------------------------------------------- 4
    {
      title: "Schema 4 · Anlage mit Kreuzung", level: "Prüfungsniveau", alt: "Isometrie einer Leitung zwischen zwei Behältern mit Pumpe, Rückflussverhinderer, Reduzierstück, Baustellenschweißnaht und einer kreuzenden Zusatzleitung",
      desc: "Eine Hauptleitung von Behälter B1 zu Behälter B2 mit Pumpe, Ventilen und Reduzierstück. Eine zweite Leitung (Punkt 7 bis 8) kreuzt sie. Die Maße stehen in der Koordinatentabelle (x, y, z in mm).",
      points: { 1: [0, 0, 500], 2: [0, 0, 2000], 3: [3000, 0, 2000], 4: [3000, 2500, 2000], 5: [5000, 2500, 2000], 6: [5000, 2500, 500], 7: [1000, -2000, 2500], 8: [1000, 1000, 2500] },
      lines: [{ pts: ["1", "2", "3", "4", "5", "6"] }, { pts: ["7", "8"], halo: true }],
      items: [
        { t: "tank", at: "1", label: "B1" }, { t: "tank", at: "6", label: "B2", side: "right" },
        { t: "flange", at: "1", toward: "2" }, { t: "flange", at: "6", toward: "5" },
        { t: "valve", a: "2", b: "3", f: 0.17, kind: "abs", label: "V1" },
        { t: "pump", a: "2", b: "3", f: 0.84, label: "P1", lo: [-12, 40] },
        { t: "valve", a: "3", b: "4", f: 0.5, kind: "rueck", label: "V2" },
        { t: "reducer", a: "4", b: "5", f: 0.3, text: "DN 100 / DN 65", bigFirst: true, lo: [14, 38] },
        { t: "support", a: "4", b: "5", f: 0.78, label: "St" },
        { t: "weld", a: "5", b: "6", f: 0.55, site: true },
        { t: "flange", at: "7", toward: "8" }, { t: "flange", at: "8", toward: "7" },
        { t: "valve", a: "7", b: "8", f: 0.18, kind: "abs", label: "V3" },
        { t: "flow", a: "7", b: "8", f: 0.4 }, { t: "flow", a: "1", b: "2", f: 0.8 }, { t: "flow", a: "4", b: "5", f: 0.55 }
      ],
      table: true,
      legend: ["axes", "flansch", "punkt", "baust", "abs", "rueck", "pumpe", "red", "stuetze", "kreuz", "flow", "behaelter", "pos"],
      textRoute: { steps: [[0, 0, 1500], [3000, 0, 0], [0, 2500, 0], [2000, 0, 0]] },
      questions(st) {
        const T = "Schema 4";
        const lenA = 1500 + 3000 + 2500 + 2000 + 1500;
        const nv = st.valves.abs + st.valves.rueck + st.valves.regel;
        const tr = this.textRoute.steps;
        return [
          Q(T, "Wie viele Ventile (ohne die Pumpe) sind in Schema 4 eingebaut?", cnt(nv)[0], cnt(nv).slice(1),
            "V1 und V3 sind Absperrventile, V2 ist ein Rückflussverhinderer. Zusammen drei Ventile. Die Pumpe P1 zählt nicht dazu."),
          Q(T, "An der Kreuzung hat eine der beiden Leitungen eine Lücke. Welche Leitung läuft hinten vorbei?",
            "Die Hauptleitung von Punkt 1 bis Punkt 6", ["Die Zusatzleitung von Punkt 7 bis Punkt 8", "Beide Leitungen", "Keine, die Leitungen sind verbunden", "Das hängt von der Strömungsrichtung ab"],
            "Die Linie mit der Lücke läuft hinter der durchgehenden vorbei. Die Zusatzleitung 7–8 liegt höher (z = 2500 gegenüber 2000) und wird deshalb durchgehend gezeichnet. Die beiden Leitungen berühren sich nicht."),
          Q(T, "In der Koordinatentabelle unterscheiden sich Punkt 3 und Punkt 4 in nur einer Spalte. Wie lang ist der Abschnitt dazwischen?",
            ...(o => [o[0], o.slice(1), "Punkt 3 hat y = 0, Punkt 4 hat y = 2500. x und z sind gleich. Der Abschnitt ist 2500 − 0 = 2500 mm lang."])(numOpts(2500, [500, 1000, 1500], mm))),
          Q(T, "Wie lang ist die Hauptleitung von Punkt 1 bis Punkt 6 insgesamt?",
            ...(o => [o[0], o.slice(1), "Die Abschnitte: 1 bis 2 = 1500 mm, 2 bis 3 = 3000 mm, 3 bis 4 = 2500 mm, 4 bis 5 = 2000 mm, 5 bis 6 = 1500 mm. Zusammen 10 500 mm. (Die Zusatzleitung 7–8 ist nicht dabei.)"])(numOpts(lenA, [500, 1000, 2000], mm))),
          Q(T, "Was bedeutet der Punkt mit Fähnchen auf dem Abschnitt von Punkt 5 bis Punkt 6?",
            "Eine Schweißnaht, die auf der Baustelle ausgeführt wird", ["Eine Schweißnaht, die in der Werkstatt ausgeführt wird", "Eine Rohrstütze", "Ein Messpunkt für den Druck", "Eine Verschraubung"],
            "Ein ausgefüllter Punkt ist eine Schweißnaht. Das Fähnchen daran bedeutet, dass die Naht erst auf der Baustelle geschweißt wird (Norm: Bild 19)."),
          Q(T, "Wie viel mm liegt Punkt 6 (Behälter B2) tiefer als Punkt 5? Entnimm die Höhen der Koordinatentabelle.",
            ...(o => [o[0], o.slice(1), "z bei Punkt 5 = 2000, z bei Punkt 6 = 500. Der Unterschied ist 2000 − 500 = 1500 mm."])(numOpts(1500, [500, 1000, 2000], mm))),
          Q(T, "Welche Nennweite hat die Hauptleitung hinter dem Reduzierstück (in Strömungsrichtung)?",
            "DN 65", ["DN 100", "DN 80", "DN 50", "DN 40"],
            "Das Reduzierstück hat die Nennweiten DN 100 / DN 65 über sich. Die Strömung läuft von der breiten Seite zur schmalen. Hinter dem Reduzierstück geht es mit DN 65 weiter bis zu Behälter B2."),
          Q(T, "Welche Beschreibung passt zur Hauptleitung von Punkt 1 bis Punkt 5?",
            routeText(tr), routeWrongs(tr),
            "Ab Punkt 1: 1,5 m nach oben, 3 m nach rechts (+X), 2,5 m nach hinten (+Y, im Bild links oben), dann 2 m nach rechts. In der Koordinatentabelle steigt x von 0 auf 3000, y von 0 auf 2500 und danach x auf 5000.")
        ];
      }
    }
  ];
})();
