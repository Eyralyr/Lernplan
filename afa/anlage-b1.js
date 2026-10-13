// Block 1: Wasserbehälter mit Pumpe (frei erfunden). Einfaches Fließbild mit denselben Symbolen wie in den Blöcken 2 bis 4, dazu Stückliste.
(function () {
  window.ANLAGE_B1 = {
    title: "Block 1 · Wasserbehälter mit Pumpe", level: "Einstieg",
    desc: "Eine ganz einfache Anlage mit einer Linie: Behälter, Filter, Pumpe, Armaturen, Verbraucher. Hier übst du das Grundprinzip: Beschreibung und Kenndaten lesen, dem Fließbild folgen und die Stückliste nutzen.",
    text: "Aus dem Behälter BE01 fördert die Pumpe PL01 Wasser über den Filter FL01 zu einem Verbraucher. Der Füllstand im Behälter wird gemessen und regelt über die Regelarmatur VC01 die Nachspeisung mit VE-Wasser (vollentsalztes Wasser). Die Temperatur vor dem Verbraucher wird angezeigt und überwacht.",
    kenn: [
      ["Behälter BE01", "Nennvolumen V = 1200 L", "Füllvolumen V<sub>F</sub> = 900 L", "Masse leer m = 310 kg"],
      ["Medium", "Wasser, Dichte ρ = 1,0 kg/dm³", "Rohr LP01: 60,3 × 2,9", ""],
      ["Pumpe PL01", "Förderstrom = 6 m³/h", "aufgenommene Leistung P = 750 W", "η Motor = 90 %, η Pumpe = 60 %"]
    ],
    ri: {
      W: 640, H: 300, alt: "Fließbild eines Wasserbehälters mit Filter, Pumpe, Rückflussverhinderer und Füllstandsregelung",
      pipes: [
        { pts: [[80, 34], [80, 87]], tag: "LP02 DN 25", tp: [88, 48] },
        { pts: [[80, 133], [80, 230], [475, 230]], tag: "LP01 DN 50", tp: [88, 190] },
        { sig: true, pts: [[185, 87], [185, 62], [112, 62]] }
      ],
      dots: [],
      sym: [
        { t: "ext", x: 80, y: 22, dir: "d", tag: "VE-Wasser", tx: 112, ty: 26, ta: "start" },
        { t: "regel", x: 80, y: 62, o: "v", tag: "VC01" },
        { t: "vessel", x: 80, y: 110, w: 100, h: 46, tag: "BE01", sub: "Vorratsbehälter" },
        { t: "pce", x: 185, y: 100, fn: "LIC", nr: "01", src: [130, 108] },
        { t: "valve", x: 130, y: 230, tag: "VV01" }, { t: "filter", x: 185, y: 230, tag: "FL01" },
        { t: "pump", x: 250, y: 230, tag: "PL01", dir: "r" }, { t: "check", x: 310, y: 230, dir: "r", tag: "VH01" },
        { t: "valve", x: 360, y: 230, tag: "VV02" },
        { t: "pce", x: 430, y: 180, fn: "TI", nr: "02", src: [430, 230], al: "AH" },
        { t: "box", x: 520, y: 230, w: 90, h: 60, tag: "Verbraucher" },
        { t: "arrow", x: 80, y: 175, dir: "d" }, { t: "arrow", x: 400, y: 230, dir: "r" }, { t: "arrow", x: 80, y: 48, dir: "d" }
      ]
    },
    legend: ["be", "pumpe", "vv", "vh", "vc", "fl", "pce", "sig", "arrow", "ext"],
    pipes: [["LP01", "Wasser"], ["LP02", "VE-Wasser (Nachspeisung)"]],
    parts: [
      [1, 1, "Behälter BE01", "1200 L", "1.4571"], [2, 2, "Vorschweißflansch DN 50 PN 16", "EN 1092-1", "1.4571"], [3, 1, "Rohr, gerade", "60,3 × 2,9 – 1500", "1.4571"],
      [4, 2, "Bogen 90°", "60,3 × 2,9", "1.4571"], [5, 8, "Sechskantschraube", "M16 × 60", "A2-70"], [6, 2, "Flachdichtung", "DN 50 PN 16", "Graphit"]
    ],
    partsTitle: "Stückliste (Rohrleitung LP01)",
    questions() {
      const { Q, QN } = window.QH, T = "Block 1";
      return [
        QN(T, "Wie groß ist der Füllgrad des Behälters BE01 (Füllvolumen 900 L, Nennvolumen 1200 L)?", 75, [5, 15, 25], n => n + " %",
          "Füllgrad = Füllvolumen : Nennvolumen · 100 % = 900 L : 1200 L · 100 % = 75 %. Der Füllgrad kann nicht über 100 % liegen."),
        QN(T, "Wie viel Liter Platz sind im Behälter BE01 im Betrieb noch frei?", 300, [100, 300, 600], n => n + " L",
          "Freies Volumen = Nennvolumen − Füllvolumen = 1200 L − 900 L = 300 L."),
        QN(T, "Wie groß ist die Gesamtmasse des gefüllten Behälters BE01 (Masse leer 310 kg, 900 L Wasser, ρ = 1,0 kg/dm³)?", 1210, [100, 300, 900], n => n + " kg",
          "Wasser: 1,0 kg/dm³ · 900 dm³ = 900 kg. Dazu der leere Behälter: 310 kg + 900 kg = 1210 kg. 1 L entspricht 1 dm³."),
        Q(T, "Welches Bauteil sitzt im Fließbild in Strömungsrichtung direkt vor der Pumpe PL01?",
          "Der Filter FL01", ["Der Rückflussverhinderer VH01", "Die Absperrarmatur VV02", "Die Regelarmatur VC01", "Der Behälter BE01"],
          "Die Pfeile zeigen: BE01 → VV01 → FL01 → PL01 → VH01 → VV02 → Verbraucher. Der Filter schützt die Pumpe vor Schmutz."),
        Q(T, "Wofür ist der Rückflussverhinderer VH01 hinter der Pumpe da?",
          "Er verhindert, dass bei Pumpenstillstand Wasser zurückströmt", ["Er regelt den Durchfluss stufenlos", "Er filtert Schmutz aus dem Wasser", "Er schützt den Behälter vor Überdruck", "Er zeigt den Druck an"],
          "VH = Sicherungsarmatur. Der Rückflussverhinderer (Rückschlagventil) öffnet nur in Strömungsrichtung. Ohne ihn könnte das Wasser durch die stehende Pumpe zurücklaufen."),
        Q(T, "Die PCE-Stelle LIC 01 meldet einen zu niedrigen Füllstand. Welche Armatur reagiert laut Fließbild über die gestrichelte Signalleitung?",
          "Die Regelarmatur VC01 öffnet und lässt VE-Wasser nachströmen", ["Die Pumpe PL01 wird abgeschaltet", "Der Filter FL01 wird gespült", "Die Absperrarmatur VV02 schließt", "Der Rückflussverhinderer VH01 öffnet"],
          "LIC = Füllstand (L) anzeigen (I) und regeln (C). Die gestrichelte Linie führt zur Regelarmatur VC01 an der VE-Wasser-Leitung. Der Pfeil an der Linie zeigt, wer beeinflusst wird."),
        Q(T, "Welche Aussage über die PCE-Stelle TI 02 mit AH stimmt?",
          "Sie zeigt die Temperatur an und gibt Alarm bei zu hohem Wert", ["Sie regelt die Temperatur am Verbraucher", "Sie gibt Alarm bei zu niedriger Temperatur", "Sie misst den Druck am Verbraucher", "Sie zeigt nur den Durchfluss an"],
          "T = Temperatur, I = Anzeige. AH = Alarm bei zu hohem Wert (High). Eine Regelung wäre TIC, ein Alarm bei zu niedrigem Wert AL."),
        Q(T, "Wofür steht das Kürzel VV im Fließbild?",
          "Absperrarmaturen", ["Regelarmaturen", "Sicherheitsarmaturen", "Sicherungsarmaturen (Rückflussverhinderer)", "Verdichter"],
          "VV = Absperrarmatur, VC = Regelarmatur, VH = Sicherungsarmatur (z. B. Rückflussverhinderer). Sicherheitsarmaturen (Sicherheitsventile) heißen in der Prüfung VY."),
        Q(T, "Welchen Innendurchmesser hat das Rohr (Pos. 3 der Stückliste, 60,3 × 2,9)?",
          "54,5 mm", ["60,3 mm", "57,4 mm", "63,2 mm", "1500 mm"],
          "60,3 mm ist der Außendurchmesser, 2,9 mm die Wanddicke. Innen: 60,3 − 2 · 2,9 = 54,5 mm. Die 1500 ist die Länge in mm."),
        Q(T, "Wie viele 90°-Bögen sind laut Stückliste eingebaut?",
          "2", ["1", "4", "8", "6"],
          "Pos. 4: Stückzahl 2. Die 8 gehört zu den Schrauben (Pos. 5), die 2 bei den Flanschen und Dichtungen."),
        Q(T, "Wie viele Schrauben gehören zu einer Flanschverbindung?",
          "4 (8 Schrauben für zwei Flansche)", ["8 je Flanschverbindung", "2", "16", "6"],
          "Laut Stückliste sind 8 Schrauben für 2 Flansche vorgesehen, also 4 je Flanschverbindung. DN 50 / PN 16 hat tatsächlich 4 Schrauben M16."),
        QN(T, "Welche hydraulische Leistung kommt im Wasser an (P zu = 750 W, η Motor = 90 %, η Pumpe = 60 %)?", 405, [45, 135, 270], n => n + " W",
          "P hydraulisch = P zu · η Motor · η Pumpe = 750 W · 0,9 · 0,6 = 405 W. Wirkungsgrade multipliziert man, das Ergebnis wird kleiner."),
        QN(T, "Wie lange braucht die Pumpe PL01 (Förderstrom 6 m³/h), um die freien 300 L im Behälter aufzufüllen?", 3, [1, 2, 5], n => n + " Minuten",
          "6 m³/h = 6000 L/h = 100 L/min. Zeit = 300 L : 100 L/min = 3 min. Erst die Einheiten gleich machen, dann teilen."),
        Q(T, "Aus welchem Werkstoff sind die Schrauben (Pos. 5) laut Stückliste?",
          "A2-70 (nichtrostend)", ["1.4571", "Graphit", "S235JR", "8.8 (unlegierter Stahl)"],
          "In der letzten Spalte der Stückliste steht A2-70. A2 = austenitischer, nichtrostender Stahl, 70 = Zugfestigkeit 700 N/mm². 1.4571 ist der Werkstoff von Rohr, Bogen und Flanschen.")
      ];
    }
  };
})();
