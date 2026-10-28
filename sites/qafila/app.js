/* Qafila Voyages — agence de voyages de démonstration. Récit au défilement : GSAP + ScrollTrigger + Lenis, servis en local. */
(function () {
  "use strict";
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var S = { lang: "fr", cur: "DZD", pkg: 1, room: 3, dep: 0, pax: 2, tab: "ticket", visa: 0, wkOn: false, tk: { ow: false, pax: 1 } };
  var DD = { id: "", dep: 0, ad: 2, ch: 0 };
  var BK = null;
  var reduce = root.className.indexOf("static") > -1 || !window.gsap || !window.ScrollTrigger;
  if (reduce && root.className.indexOf("static") < 0) root.className += " static";
  function T_() { return T[S.lang]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function store(k, v) { try { localStorage.setItem("qafila-" + k, JSON.stringify(v)); } catch (e) {} }
  function load(k) { try { return JSON.parse(localStorage.getItem("qafila-" + k)); } catch (e) { return null; } }
  var ISO = function (s) { return "⁦" + s + "⁩"; };
  var DEST = {}; D.dest.forEach(function (d) { DEST[d.id] = d; });

  /* ---------- argent et dates ---------- */
  function num(n, l) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, (l || S.lang) === "en" ? "," : " "); }
  function money(v) {
    if (S.cur === "DZD") { var n = num(v); return S.lang === "ar" ? ISO(n) + " دج" : S.lang === "en" ? n + " DZD" : n + " DA"; }
    return new Intl.NumberFormat(S.lang === "en" ? "en-GB" : S.lang === "ar" ? "ar-DZ-u-nu-latn" : "fr-FR", { style: "currency", currency: S.cur, maximumFractionDigits: 0 }).format(v * D.rates[S.cur]);
  }
  function da(v) { return num(v, "fr") + " DA"; }
  function loc(l) { l = l || S.lang; return l === "ar" ? "ar-DZ-u-nu-latn" : l === "en" ? "en-GB" : "fr-FR"; }
  function depDate(i) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + D.dep[i][0]); return d; }
  function fmtD(d, l) { return new Intl.DateTimeFormat(loc(l), { weekday: "short", day: "numeric", month: "long" }).format(d); }
  function fmtS(d, l) { return new Intl.DateTimeFormat(loc(l), { day: "numeric", month: "short" }).format(d); }
  function city(code, l) { for (var i = 0; i < D.from.length; i++) if (D.from[i][0] === code) return D.from[i][1][l || S.lang]; return code; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  var PK = function (id) { return D.omra[id]; };

  var ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6.5"/></svg>',
    kaaba: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l9-4 9 4v11l-9 3-9-3zM3 8l9 3 9-3M12 11v11" fill-opacity=".9" stroke="#0B1530" stroke-width="1.4"/></svg>',
    dome: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c1 2 4 3 4 7H8c0-4 3-5 4-7zM6 11h12v9H6z"/></svg>',
    close: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    plane: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 15.5v-2L13.5 8.5V3a1.5 1.5 0 0 0-3 0v5.5l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5l-2-1.5v-5.5l8 2.5Z"/></svg>'
  };

  /* ---------- hublot : les scènes ---------- */
  var SC = ["hero/ciel", "hero/istanbul", "hero/cappadoce", "hero/dubai", "hero/zanzibar"];
  var SCW = [0, 0.16, 0.38, 0.6, 0.82, 1];
  var heroP = 0, hz = { dx: 0, dy: 0, sc: 1.8 };
  function heroCaption(i) {
    var t = T_(), b = $("#hcap b"), s = $("#hcap span");
    var key = i + S.lang + S.cur; if (b.dataset.k === key) return; b.dataset.k = key;
    var set = function () {
      if (i === 0) { b.textContent = t.skyN; s.textContent = t.skyS; }
      else { var d = D.dest[i - 1]; b.textContent = d.n[S.lang]; s.textContent = d.tag[S.lang] + " · " + t.dep + " " + money(d.p); }
    };
    if (reduce || !window.gsap) { set(); return; }
    gsap.to("#hcap", { opacity: 0, y: 8, duration: 0.15, overwrite: true, onComplete: function () { set(); gsap.to("#hcap", { opacity: heroP > 0.06 ? 1 : 0, y: 0, duration: 0.3 }); } });
    $$("#hdots i").forEach(function (e, k) { e.classList.toggle("on", k === i); });
  }
  function heroState(p) {
    heroP = p;
    var q = 1 - Math.pow(1 - clamp(p / 0.9, 0, 1), 2.2);
    gsap.set("#wz", { x: hz.dx * q, y: hz.dy * q, scale: 1 + (hz.sc - 1) * q });
    gsap.set("#htx", { opacity: 1 - clamp(p / 0.1, 0, 1), y: -50 * clamp(p / 0.1, 0, 1) });
    gsap.set(".hsc", { opacity: 1 - clamp(p / 0.05, 0, 1) });
    var cur = 0;
    $$(".scn").forEach(function (el, i) {
      var a = SCW[i], b = SCW[i + 1], f = 0.035, o;
      if (i === 0) o = p < b - f ? 1 : clamp((b + f - p) / (2 * f), 0, 1);
      else if (i === 4) o = clamp((p - (a - f)) / (2 * f), 0, 1);
      else o = clamp((p - (a - f)) / (2 * f), 0, 1) * (p < b - f ? 1 : clamp((b + f - p) / (2 * f), 0, 1));
      if (p >= a && (p < b || i === 4)) cur = i;
      el.style.opacity = o.toFixed(3);
      var local = clamp((p - a) / (b - a), 0, 1);
      el.firstChild.style.transform = "scale(" + (1.28 - 0.2 * local).toFixed(3) + ") translate3d(" + ((local - 0.5) * -3).toFixed(2) + "%,0,0)";
    });
    $$("#cl i").forEach(function (c, i) { c.style.transform = "translate3d(" + ((p * (240 + i * 90)) % 260 - 20) + "%," + (Math.sin(p * 9 + i) * 10) + "px,0)"; });
    var show = p > 0.06 ? 1 : 0;
    $("#halt").style.opacity = show; $("#hdots").style.opacity = show;
    $("#hcap").style.opacity = show;
    var alt = Math.round(11000 * Math.pow(Math.sin(Math.PI * clamp(p, 0, 1)), 0.5) / 100) * 100;
    $("#halt b").textContent = num(alt) + " m";
    heroCaption(cur);
  }

  /* ---------- rendu des sections ---------- */
  function staticR() {
    var t = T_(), nav = [["dest", t.nav.dest], ["omra", t.nav.omra], ["bil", t.nav.bil], ["suivi", t.nav.suivi]];
    var lk = function (n) { return '<a href="#' + n[0] + '">' + esc(n[1]) + "</a>"; };
    $("#nav").innerHTML = nav.slice(0, 3).map(lk).join("");
    $("#mnl").innerHTML = nav.map(function (n) { return '<a href="#' + n[0] + '" data-close>' + esc(n[1]) + "</a>"; }).join("");
    $("#fl").innerHTML = nav.map(lk).join("");
    $("#manTx").innerHTML = t.man.split(/\s+/).map(function (w) { return '<span class="wd">' + esc(w) + "</span>"; }).join(" ");
    if (!$("#scs").children.length) {
      $("#scs").innerHTML = SC.map(function (s, i) { return '<div class="scn"><img src="assets/img/' + s + '.webp" alt="" ' + (i < 2 ? "" : 'loading="lazy"') + "></div>"; }).join("");
      $("#hdots").innerHTML = SC.map(function () { return "<i></i>"; }).join("");
    }
    $("#cam").innerHTML = D.dest.map(function (d) {
      return '<button class="dc" data-dest="' + d.id + '" aria-label="' + esc(d.n[S.lang] + " — " + t.seeProg) + '"><img src="assets/img/' + d.img + '.webp" alt="" style="object-position:' + d.pos + '" loading="lazy"><span class="t"><b>' + esc(d.n[S.lang]) + "</b><span>" + esc(t.dDays(d.days) + " · " + d.tag[S.lang]) + "</span><em>" + esc(t.dFrom + " " + money(d.p)) + "</em></span></button>";
    }).join("");
    $("#dcap b").textContent = D.dest[0].n[S.lang]; $("#dcap b").dataset.i = "0";
    $("#qa").innerHTML = t.faq.map(function (x) { return "<details><summary>" + esc(x[0]) + "</summary><p>" + esc(x[1]) + "</p></details>"; }).join("");
    var mq = t.mq.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("");
    $("#mq").innerHTML = mq + mq + mq + mq;
    $("#big").textContent = S.lang === "ar" ? "قافلة" : "Qafila";
    $$("[data-wa]").forEach(function (a) { a.href = "https://wa.me/" + D.wa + "?text=" + encodeURIComponent(T.fr.waHello); });
    omraR(); ticketR(); visaR(); routeLabels(); trHint();
  }

  /* ---------- Omra ---------- */
  function omraR() {
    var t = T_();
    if (!$("#arch").children.length) {
      $("#arch").innerHTML = D.omra.map(function (p, i) { return '<img src="assets/img/' + p.img + '.webp" alt="" style="object-position:' + p.pos + '"' + (i ? ' loading="lazy"' : "") + ">"; }).join("");
      $("#wk").innerHTML = [0, 1].map(function (k) { return "<div><h3><span></span><em></em></h3><div class=\"trk\"><span class=\"g\">" + ICON[k ? "dome" : "kaaba"] + '</span><span class="h" style="inset-inline-start:0"></span></div></div>'; }).join("");
    }
    $("#cfg").innerHTML =
      '<div><h3 class="l">' + esc(t.pkg) + '</h3><div class="chips" id="pkgs">' + D.omra.map(function (p, i) { return '<button class="chip" data-pkg="' + i + '" aria-pressed="false">' + esc(p.n[S.lang]) + ' <span class="stars" aria-hidden="true">' + "★".repeat(p.stars) + "</span></button>"; }).join("") + "</div></div>" +
      '<div class="info" id="pinfo"></div>' +
      '<div><h3 class="l">' + esc(t.room) + '</h3><div class="chips" id="rooms">' + [2, 3, 4].map(function (r) { return '<button class="chip" data-room="' + r + '" aria-pressed="false">' + esc(t["r" + r]) + " <small>" + esc(t.rN(r)) + "</small></button>"; }).join("") + "</div></div>" +
      '<div><h3 class="l">' + esc(t.depart) + '</h3><div class="deps" id="deps" role="radiogroup">' + D.dep.map(function (d, i) { return '<button class="dp" role="radio" data-dep="' + i + '" aria-checked="false"><span>' + esc(fmtD(depDate(i))) + "</span><small>" + esc(t.seatsLeft(d[1])) + "</small></button>"; }).join("") + "</div></div>" +
      '<div class="row2"><div><h3 class="l">' + esc(t.travelers) + '</h3><div class="step"><button data-pax="-1" aria-label="−">−</button><span id="paxN"></span><button data-pax="1" aria-label="+">+</button></div></div></div>' +
      '<ul class="inc">' + t.omraInc.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
      '<div class="tot"><div><small id="oPer"></small><b id="oTot"></b></div><button class="btn" id="oBk">' + esc(t.bookOmra) + "</button></div>";
    omraU();
  }
  function omraU() {
    var t = T_(), p = PK(S.pkg);
    $$("[data-pkg]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.pkg === S.pkg)); });
    $$("[data-room]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.room === S.room)); });
    $$("[data-dep]").forEach(function (b) { b.setAttribute("aria-checked", String(+b.dataset.dep === S.dep)); });
    $("#pinfo").innerHTML = "<span><b>" + esc(t.mecca) + "</b> · " + esc(p.hot[S.lang][0]) + "</span><span><b>" + esc(t.medina) + "</b> · " + esc(p.hot[S.lang][1]) + "</span><span>" + esc(t.nightsL(p.nights[0], p.nights[1])) + "</span>";
    $("#paxN").textContent = S.pax;
    var pp = p.p[S.room]; $("#oPer").textContent = money(pp) + " " + t.perPers + " · " + t.totalL; $("#oTot").textContent = money(pp * S.pax);
    $$("#arch img").forEach(function (im, i) { im.classList.toggle("on", i === S.pkg); });
    $$("#wk > div").forEach(function (el, k) {
      var m = p.dist[k], pct = S.wkOn ? Math.min(92, m / 8) : 0;
      $("span", $("h3", el)).textContent = k ? t.medina : t.mecca;
      $("em", $("h3", el)).textContent = m + " m " + (k ? t.toNabawi : t.toHaram) + " · " + t.walk(m);
      $(".h", el).style.insetInlineStart = pct + "%";
    });
  }

  /* ---------- fenêtre d'une destination ---------- */
  function openDest(id) {
    DD = { id: id, dep: 0, ad: 2, ch: 0 }; ddR(); show($("#dd")); $("#ddb").scrollTop = 0;
  }
  function ddTotal() { var d = DEST[DD.id]; return d.p * DD.ad + d.c * DD.ch; }
  function ddR() {
    var t = T_(), d = DEST[DD.id];
    $("#ddb").innerHTML = '<button class="x" data-close aria-label="' + esc(t.close) + '">' + ICON.close + "</button>" +
      '<div class="ddi"><img src="assets/img/' + d.img + '.webp" alt="" style="object-position:' + d.pos + '"><h2 id="ddT">' + esc(d.n[S.lang]) + "</h2></div>" +
      '<div class="ddb"><p style="color:var(--ink2)">' + esc(d.tag[S.lang] + " · " + t.dDays(d.days)) + "</p>" +
      "<div><h3 class=\"l\" style=\"font-family:var(--b);font-size:.9rem;font-weight:700;margin-bottom:12px\">" + esc(t.prog) + '</h3><ol class="pg">' + d.prog.map(function (x) { return "<li><b>" + esc(x[0][S.lang]) + "</b><span>" + esc(x[1][S.lang]) + "</span></li>"; }).join("") + "</ol></div>" +
      '<div><h3 class="l" style="font-family:var(--b);font-size:.9rem;font-weight:700;margin-bottom:10px">' + esc(t.incl) + '</h3><ul class="inc">' + d.inc[S.lang].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
      '<div><h3 class="l" style="font-family:var(--b);font-size:.9rem;font-weight:700;margin-bottom:10px">' + esc(t.depart) + '</h3><div class="deps" role="radiogroup">' + D.dep.map(function (x, i) { return '<button class="dp" role="radio" data-ddep="' + i + '" aria-checked="false"><span>' + esc(fmtD(depDate(i))) + "</span><small>" + esc(t.seatsLeft(x[1])) + "</small></button>"; }).join("") + "</div></div>" +
      '<div class="row2"><div><h3 class="l" style="font-family:var(--b);font-size:.9rem;font-weight:700;margin-bottom:8px">' + esc(t.adults) + " · " + esc(money(d.p)) + '</h3><div class="step"><button data-dad="-1" aria-label="−">−</button><span id="ddA"></span><button data-dad="1" aria-label="+">+</button></div></div>' +
      '<div><h3 class="l" style="font-family:var(--b);font-size:.9rem;font-weight:700;margin-bottom:8px">' + esc(t.kids) + " · " + esc(money(d.c)) + '</h3><div class="step"><button data-dch="-1" aria-label="−">−</button><span id="ddC"></span><button data-dch="1" aria-label="+">+</button></div></div></div>' +
      '<div class="tot"><div><small>' + esc(t.totalL) + '</small><b id="ddTot"></b></div><button class="btn" id="ddBk">' + esc(t.book) + "</button></div></div>";
    ddU();
  }
  function ddU() {
    $$("[data-ddep]").forEach(function (b) { b.setAttribute("aria-checked", String(+b.dataset.ddep === DD.dep)); });
    $("#ddA").textContent = DD.ad; $("#ddC").textContent = DD.ch; $("#ddTot").textContent = money(ddTotal());
  }

  /* ---------- billets et visas ---------- */
  function phoneBlock(id, f) {
    f = f || {};
    return '<div class="phn"><select class="inp" id="' + id + 'C" aria-label="Indicatif">' + D.phones.map(function (c) { return '<option value="' + c[0] + '"' + (c[0] === (f.cc || "+213") ? " selected" : "") + ">" + c[1] + " " + c[0] + "</option>"; }).join("") + '</select><input class="inp" id="' + id + 'P" type="tel" inputmode="tel" autocomplete="tel-national" dir="ltr" placeholder="0550 12 34 56" value="' + esc(f.phone || "") + '"></div>';
  }
  function ticketR() {
    var t = T_(), me = load("me") || {}, today = new Date(Date.now() + 86400e3).toISOString().slice(0, 10);
    $("#pT").innerHTML = '<form id="tkF" novalidate><div class="fg">' +
      '<label class="f">' + esc(t.tFrom) + '<select class="inp" id="tFrom">' + D.from.map(function (c) { return '<option value="' + c[0] + '">' + esc(c[1][S.lang]) + " (" + c[0] + ")</option>"; }).join("") + "</select></label>" +
      '<label class="f">' + esc(t.tTo) + '<input class="inp" id="tTo" list="dl" autocomplete="off" placeholder="' + esc(t.tToPh) + '"><datalist id="dl">' + D.dest.map(function (d) { return '<option value="' + esc(d.n[S.lang]) + '">'; }).join("") + '</datalist><span class="err" id="eTo"></span></label>' +
      '<div class="w2 chips" role="group"><button type="button" class="chip" data-ow="0" aria-pressed="' + !S.tk.ow + '">' + esc(t.tRet) + '</button><button type="button" class="chip" data-ow="1" aria-pressed="' + S.tk.ow + '">' + esc(t.tOne) + "</button></div>" +
      '<label class="f">' + esc(t.tD1) + '<input class="inp" id="tD1" type="date" min="' + today + '"><span class="err" id="eD1"></span></label>' +
      '<label class="f" id="tD2L"' + (S.tk.ow ? " hidden" : "") + ">" + esc(t.tD2) + '<input class="inp" id="tD2" type="date" min="' + today + '"></label>' +
      '<div class="f w2"><span style="font-size:.86rem;font-weight:600;margin-bottom:6px;display:block">' + esc(t.tPax) + '</span><div class="step"><button type="button" data-tpax="-1" aria-label="−">−</button><span id="tPaxN">' + S.tk.pax + '</span><button type="button" data-tpax="1" aria-label="+">+</button></div></div>' +
      '<label class="f">' + esc(t.tName) + '<input class="inp" id="tName" autocomplete="name" value="' + esc(me.name || "") + '"><span class="err" id="eN"></span></label>' +
      '<div class="f"><span style="font-size:.86rem;font-weight:600;margin-bottom:6px;display:block">' + esc(t.tPhone) + "</span>" + phoneBlock("t", me) + '<span class="err" id="eP"></span></div>' +
      '<div class="w2"><button class="btn wa full" id="tSend">' + esc(t.tSend) + "</button></div></div></form>";
  }
  function visaR() {
    var t = T_(), v = D.visa[S.visa];
    $("#pV").innerHTML = '<h3 class="l" style="font-family:var(--b);font-size:.9rem;font-weight:700;margin-bottom:10px">' + esc(t.vFor) + '</h3><div class="chips" id="vch">' + D.visa.map(function (x, i) { return '<button class="chip" data-visa="' + i + '" aria-pressed="' + (i === S.visa) + '">' + esc(x.n[S.lang]) + "</button>"; }).join("") + "</div>" +
      '<ul class="vlist" id="vl">' + v.docs[S.lang].map(function (x) { return "<li>" + ICON.check + "<span>" + esc(x) + "</span></li>"; }).join("") + "</ul>" +
      '<div class="vm"><span>' + esc(t.vDelay(v.days[0], v.days[1])) + "</span><b>" + esc(t.vFee(v.fee ? num(v.fee) : 0)) + "</b></div>" +
      '<p class="note">' + esc(t.vNote) + '</p><button class="btn dk" id="vGo">' + esc(t.vCta) + "</button>";
  }
  function routeLabels() {
    var t = T_();
    $("#rtA").textContent = t.fromL;
    var z = S.tab === "visa" ? D.visa[S.visa].n[S.lang] : ($("#tTo") && $("#tTo").value.trim()) || D.dest[0].n[S.lang];
    $("#rtZ").textContent = z;
  }
  function routeP(p) {
    var path = $("#rp"), len = path.getTotalLength();
    var a = path.getPointAtLength(len * clamp(p, 0, 1)), b = path.getPointAtLength(len * clamp(p + 0.012, 0, 1));
    var ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    var rtl = root.dir === "rtl";
    $("#rpl").setAttribute("transform", "translate(" + a.x + " " + a.y + ") rotate(" + ang + ")");
    $("#rd").style.strokeDashoffset = String(1 - clamp(p, 0, 1));
  }

  /* ---------- réservation ---------- */
  function describe(b, L) {
    var t = T[L], out = [], tot = 0;
    if (b.kind === "omra") {
      var p = PK(b.pkg), pp = p.p[b.room];
      out.push(p.n[L] + " — " + t["r" + b.room] + " (" + t.rN(b.room) + ")");
      out.push(t.departD + " : " + fmtD(depDate(b.dep), L));
      out.push(t.travelers + " : " + b.pax + " × " + (L === "fr" ? da(pp) : money2(pp, L)));
      tot = pp * b.pax;
    } else if (b.kind === "sejour") {
      var d = DEST[b.id];
      out.push(d.n[L] + " — " + t.dDays(d.days));
      out.push(t.departD + " : " + fmtD(depDate(b.dep), L));
      out.push(t.adults + " : " + b.ad + " × " + (L === "fr" ? da(d.p) : money2(d.p, L)));
      if (b.ch) out.push(t.kids + " : " + b.ch + " × " + (L === "fr" ? da(d.c) : money2(d.c, L)));
      tot = d.p * b.ad + d.c * b.ch;
    } else if (b.kind === "visa") {
      var v = D.visa[b.visa];
      out.push(t.tVisa + " : " + v.n[L]);
      out.push(t.vFee(v.fee ? num(v.fee, L) : 0));
      tot = v.fee;
    } else {
      out.push(t.tTicket + " : " + b.from + " → " + b.to + " (" + (b.ow ? t.tOne : t.tRet) + ")");
      out.push(t.tD1 + " : " + b.d1 + (b.d2 ? " · " + t.tD2 + " : " + b.d2 : ""));
      out.push(t.tPax + " : " + b.pax);
    }
    return { lines: out, total: tot };
  }
  function money2(v, L) { var s = S.lang; S.lang = L; var cu = S.cur; S.cur = "DZD"; var r = money(v); S.lang = s; S.cur = cu; return r; }
  function openBook(b) {
    var me = load("me") || {}; BK = { b: b, f: { name: me.name || "", cc: me.cc || "+213", phone: me.phone || "", from: me.from || "ALG", note: "" } };
    bkR(); show($("#bk")); $("#bkb").scrollTop = 0;
  }
  function bkR() {
    var t = T_(), f = BK.f, d = describe(BK.b, S.lang);
    $("#bkb").innerHTML = '<button class="x" data-close aria-label="' + esc(t.close) + '">' + ICON.close + '</button><div class="ddb" style="padding-top:clamp(40px,6vw,56px)"><h2 id="bkT" style="font-size:2rem">' + esc(t.bkT) + "</h2>" +
      '<div class="sum"><b>' + esc(t.bkSum) + "</b>" + d.lines.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + (d.total ? '<div class="t"><span>' + esc(t.totalL) + "</span><span>" + esc(money(d.total)) + "</span></div>" : "") + "</div>" +
      '<form id="bkF" novalidate class="fg">' +
      '<label class="f w2">' + esc(t.bkName) + '<input class="inp" name="name" autocomplete="name" value="' + esc(f.name) + '"><span class="err" data-e="name"></span></label>' +
      '<div class="f w2"><span style="font-size:.86rem;font-weight:600;margin-bottom:6px;display:block">' + esc(t.bkPhone) + "</span>" + phoneBlock("b", f) + '<span class="err" data-e="phone"></span></div>' +
      '<label class="f w2">' + esc(t.bkFrom) + '<select class="inp" name="from">' + D.from.map(function (c) { return '<option value="' + c[0] + '"' + (c[0] === f.from ? " selected" : "") + ">" + esc(c[1][S.lang]) + "</option>"; }).join("") + "</select></label>" +
      '<label class="f w2">' + esc(t.bkNote) + '<textarea class="inp" name="note" placeholder="' + esc(t.bkNotePh) + '">' + esc(f.note) + "</textarea></label>" +
      '<p class="note w2" style="margin:0">' + esc(t.bkPay) + '</p><div class="w2"><button class="btn full">' + esc(t.bkSend) + "</button></div></form></div>";
  }
  function bkGrab() { var f = $("#bkF"); if (!f) return; BK.f.name = f.name.value; BK.f.cc = $("#bC").value; BK.f.phone = $("#bP").value; BK.f.from = f.from.value; BK.f.note = f.note.value; }
  function validPhone(cc, ph) { return (cc === "+213" ? /^0?[5-7]\d{8}$/ : /^\d{6,12}$/).test(String(ph).replace(/[\s.\-()]/g, "")); }
  function bkSend(e) {
    e.preventDefault(); bkGrab();
    var t = T_(), f = BK.f, ok = true, form = $("#bkF");
    function err(n, m) { var el = $('[data-e="' + n + '"]', form); if (el) el.textContent = m || ""; var inp = n === "phone" ? $("#bP") : form[n]; if (inp) inp.setAttribute("aria-invalid", m ? "true" : "false"); if (m && ok) { ok = false; inp.focus(); } }
    err("name", f.name.trim().length < 3 ? t.errName : ""); err("phone", validPhone(f.cc, f.phone) ? "" : t.errPhone);
    if (!ok) return;
    finish(BK.b, f);
  }
  function finish(b, f) {
    var t = T_(), n = "QFL-" + String(Math.floor(10000 + Math.random() * 90000)), d = describe(b, "fr");
    var dep = b.kind === "omra" || b.kind === "sejour" ? depDate(b.dep).getTime() : 0;
    var orders = load("orders") || []; orders.unshift({ n: n, ts: Date.now(), dep: dep, kind: b.kind }); store("orders", orders.slice(0, 10));
    store("me", { name: f.name.trim(), cc: f.cc, phone: f.phone.trim(), from: f.from });
    var msg = "Bonjour Qafila, je souhaite faire la demande suivante (dossier " + n + ") :\n" + d.lines.map(function (x) { return "• " + x; }).join("\n") +
      (d.total ? "\nTotal estimé : " + da(d.total) : "") + "\nVille de départ : " + city(f.from, "fr") + (f.note && f.note.trim() ? "\nRemarque : " + f.note.trim() : "") + "\nNom : " + f.name.trim() + " · " + f.cc + " " + f.phone.trim().replace(/^0/, "");
    $$("dialog[open]").forEach(function (x) { if (x.id !== "bk") x.close(); });
    $("#bkb").innerHTML = '<button class="x" data-close aria-label="' + esc(t.close) + '">' + ICON.close + '</button><div class="ok"><span class="tick"><svg class="ico" style="width:30px;height:30px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><h2 id="bkT">' + esc(t.okT) + "</h2><p>" + esc(t.okP(n)) + '</p><div class="b2"><a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/' + D.wa + "?text=" + encodeURIComponent(msg) + '">' + esc(t.okWa) + '</a><button class="btn dk" data-trk="' + n + '">' + esc(t.okTrack) + "</button></div></div>";
    show($("#bk"));
  }

  /* ---------- suivi ---------- */
  var DEMO = "QFL-40218";
  function trHint() { $("#trHint").textContent = ""; }
  function track(v) {
    var t = T_(), n = String(v || "").trim().toUpperCase().replace(/\s/g, "");
    if (/^QFL\d{5}$/.test(n)) n = "QFL-" + n.slice(3);
    var bad = function () { $("#trE").textContent = t.trErr; $("#tl").hidden = true; $("#trN").setAttribute("aria-invalid", "true"); };
    if (!/^QFL-\d{5}$/.test(n)) return bad();
    var o = (load("orders") || []).filter(function (x) { return x.n === n; })[0], st, ts, dep;
    if (o) { st = 0; ts = o.ts; dep = o.dep; }
    else if (n === DEMO) { st = 3; ts = Date.now() - 6 * 86400e3; dep = depDate(0).getTime() - 5 * 86400e3; }
    else return bad();
    $("#trE").textContent = ""; $("#trN").setAttribute("aria-invalid", "false"); $("#trN").value = n;
    var fmt = new Intl.DateTimeFormat(loc(), { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }), off = [0, 22, 74, 120, 144];
    $("#tl").innerHTML = '<h3><span dir="ltr">' + n + "</span> · " + esc(t.trNow) + (S.lang === "fr" ? " : " : ": ") + esc(t.trSteps[st]) + "</h3>" + (dep ? '<p class="meta">' + esc(t.trFor(fmtD(new Date(dep)))) + "</p>" : '<p class="meta"></p>') +
      t.trSteps.map(function (s, i) { return '<li class="stp' + (i < st ? " done" : i === st ? " now" : "") + '">' + esc(s) + (i <= st ? "<small>" + esc(fmt.format(new Date(ts + off[i] * 3600e3))) + "</small>" : "") + "</li>"; }).join("");
    $("#tl").hidden = false;
    if (!reduce && window.gsap) gsap.from("#tl .stp", { opacity: 0, y: 14, stagger: 0.09, duration: 0.45, ease: "power2.out" });
  }
  function goTrack(n) { $$("dialog[open]").forEach(function (d) { d.close(); }); var el = $("#suivi"); if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0 }); else el.scrollIntoView(); var o = n || ((load("orders") || [])[0] || {}).n; if (o) { $("#trN").value = o; track(o); } }

  /* ---------- outils ---------- */
  function show(d) { if (!d.open) { try { d.showModal(); } catch (e) { d.setAttribute("open", ""); } } }
  var tT;
  function toast(m) { var el = $("#toast"); el.textContent = m; el.classList.add("on"); clearTimeout(tT); tT = setTimeout(function () { el.classList.remove("on"); }, 2600); }

  /* ---------- le mouvement ---------- */
  var lenis = null, ctx = null;
  function smooth() {
    if (reduce || !window.Lenis) return;
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: { offset: 0 }, prevent: function (n) { return !!(n.closest && n.closest("dialog")); } });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    new MutationObserver(function () { if (document.querySelector("dialog[open]")) lenis.stop(); else lenis.start(); }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
  }
  function headerWatch() {
    var top = $("#top"), dk = $$(".man,#omra,#dest,footer");
    var solid = function () {
      top.classList.toggle("solid", (window.scrollY || 0) > 40);
      var on = dk.some(function (e) { var r = e.getBoundingClientRect(); return r.top <= 32 && r.bottom >= 32; });
      top.classList.toggle("dark", on);
    };
    addEventListener("scroll", solid, { passive: true }); setInterval(solid, 250); solid();
  }
  function intro() {
    if (reduce) { $("#blind").style.display = "none"; return; }
    gsap.fromTo("#htx > *", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out", delay: 0.2 });
    gsap.fromTo("#wz", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.1 });
    gsap.to("#blind", { scaleY: 0, duration: 1.4, ease: "power3.inOut", delay: 0.9 });
  }
  function scenes() {
    if (reduce) {
      $$(".scn").forEach(function (el, i) { el.style.opacity = i === 1 ? 1 : 0; el.firstChild.style.transform = "none"; });
      $("#blind").style.display = "none"; routeP(0.65); return;
    }
    if (ctx) ctx.revert();
    ctx = gsap.context(function () {
      var mob = innerWidth < 800, rtl = root.dir === "rtl";
      /* 1. le hublot : on s'approche, la vue change de ville */
      gsap.set("#wz", { clearProps: "transform,opacity" });
      var r = $("#wz").getBoundingClientRect();
      hz.dx = innerWidth / 2 - (r.left + r.width / 2); hz.dy = innerHeight / 2 - (r.top + r.height / 2) + (mob ? 6 : 14);
      hz.sc = mob ? 2.25 : Math.min(2, (innerHeight * 0.96) / r.height);
      heroState(0);
      var proxy = { p: 0 };
      gsap.to(proxy, { p: 1, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "+=" + (mob ? 420 : 460) + "%", pin: true, scrub: 0.6, anticipatePin: 1 }, onUpdate: function () { heroState(proxy.p); } });
      /* 2. manifeste : chaque mot s'allume */
      gsap.to("#manTx .wd", { opacity: 1, stagger: 0.06, ease: "none", scrollTrigger: { trigger: "#manTx", start: "top 82%", end: "bottom 50%", scrub: true } });
      /* 3. Omra : l'arche suit le défilement, la distance au Haram se parcourt */
      gsap.fromTo("#arch img", { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: "#omra", start: "top bottom", end: "bottom top", scrub: true } });
      ScrollTrigger.create({ trigger: "#wk", start: "top 88%", once: true, onEnter: function () { S.wkOn = true; omraU(); } });
      if (S.wkOn) omraU();
      /* 4. destinations : on traverse le ciel, chaque carte vient vers nous puis passe */
      var cards = $$("#cam .dc"), n = cards.length, DZ = mob ? 760 : 980;
      cards.forEach(function (c, i) {
        var sx = (i % 2 ? 1 : -1) * (rtl ? -1 : 1);
        gsap.set(c, { xPercent: -50, yPercent: -50, x: (mob ? sx * 2 : (rtl ? -1 : 1) * 13 + sx * 4) * innerWidth / 100, y: (i % 3 - 1) * (mob ? 2 : 4) * innerHeight / 100, z: -i * DZ, rotationY: -sx * 6 });
      });
      var depth = function (p) {
        var camZ = p * (n - 0.5) * DZ, near = 0, best = 1e9;
        gsap.set("#cam", { z: camZ });
        cards.forEach(function (c, i) {
          var dz = camZ - i * DZ, o, b;
          if (dz > 0) { o = Math.max(0, 1 - dz / 520); b = Math.min(12, dz / 45); } else { o = Math.max(0, 1 + dz / (DZ * 3)); b = Math.min(8, -dz / 340); }
          c.style.opacity = o.toFixed(3); c.style.filter = b > 0.2 ? "blur(" + b.toFixed(1) + "px)" : "none"; c.style.pointerEvents = o > 0.7 ? "auto" : "none";
          if (Math.abs(dz) < best) { best = Math.abs(dz); near = i; }
        });
        var cap = $("#dcap b"), nm = D.dest[near].n[S.lang]; if (cap.textContent !== nm) cap.textContent = nm;
        $("#dbar i").style.transform = "scaleX(" + p.toFixed(4) + ")";
      };
      depth(0);
      ScrollTrigger.create({ trigger: "#dest", start: "top top", end: "+=" + n * 85 + "%", pin: true, scrub: 1, onUpdate: function (s) { depth(s.progress); } });
      /* 5. billets : l'avion suit la route au fil de la page */
      routeP(0);
      ScrollTrigger.create({ trigger: "#rt", start: "top 88%", end: "bottom 38%", scrub: true, onUpdate: function (s) { routeP(s.progress); } });
      gsap.fromTo("#bgp img", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: "#bil", start: "top bottom", end: "bottom top", scrub: true } });
      /* l'en-tête change de teinte au-dessus des sections sombres */
    });
  }

  /* ---------- langue ---------- */
  function texts() {
    var t = T_();
    $$("[data-i]").forEach(function (e) { var v = t[e.getAttribute("data-i")]; if (typeof v === "string") e.textContent = v; });
    $$("[data-al]").forEach(function (e) { var v = t[e.getAttribute("data-al")]; if (typeof v === "string") { e.setAttribute("aria-label", v); e.setAttribute("title", v); } });
    $("#trN").placeholder = t.trPh; document.title = t.title;
    $("#logo").textContent = $("#logo2").textContent = S.lang === "ar" ? "قافلة" : "QAFILA";
    $("#hcap b").dataset.k = "";
  }
  var booted = false;
  function all() {
    var tkVals = $("#tTo") ? { to: $("#tTo").value, d1: $("#tD1").value, d2: $("#tD2").value, n: $("#tName").value, p: $("#tP").value, c: $("#tC").value, f: $("#tFrom").value } : null;
    texts(); staticR();
    if (tkVals) { $("#tTo").value = tkVals.to; $("#tD1").value = tkVals.d1; $("#tD2").value = tkVals.d2; $("#tName").value = tkVals.n || $("#tName").value; $("#tP").value = tkVals.p || $("#tP").value; $("#tC").value = tkVals.c; $("#tFrom").value = tkVals.f; routeLabels(); }
    if ($("#dd").open) { ddR(); }
    if ($("#bk").open && $("#bkF")) { bkGrab(); bkR(); }
    if (!$("#tl").hidden) track($("#trN").value);
    if (booted) { scenes(); ScrollTrigger.refresh(); heroCaption(0); }
  }
  function lang(l) { S.lang = l; root.lang = l; root.dir = l === "ar" ? "rtl" : "ltr"; $("#lang").value = l; store("lang", l); all(); }
  function cur(c) { S.cur = c; $("#cur").value = c; store("cur", c); all(); }

  /* ---------- événements ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-dest],[data-close],[data-pkg],[data-room],[data-dep],[data-pax],[data-ddep],[data-dad],[data-dch],[data-ow],[data-tpax],[data-tab],[data-visa],[data-trk],[data-goto],#oBk,#ddBk,#vGo,#mb,#demoN");
    if (!el) { if (e.target.tagName === "DIALOG") e.target.close(); return; }
    var a;
    if ((a = el.getAttribute("data-dest"))) { openDest(a); return; }
    if (el.hasAttribute("data-close")) { var dl = el.closest("dialog"); if (dl) dl.close(); return; }
    if ((a = el.getAttribute("data-pkg"))) { S.pkg = +a; omraU(); return; }
    if ((a = el.getAttribute("data-room"))) { S.room = +a; omraU(); return; }
    if ((a = el.getAttribute("data-dep"))) { S.dep = +a; omraU(); return; }
    if ((a = el.getAttribute("data-pax"))) { S.pax = clamp(S.pax + +a, 1, 10); omraU(); return; }
    if ((a = el.getAttribute("data-ddep"))) { DD.dep = +a; ddU(); return; }
    if ((a = el.getAttribute("data-dad"))) { DD.ad = clamp(DD.ad + +a, 1, 10); ddU(); return; }
    if ((a = el.getAttribute("data-dch"))) { DD.ch = clamp(DD.ch + +a, 0, 8); ddU(); return; }
    if ((a = el.getAttribute("data-ow"))) { S.tk.ow = a === "1"; $$("[data-ow]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === el)); }); $("#tD2L").hidden = S.tk.ow; return; }
    if ((a = el.getAttribute("data-tpax"))) { S.tk.pax = clamp(S.tk.pax + +a, 1, 9); $("#tPaxN").textContent = S.tk.pax; return; }
    if ((a = el.getAttribute("data-tab"))) { S.tab = a; $("#tbT").setAttribute("aria-selected", String(a === "ticket")); $("#tbV").setAttribute("aria-selected", String(a === "visa")); $("#pT").hidden = a !== "ticket"; $("#pV").hidden = a !== "visa"; routeLabels(); if (window.ScrollTrigger) ScrollTrigger.refresh(); return; }
    if ((a = el.getAttribute("data-visa"))) { S.visa = +a; visaR(); routeLabels(); if (!reduce) gsap.from("#vl li", { opacity: 0, y: 10, stagger: 0.07, duration: 0.4 }); return; }
    if ((a = el.getAttribute("data-trk"))) { goTrack(a); return; }
    if (el.hasAttribute("data-goto")) { goTrack(); return; }
    if (el.id === "oBk") { openBook({ kind: "omra", pkg: S.pkg, room: S.room, dep: S.dep, pax: S.pax }); return; }
    if (el.id === "ddBk") { var d0 = DD; $("#dd").close(); openBook({ kind: "sejour", id: d0.id, dep: d0.dep, ad: d0.ad, ch: d0.ch }); return; }
    if (el.id === "vGo") { openBook({ kind: "visa", visa: S.visa }); return; }
    if (el.id === "mb") { show($("#mn")); return; }
    if (el.id === "demoN") { $("#trN").value = DEMO; track(DEMO); return; }
  });
  document.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && e.target.id === "demoN") { e.preventDefault(); $("#trN").value = DEMO; track(DEMO); } });
  document.addEventListener("change", function (e) {
    var el = e.target;
    if (el.id === "lang") lang(el.value); else if (el.id === "cur") cur(el.value);
  });
  document.addEventListener("input", function (e) { if (e.target.id === "tTo") routeLabels(); });
  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (f.id === "bkF") { bkSend(e); return; }
    if (f.id === "trF") { e.preventDefault(); track($("#trN").value); return; }
    if (f.id === "tkF") {
      e.preventDefault();
      var t = T_(), ok = true;
      function err(id, m, inp) { $(id).textContent = m || ""; if (inp) { $(inp).setAttribute("aria-invalid", m ? "true" : "false"); if (m && ok) { ok = false; $(inp).focus(); } } }
      err("#eTo", $("#tTo").value.trim().length < 2 ? t.errTo : "", "#tTo");
      err("#eD1", $("#tD1").value ? "" : t.errDate, "#tD1");
      err("#eN", $("#tName").value.trim().length < 3 ? t.errName : "", "#tName");
      err("#eP", validPhone($("#tC").value, $("#tP").value) ? "" : t.errPhone, "#tP");
      if (!ok) return;
      var fd = function (v) { return v ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(new Date(v + "T12:00")) : ""; };
      var tk = { kind: "ticket", from: city($("#tFrom").value, "fr"), to: $("#tTo").value.trim(), ow: S.tk.ow, d1: fd($("#tD1").value), d2: S.tk.ow ? "" : fd($("#tD2").value), pax: S.tk.pax };
      finish(tk, { name: $("#tName").value, cc: $("#tC").value, phone: $("#tP").value, from: $("#tFrom").value, note: "" });
    }
  });

  /* ---------- démarrage ---------- */
  function boot() {
    var l = load("lang"), c = load("cur");
    if (c && D.rates[c]) { S.cur = c; $("#cur").value = c; }
    if (l === "fr" || l === "en" || l === "ar") { S.lang = l; root.lang = l; root.dir = l === "ar" ? "rtl" : "ltr"; $("#lang").value = l; }
    var q = (location.search.match(/[?&]lang=(fr|en|ar)/) || [])[1]; if (q) { S.lang = q; root.lang = q; root.dir = q === "ar" ? "rtl" : "ltr"; $("#lang").value = q; }
    if (!reduce) gsap.registerPlugin(ScrollTrigger);
    all(); smooth(); headerWatch(); booted = true; scenes(); intro();
    $("#trN").value = DEMO; track(DEMO);
    if (!reduce) { addEventListener("load", function () { ScrollTrigger.refresh(); }); var rt; addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { scenes(); ScrollTrigger.refresh(); }, 250); }); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!reduce) ScrollTrigger.refresh(); });
  }
  boot();
})();
