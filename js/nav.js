// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Scroll-triggered reveal animations
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Duplicate marquee content for a seamless infinite loop
  document.querySelectorAll('.marquee-track').forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  // Company logos: pull a small favicon per company from its (guessed) domain.
  //
  // Each company's logo is loaded in stages (no single source is complete):
  //   1. Clearbit's logo API — actual brand logos; returns a clean 404 on miss.
  //   2. Google's s2/favicons service — fast, but returns a generic ~16px
  //      globe (HTTP 200, NOT an error) for domains it hasn't indexed.
  //   3. The site's own /favicon.ico — recovers newer/smaller sites the two
  //      services don't have yet (e.g. rallyup.team), even though the domain is fine.
  //   4. A first-initial letter badge if nothing yields a real icon.
  // Each stage declares a minimum acceptable pixel size; a load smaller than
  // that (Google's globe, or a 0x0 non-image response) is rejected and we
  // advance. Tiles that already carry an embedded <img> logo skip all of this.
  //
  // Requests are also staggered a few ms apart per tile instead of all 128
  // firing in the same tick. Bursting every request at once against the same
  // host on page load is what was silently dropping/erroring a chunk of the
  // logos in testing, especially for the ones this codebase had already
  // double-checked had correct domains (Avibra, RiskMatch, Zeel, etc.) —
  // it was a load-pattern problem, not a wrong-domain problem.
  const tiles = Array.from(document.querySelectorAll('.company-tile'));
  const STAGGER_MS = 60;

  tiles.forEach((tile, i) => {
    const domain = tile.getAttribute('data-domain');
    const nameEl = tile.querySelector('.company-name-text');
    const initial = (nameEl ? nameEl.textContent.trim() : '?').charAt(0).toUpperCase();

    const head = tile.querySelector('.company-head') || tile;

    const fallback = document.createElement('span');
    fallback.className = 'company-logo-fallback';
    fallback.textContent = initial;

    // No confirmed domain for this one (too ambiguous/collision-risk to guess) —
    // go straight to the initial badge instead of trying a favicon fetch.
    if (!domain) {
      if (!tile.querySelector('.company-logo')) head.insertBefore(fallback, head.firstChild);
      return;
    }

    const img = document.createElement('img');
    img.className = 'company-logo';
    img.alt = '';
    head.insertBefore(img, head.firstChild);

    // Swap in the letter badge (same element the no-domain tiles use).
    const useBadge = () => { if (img.parentNode) img.replaceWith(fallback); };

    // Ordered logo sources. `min` = smallest pixel width that counts as a real
    // result for that stage (Google's "no icon" globe is ~16px, so it's rejected
    // at 24; Clearbit and direct favicons just need to be a real image, so 1).
    const stages = [
      { src: `https://logo.clearbit.com/${domain}?size=128`,               min: 1  },
      { src: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,  min: 24 },
      { src: `https://${domain}/favicon.ico`,                              min: 1  },
    ];
    let s = 0;
    const tryStage = () => {
      if (s >= stages.length) { useBadge(); return; }
      img.src = stages[s].src;
    };
    img.onerror = () => { s++; tryStage(); };
    img.onload  = () => { if (img.naturalWidth < stages[s].min) { s++; tryStage(); } };

    // Stagger start times so all tiles don't hit the network in the same tick.
    setTimeout(tryStage, i * STAGGER_MS);
  });
});
