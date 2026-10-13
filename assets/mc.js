// Trainer für Auswahlfragen (wie Teil A der IHK-Prüfung: 5 Antworten, genau eine ist richtig).
// Fragen kommen aus window.FRAGEN: {t: Thema, q: Frage, o: [richtige Antwort, 4 falsche], why: Erklärung}
// Optional: window.MC_TITLE_KEY (eigener Speicherplatz je Seite)
(function () {
  const $ = id => document.getElementById(id);
  const ALL = window.FRAGEN;
  const TOPICS = [...new Set(ALL.map(f => f.t))];
  const KEY = window.MC_KEY || "afa";
  const PRUEFUNG_N = Math.min(28, ALL.length);
  const RUNDE = 10;
  let sel = new Set(TOPICS);
  let mode = "ueben", list = [], idx = 0, log = [], timer = null, t0 = 0, showTime = false, seen = new Set();

  const toTop = () => { const t = window.MC_SCROLL && $(window.MC_SCROLL); t ? t.scrollIntoView() : window.scrollTo(0, 0); };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return String(h); };
  const store = {
    get(k, d) { try { const v = localStorage.getItem(KEY + "-" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(KEY + "-" + k, JSON.stringify(v)); } catch (e) {} }
  };
  const ago = d => {
    const days = Math.round((new Date(new Date().toDateString()) - new Date(new Date(d).toDateString())) / 864e5);
    return days <= 0 ? "heute" : days === 1 ? "gestern" : "vor " + days + " Tagen";
  };

  function home() {
    clearInterval(timer);
    $("meta").style.display = "none"; $("prog").style.width = "0";
    const last = store.get("last", null), wrong = store.get("falsch", []);
    const wrongPool = ALL.filter(f => wrong.includes(hash(f.q)));
    const chips = TOPICS.map(t => {
      const n = ALL.filter(f => f.t === t).length;
      return '<button class="chip' + (sel.has(t) ? " on" : "") + '" data-t="' + t + '">' + t + " (" + n + ")</button>";
    }).join("");
    $("card").innerHTML =
      "<h2>Heute üben</h2>" +
      (last ? '<p class="hint" style="margin-top:0">Zuletzt geübt: ' + ago(last.date) + ", " + last.right + " von " + last.total + " richtig.</p>" : "") +
      '<button class="btn" id="go-10" style="margin-top:6px">' + RUNDE + " Fragen, gemischt</button>" +
      (wrongPool.length ? '<button class="btn ghost" id="go-wrong">' + wrongPool.length + " Fragen, die noch wackeln</button>" : "") +
      '<p class="hint">Nach jeder Frage siehst du sofort, ob sie stimmt. Du kannst jederzeit aufhören.</p>' +
      "<details><summary>Themen auswählen</summary>" +
      '<div class="chips" id="chips">' + chips + "</div>" +
      '<p class="hint"><button class="chip" id="all">Alle</button> <button class="chip" id="none">Keine</button></p>' +
      '<button class="btn" id="go-themen">Mit diesen Themen üben</button></details>' +
      "<details><summary>Prüfungs-Simulation (" + PRUEFUNG_N + " Fragen)</summary>" +
      "<p>Hier gibt es keine Note, du übst nur. Das Ergebnis kommt erst am Ende, so wie in der Prüfung. In der echten Prüfung hast du 105 Minuten für Teil A und Teil B zusammen. Für Teil A kannst du etwa 45 Minuten rechnen.</p>" +
      '<button class="btn ghost" id="go-pruef">Simulation starten</button></details>';
    document.querySelectorAll("#chips .chip").forEach(b => b.onclick = () => {
      sel.has(b.dataset.t) ? sel.delete(b.dataset.t) : sel.add(b.dataset.t);
      b.classList.toggle("on");
    });
    $("all").onclick = () => { sel = new Set(TOPICS); document.querySelectorAll("#chips .chip").forEach(b => b.classList.add("on")); };
    $("none").onclick = () => { sel = new Set(); document.querySelectorAll("#chips .chip").forEach(b => b.classList.remove("on")); };
    $("go-10").onclick = () => start("ueben", nextRound(ALL));
    if (wrongPool.length) $("go-wrong").onclick = () => start("ueben", shuffle(wrongPool).slice(0, RUNDE));
    $("go-themen").onclick = () => {
      const pool = ALL.filter(f => sel.has(f.t));
      if (!pool.length) { alert("Bitte wähle mindestens ein Thema aus."); return; }
      start("ueben", nextRound(pool));
    };
    $("go-pruef").onclick = () => start("pruefung", shuffle(ALL).slice(0, PRUEFUNG_N));
  }

  // nächste Runde: bevorzugt Fragen, die in dieser Sitzung noch nicht dran waren
  function nextRound(pool) {
    let fresh = pool.filter(f => !seen.has(hash(f.q)));
    if (fresh.length < RUNDE) { seen = new Set(); fresh = pool; }
    return shuffle(fresh).slice(0, RUNDE);
  }

  function start(m, items) {
    mode = m; list = items; idx = 0; log = [];
    $("meta").style.display = "";
    clearInterval(timer);
    if (mode === "pruefung") { t0 = Date.now(); showTime = false; timer = setInterval(tick, 1000); tick(); } else $("topic").innerHTML = "";
    render();
  }

  function tick() {
    const s = Math.floor((Date.now() - t0) / 1000);
    $("topic").innerHTML = showTime
      ? '<button class="chip" id="tt">⏱ ' + String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0") + "</button>"
      : '<button class="chip" id="tt">⏱ Zeit anzeigen</button>';
    $("tt").onclick = () => { showTime = !showTime; tick(); };
  }

  function render() {
    if (idx >= list.length) return finish();
    toTop();
    const f = list[idx];
    const order = shuffle([0, 1, 2, 3, 4]);
    $("count").textContent = "Frage " + (idx + 1) + " von " + list.length;
    $("prog").style.width = (idx / list.length * 100) + "%";
    $("card").innerHTML =
      '<span class="tag">' + f.t + "</span>" +
      '<p class="q">' + f.q + "</p>" +
      order.map(k => '<button class="opt" data-k="' + k + '">' + f.o[k] + "</button>").join("") +
      '<button class="btn" id="check" disabled>' + (mode === "ueben" ? "Prüfen" : "Weiter") + "</button>" +
      (mode === "pruefung" ? '<button class="btn ghost" id="skip">Überspringen</button>' : "") +
      '<button class="btn ghost" id="stop">Beenden und auswerten</button>' +
      '<div id="fb"></div>';
    let chosen = null, done = false;
    document.querySelectorAll(".opt").forEach(b => b.onclick = () => {
      if (done) return;
      document.querySelectorAll(".opt").forEach(x => x.classList.remove("sel"));
      b.classList.add("sel"); chosen = +b.dataset.k; $("check").disabled = false;
    });
    $("stop").onclick = () => { if (log.length) finish(); else home(); };
    if ($("skip")) $("skip").onclick = () => { log.push({ f, ok: false, chosen: null, skipped: true }); idx++; render(); };
    $("check").onclick = () => {
      if (done) { idx++; return render(); }
      const ok = chosen === 0;
      log.push({ f, ok, chosen });
      if (mode === "pruefung") { idx++; return render(); }
      done = true;
      document.querySelectorAll(".opt").forEach(b => {
        b.disabled = true;
        if (+b.dataset.k === 0) b.classList.add("ok"); else if (+b.dataset.k === chosen) b.classList.add("bad");
      });
      $("fb").innerHTML = '<div class="fb ' + (ok ? "ok" : "bad") + '"><b>' + (ok ? "✅ Richtig" : "❌ Nicht ganz. Richtig ist die grün markierte Antwort.") + "</b>" + f.why + "</div>";
      $("check").textContent = idx === list.length - 1 ? "Auswertung" : "Weiter";
      $("stop").style.display = "none";
    };
  }

  function finish() {
    clearInterval(timer);
    toTop();
    $("prog").style.width = "100%";
    $("count").textContent = "Fertig";
    $("topic").innerHTML = "";
    const right = log.filter(l => l.ok).length, total = log.length;
    const wrong = log.filter(l => !l.ok);
    const byTopic = {};
    log.forEach(l => { const t = byTopic[l.f.t] = byTopic[l.f.t] || [0, 0]; t[1]++; if (l.ok) t[0]++; });
    // Speichern: letzte Runde und wackelnde Fragen
    store.set("last", { date: new Date().toISOString(), right, total });
    let falsch = store.get("falsch", []);
    log.forEach(l => { const h = hash(l.f.q); seen.add(h); falsch = falsch.filter(x => x !== h); if (!l.ok) falsch.push(h); });
    store.set("falsch", falsch);
    const pct = total ? right / total : 0;
    const verdict = pct === 1 ? "Alles richtig. Stark!" : pct >= 0.75 ? "Gut. Nur noch ein paar Lücken." : pct >= 0.5 ? "Gute Basis. Diese Themen lohnen sich zu wiederholen." : "Hier gibt es noch viel Luft nach oben. Mach weiter, jede Runde hilft.";
    let best = "";
    if (mode === "pruefung") {
      const old = store.get("pruef-best", null);
      if (old !== null) best = '<p class="hint">Bisheriger Bestwert in der Simulation: ' + old + " von " + total + ".</p>";
      if (old === null || right > old) store.set("pruef-best", right);
    }
    let html = '<h2 style="margin:0">Geschafft</h2><div class="score">' + right + " von " + total + "</div><p>" + verdict + "</p>" + best;
    html += "<p><b>Nach Themen</b> (🟢 sicher, 🟡 wackelig, 🔴 noch üben):</p><ul class=\"weak\">" +
      Object.keys(byTopic).map(t => {
        const [r, n] = byTopic[t], p = r / n;
        return "<li>" + (p >= 0.8 ? "🟢" : p >= 0.5 ? "🟡" : "🔴") + " " + t + ": " + r + " von " + n + "</li>";
      }).join("") + "</ul>";
    if (wrong.length) {
      html += "<p><b>Das war falsch, mit Erklärung:</b></p>" + wrong.map(l =>
        "<details><summary>" + l.f.q + "</summary><p><b>Richtig:</b> " + l.f.o[0] + "</p>" +
        (l.chosen !== null ? "<p><b>Deine Antwort:</b> " + l.f.o[l.chosen] + "</p>" : "<p><i>Übersprungen</i></p>") + "<p>" + l.f.why + "</p></details>").join("");
    }
    html += (mode === "ueben" ? '<button class="btn" id="more">Noch ' + RUNDE + " Fragen</button>" : "") +
      (wrong.length ? '<button class="btn ghost" id="again-wrong">Nur die falschen nochmal</button>' : "") +
      '<button class="btn ghost" id="back">Fertig für heute</button>';
    $("card").innerHTML = html;
    if ($("more")) $("more").onclick = () => start("ueben", nextRound(ALL));
    if (wrong.length) $("again-wrong").onclick = () => start("ueben", shuffle(wrong.map(l => l.f)));
    $("back").onclick = home;
  }

  home();
})();
