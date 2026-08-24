(function () {
  'use strict';

  /* ---------------- Countdown ---------------- */
  var WEDDING_DATE = new Date('2026-12-18T13:00:00');

  function updateCountdown() {
    var now = new Date();
    var diff = Math.max(0, WEDDING_DATE - now);

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((diff / (1000 * 60)) % 60);
    var seconds = Math.floor((diff / 1000) % 60);

    var pad = function (n) { return String(n).padStart(2, '0'); };

    var el = document.querySelector('[data-countdown]');
    if (!el) return;
    var d = el.querySelector('[data-days]');
    var h = el.querySelector('[data-hours]');
    var m = el.querySelector('[data-minutes]');
    var s = el.querySelector('[data-seconds]');
    if (d) d.textContent = days;
    if (h) h.textContent = pad(hours);
    if (m) m.textContent = pad(minutes);
    if (s) s.textContent = pad(seconds);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------------- RSVP form ---------------- */
  var rsvpForm = document.getElementById('rsvp-form');
  var rsvpSuccess = document.getElementById('rsvp-success');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = rsvpForm.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      fetch(rsvpForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(rsvpForm)
      }).then(function (res) {
        if (!res.ok) throw new Error('RSVP request failed');
        rsvpForm.hidden = true;
        rsvpSuccess.hidden = false;
        rsvpSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }).catch(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
        window.alert("Sorry, your RSVP couldn't be sent — please check your connection and try again.");
      });
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll('.reveal, .details-grid .detail-card, .faq-list .faq-item');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------- Subtle hero parallax ---------------- */
  var heroMedia = document.querySelector('.hero__media img');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroMedia && !reduceMotion) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var offset = Math.min(window.scrollY * 0.12, 60);
        heroMedia.style.transform = 'translateY(' + offset + 'px) scale(1.06)';
        ticking = false;
      });
    }, { passive: true });
  }
})();
