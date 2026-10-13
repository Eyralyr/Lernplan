// Block 2: Kühlwasserkreislauf (frei erfunden). Fließbild, Behälterzeichnung und Fragen.
(function () {
  window.ANLAGE_B2 = {
    title: "Block 2 · Kühlwasserkreislauf", level: "Mittel",
    desc: "Ein Kühlwasserkreislauf mit zwei Pumpen (eine läuft, eine ist Reserve), Filter, Wärmetauscher und Ausgleichsbehälter. Lies zuerst die Beschreibung und die Kenndaten, dann das Fließbild, dann die Behälterzeichnung.",
    text: "Die Pumpe PL01 fördert Kühlwasser aus dem Ausgleichsbehälter BE01 über den Filter FL01 zum Wärmetauscher WT01 und weiter zum Verbraucher. Die Pumpe PL02 ist die Reservepumpe. Das Wasser fließt über die Rücklaufleitung zurück in den Behälter. Der Wärmetauscher WT01 wird sekundärseitig mit Kaltwasser betrieben. Der Füllstand im Behälter wird angezeigt und überwacht. Der Behälter steht unter geringem Druck und ist durch das Sicherheitsventil SV01 abgesichert.",
    kenn: [
      ["Behälter BE01", "Nennvolumen V = 800 L", "Füllvolumen V<sub>F</sub> = 600 L", "Masse leer m = 280 kg"],
      ["Medium", "Kühlwasser, Dichte ρ = 1,0 kg/dm³", "spez. Wärmekapazität c = 4,19 kJ/(kg · K)", ""],
      ["Pumpe PL01", "Förderstrom = 12 m³/h", "aufgenommene Leistung P = 1,1 kW", "η Motor = 88 %, η Pumpe = 62 %"],
      ["Wärmetauscher WT01", "Wasser Eintritt 40 °C, Austritt 32 °C", "Rohr LP02: 76,1 × 2,9 (DN 65)", ""]
    ],
    ri: {
      W: 800, H: 420, alt: "Fließbild eines Kühlwasserkreislaufs mit zwei Pumpen, Filter, Wärmetauscher und Behälter",
      pipes: [
        { pts: [[110, 93], [110, 200], [280, 200]], tag: "LP01 DN 80", tp: [118, 150] },
        { pts: [[280, 200], [280, 150], [520, 150], [520, 200]] },
        { pts: [[280, 200], [280, 250], [520, 250], [520, 200]] },
        { pts: [[520, 200], [585, 200]], tag: "LP02 DN 65", tp: [525, 190] },
        { pts: [[655, 200], [710, 200]] },
        { pts: [[620, 320], [620, 213]], tag: "LP04 DN 40", tp: [628, 300] },
        { pts: [[620, 187], [620, 100]] },
        { pts: [[745, 228], [745, 350], [40, 350], [40, 20], [80, 20], [80, 47]], tag: "LP03 DN 65", tp: [300, 342] },
        { pts: [[110, 47], [140, 47]] }, { pts: [[140, 47], [140, 32]] }
      ],
      dots: [[280, 200], [520, 200]],
      sym: [
        { t: "vessel", x: 110, y: 70, w: 110, h: 46, tag: "BE01", sub: "Ausgleichsbehälter" },
        { t: "safety", x: 140, y: 32, tag: "SV01" },
        { t: "pce", x: 225, y: 38, fn: "LI", nr: "03", src: [165, 62], al: "AL" },
        { t: "valve", x: 165, y: 200, tag: "VV01" }, { t: "filter", x: 225, y: 200, tag: "FL01" },
        { t: "valve", x: 320, y: 150, tag: "VV02", ty: 126 }, { t: "pump", x: 380, y: 150, tag: "PL01", dir: "r" }, { t: "check", x: 440, y: 150, dir: "r", tag: "VH01", ty: 126 }, { t: "valve", x: 485, y: 150, tag: "VV04", ty: 126 },
        { t: "valve", x: 320, y: 250, tag: "VV03" }, { t: "pump", x: 380, y: 250, tag: "PL02", dir: "r" }, { t: "check", x: 440, y: 250, dir: "r", tag: "VH02" }, { t: "valve", x: 485, y: 250, tag: "VV05" },
        { t: "pce", x: 550, y: 152, fn: "PI", nr: "02", src: [550, 200] },
        { t: "hx", x: 620, y: 200, w: 70, h: 26, tag: "WT01" },
        { t: "valve", x: 620, y: 275, o: "v", tag: "VV06", tx: 632 },
        { t: "ext", x: 620, y: 335, dir: "u", tag: "Kaltwasser ein", ty: 366 }, { t: "ext", x: 620, y: 75, dir: "u", tag: "Kaltwasser aus", ty: 56 },
        { t: "pce", x: 685, y: 152, fn: "TI", nr: "01", src: [685, 200], al: "AH" },
        { t: "box", x: 745, y: 200, w: 70, h: 56, tag: "Verbraucher", sub: "Presse" },
        { t: "valve", x: 400, y: 350, tag: "VV07" },
        { t: "arrow", x: 110, y: 130, dir: "d" }, { t: "arrow", x: 250, y: 200, dir: "r" }, { t: "arrow", x: 745, y: 300, dir: "d" }, { t: "arrow", x: 200, y: 350, dir: "l" }, { t: "arrow", x: 40, y: 200, dir: "u" }, { t: "arrow", x: 690, y: 200, dir: "r" }, { t: "arrow", x: 560, y: 200, dir: "r" }
      ]
    },
    legend: ["be", "pumpe", "vv", "vh", "sv", "fl", "wt", "pce", "arrow"],
    pipes: [["LP01 bis LP03", "Kühlwasser"], ["LP04", "Kaltwasser (Sekundärseite WT01)"]],
    vessel: {
      alt: "Zeichnung des Ausgleichsbehälters BE01", D: 800, L: 1400, hh: 200, scale: 0.26, hs: 260, sw: 260, views: ["front"],
      saddles: [450, 1350],
      nozzles: [{ id: "A", x: 400, ang: 0, dn: 65, len: 190 }, { id: "B", x: 720, ang: 180, dn: 80, len: 200 }, { id: "C", x: 900, ang: 0, dn: 50, len: 190 }, { id: "D", x: 1300, ang: 90, dn: 25, len: 120 }],
      dims: [{ k: "h", a: 0, b: 1800, off: 100, ea: -30, eb: -30, text: "1800" }, { k: "hb", a: 450, b: 1350, off: 26, text: "900" }, { k: "v", a: 0, b: 800, off: 46, text: "Ø 800" }],
      callouts: [{ v: "front", n: "1", x: 1000, y: 330, dx: 36, dy: -50 }, { v: "front", n: "2", x: 1790, y: 400, dx: 20, dy: -60 }, { v: "front", n: "3", x: 1350, y: 880, dx: 30, dy: 26 }]
    },
    nozzles: [{ id: "A", fn: "Rücklauf aus der Anlage (Zulauf)", dn: 65 }, { id: "B", fn: "Ablauf zur Pumpe", dn: 80 }, { id: "C", fn: "Sicherheitsventil", dn: 50 }, { id: "D", fn: "Füllstandsmessung", dn: 25 }],
    parts: [
      [1, 1, "Mantel", "Ø 800 × 6 – 1400", "1.4301"], [2, 2, "Boden", "DIN 28013, Ø 800", "1.4301"], [3, 2, "Sattel", "Breite 260", "S235JR"],
      [4, 1, "Stutzen A", "Rohr 76,1 × 2,9 – 190", "1.4301"], [5, 1, "Stutzen B", "Rohr 88,9 × 3,2 – 200", "1.4301"], [6, 1, "Stutzen C", "Rohr 60,3 × 2,9 – 190", "1.4301"],
      [7, 1, "Stutzen D", "Rohr 33,7 × 2,6 – 120", "1.4301"], [8, 4, "Vorschweißflansch", "EN 1092-1, DN 25 / 50 / 65 / 80, PN 16", "1.4301"]
    ],
    questions() {
      const { Q, QN } = window.QH, T = "Block 2";
      return [
        Q(T, "In welcher Reihenfolge durchströmt das Wasser die Bauteile vom Behälter BE01 bis zum Wärmetauscher WT01?",
          "BE01 → VV01 → FL01 → Pumpen (parallel) → WT01", ["BE01 → FL01 → VV01 → Pumpen (parallel) → WT01", "BE01 → VV01 → Pumpen (parallel) → FL01 → WT01", "BE01 → Pumpen (parallel) → VV01 → FL01 → WT01", "BE01 → WT01 → FL01 → VV01 → Pumpen (parallel)"],
          "Die Pfeile zeigen: aus BE01 über VV01 und den Filter FL01, dann teilt sich die Leitung in zwei parallele Pumpenzweige (PL01 und PL02). Hinter den Pumpen fließen die Zweige wieder zusammen und gehen zu WT01."),
        Q(T, "Die Pumpe PL01 soll gewartet werden, PL02 läuft weiter. Welche Armaturen müssen geschlossen werden, um PL01 abzusperren?",
          "VV02 und VV04", ["VV01 und VV06", "VH01 und VV02", "VV03 und VV05", "Nur VV02"],
          "PL01 sitzt im oberen Zweig zwischen VV02 (vor der Pumpe) und VV04 (hinter dem Rückflussverhinderer). Beide Absperrarmaturen schließen den Zweig auf beiden Seiten ab. VV03 und VV05 gehören zu PL02."),
        Q(T, "Wozu dienen die Rückflussverhinderer VH01 und VH02?",
          "Sie verhindern, dass Wasser durch die stillstehende Pumpe zurückläuft", ["Sie schützen den Behälter vor Überdruck", "Sie regeln den Durchfluss", "Sie filtern Schmutz aus dem Wasser", "Sie messen die Temperatur"],
          "VH = Sicherungsarmatur. Ohne Rückflussverhinderer würde die laufende Pumpe das Wasser durch die stillstehende Reservepumpe zurückdrücken."),
        QN(T, "Wie viele Absperrarmaturen (VV) sind im Fließbild eingezeichnet?", 7, [1, 2, 3], String,
          "VV01 bis VV07 sind Absperrarmaturen. Die Rückflussverhinderer heißen VH und zählen nicht dazu."),
        Q(T, "Was bedeutet die PCE-Stelle LI 03 mit der Angabe AL?",
          "Füllstand anzeigen, Alarm bei zu niedrigem Wert", ["Füllstand regeln, Alarm bei zu hohem Wert", "Durchfluss anzeigen, Alarm bei zu niedrigem Wert", "Füllstand anzeigen, Alarm bei zu hohem Wert", "Druck anzeigen und regeln"],
          "L = Füllstand (Level), I = Anzeige (Indication). AL = Alarm bei zu niedrigem Wert (Low). AH wäre Alarm bei zu hohem Wert."),
        Q(T, "Welche Aufgabe hat das Sicherheitsventil SV01 am Behälter BE01?",
          "Es öffnet bei zu hohem Druck und bläst ab", ["Es verhindert das Zurückströmen", "Es regelt den Füllstand", "Es sperrt den Behälter beim Wechsel der Pumpe ab", "Es zeigt den Druck an"],
          "SV = Sicherheitsventil. Es schützt den Behälter, indem es bei Überschreiten des Ansprechdrucks öffnet. Das Zickzack-Symbol steht für die Feder: Das Ventil öffnet, wenn der Druck die Federkraft übersteigt. In der Prüfung heißen Sicherheitsarmaturen VY."),
        Q(T, "Welche Leitung führt das Kaltwasser auf der Sekundärseite des Wärmetauschers?",
          "LP04", ["LP01", "LP02", "LP03", "Keine, der Wärmetauscher hat nur einen Kreislauf"],
          "Laut Leitungsliste ist LP04 die Kaltwasserleitung der Sekundärseite. LP01 bis LP03 führen das Kühlwasser des Hauptkreises."),
        Q(T, "Wie groß ist in der Behälterzeichnung der Abstand der beiden Sättel?",
          "900 mm", ["450 mm", "1350 mm", "1400 mm", "1800 mm"],
          "Die Maßlinie unter dem Behälter zeigt 900 mm. 1800 mm ist die Gesamtlänge, 1400 mm die Länge des Zylinders."),
        Q(T, "Welche Nennweite hat der Stutzen B, an dem das Wasser zur Pumpe abfließt?",
          "DN 80", ["DN 25", "DN 50", "DN 65", "DN 100"],
          "In der Stutzentabelle steht bei B „Ablauf zur Pumpe“ mit DN 80. Im Fließbild passt dazu die Saugleitung LP01 DN 80."),
        Q(T, "Welche Stutzen sitzen oben am Behälter?",
          "A und C", ["A und B", "B und D", "C und D", "Nur A"],
          "In der Vorderansicht ragen A und C nach oben. B ragt nach unten, D steht seitlich zur Vorderansicht hin und sieht aus wie ein Kreis."),
        QN(T, "Wie groß ist der Füllgrad des Behälters BE01 (Füllvolumen 600 L, Nennvolumen 800 L)?", 75, [5, 10, 15], n => n + " %",
          "Füllgrad = Füllvolumen : Nennvolumen · 100 % = 600 L : 800 L · 100 % = 75 %."),
        QN(T, "Wie groß ist die Gesamtmasse des gefüllten Behälters BE01 (Masse leer 280 kg, Füllung 600 L Wasser, ρ = 1,0 kg/dm³)?", 880, [80, 100, 600], n => n + " kg",
          "Wasser: 1,0 kg/dm³ · 600 dm³ = 600 kg. Dazu der leere Behälter: 280 kg + 600 kg = 880 kg."),
        QN(T, "Welche hydraulische Leistung kommt im Wasser an (aufgenommene Leistung 1,1 kW, η Motor = 88 %, η Pumpe = 62 %)?", 600, [60, 100, 200], n => n + " W",
          "P hydraulisch = P zu · η Motor · η Pumpe = 1100 W · 0,88 · 0,62 ≈ 600 W. Wirkungsgrade multipliziert man."),
        QN(T, "Welche Wärmeleistung nimmt der Wärmetauscher auf (12 m³/h Wasser, 40 °C auf 32 °C, c = 4,19 kJ/(kg · K), ρ = 1,0 kg/dm³)?", 112, [10, 20, 40], n => "ca. " + n + " kW",
          "Massenstrom: 12 m³/h = 12 000 kg/h = 3,33 kg/s. Q̇ = ṁ · c · ΔT = 3,33 kg/s · 4,19 kJ/(kg · K) · 8 K ≈ 112 kW."),
        QN(T, "Mit welcher Geschwindigkeit strömt das Wasser in der Leitung LP02 (12 m³/h, Rohr 76,1 × 2,9)?", 0.86, [0.1, 0.2, 0.4], n => String(n).replace(".", ",") + " m/s",
          "Innendurchmesser: 76,1 − 2 · 2,9 = 70,3 mm. A = π/4 · (0,0703 m)² ≈ 0,00388 m². Q = 12 m³/h = 0,00333 m³/s. v = Q : A ≈ 0,86 m/s.")
      ];
    }
  };
})();
