/* Ofoq Billets — agence de billets d'avion de démonstration. Défilement : GSAP + ScrollTrigger + Lenis, servis en local. */
(function () {
  "use strict";
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var S = { lang: "fr", cur: "DZD", dest: "CDG", trip: "rt", from: "ALG", to: "CDG", ad: 1, ch: 0, inf: 0, fare: "eco", d1: "", d2: "", visa: false };
  var reduce = root.className.indexOf("static") > -1 || !window.gsap || !window.ScrollTrigger;
  if (reduce && root.className.indexOf("static") < 0) root.className += " static";
  var TO = {}; D.to.forEach(function (d) { TO[d.id] = d; });
  var FA = {}; D.fares.forEach(function (f) { FA[f.id] = f; });
  var VISA_FOR = { CDG: "fr", MRS: "fr", LYS: "fr", MAD: "es", IST: "tr", YUL: "ca" };
  var VI = {}; D.visa.forEach(function (v) { VI[v.id] = v; });
  function T_() { return T[S.lang]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function store(k, v) { try { localStorage.setItem("ofoq-" + k, JSON.stringify(v)); } catch (e) {} }
  function load(k) { try { return JSON.parse(localStorage.getItem("ofoq-" + k)); } catch (e) { return null; } }
  var ISO = function (s) { return "⁦" + s + "⁩"; };
  function r500(v) { return Math.round(v / 500) * 500; }

  /* ---------- argent et dates ---------- */
  function num(n, l) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, (l || S.lang) === "en" ? "," : " "); }
  function money(v) {
    if (S.cur === "DZD") { var n = num(v); return S.lang === "ar" ? ISO(n) + " دج" : S.lang === "en" ? n + " DZD" : n + " DA"; }
    return new Intl.NumberFormat(S.lang === "en" ? "en-GB" : S.lang === "ar" ? "ar-DZ-u-nu-latn" : "fr-FR", { style: "currency", currency: S.cur, maximumFractionDigits: 0 }).format(v * D.rates[S.cur]);
  }
  function da(v) { return num(v, "fr") + " DA"; }
  function loc(l) { l = l || S.lang; return l === "ar" ? "ar-DZ-u-nu-latn" : l === "en" ? "en-GB" : "fr-FR"; }
  function fmtL(s, l) { var p = s.split("-"); return new Intl.DateTimeFormat(loc(l), { weekday: "long", day: "numeric", month: "long" }).format(new Date(+p[0], +p[1] - 1, +p[2], 12)); }
  function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function city(code, l) { for (var i = 0; i < D.from.length; i++) if (D.from[i][0] === code) return D.from[i][1][l || S.lang]; return code; }
  function monthName(m) { return new Intl.DateTimeFormat(loc(), { month: "short" }).format(new Date(2026, m, 1)); }
  function curMonth() { var d = new Date(); return d.getMonth(); }

  /* ---------- prix ---------- */
  function fareFor(id, m, rt) { return TO[id].p * D.season[m] * (rt ? 1 : 0.62); }
  function monthOf(s) { return s ? +s.split("-")[1] - 1 : (curMonth() + 1) % 12; }
  function quote() {
    var m = monthOf(S.d1), pax = S.ad + S.ch * 0.75 + S.inf * 0.1;
    var base = r500(fareFor(S.to, m, S.trip === "rt") * pax);
    var add = FA[S.fare].add * (S.ad + S.ch);
    var visa = S.visa && VISA_FOR[S.to] ? VI[VISA_FOR[S.to]].p * (S.ad + S.ch) : 0;
    return { base: base, add: add, visa: visa, tot: base + add + visa };
  }

  /* ---------- textes ---------- */
  function applyText() {
    var t = T_();
    root.lang = S.lang; root.dir = t.dir; document.title = t.title;
    $$("[data-t]").forEach(function (e) { e.textContent = t[e.getAttribute("data-t")]; });
    $$("#nav a").forEach(function (a, i) { a.textContent = t.nav[i]; });
    $$(".sw button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-l") === S.lang); });
    $("#hl h1").textContent = t.heroH; $("#hl p").textContent = t.heroP; $("#hsc").textContent = t.scroll;
    $("#dep h2").textContent = t.depH; $("#dep .sh p").textContent = t.depP;
    $("#cal h2").textContent = t.calH; $("#cal .sh p").textContent = t.calP;
    $("#far h2").textContent = t.farH; $("#far .sh p").textContent = t.farP;
    $("#visa h2").textContent = t.visaH; $("#visa .sh p").textContent = t.visaP;
    $("#trk h2").textContent = t.trkH; $("#trk .sh p").textContent = t.trkP;
    $("#sc").placeholder = t.trkIn; $("#sc").setAttribute("aria-label", t.trkIn); $("#sf .btn").textContent = t.trkBtn;
    $("#faq h2").textContent = t.faqH;
    $("#fl").innerHTML = t.faq.map(function (q) { return "<details><summary>" + esc(q[0]) + "</summary><p>" + esc(q[1]) + "</p></details>"; }).join("");
    $(".fgr h2").textContent = t.footH; $("#fa").textContent = t.addr; $("#fh").textContent = t.hours;
    $("#bkh").textContent = t.bkH; ["h1", "h2", "h3", "h4", "h5"].forEach(function (k, i) { $("#" + k).textContent = t["b" + (i + 1)]; });
    $("[data-trip=rt]").textContent = t.rt; $("[data-trip=ow]").textContent = t.ow;
    $("#lf").textContent = t.fromL; $("#lt").textContent = t.toL; $("#ld1").textContent = t.d1; $("#ld2").textContent = t.d2;
    $("#bn").placeholder = t.name; $("#bn").setAttribute("aria-label", t.name); $("#bp").placeholder = t.phone; $("#bp").setAttribute("aria-label", t.phone); $("#bo").placeholder = t.note; $("#bo").setAttribute("aria-label", t.note);
    $("#bsend").textContent = t.send; $(".sm small").textContent = t.sendNote; $(".sm h4").textContent = t.est; $(".sm .tt span").textContent = t.tot;
    $("#ok h3").textContent = t.okH; $("#ok p").textContent = t.okP; $("#bwa").textContent = t.send; $("#btr").textContent = t.track; $("#bkx").setAttribute("aria-label", t.close);
    $("#waf").href = "https://wa.me/" + D.wa + "?text=" + encodeURIComponent(T.fr.waHead);
    if (!$("#bf").options.length) $("#bf").innerHTML = D.from.map(function (f) { return '<option value="' + f[0] + '"></option>'; }).join("");
    $$("#bf option").forEach(function (o, i) { o.textContent = D.from[i][1][S.lang]; });
    $("#bt").innerHTML = D.to.map(function (d) { return '<option value="' + d.id + '"' + (d.id === S.to ? " selected" : "") + ">" + esc(d.c[S.lang]) + "</option>"; }).join("");
    $("#bf").value = S.from;
  }

  /* ---------- départs ---------- */
  function renderBoard() {
    var t = T_();
    $("#brd").innerHTML = D.to.map(function (d) {
      var p = r500(d.p * Math.min.apply(null, D.season));
      return '<button type="button" class="fr" data-to="' + d.id + '"><span class="t">' + ISO(d.t) + '</span><span class="f">' + d.f + '</span><span class="c"><b>' + esc(d.c[S.lang]) + "</b><span>" + esc(d.k[S.lang]) + '</span></span><span class="h">' + d.h + '</span><span class="p"><small>' + t.from + "</small>" + money(p) + "<small>" + t.pp + "</small></span></button>";
    }).join("");
    if (!$("#dpic img")) $("#dpic").innerHTML = ["hero/comptoirs.webp", "dest/paris.webp", "dest/montreal.webp", "hero/panneau.webp"].map(function (s, i) { return '<img src="assets/img/' + s + '" alt="" loading="lazy" decoding="async" data-k="' + s + '"' + (i === 0 ? ' class="on"' : "") + ">"; }).join("");
  }
  function showPic(id) {
    var k = (TO[id] && TO[id].img) || "hero/comptoirs.webp";
    $$("#dpic img").forEach(function (i) { i.classList.toggle("on", i.getAttribute("data-k") === k); });
  }

  /* ---------- calendrier des prix ---------- */
  function renderCal() {
    var t = T_(), d = TO[S.dest];
    $("#chips").innerHTML = D.to.map(function (x) { return '<button type="button" data-dest="' + x.id + '" aria-pressed="' + (x.id === S.dest) + '">' + esc(x.c[S.lang]) + "</button>"; }).join("");
    var vals = D.season.map(function (c) { return r500(d.p * c); }), mx = Math.max.apply(null, vals), mn = Math.min.apply(null, vals);
    var first = !$("#bars .bar");
    $("#bars").innerHTML = vals.map(function (v, i) {
      return '<div class="bar' + (v === mn ? " lo" : v === mx ? " hi" : "") + '"><div class="col"><b>' + money(v).replace(/\s(DA|DZD)$/, "") + '</b><i style="--h:' + (first ? 0 : (v / mx).toFixed(3)) + '" data-h="' + (v / mx).toFixed(3) + '"></i></div><span>' + monthName(i) + '</span><button type="button" data-m="' + i + '" aria-label="' + monthName(i) + " " + money(v) + '"></button></div>';
    }).join("");
    if (first) requestAnimationFrame(function () { $$("#bars i").forEach(function (e) { e.style.setProperty("--h", e.getAttribute("data-h")); }); });
    $("#calx").innerHTML = '<div>' + t.calBest + '<br><b>' + monthName(vals.indexOf(mn)) + " · " + money(mn) + '</b></div><div>' + t.calHigh + '<br><b>' + monthName(vals.indexOf(mx)) + " · " + money(mx) + "</b></div>";
  }
  function renderFares() {
    var t = T_();
    $("#fg").innerHTML = D.fares.map(function (f, i) {
      return '<div class="fc' + (i === 2 ? " hot" : "") + '"><h3>' + esc(f.n[S.lang]) + '</h3><div class="ad">' + (f.add ? "+ " + money(f.add) : "0") + "</div><small>" + t.perPax + "</small><p>" + esc(f.d[S.lang]) + '</p><button type="button" class="btn' + (i ? " o" : "") + '" data-fare="' + f.id + '">' + t.bookShort + "</button></div>";
    }).join("");
  }
  function renderVisa() {
    var t = T_();
    $("#vl").innerHTML = D.visa.map(function (v) {
      return '<div class="vr"><h3>' + esc(v.n[S.lang]) + '</h3><div class="vp2"><small>' + t.visaFrom + "</small>" + money(v.p) + "</div><p>" + esc(v.d[S.lang]) + '</p><button type="button" class="btn o" data-visa="' + v.id + '">' + t.visaBtn + "</button></div>";
    }).join("");
  }

  /* ---------- hero : le hublot ---------- */
  var phI = -1;
  function setPhase(i, force) {
    if (i === phI && !force) return; phI = i;
    var P = T_().ph[i], b = $("#ph b"), e = $("#ph em"), s = $("#ph span");
    var set = function () { b.textContent = P.t; e.textContent = P.n; s.textContent = P.s; };
    if (reduce || force) { set(); return; }
    gsap.to("#ph > *", { opacity: 0, y: 8, duration: 0.14, overwrite: true, onComplete: function () { set(); gsap.to("#ph > *", { opacity: 1, y: 0, duration: 0.3, stagger: 0.04 }); } });
  }
  function planeAt(p) {
    var path = $("#rp1"), L = path.getTotalLength(), r = $("#rt").getBoundingClientRect(), pln = $("#pln"); if (!pln) return;
    var a = path.getPointAtLength(L * p), b = path.getPointAtLength(Math.min(L, L * p + 2));
    var x = a.x / 1000 * r.width, y = a.y / 70 * r.height, ang = Math.atan2((b.y - a.y) / 70 * r.height, (b.x - a.x) / 1000 * r.width) * 180 / Math.PI;
    var rtl = S.lang === "ar";
    pln.style.transform = "translate(" + (rtl ? r.width - x : x) + "px," + y + "px) translate(-50%,-50%) rotate(" + (rtl ? 180 - ang : ang) + "deg)";
    path.style.strokeDasharray = L; path.style.strokeDashoffset = L * (1 - p);
  }

  var ctx = null, lenis = null;
  function scenes() {
    if (reduce) { planeAt(0.4); return; }
    if (ctx) ctx.revert();
    ctx = gsap.context(function () {
      var rtl = S.lang === "ar" ? -1 : 1, mob = innerWidth < 860, lk = $$(".lk");
      gsap.set(lk[1], { opacity: 0 }); gsap.set(lk[2], { opacity: 0 });
      gsap.set("#win", { rotationY: -14 * rtl, rotationZ: -5 * rtl });
      var st = { progress: 0 };
      var tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: "#hero", start: "top top", end: "+=" + (mob ? 260 : 320) + "%", pin: true, scrub: 0.7, anticipatePin: 1,
        onUpdate: function (s) { setPhase(s.progress < 0.34 ? 0 : s.progress < 0.67 ? 1 : 2); planeAt(s.progress); } } });
      tl.to("#win", { rotationY: 14 * rtl, rotationZ: 5 * rtl, y: -14, duration: 3 }, 0)
        .to(lk[1], { opacity: 1, duration: 0.5 }, 0.55).to(lk[2], { opacity: 1, duration: 0.5 }, 1.6)
        .to(lk[0].firstChild, { scale: 1.12, duration: 3 }, 0)
        .to("#hl", { opacity: 0.0, y: -30, duration: 0.8 }, 2.2);
      gsap.from("#win", { y: 70, rotationX: 12, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.1 });
      gsap.from("#hl > *", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.3 });
      planeAt(0);
    });
    ScrollTrigger.refresh();
  }
  function headerWatch() {
    var hd = $("#hd");
    function run() { var hr = $("#hero").getBoundingClientRect(); hd.classList.toggle("solid", !(hr.top <= 1 && hr.bottom >= 68) && scrollY > 40); }
    if (reduce) { addEventListener("scroll", run, { passive: true }); addEventListener("resize", run); } else { gsap.ticker.add(run); }
    run();
  }

  /* ---------- réservation ---------- */
  function openBk(o) {
    o = o || {};
    if (o.to) { S.to = o.to; S.dest = o.to; }
    if (o.fare) S.fare = o.fare;
    if (o.month != null) { var d = new Date(), y = d.getFullYear(); if (o.month < d.getMonth() || (o.month === d.getMonth() && d.getDate() > 15)) y++; S.d1 = y + "-" + ("0" + (o.month + 1)).slice(-2) + "-15"; S.d2 = ""; }
    if (o.visa) { S.visa = true; var map = { fr: "CDG", es: "MAD", tr: "IST", ca: "YUL" }; S.to = map[o.visa]; S.dest = S.to; }
    else if (o.to || o.fare) S.visa = S.visa && !!VISA_FOR[S.to];
    $("#bkf").hidden = false; $("#ok").hidden = true; $("#er").textContent = "";
    applyText(); renderBk();
    if (!$("#bk").open) $("#bk").showModal();
  }
  function renderBk() {
    var t = T_(), tm = new Date(); tm.setDate(tm.getDate() + 1);
    $$("[data-trip]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-trip") === S.trip); });
    $("#bf").value = S.from; $("#bt").value = S.to;
    $("#bd1").min = iso(tm); $("#bd2").min = S.d1 || iso(tm); $("#bd1").value = S.d1; $("#bd2").value = S.d2;
    $("#ldr").hidden = S.trip === "ow";
    var rows = [["ad", t.ad, 1], ["ch", t.ch, 0], ["inf", t.inf, 0]];
    $("#px").innerHTML = rows.map(function (r) { return '<div class="pr2"><span>' + r[1] + '</span><div class="ct"><button type="button" data-px="' + r[0] + '" data-d="-1" aria-label="-">−</button><output>' + S[r[0]] + '</output><button type="button" data-px="' + r[0] + '" data-d="1" aria-label="+">+</button></div></div>'; }).join("");
    var vf = VISA_FOR[S.to];
    $("#bfo").innerHTML = D.fares.map(function (f) { return '<label><input type="radio" name="fa" value="' + f.id + '"' + (S.fare === f.id ? " checked" : "") + "><span>" + esc(f.n[S.lang]) + " · " + esc(f.d[S.lang]) + "</span><em>" + (f.add ? "+ " + money(f.add) : "0") + "</em></label>"; }).join("") +
      (vf ? '<label><input type="checkbox" id="bv"' + (S.visa ? " checked" : "") + "><span>" + esc(VI[vf].n[S.lang]) + "</span><em>+ " + money(VI[vf].p) + "</em></label>" : "");
    if (!$("#bc").options.length) $("#bc").innerHTML = D.phones.map(function (p) { return '<option value="' + p[0] + '">' + p[0] + " " + p[1] + "</option>"; }).join("");
    renderSum();
  }
  function renderSum() {
    var q = quote(), t = T_();
    var rows = [[TO[S.to].c[S.lang] + " · " + (S.trip === "rt" ? t.rt : t.ow), money(q.base)]];
    if (q.add) rows.push([FA[S.fare].n[S.lang], money(q.add)]);
    if (q.visa) rows.push([VI[VISA_FOR[S.to]].n[S.lang], money(q.visa)]);
    $("#bsum").innerHTML = rows.map(function (r) { return "<li><span>" + esc(r[0]) + "</span><span>" + r[1] + "</span></li>"; }).join("");
    $("#btot").textContent = money(q.tot);
  }
  function finish() {
    var t = T_(), er = $("#er"), q = quote(), f = T.fr;
    var name = $("#bn").value.trim(), ph = $("#bp").value.replace(/[^\d]/g, "");
    if (!S.d1 || (S.trip === "rt" && !S.d2)) { er.textContent = t.needDate; return; }
    if (S.trip === "rt" && S.d2 <= S.d1) { er.textContent = t.needRet; return; }
    if (!name || ph.length < 6) { er.textContent = t.needName; return; }
    er.textContent = "";
    var code = "OFQ-" + (10000 + Math.floor(Math.random() * 89999));
    var pax = [S.ad + " " + f.waAd]; if (S.ch) pax.push(S.ch + " " + f.waCh); if (S.inf) pax.push(S.inf + " " + f.waInf);
    var msg = f.waHead + "\n" + f.waCode + " : " + code + "\n" +
      f.waTrip + " : " + city(S.from, "fr") + " → " + TO[S.to].c.fr + " (" + (S.trip === "rt" ? f.waRT : f.waOW) + ")\n" +
      f.waDates + " : " + fmtL(S.d1, "fr") + (S.trip === "rt" ? " au " + fmtL(S.d2, "fr") : "") + "\n" +
      f.waPax + " : " + pax.join(", ") + "\n" + f.waFare + " : " + FA[S.fare].n.fr + "\n" +
      (q.visa ? f.waVisa + " : " + VI[VISA_FOR[S.to]].n.fr + " (" + da(q.visa) + ")\n" : "") +
      f.waTotal + " : " + da(q.tot) + "\n" + f.waName + " : " + name + "\n" + f.waPhone + " : " + $("#bc").value + " " + ph.replace(/^0/, "") +
      ($("#bo").value.trim() ? "\n" + f.waNote + " : " + $("#bo").value.trim() : "");
    var o = load("orders") || []; o.unshift({ code: code, from: S.from, to: S.to, trip: S.trip, d1: S.d1, d2: S.d2, p: q.tot, name: name, ts: Date.now() }); store("orders", o.slice(0, 10));
    $("#bcode").textContent = code;
    $("#bwa").href = "https://wa.me/" + D.wa + "?text=" + encodeURIComponent(msg);
    $("#bkf").hidden = true; $("#ok").hidden = false; $("#bk").scrollTop = 0;
  }

  /* ---------- suivi ---------- */
  function track(v) {
    var t = T_(), c = String(v || "").toUpperCase().replace(/\s/g, "");
    if (/^\d{5}$/.test(c)) c = "OFQ-" + c;
    var o = null, step = 0;
    if (c === "OFQ-52107") { var a = new Date(), b = new Date(); a.setDate(a.getDate() + 12); b.setDate(b.getDate() + 20); o = { code: c, from: "ALG", to: "CDG", trip: "rt", d1: iso(a), d2: iso(b), p: 124500 }; step = 3; }
    else (load("orders") || []).forEach(function (x) { if (x.code === c) { o = x; step = 1; } });
    var box = $("#st");
    if (!o) { box.innerHTML = '<p class="stm">' + esc(t.trkNo) + "</p>"; return; }
    box.innerHTML = '<div class="stm"><b>' + esc(o.code) + "</b>" + esc(city(o.from) + " → " + TO[o.to].c[S.lang]) + "<br>" + esc(fmtL(o.d1) + (o.trip === "rt" ? " → " + fmtL(o.d2) : "")) + " · " + money(o.p) + "</div>" +
      t.steps.map(function (s, i) { return '<div class="stp' + (i < step ? " ok" : "") + '"><i>' + (i < step ? "✓" : i + 1) + "</i><b>" + esc(s) + "</b></div>"; }).join("");
  }

  /* ---------- événements ---------- */
  document.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-l]"))) { S.lang = b.getAttribute("data-l"); full(); return; }
    if ((b = e.target.closest(".fr[data-to]"))) { openBk({ to: b.getAttribute("data-to") }); return; }
    if ((b = e.target.closest("[data-dest]"))) { S.dest = b.getAttribute("data-dest"); renderCal(); return; }
    if ((b = e.target.closest("#bars [data-m]"))) { openBk({ to: S.dest, month: +b.getAttribute("data-m") }); return; }
    if ((b = e.target.closest("[data-fare]"))) { openBk({ fare: b.getAttribute("data-fare") }); return; }
    if ((b = e.target.closest("[data-visa]"))) { openBk({ visa: b.getAttribute("data-visa") }); return; }
    if (e.target.closest("#hbook")) { openBk(); return; }
    if ((b = e.target.closest("[data-trip]"))) { S.trip = b.getAttribute("data-trip"); renderBk(); return; }
    if ((b = e.target.closest("[data-px]"))) { var k = b.getAttribute("data-px"), n = S[k] + +b.getAttribute("data-d"); S[k] = Math.max(k === "ad" ? 1 : 0, Math.min(9, n)); if (S.inf > S.ad) S.inf = S.ad; renderBk(); return; }
    if (e.target.closest("#bkx") || e.target === $("#bk")) { $("#bk").close(); return; }
    if (e.target.closest("#bsend")) { finish(); return; }
    if (e.target.closest("#btr")) { $("#bk").close(); $("#sc").value = $("#bcode").textContent; track($("#sc").value); setTimeout(function () { if (lenis) lenis.scrollTo($("#trk"), { offset: -4, duration: 1 }); else $("#trk").scrollIntoView(); }, 60); return; }
    if ((b = e.target.closest('a[href^="#"]'))) {
      var el = $(b.getAttribute("href")); if (el && el.id) { e.preventDefault(); if (lenis) lenis.scrollTo(el, { offset: el.id === "hero" ? 0 : -4 }); else el.scrollIntoView(); }
    }
  });
  document.addEventListener("change", function (e) {
    var i = e.target.id;
    if (i === "cur") { S.cur = e.target.value; renderBoard(); renderCal(); renderFares(); renderVisa(); if ($("#bk").open) renderBk(); if ($("#sc").value) track($("#sc").value); }
    else if (i === "bf") { S.from = e.target.value; renderSum(); }
    else if (i === "bt") { S.to = e.target.value; S.dest = S.to; if (!VISA_FOR[S.to]) S.visa = false; renderBk(); renderCal(); }
    else if (i === "bd1") { S.d1 = e.target.value; if (S.d2 && S.d2 <= S.d1) S.d2 = ""; renderBk(); }
    else if (i === "bd2") { S.d2 = e.target.value; renderSum(); }
    else if (i === "bv") { S.visa = e.target.checked; renderSum(); }
    else if (e.target.name === "fa") { S.fare = e.target.value; renderSum(); }
  });
  $("#brd").addEventListener("pointerover", function (e) { var b = e.target.closest(".fr"); if (b) showPic(b.getAttribute("data-to")); });
  $("#sf").addEventListener("submit", function (e) { e.preventDefault(); track($("#sc").value); });
  $("#bk").addEventListener("close", function () { if (lenis) lenis.start(); });
  document.addEventListener("pointermove", function (e) {
    if (reduce || e.pointerType === "touch") return;
    var c = e.target.closest && e.target.closest(".fc");
    $$(".fc").forEach(function (n) { if (n !== c) n.style.transform = ""; });
    if (!c) return;
    var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = "rotateY(" + (x * 10) + "deg) rotateX(" + (-y * 8) + "deg)";
  });

  function full() {
    applyText(); renderBoard(); renderCal(); renderFares(); renderVisa(); setPhase(phI < 0 ? 0 : phI, true);
    if ($("#bk").open) renderBk();
    if ($("#sc").value) track($("#sc").value);
    scenes();
  }

  if (!reduce) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    new MutationObserver(function () { if ($("#bk").open) lenis.stop(); else lenis.start(); }).observe($("#bk"), { attributes: true, attributeFilter: ["open"] });
  }
  full(); headerWatch();
  addEventListener("load", function () { if (!reduce) ScrollTrigger.refresh(); });
})();
