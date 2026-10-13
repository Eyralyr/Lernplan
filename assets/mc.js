// Trainer für Auswahlfragen (wie Teil A der IHK-Prüfung: 5 Antworten, genau eine ist richtig).
// Fragen kommen aus window.FRAGEN: {t: Thema, q: Frage, o: [richtige Antwort, 4 falsche], why: Erklärung}
// Optional: window.MC_KEY (eigener Speicherplatz je Seite), window.MC_SCROLL (Element-ID, zu dem nach oben gescrollt wird)
(function () {
  const $ = id => document.getElementById(id);
  const ALL = window.FRAGEN;
  const TOPICS = [...new Set(ALL.map(f => f.t))];
  const KEY = window.MC_KEY || "afa";
  const PRUEFUNG_N = Math.min(28, ALL.length);
  const RUNDE = 10;
  let sel = new Set(TOPICS), recorded = false;
  // Zustand der laufenden Runde
  let mode = "ueben", list = [], orders = [], ans = [], idx = 0, timer = null, t0 = 0, showTime = false, showGrid = false, seen = new Set();

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
  const qstats = () => store.get("q", {});
  const stat = f => qstats()[hash(f.q)] || null;
  function record(f, ok) {
    const qs = qstats(), h = hash(f.q), e = qs[h] || [0, 0, ""];
    e[0]++; if (ok) e[1]++; e[2] = ok ? "r" : "w"; qs[h] = e; store.set("q", qs);
  }
  const coverage = pool => {
    const qs = qstats(); let seenN = 0, solid = 0;
    pool.forEach(f => { const e = qs[hash(f.q)]; if (e) { seenN++; if (e[2] === "r") solid++; } });
    return { total: pool.length, seen: seenN, solid, never: pool.length - seenN };
  };
  const answered = () => ans.filter(a => a !== null).length;
  const openIdx = () => ans.map((a, i) => a === null ? i : -1).filter(i => i >= 0);

  // ---------- Startbildschirm ----------
  function home() {
    clearInterval(timer);
    $("meta").style.display = "none"; $("prog").style.width = "0";
    const last = store.get("last", null), cov = coverage(ALL);
    const wrongPool = ALL.filter(f => { const e = stat(f); return e && e[2] === "w"; });
    const perTopic = TOPICS.map(t => { const c = coverage(ALL.filter(f => f.t === t)); return "<li>" + t + ": " + c.seen + " von " + c.total + " gesehen, " + c.solid + " zuletzt richtig</li>"; }).join("");
    const chips = TOPICS.map(t => {
      const n = ALL.filter(f => f.t === t).length;
      return '<button class="chip' + (sel.has(t) ? " on" : "") + '" data-t="' + t + '">' + t + " (" + n + ")</button>";
    }).join("");
    $("card").innerHTML =
      "<h2>Heute üben</h2>" +
      '<div class="given" style="margin-top:6px"><b>Abdeckung: ' + cov.seen + " von " + cov.total + " Fragen schon gesehen</b>" +
      '<div class="bar" style="margin:6px 0 4px"><i style="width:' + Math.round(cov.seen / cov.total * 100) + '%"></i></div>' +
      (cov.never ? "Noch nie gesehen: " + cov.never + ". Die kommen in den Runden zuerst dran." : "Alle Fragen waren schon mindestens einmal dran. Stark!") +
      " Davon zuletzt richtig: " + cov.solid + ".</div>" +
      (last ? '<p class="hint" style="margin-top:0">Zuletzt geübt: ' + ago(last.date) + ", " + last.right + " von " + last.total + " richtig.</p>" : "") +
      '<button class="btn" id="go-10" style="margin-top:6px">' + RUNDE + " Fragen, gemischt</button>" +
      (wrongPool.length ? '<button class="btn ghost" id="go-wrong">' + wrongPool.length + " Fragen, die noch wackeln</button>" : "") +
      '<p class="hint">Nach jeder Frage siehst du sofort, ob sie stimmt. Du kannst jederzeit aufhören oder zurückgehen.</p>' +
      "<details><summary>Wie weit bin ich? (nach Themen)</summary><ul class=\"weak\">" + perTopic + "</ul></details>" +
      "<details><summary>Themen auswählen</summary>" +
      '<div class="chips" id="chips">' + chips + "</div>" +
      '<p class="hint"><button class="chip" id="all">Alle</button> <button class="chip" id="none">Keine</button></p>' +
      '<button class="btn" id="go-themen">Mit diesen Themen üben</button></details>' +
      "<details><summary>Prüfungs-Simulation (" + PRUEFUNG_N + " Fragen)</summary>" +
      "<p>Hier gibt es keine Note, du übst nur. Das Ergebnis kommt erst am Ende, so wie in der Prüfung. Du kannst Fragen überspringen, zurückgehen und offene Fragen später beantworten. In der echten Prüfung hast du 105 Minuten für Teil A und Teil B zusammen. Für Teil A kannst du etwa 45 Minuten rechnen.</p>" +
      '<button class="btn ghost" id="go-pruef">Simulation starten</button></details>' +
      '<details><summary>Sicherung</summary><div id="bk"></div></details>';
    if (window.KaiBackup) window.KaiBackup.mount($("bk")); else $("bk").textContent = "Sicherung nicht verfügbar.";
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

  // nächste Runde: nie gesehene Fragen zuerst, dann zuletzt falsch, dann nur einmal richtig, dann der Rest
  function nextRound(pool) {
    let cand = pool.filter(f => !seen.has(hash(f.q)));
    if (cand.length < RUNDE) { seen = new Set(); cand = pool; }
    const grp = [[], [], [], []];
    cand.forEach(f => { const e = stat(f); grp[!e ? 0 : e[2] === "w" ? 1 : e[1] < 2 ? 2 : 3].push(f); });
    let out = [];
    for (const g of grp) { out = out.concat(shuffle(g)); if (out.length >= RUNDE) break; }
    return out.slice(0, RUNDE);
  }

  function start(m, items) {
    mode = m; list = items; idx = 0; showGrid = false;
    ans = items.map(() => null); recorded = false;
    orders = items.map(() => shuffle([0, 1, 2, 3, 4]));
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

  // Übersicht aller Fragen (nur Prüfungs-Simulation)
  function gridHTML() {
    return '<div class="qgrid">' + list.map((_, i) =>
      '<button class="chip' + (ans[i] !== null ? " on" : "") + (i === idx ? " cur" : "") + '" data-i="' + i + '" aria-label="Frage ' + (i + 1) + (ans[i] === null ? ", offen" : ", beantwortet") + '">' + (i + 1) + "</button>").join("") + "</div>" +
      '<p class="hint">Gefüllt = beantwortet, leer = noch offen.</p>';
  }

  // ---------- eine Frage anzeigen ----------
  function render() {
    toTop();
    const f = list[idx], order = orders[idx];
    const locked = mode === "ueben" && ans[idx] !== null;      // im Üben-Modus ist eine geprüfte Frage gesperrt
    $("count").textContent = "Frage " + (idx + 1) + " von " + list.length;
    $("prog").style.width = (answered() / list.length * 100) + "%";
    let chosen = ans[idx];
    $("card").innerHTML =
      '<span class="tag">' + f.t + "</span>" +
      '<p class="q">' + f.q + "</p>" +
      order.map(k => '<button class="opt" data-k="' + k + '">' + f.o[k] + "</button>").join("") +
      '<div class="nav">' +
      (idx > 0 ? '<button class="btn ghost" id="back">← Zurück</button>' : "") +
      '<button class="btn" id="check">' + (mode === "ueben" ? (locked ? (idx === list.length - 1 ? "Auswertung" : "Weiter →") : "Prüfen") : (idx === list.length - 1 ? "Zur Übersicht →" : "Weiter →")) + "</button>" +
      "</div>" +
      (mode === "pruefung" ? '<p><button class="chip" id="grid">' + (showGrid ? "Übersicht ausblenden" : "Alle Fragen anzeigen") + "</button></p>" + (showGrid ? gridHTML() : "") : "") +
      '<p><button class="chip" id="stop">Beenden und auswerten</button></p>' +
      '<div id="fb"></div>';

    const opts = [...document.querySelectorAll(".opt")];
    const mark = (k, cls) => opts.forEach(b => { if (+b.dataset.k === k) b.classList.add(cls); });
    if (chosen !== null) mark(chosen, locked ? (chosen === 0 ? "ok" : "bad") : "sel");
    if (locked) {
      opts.forEach(b => b.disabled = true); mark(0, "ok");
      $("fb").innerHTML = '<div class="fb ' + (chosen === 0 ? "ok" : "bad") + '"><b>' + (chosen === 0 ? "✅ Richtig" : "❌ Nicht ganz. Richtig ist die grün markierte Antwort.") + "</b>" + f.why + "</div>";
    }
    opts.forEach(b => b.onclick = () => {
      if (locked) return;
      opts.forEach(x => x.classList.remove("sel"));
      b.classList.add("sel"); chosen = +b.dataset.k;
      if (mode === "ueben") $("check").disabled = false;
      if (mode === "pruefung") { ans[idx] = chosen; $("prog").style.width = (answered() / list.length * 100) + "%"; if (showGrid) refreshGrid(); }
    });
    if (mode === "ueben" && !locked) $("check").disabled = chosen === null;
    if ($("back")) $("back").onclick = () => { idx--; render(); };
    $("stop").onclick = () => { if (mode === "pruefung") review(true); else if (answered()) finish(); else home(); };
    if ($("grid")) $("grid").onclick = () => { showGrid = !showGrid; render(); };
    document.querySelectorAll(".qgrid .chip").forEach(b => b.onclick = () => { idx = +b.dataset.i; render(); });

    $("check").onclick = () => {
      if (mode === "pruefung") { if (idx === list.length - 1) return review(false); idx++; return render(); }
      if (locked) { if (idx === list.length - 1) return finish(); idx++; return render(); }
      if (chosen === null) return;                      // Üben: erst eine Antwort wählen
      ans[idx] = chosen; record(list[idx], chosen === 0);
      render();
    };
  }
  function refreshGrid() { const g = document.querySelector(".qgrid"); if (g) { g.outerHTML = gridHTML(); document.querySelectorAll(".qgrid .chip").forEach(b => b.onclick = () => { idx = +b.dataset.i; render(); }); } }

  // ---------- Übersicht vor der Auswertung (Simulation) ----------
  function review(fromStop) {
    toTop();
    const open = openIdx();
    if (!open.length && !fromStop) return finish();
    $("count").textContent = "Fast fertig";
    $("card").innerHTML = '<h2 style="margin:0">' + (open.length ? open.length + " Fragen sind noch offen" : "Alle Fragen sind beantwortet") + "</h2>" +
      '<p class="hint">Du kannst jetzt zu einer Frage zurückgehen oder die Simulation auswerten. Offene Fragen zählen dann als nicht gelöst.</p>' +
      gridHTML() +
      (open.length ? '<button class="btn" id="to-open">Zur ersten offenen Frage</button>' : "") +
      '<button class="btn' + (open.length ? " ghost" : "") + '" id="eval">Jetzt auswerten</button>' +
      '<button class="btn ghost" id="to-last">← Zurück zu den Fragen</button>';
    document.querySelectorAll(".qgrid .chip").forEach(b => b.onclick = () => { idx = +b.dataset.i; showGrid = false; render(); });
    if ($("to-open")) $("to-open").onclick = () => { idx = open[0]; showGrid = false; render(); };
    $("to-last").onclick = () => { render(); };
    $("eval").onclick = finish;
  }

  // ---------- Auswertung ----------
  function finish() {
    clearInterval(timer); toTop();
    $("prog").style.width = "100%"; $("count").textContent = "Fertig"; $("topic").innerHTML = "";
    // Üben: nur beantwortete Fragen zählen. Simulation: offene Fragen zählen als nicht gelöst.
    const log = list.map((f, i) => ({ f, chosen: ans[i], ok: ans[i] === 0, skipped: ans[i] === null }))
      .filter(l => mode === "pruefung" || !l.skipped);
    const right = log.filter(l => l.ok).length, total = log.length;
    const wrong = log.filter(l => !l.ok);
    const byTopic = {};
    log.forEach(l => { const t = byTopic[l.f.t] = byTopic[l.f.t] || [0, 0]; t[1]++; if (l.ok) t[0]++; });
    store.set("last", { date: new Date().toISOString(), right, total });
    log.forEach(l => seen.add(hash(l.f.q)));
    if (mode === "pruefung" && !recorded) { log.forEach(l => { if (!l.skipped) record(l.f, l.ok); }); recorded = true; }
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
      html += "<p><b>Das war falsch oder offen, mit Erklärung:</b></p>" + wrong.map(l =>
        "<details><summary>" + l.f.q + "</summary><p><b>Richtig:</b> " + l.f.o[0] + "</p>" +
        (l.chosen !== null ? "<p><b>Deine Antwort:</b> " + l.f.o[l.chosen] + "</p>" : "<p><i>Nicht beantwortet</i></p>") + "<p>" + l.f.why + "</p></details>").join("");
    }
    html += (mode === "ueben" ? '<button class="btn" id="more">Noch ' + RUNDE + " Fragen</button>" : "") +
      (wrong.length ? '<button class="btn ghost" id="again-wrong">Nur die falschen nochmal</button>' : "") +
      (mode === "pruefung" ? '<button class="btn ghost" id="to-review">← Zurück zu den Fragen</button>' : "") +
      '<button class="btn ghost" id="done">Fertig für heute</button>';
    $("card").innerHTML = html;
    if ($("more")) $("more").onclick = () => start("ueben", nextRound(ALL));
    if (wrong.length) $("again-wrong").onclick = () => start("ueben", shuffle(wrong.map(l => l.f)));
    if ($("to-review")) $("to-review").onclick = () => review(true);
    $("done").onclick = home;
  }

  home();
})();
