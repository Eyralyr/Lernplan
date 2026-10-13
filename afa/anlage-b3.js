// Block 3: Laugen-Dosierstation (frei erfunden). Fließbild mit Signalleitungen, Behälterzeichnung mit zwei Ansichten, Fragen.
(function () {
  window.ANLAGE_B3 = {
    title: "Block 3 · Laugen-Dosierstation", level: "Anspruchsvoll",
    desc: "Eine Dosierstation, die Natronlauge in eine Abwasserleitung gibt, um den pH-Wert zu regeln. Das Fließbild hat jetzt Signalleitungen (gestrichelt): Sie zeigen, welche Messstelle die Pumpe beeinflusst.",
    text: "Natronlauge wird aus dem Vorratsbehälter BE01 mit der Dosierpumpe PL01 über den Filter FL01 in die Abwasserleitung LP05 gegeben. Der pH-Wert wird hinter der Einspeisung gemessen (QIC 05) und regelt die Dosierung. Der Füllstandsschalter LS 03 schaltet die Pumpe ab, wenn der Behälter fast leer ist. Das Sicherheitsventil SV01 schützt die Druckleitung und bläst in den Auffangbehälter BE02 ab. Der Behälter wird über die Füllleitung LP03 aus Fässern befüllt. Die Rohre sind für die Übung großzügig gewählt (vereinfacht).",
    kenn: [
      ["Behälter BE01", "Nennvolumen V = 1200 L", "Füllvolumen V<sub>F</sub> = 900 L", "Masse leer m = 380 kg"],
      ["Medium", "Natronlauge, Dichte ρ = 1,22 kg/dm³", "Mindestfüllstand: 100 L", "Gefahrstoff: GHS05 (ätzend)"],
      ["Abwasser", "Volumenstrom 20 m³/h", "Dosierung: 0,15 L Lauge je m³ Abwasser", ""],
      ["Dosierpumpe PL01", "maximaler Förderstrom 40 L/h", "Betriebsdruck 6 bar", "Schutzart IP65"]
    ],
    ri: {
      W: 880, H: 470, alt: "Fließbild einer Laugen-Dosierstation mit Behälter, Dosierpumpe, Sicherheitsventil und pH-Regelung",
      pipes: [
        { pts: [[32, 70], [115, 70], [115, 130]], tag: "LP03 DN 25", tp: [30, 102] },
        { pts: [[180, 130], [180, 62]], tag: "LP04 DN 25", tp: [188, 100] },
        { pts: [[140, 190], [140, 330], [345, 330]], tag: "LP01 DN 32", tp: [148, 260] },
        { pts: [[345, 330], [600, 330], [600, 410]], tag: "LP02 DN 25", tp: [620, 322] },
        { pts: [[450, 330], [450, 278]] },
        { pts: [[450, 242], [450, 215], [500, 215]], tag: "LP06 DN 25", tp: [456, 207] },
        { pts: [[32, 410], [848, 410]], tag: "LP05 DN 100", tp: [200, 402] },
        { sig: true, pts: [[273, 150], [330, 150], [330, 315]] },
        { sig: true, pts: [[733, 350], [780, 350], [780, 175], [330, 175]] }
      ],
      dots: [[450, 330], [600, 410], [330, 175]],
      sym: [
        { t: "ext", x: 20, y: 70, dir: "r", tag: "Fass", ty: 50, ta: "start", tx: 10 },
        { t: "valve", x: 52, y: 70, tag: "VV01", ty: 50 }, { t: "check", x: 85, y: 70, dir: "r", tag: "VH01", ty: 50 },
        { t: "vessel", x: 140, y: 160, w: 130, h: 60, tag: "BE01", sub: "Lauge-Vorrat" },
        { t: "ext", x: 180, y: 46, dir: "u", tag: "Abluft", ty: 26 },
        { t: "pce", x: 260, y: 150, fn: "LS", nr: "03", src: [205, 150], al: "AL" },
        { t: "valve", x: 190, y: 330, tag: "VV02" }, { t: "filter", x: 250, y: 330, tag: "FL01" }, { t: "pump", x: 320, y: 330, tag: "PL01", dir: "r" },
        { t: "check", x: 395, y: 330, dir: "r", tag: "VH02" },
        { t: "safety", x: 450, y: 262, tag: "SV01" }, { t: "vessel", x: 560, y: 215, w: 120, h: 44, tag: "BE02", sub: "Auffangbehälter" },
        { t: "valve", x: 515, y: 330, tag: "VV03" },
        { t: "pce", x: 570, y: 285, fn: "FI", nr: "04", src: [570, 330] },
        { t: "check", x: 600, y: 372, dir: "d", tag: "VH03", tx: 616, ty: 376 },
        { t: "ext", x: 20, y: 410, dir: "r", tag: "Abwasser", ty: 390, tx: 8, ta: "start" }, { t: "valve", x: 100, y: 410, tag: "VV04" },
        { t: "pce", x: 720, y: 352, fn: "QIC", nr: "05", src: [720, 410] },
        { t: "ext", x: 862, y: 410, dir: "r", tag: "Abwasser", ty: 390, tx: 852 },
        { t: "arrow", x: 115, y: 100, dir: "d" }, { t: "arrow", x: 140, y: 262, dir: "d" }, { t: "arrow", x: 640, y: 330, dir: "r" }, { t: "arrow", x: 300, y: 410, dir: "r" }, { t: "arrow", x: 640, y: 410, dir: "r" }, { t: "arrow", x: 800, y: 410, dir: "r" }
      ]
    },
    legend: ["be", "pumpe", "vv", "vh", "sv", "fl", "pce", "sig", "arrow"],
    pipes: [["LP01", "Natronlauge (Saugleitung)"], ["LP02", "Natronlauge (Dosierleitung)"], ["LP03", "Natronlauge (Füllleitung)"], ["LP04", "Abluft"], ["LP05", "Abwasser"], ["LP06", "Natronlauge (Abblaseleitung von SV01)"]],
    vessel: {
      alt: "Zeichnung des Vorratsbehälters BE01 mit Vorderansicht und Draufsicht", D: 900, L: 1600, hh: 225, scale: 0.22, hs: 250, sw: 280, views: ["front", "top"],
      saddles: [500, 1550],
      nozzles: [{ id: "A", x: 400, ang: 0, dn: 25, len: 160 }, { id: "E", x: 900, ang: 0, dn: 400, len: 130 }, { id: "B", x: 1400, ang: 0, dn: 25, len: 160 }, { id: "C", x: 900, ang: 180, dn: 32, len: 180 }, { id: "D", x: 1250, ang: 90, dn: 25, len: 140 }],
      dims: [{ k: "h", a: 0, b: 2050, off: 100, ea: -30, eb: -30, text: "2050" }, { k: "hb", a: 500, b: 1550, off: 28, text: "1050" }, { k: "v", a: 0, b: 900, off: 46, text: "Ø 900" }],
      callouts: [{ v: "front", n: "1", x: 1100, y: 420, dx: 40, dy: -60 }, { v: "front", n: "2", x: 2040, y: 450, dx: 22, dy: -70 }, { v: "front", n: "3", x: 1550, y: 1060, dx: 36, dy: 24 }]
    },
    nozzles: [{ id: "A", fn: "Befüllung", dn: 25 }, { id: "B", fn: "Entlüftung", dn: 25 }, { id: "C", fn: "Entnahme (Pumpe)", dn: 32 }, { id: "D", fn: "Füllstandsschalter", dn: 25 }, { id: "E", fn: "Mannloch", dn: 400, pn: 6 }],
    parts: [
      [1, 1, "Mantel", "Ø 900 × 6 – 1600", "1.4571"], [2, 2, "Boden", "DIN 28013, Ø 900", "1.4571"], [3, 2, "Sattel", "Breite 280", "S235JR"],
      [4, 1, "Mannloch", "DN 400, PN 6", "1.4571"], [5, 1, "Stutzen A", "Rohr 33,7 × 2,6 – 160", "1.4571"], [6, 1, "Stutzen B", "Rohr 33,7 × 2,6 – 160", "1.4571"],
      [7, 1, "Stutzen C", "Rohr 42,4 × 2,6 – 180", "1.4571"], [8, 1, "Stutzen D", "Rohr 33,7 × 2,6 – 140", "1.4571"],
      [9, 3, "Vorschweißflansch", "EN 1092-1, DN 25, PN 16", "1.4571"], [10, 1, "Vorschweißflansch", "EN 1092-1, DN 32, PN 16", "1.4571"]
    ],
    questions() {
      const { Q, QN } = window.QH, T = "Block 3";
      return [
        QN(T, "Wie viele Rückflussverhinderer (VH) sind im Fließbild eingezeichnet?", 3, [1, 2, 3], String,
          "VH01 sitzt in der Füllleitung, VH02 hinter der Pumpe und VH03 an der Einspeisung ins Abwasser. VH = Sicherungsarmatur (Rückflussverhinderer)."),
        Q(T, "Von welchen Messstellen laufen gestrichelte Signalleitungen zur Pumpe PL01?",
          "LS 03 (Füllstand) und QIC 05 (pH-Wert)", ["FI 04 und QIC 05", "LS 03 und FI 04", "Nur LS 03", "Nur QIC 05"],
          "Beide gestrichelten Signalleitungen enden mit einer Pfeilspitze an der Pumpe PL01. LS 03 schaltet bei niedrigem Füllstand ab, QIC 05 regelt die Dosierung nach dem pH-Wert. FI 04 zeigt nur an."),
        Q(T, "LS 03 meldet: Der Behälter BE01 ist fast leer. Was passiert mit der Pumpe PL01?",
          "Sie wird abgeschaltet, damit sie nicht trockenläuft", ["Sie läuft mit doppelter Leistung weiter", "Sie fördert jetzt Abwasser statt Lauge", "Sie wird nur beim nächsten Alarm gestoppt", "Das Sicherheitsventil SV01 übernimmt ihre Arbeit"],
          "LS = Füllstandsschalter, AL = Alarm bei niedrigem Wert. Das Signal geht an die Pumpe. Sie darf nicht trockenlaufen."),
        Q(T, "Wie sperrst du die Pumpe PL01 für eine Wartung ab?",
          "VV02 (saugseitig) und VV03 (druckseitig) schließen", ["Nur VV01 schließen", "VH02 und VH03 schließen", "VV04 schließen", "SV01 öffnen"],
          "Saug- und Druckseite der Pumpe werden mit VV02 und VV03 abgesperrt. VV01 gehört zur Füllleitung, VV04 zur Abwasserleitung."),
        Q(T, "Wohin bläst das Sicherheitsventil SV01 ab?",
          "In den Auffangbehälter BE02", ["In den Vorratsbehälter BE01", "In die Abwasserleitung LP05", "In die Umgebungsluft", "In die Füllleitung"],
          "Von SV01 führt eine Leitung zum Behälter BE02. Er fängt austretende Lauge auf, damit nichts in die Umgebung gelangt."),
        Q(T, "Was bedeutet QIC 05?",
          "Qualität (hier pH-Wert) messen, anzeigen und regeln", ["Durchfluss messen und regeln", "Füllstand anzeigen und regeln", "Druck messen und anzeigen", "Temperatur messen und regeln"],
          "Q = Qualität/Analyse (hier der pH-Wert), I = Anzeige, C = Regelung. Die Messung sitzt hinter der Einspeisestelle, damit sie die Wirkung der Lauge erfasst."),
        Q(T, "Wo sitzt die Messstelle QIC 05 im Verhältnis zur Einspeisung der Lauge (in Strömungsrichtung des Abwassers)?",
          "Hinter der Einspeisung", ["Vor der Einspeisung", "An derselben Stelle", "Im Vorratsbehälter", "An der Pumpe PL01"],
          "Das Abwasser fließt von links nach rechts. Die Lauge wird bei der Leitung LP02 eingespeist, QIC 05 sitzt weiter rechts, also dahinter. So wird der pH-Wert nach dem Zugeben gemessen."),
        Q(T, "Welches Medium führt die Leitung LP04?",
          "Abluft", ["Natronlauge", "Abwasser", "Kühlwasser", "Druckluft"],
          "Laut Leitungsliste ist LP04 die Abluftleitung des Vorratsbehälters. Sie führt den Verdrängungsstrom ins Freie, wenn der Behälter befüllt wird."),
        QN(T, "Wie viele Stutzen hat der Behälter laut Stutzentabelle (inklusive Mannloch)?", 5, [1, 2, 3], String,
          "Die Tabelle nennt A, B, C, D und E, also fünf Stutzen. Das Mannloch (E) zählt mit."),
        Q(T, "Welche Nennweite hat das Mannloch (Stutzen E)?",
          "DN 400", ["DN 25", "DN 32", "DN 100", "DN 250"],
          "In der Stutzentabelle steht bei E „Mannloch“ mit DN 400. Es ist der größte Stutzen und in der Draufsicht als großer Kreis zu erkennen."),
        Q(T, "In der Draufsicht ist der Stutzen D als Rechteck nach unten gezeichnet, in der Vorderansicht als Kreis. Auf welcher Seite des Behälters sitzt er?",
          "Vorn, zur Vorderansicht hin", ["Hinten", "Oben", "Unten", "Er sitzt genau in der Mitte"],
          "Bei der Projektionsmethode 1 liegt die Draufsicht unter der Vorderansicht. Alles, was in der Draufsicht nach unten zeigt, liegt an der Vorderseite. In der Vorderansicht sieht man es von vorn als Kreis."),
        Q(T, "Wie groß ist der Abstand der beiden Sättel in der Zeichnung?",
          "1050 mm", ["500 mm", "1600 mm", "2050 mm", "900 mm"],
          "Die Maßlinie unter dem Behälter zeigt 1050 mm. 2050 mm ist die Gesamtlänge, 1600 mm die Länge des Zylinders."),
        QN(T, "Wie groß ist der Füllgrad des Behälters BE01 (Füllvolumen 900 L, Nennvolumen 1200 L)?", 75, [5, 10, 25], n => n + " %",
          "Füllgrad = 900 L : 1200 L · 100 % = 75 %."),
        QN(T, "Wie groß ist die Gesamtmasse des gefüllten Behälters (Masse leer 380 kg, Füllung 900 L Natronlauge, ρ = 1,22 kg/dm³)?", 1478, [100, 120, 380], n => n + " kg",
          "Lauge: 1,22 kg/dm³ · 900 dm³ = 1098 kg. Dazu der leere Behälter: 380 kg + 1098 kg = 1478 kg."),
        QN(T, "Wie viel Lauge muss die Pumpe pro Stunde dosieren (Abwasser 20 m³/h, 0,15 L Lauge je m³)?", 3, [1, 2, 5], n => n + " L/h",
          "20 m³/h · 0,15 L/m³ = 3 L/h. Das liegt weit unter dem maximalen Förderstrom der Pumpe von 40 L/h."),
        QN(T, "Wie lange reicht die Füllung bis zum Mindestfüllstand (900 L Füllung, Mindestfüllstand 100 L, Dosierung 3 L/h)?", 267, [24, 50, 100], n => "ca. " + n + " h",
          "Nutzbare Menge: 900 L − 100 L = 800 L. Zeit = 800 L : 3 L/h ≈ 267 h, das sind gut 11 Tage.")
      ];
    }
  };
})();
