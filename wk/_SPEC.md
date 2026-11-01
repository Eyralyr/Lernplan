# Format der WK-Datendateien (wk/data-<slug>.js)

```js
(function () {
  const F = (t, s, q, right, wrongs, why) => ({ t, s, q, o: [right, ...wrongs], why });
  window.WK_DATA = window.WK_DATA || {};
  window.WK_DATA["<slug>"] = {
    title: "Steuern",                 // Themenname (kurz)
    sub: "Einkommensteuer, Lohnsteuer, Umsatzsteuer",   // eine Zeile
    merk: ["Kurzer Merksatz 1", "..."],   // 5 bis 8 Merksätze (leichte Sprache, mit Stand/Jahr bei Zahlen)
    fragen: [
      F("Unterthema", 1, "Frage?", "richtige Antwort", ["falsch1","falsch2","falsch3","falsch4"], "Erklärung (2-4 kurze Sätze)."),
      ...
    ]
  };
})();
```
- t = Unterthema (4 bis 7 Stück je Datei, kurze Namen), s = Stufe 1..4
- Stufe 1 Einstieg: Begriff/Grundwissen. 2 Mittel: Zusammenhang, einfache Anwendung. 3 Anspruchsvoll: Fallbeispiel oder Rechnung mit mehreren Schritten. 4 Prüfungsniveau: Szenario einer fiktiven Musterfirma im Stil der IHK-WiSo-Prüfung, ähnliche Antworten unterscheiden.
- Mindestens 8 Fragen je Stufe (also >= 32 je Datei), gleichmäßig auf die Unterthemen verteilt.
- Rechenaufgaben sind normale Fragen mit Zahlen im Text; die Antwortzahlen sind plausible Fehlwege (z. B. vergessener Schritt, falscher Prozentsatz); der Lösungsweg steht in why.
