// Sicherung des Lernstands als Text (Export/Import).
// Der Lernstand liegt im Browser (localStorage). Alle Schlüssel dieser Seiten beginnen mit afa-, anlage- oder kai-.
// Die Sicherung ist ein Text im JSON-Format: {"v":1,"deck":"kai-lernplan","exported":"2026-10-13","data":{...}}
// Beim Einlesen wird alles geprüft (Version, Deck, Schlüsselnamen, Größe), erst dann wird ersetzt.
(function () {
  const DECK = "kai-lernplan";
  const KEY_OK = /^(afa|anlage|kai)-[a-z0-9-]+$/;
  const META = "kai-meta";                 // { lastBackup: "YYYY-MM-DD" }
  const MAX_TEXT = 300000, MAX_KEYS = 60, MAX_VALUE = 100000;

  const pad = n => String(n).padStart(2, "0");
  const today = () => { const d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  const fmtDate = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ""); return m ? m[3] + "." + m[2] + "." + m[1] : "noch nie"; };
  const days = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ""); if (!m) return null; return Math.round((new Date(new Date().toDateString()) - new Date(+m[1], +m[2] - 1, +m[3])) / 864e5); };

  function keys() {
    const out = [];
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (KEY_OK.test(k)) out.push(k); } } catch (e) {}
    return out.sort();
  }
  function getMeta() { try { return JSON.parse(localStorage.getItem(META) || "{}") || {}; } catch (e) { return {}; } }
  function setMeta(m) { try { localStorage.setItem(META, JSON.stringify(m)); } catch (e) {} }

  // Sicherungstext erstellen
  function serialize() {
    const data = {};
    keys().forEach(k => { if (k === META) return; try { data[k] = JSON.parse(localStorage.getItem(k)); } catch (e) {} });
    return JSON.stringify({ v: 1, deck: DECK, exported: today(), data });
  }
  // Sicherungstext prüfen, liefert die bereinigten Schlüssel/Werte oder wirft einen Fehler mit lesbarer Meldung
  function parse(text) {
    text = String(text || "").trim();
    if (!text) throw new Error("Erst den Sicherungstext einfügen.");
    if (text.length > MAX_TEXT) throw new Error("Der Text ist zu lang für eine Sicherung.");
    let o; try { o = JSON.parse(text); } catch (e) { throw new Error("Das ist kein gültiger Sicherungstext. Hast du alles kopiert, von der ersten bis zur letzten Klammer?"); }
    if (!o || typeof o !== "object" || o.v !== 1) throw new Error("Unbekanntes Format.");
    if (o.deck !== DECK) throw new Error("Diese Sicherung gehört nicht zu diesen Lernseiten.");
    if (!o.data || typeof o.data !== "object" || Array.isArray(o.data)) throw new Error("In der Sicherung fehlen die Daten.");
    const ks = Object.keys(o.data);
    if (ks.length > MAX_KEYS) throw new Error("Die Sicherung enthält zu viele Einträge.");
    const out = {};
    ks.forEach(k => {
      if (!KEY_OK.test(k) || k === META) return;                 // fremde Schlüssel werden ignoriert
      const v = JSON.stringify(o.data[k]);
      if (v === undefined || v.length > MAX_VALUE) return;
      out[k] = v;
    });
    return { values: out, exported: typeof o.exported === "string" ? o.exported : "" };
  }
  function replaceAll(values, exported) {
    keys().forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
    Object.keys(values).forEach(k => { try { localStorage.setItem(k, values[k]); } catch (e) {} });
    setMeta({ lastBackup: exported || today() });
  }
  function reset() { keys().forEach(k => { try { localStorage.removeItem(k); } catch (e) {} }); }

  // Sicherungsbereich in ein Element einbauen
  function mount(el, opts) {
    opts = opts || {};
    el.innerHTML =
      '<p class="hint">Dein Lernstand liegt nur in diesem Browser. Safari kann Browserdaten nach 7 Tagen ohne Nutzung löschen, und auf einem anderen Gerät fängst du bei null an. Kopiere den Text deshalb einmal pro Woche in Notion (Abschnitt „Meine Sicherung“).</p>' +
      '<p class="hint" id="bk-last"></p>' +
      '<button type="button" class="btn ghost" id="bk-make">Sicherung erstellen</button>' +
      '<label for="bk-text" style="display:block;margin-top:10px;font-weight:700;font-size:.9rem">Sicherungstext</label>' +
      '<textarea id="bk-text" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="Zum Einlesen hier einfügen" style="width:100%;min-height:96px;font:14px/1.4 ui-monospace,Menlo,monospace;background:var(--card);color:var(--text);border:1.5px solid var(--line);border-radius:10px;padding:8px;margin:6px 0"></textarea>' +
      '<button type="button" class="btn ghost" id="bk-copy">Text kopieren</button>' +
      '<button type="button" class="btn ghost" id="bk-load">Text einlesen</button>' +
      '<button type="button" class="btn ghost" id="bk-reset">Fortschritt zurücksetzen</button>' +
      '<p id="bk-note" role="status" style="font-weight:700;min-height:22px"></p>';
    const $ = id => el.querySelector("#" + id);
    let confirmLoad = false, confirmReset = false;
    const note = t => { $("bk-note").textContent = t; };
    const refreshLast = () => { $("bk-last").textContent = "Zuletzt gesichert: " + fmtDate(getMeta().lastBackup); };
    const afterChange = () => { if (opts.onChange) opts.onChange(); else setTimeout(() => location.reload(), 900); };
    const mark = () => { const m = getMeta(); m.lastBackup = today(); setMeta(m); refreshLast(); };
    const clearConfirm = except => {
      if (except !== "load") { confirmLoad = false; $("bk-load").textContent = "Text einlesen"; }
      if (except !== "reset") { confirmReset = false; $("bk-reset").textContent = "Fortschritt zurücksetzen"; }
    };

    refreshLast();
    $("bk-make").onclick = () => { clearConfirm(); $("bk-text").value = serialize(); mark(); note("Sicherung erstellt. Mit „Text kopieren“ in Notion einfügen."); };
    $("bk-copy").onclick = () => {
      clearConfirm();
      const ta = $("bk-text");
      if (!ta.value) { ta.value = serialize(); }
      ta.select(); try { ta.setSelectionRange(0, ta.value.length); } catch (e) {}
      const ok = () => { mark(); note("Kopiert."); };
      const fail = () => note("Der Text ist markiert. Bitte von Hand kopieren.");
      try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(ta.value).then(ok, fail); return; } } catch (e) {}
      let done = false; try { done = document.execCommand("copy"); } catch (e) {}
      done ? ok() : fail();
    };
    $("bk-load").onclick = () => {
      clearConfirm("load");
      let parsed; try { parsed = parse($("bk-text").value); } catch (e) { confirmLoad = false; $("bk-load").textContent = "Text einlesen"; return note(e.message); }
      if (!confirmLoad) { confirmLoad = true; $("bk-load").textContent = "Wirklich ersetzen? Nochmal tippen"; return note("Der aktuelle Lernstand wird ersetzt."); }
      replaceAll(parsed.values, parsed.exported);
      confirmLoad = false; $("bk-load").textContent = "Text einlesen";
      note("Sicherung eingelesen. Die Seite lädt neu …"); afterChange();
    };
    $("bk-reset").onclick = () => {
      clearConfirm("reset");
      if (!confirmReset) { confirmReset = true; $("bk-reset").textContent = "Wirklich alles löschen? Nochmal tippen"; return note("Dabei geht dein gesamter Lernstand verloren. Mach vorher eine Sicherung."); }
      reset(); confirmReset = false; $("bk-reset").textContent = "Fortschritt zurücksetzen";
      note("Zurückgesetzt. Die Seite lädt neu …"); afterChange();
    };
  }

  // Für die Startseite: gibt es Lernstand, und wann wurde zuletzt gesichert?
  function status() {
    const hasData = keys().some(k => k !== META);
    const last = getMeta().lastBackup || "";
    return { hasData, last, daysSince: days(last) };
  }

  window.KaiBackup = { mount, status, serialize, parse, fmtDate };
})();
