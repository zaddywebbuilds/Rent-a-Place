/* ==========================================================================
   Rent a Place - interaction layer
   Sticky nav, mobile menu, scroll reveals, 3D card tilt.
   ========================================================================== */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- year ---------------- */

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------- sticky nav ---------------- */

  var nav = document.getElementById("hdr");
  var onScroll = function () {
    if (!nav) return;
    nav.classList.toggle("is-stuck", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- mobile menu ---------------- */

  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      burger.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      menu.hidden = open;
      if (!open && nav) nav.classList.add("is-stuck");
    });

    menu.addEventListener("click", function (e) {
      if (e.target.tagName !== "A") return;
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
      menu.hidden = true;
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) burger.click();
    });
  }

  /* ---------------- scroll reveals ---------------- */

  var reveals = document.querySelectorAll(".reveal");

  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger siblings that enter together.
        var delay = Math.min(i * 90, 450);
        setTimeout(function () { el.classList.add("in"); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- 3D card tilt ---------------- */

  if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var MAX = 5; // degrees

    document.querySelectorAll(".tilt").forEach(function (card) {
      var frame = null;

      card.addEventListener("pointermove", function (e) {
        if (frame) return;
        frame = requestAnimationFrame(function () {
          frame = null;
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            "perspective(1100px) rotateY(" + (px * MAX).toFixed(2) + "deg) rotateX(" +
            (-py * MAX).toFixed(2) + "deg) translateY(-6px) scale(1.012)";
        });
      });

      card.addEventListener("pointerleave", function () {
        if (frame) { cancelAnimationFrame(frame); frame = null; }
        card.style.transform = "";
      });
    });
  }

  /* ---------------- form (front end only) ---------------- */

  var form = document.querySelector(".form");
  if (form) {
    form.addEventListener("submit", function (e) {
      // No endpoint is wired yet. Keep the page from navigating to "#"
      // and tell the visitor how to reach the office in the meantime.
      e.preventDefault();

      if (!form.reportValidity()) return;

      var btn = form.querySelector("button[type=submit]");
      var fine = form.querySelector(".form__fine");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Form not connected yet";
      }
      if (fine) {
        fine.innerHTML =
          'This form is not connected yet. Please call ' +
          '<a href="tel:+17783121408">778-312-1408</a> or email ' +
          '<a href="mailto:office@ratzlaffco.ca">office@ratzlaffco.ca</a>.';
      }
    });
  }
})();
