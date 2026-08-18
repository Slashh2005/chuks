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

  /* ---------------- Gallery data ---------------- */
  var GALLERY_ITEMS = [
    { src: 'assets/images/engagement-garden.jpg', alt: 'Chukwuma and Ellen in a garden setting', tag: 'Engagement', category: 'engagement' },
    { src: 'assets/images/engagement-candid-laugh.jpg', alt: 'Ellen laughing with Chukwuma', tag: 'Engagement', category: 'engagement' },
    { src: 'assets/images/engagement-candid-embrace.jpg', alt: 'Chukwuma and Ellen sharing a joyful embrace', tag: 'Engagement', category: 'engagement' },
    { src: 'assets/images/proposal-arch-kiss.jpg', alt: "Chukwuma and Ellen embracing beneath a floral arch reading 'Will You Marry Me?'", tag: 'Proposal', category: 'proposal' },
    { src: 'assets/images/proposal-bouquet-kiss.jpg', alt: 'Chukwuma and Ellen kissing, holding a bouquet of roses', tag: 'Proposal', category: 'proposal' },
    { src: 'assets/images/proposal-ring-roses.jpg', alt: "Close-up of Ellen's engagement ring surrounded by red roses", tag: 'Proposal', category: 'proposal' },
    { src: 'assets/images/engagement-ring-closeup.jpg', alt: 'Ellen showing her engagement ring while embracing Chukwuma', tag: 'Proposal', category: 'proposal' }
  ];

  function buildTile(item) {
    var fig = document.createElement('figure');
    fig.className = 'gtile';
    fig.setAttribute('data-category', item.category);

    if (item.placeholder) {
      fig.classList.add('gtile--placeholder');
      fig.innerHTML =
        '<span class="gtile__monogram" aria-hidden="true">C &middot; E</span>' +
        '<span class="gtile__caption">' + item.caption + '</span>' +
        '<span class="gtile__tag">' + item.tag + '</span>';
    } else if (item.video) {
      fig.classList.add('gtile--video');
      fig.innerHTML =
        '<span class="gtile__play" aria-hidden="true">&#9654;</span>' +
        '<span class="gtile__caption" style="margin-top:10px;">Video coming soon</span>' +
        '<span class="gtile__tag">' + item.tag + '</span>';
    } else {
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      img.loading = 'lazy';
      var tag = document.createElement('span');
      tag.className = 'gtile__tag';
      tag.textContent = item.tag;
      fig.appendChild(img);
      fig.appendChild(tag);
    }
    return fig;
  }

  var galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid) {
    GALLERY_ITEMS.forEach(function (item) {
      galleryGrid.appendChild(buildTile(item));
    });
  }

  /* ---------------- Gallery filtering ---------------- */
  var filterButtons = document.querySelectorAll('.gallery-filter');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      document.querySelectorAll('.gtile').forEach(function (tile) {
        var match = filter === 'all' || tile.getAttribute('data-category') === filter;
        if (match) {
          tile.classList.remove('is-hidden');
          requestAnimationFrame(function () { tile.classList.remove('is-filtered-out'); });
        } else {
          tile.classList.add('is-filtered-out');
          setTimeout(function () {
            if (tile.classList.contains('is-filtered-out')) tile.classList.add('is-hidden');
          }, 350);
        }
      });
    });
  });

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
  var revealEls = document.querySelectorAll('.reveal, .gallery-grid .gtile, .details-grid .detail-card, .faq-list .faq-item');
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
