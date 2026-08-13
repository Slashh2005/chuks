(function () {
  'use strict';

  /* ---------------- Version toggle ---------------- */
  var versionButtons = document.querySelectorAll('[data-set-version]');
  versionButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var v = btn.getAttribute('data-set-version');
      document.body.setAttribute('data-version', v);
      versionButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      try { localStorage.setItem('wedding-preview-version', v); } catch (e) {}
    });
  });
  try {
    var saved = localStorage.getItem('wedding-preview-version');
    if (saved) {
      document.body.setAttribute('data-version', saved);
      versionButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-set-version') === saved ? 'true' : 'false');
      });
    }
  } catch (e) {}

  /* ---------------- Countdown ---------------- */
  var WEDDING_DATE = new Date('2026-12-18T13:00:00');

  function updateCountdowns() {
    var now = new Date();
    var diff = Math.max(0, WEDDING_DATE - now);

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((diff / (1000 * 60)) % 60);
    var seconds = Math.floor((diff / 1000) % 60);

    var pad = function (n) { return String(n).padStart(2, '0'); };

    document.querySelectorAll('[data-countdown]').forEach(function (el) {
      var d = el.querySelector('[data-days]');
      var h = el.querySelector('[data-hours]');
      var m = el.querySelector('[data-minutes]');
      var s = el.querySelector('[data-seconds]');
      if (d) d.textContent = days;
      if (h) h.textContent = pad(hours);
      if (m) m.textContent = pad(minutes);
      if (s) s.textContent = pad(seconds);
    });
  }
  updateCountdowns();
  setInterval(updateCountdowns, 1000);

  /* ---------------- Gallery data ---------------- */
  var GALLERY_ITEMS = [
    { src: 'assets/images/engagement-garden.jpg', alt: 'Chukwuma and Ellen in a garden setting', tag: 'Engagement', category: 'engagement' },
    { src: 'assets/images/engagement-candid-laugh.jpg', alt: 'Ellen laughing with Chukwuma', tag: 'Engagement', category: 'engagement' },
    { src: 'assets/images/engagement-candid-embrace.jpg', alt: 'Chukwuma and Ellen sharing a joyful embrace', tag: 'Engagement', category: 'engagement' },
    { src: 'assets/images/proposal-arch-kiss.jpg', alt: "Chukwuma and Ellen embracing beneath a floral arch reading 'Will You Marry Me?'", tag: 'Proposal', category: 'proposal' },
    { src: 'assets/images/proposal-bouquet-kiss.jpg', alt: 'Chukwuma and Ellen kissing, holding a bouquet of roses', tag: 'Proposal', category: 'proposal' },
    { src: 'assets/images/proposal-ring-roses.jpg', alt: "Close-up of Ellen's engagement ring surrounded by red roses", tag: 'Proposal', category: 'proposal' },
    { src: 'assets/images/engagement-ring-closeup.jpg', alt: 'Ellen showing her engagement ring while embracing Chukwuma', tag: 'Proposal', category: 'proposal' },
    { placeholder: true, icon: '🧸', caption: 'Childhood photo — coming soon', tag: 'Childhood', category: 'childhood' },
    { placeholder: true, icon: '🎠', caption: 'Childhood photo — coming soon', tag: 'Childhood', category: 'childhood' },
    { placeholder: true, icon: '👶', caption: 'Baby photo — coming soon', tag: 'Baby Days', category: 'baby' },
    { placeholder: true, icon: '🍼', caption: 'Baby photo — coming soon', tag: 'Baby Days', category: 'baby' },
    { video: true, tag: 'Video Slideshow', category: 'video' }
  ];

  function buildTile(item) {
    var fig = document.createElement('figure');
    fig.className = 'gtile';
    fig.setAttribute('data-category', item.category);

    if (item.placeholder) {
      fig.classList.add('gtile--placeholder');
      fig.innerHTML =
        '<span class="gtile__icon" aria-hidden="true">' + item.icon + '</span>' +
        '<span class="gtile__caption">' + item.caption + '</span>' +
        '<span class="gtile__tag">' + item.tag + '</span>';
    } else if (item.video) {
      fig.classList.add('gtile--video');
      fig.innerHTML =
        '<span class="gtile__play" aria-hidden="true">▶</span>' +
        '<span class="gtile__caption" style="margin-top:10px;">Video slideshow — coming soon</span>' +
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

  ['gallery-v1', 'gallery-v2', 'gallery-v3', 'gallery-v4'].forEach(function (id) {
    var grid = document.getElementById(id);
    if (!grid) return;
    GALLERY_ITEMS.forEach(function (item) {
      grid.appendChild(buildTile(item));
    });
  });

  /* ---------------- Gallery filtering ---------------- */
  var filterButtons = document.querySelectorAll('.gallery-filter');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      document.querySelectorAll('.gtile').forEach(function (tile) {
        var match = filter === 'all' || tile.getAttribute('data-category') === filter;
        tile.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------------- RSVP form ---------------- */
  var rsvpForm = document.getElementById('rsvp-form');
  var rsvpSuccess = document.getElementById('rsvp-success');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      rsvpForm.hidden = true;
      rsvpSuccess.hidden = false;
      rsvpSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
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
})();
