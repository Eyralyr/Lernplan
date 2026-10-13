// Kleine Hilfen zum Bauen von Auswahlfragen (eine richtige Antwort + vier falsche).
(function () {
  const Q = (t, q, right, wrongs, why) => ({ t, q, o: [right, ...wrongs], why });
  const fmtNum = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  // richtige Zahl + vier falsche Zahlen im Abstand der Schritte (nie negativ, alle verschieden)
  function numOpts(ans, deltas, fmt) {
    const w = []; deltas.forEach(d => { [ans + d, ans - d].forEach(v0 => { const v = Math.round(v0 * 1000) / 1000; if (v >= 0 && v !== ans && !w.some(x => Math.abs(x - v) < 1e-9)) w.push(v); }); });
    return [fmt(ans), ...w.slice(0, 4).map(fmt)];
  }
  const cnt = ans => numOpts(ans, [1, 2, 3], String);
  // Frage mit Zahlenantwort bauen: QN(Thema, Frage, Antwort, Schritte, Format, Erklärung)
  const QN = (t, q, ans, deltas, fmt, why) => { const o = numOpts(ans, deltas, fmt); return Q(t, q, o[0], o.slice(1), why); };
  window.QH = { Q, QN, numOpts, cnt, fmtNum, mm: n => fmtNum(n) + " mm" };
})();
