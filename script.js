(function () {
  "use strict";

  var TELEGRAM_URL = "https://t.me/+LVgmuaf6A-1jZTY0";
  var TELEGRAM_DM_URL = "https://t.me/Aryan_XCLUSIVE";
  var X_PIXEL_ID = "11jvlf";
  var X_LEAD_PIXEL_ID = "";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function track(event, data) {
    var payload = { event: event, ts: new Date().toISOString() };
    for (var k in data) payload[k] = data[k];
    if (window.dataLayer && Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
    console.debug("[funnel]", payload);
  }

  function loadXPixel() {
    if (!X_PIXEL_ID) return;
    (function (e, t, n, s, u, a) {
      s = e.twq = function () {
        s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
      };
      s.version = "1.1";
      s.queue = [];
      u = t.createElement(n);
      u.async = !0;
      u.src = "https://static.ads-twitter.com/uwt.js";
      a = t.getElementsByTagName(n)[0];
      a.parentNode.insertBefore(u, a);
    })(window, document, "script");
    window.twq("init", X_PIXEL_ID);
  }

  function fireX(event, data) {
    if (!window.twq) return;
    try {
      var id = event === "Lead" && X_LEAD_PIXEL_ID ? X_LEAD_PIXEL_ID : X_PIXEL_ID;
      if (!id) return;
      window.twq("track", event, { ...(data || {}), pixel_id: id });
    } catch (e) {}
  }

  function captureUtm() {
    var out = {};
    var params = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach(function (k) {
      var v = params.get(k);
      if (v) out[k] = v;
    });
    return out;
  }

  document.querySelectorAll("[data-tg]").forEach(function (a) {
    a.href = TELEGRAM_URL;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });

  document.querySelectorAll("[data-tg-dm]").forEach(function (a) {
    a.href = TELEGRAM_DM_URL;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });

  var confirmed = false;
  var boxes = Array.prototype.slice.call(document.querySelectorAll(".confirm-box"));
  var hints = Array.prototype.slice.call(document.querySelectorAll(".hint"));

  function syncBoxes() {
    boxes.forEach(function (b) { b.checked = confirmed; });
  }

  function hideHints() {
    hints.forEach(function (h) {
      h.hidden = true;
      h.textContent = "";
    });
  }

  function showHint(anchor) {
    var block = anchor.closest(".cta-block") || anchor.closest(".stickybar");
    if (!block) return;
    var hint = block.querySelector(".hint");
    var box = block.querySelector(".confirm-box");
    if (box) box.focus();
    if (!hint) return;
    hint.textContent = "Tick the 18+ box above, then tap again to open Telegram.";
    hint.hidden = false;
    window.clearTimeout(showHint._t);
    showHint._t = window.setTimeout(hideHints, 4500);
  }

  boxes.forEach(function (box) {
    box.addEventListener("change", function () {
      confirmed = box.checked;
      syncBoxes();
      hideHints();
      track("telegram_confirm", { value: confirmed, utm: captureUtm() });
    });
  });

  document.addEventListener("click", function (e) {
    var link = e.target.closest("[data-tg]");
    if (!link) return;
    if (!confirmed) {
      e.preventDefault();
      showHint(link);
      track("telegram_join_blocked_18", { utm: captureUtm() });
      return;
    }
    track("telegram_join_click", captureUtm());
    fireX("Lead", captureUtm());
  });

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-event]");
    if (!el) return;
    var name = el.getAttribute("data-event");
    if (name === "faq_open") return;
    track(name, { utm: captureUtm() });
  });

  var faqItems = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));
  faqItems.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
      if (open) track("faq_open", { question: q.textContent.trim().slice(0, 60) });
    });
  });

  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reducedMotion) {
      el.textContent = String(target);
      return;
    }
    var start = null;
    var dur = 1400;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var countEls = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if ("IntersectionObserver" in window) {
    var countObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    countEls.forEach(function (el) { countObs.observe(el); });
  } else {
    countEls.forEach(animateCount);
  }

  function nextTip() {
    var now = new Date();
    var next = new Date(now);
    next.setUTCHours(7, 0, 0, 0);
    next.setUTCMinutes(0, 0, 0);
    if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
    return next;
  }

  var cdH = document.getElementById("cd-h");
  var cdM = document.getElementById("cd-m");
  var cdS = document.getElementById("cd-s");

  function pad(n) { return String(n).padStart(2, "0"); }

  function tickCountdown() {
    var diff = Math.max(0, nextTip().getTime() - Date.now());
    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    cdH.textContent = pad(h);
    cdM.textContent = pad(m);
    cdS.textContent = pad(s);
    if (diff <= 1000) track("countdown_zero", {});
  }

  if (cdH && cdM && cdS) {
    tickCountdown();
    window.setInterval(tickCountdown, 1000);
  }

  var stickybar = document.getElementById("stickybar");
  if (stickybar) {
    var shown = false;
    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (y > 480 && !shown) {
        stickybar.hidden = false;
        requestAnimationFrame(function () {
          stickybar.classList.add("visible");
          track("sticky_cta_view");
        });
        shown = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  loadXPixel();
  fireX("PageView", captureUtm());
  track("page_view", captureUtm());
})();
