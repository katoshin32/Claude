(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var mobileNav = document.getElementById("mobileNav");
  var menuIco = document.getElementById("menuIco");
  var open = false;
  function setMenu(v) {
    open = v;
    if (!mobileNav) return;
    mobileNav.classList.toggle("hidden", !open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    if (menuIco) menuIco.innerHTML = open
      ? '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'
      : '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>';
  }
  if (menuBtn) menuBtn.addEventListener("click", function () { setMenu(!open); });
  if (mobileNav) mobileNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-btn");
    btn.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", isOpen ? "false" : "true");
      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });

  /* ---------- Reception status (JST-aware) ---------- */
  (function () {
    var text = document.getElementById("statText");
    var dot = document.getElementById("statDot");
    var ping = document.getElementById("statPing");
    if (!text) return;
    // Compute current time in Asia/Tokyo regardless of viewer TZ
    var jst = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    var h = jst.getHours();
    var phoneOpen = h >= 10 && h < 19; // 電話受付 10:00-19:00
    if (phoneOpen) {
      text.textContent = "ただ今 電話受付中";
    } else {
      text.textContent = "ただ今 電話受付時間外";
      if (dot) { dot.classList.remove("bg-sage"); dot.classList.add("bg-gold"); }
      if (ping) { ping.classList.remove("bg-sage"); ping.classList.add("bg-gold"); ping.classList.remove("opacity-70"); ping.style.display = "none"; }
    }
  })();

  /* ---------- GSAP animations ---------- */
  if (reduce || typeof gsap === "undefined") {
    document.querySelectorAll("[data-reveal]").forEach(function (el) { el.style.opacity = 1; });
    return;
  }
  document.documentElement.classList.add("reveal-ready");
  gsap.registerPlugin(ScrollTrigger);

  // Generic reveal
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, y: 22 }, {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  // Hero orchestration
  var heroBits = ["#docCard", "#lawyerPlate", "#lineBubble"];
  gsap.set(heroBits, { opacity: 0 });
  var tl = gsap.timeline({ delay: 0.15 });
  tl.fromTo("#docCard", { opacity: 0, y: 30, rotate: -8 }, { opacity: 1, y: 0, rotate: -3, duration: 0.9, ease: "power3.out" })
    .fromTo("#lawyerPlate", { opacity: 0, y: 20, rotate: 10 }, { opacity: 1, y: 0, rotate: 4, duration: 0.7, ease: "back.out(1.5)" }, "-=0.5")
    .fromTo("#lineBubble", { opacity: 0, scale: 0.7, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(2)" }, "-=0.35");

  // Gentle float loop on document card
  gsap.to("#docCard", { y: "+=8", duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to("#lawyerPlate", { y: "+=6", duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.3 });

  // Process horizontal line draw (desktop)
  var pline = document.getElementById("processLine");
  if (pline) {
    gsap.fromTo(pline, { scaleX: 0 }, {
      scaleX: 1, duration: 1.1, ease: "power2.inOut",
      scrollTrigger: { trigger: pline, start: "top 80%", once: true }
    });
  }

  // Count-up numbers
  gsap.utils.toArray(".count").forEach(function (el) {
    var to = parseFloat(el.getAttribute("data-to")) || 0;
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: to, duration: 1.2, ease: "power2.out",
          onUpdate: function () { el.textContent = Math.round(obj.v).toLocaleString("ja-JP"); },
          onComplete: function () { el.textContent = to.toLocaleString("ja-JP"); }
        });
      }
    });
  });
})();
