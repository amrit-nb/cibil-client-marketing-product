// ─── Scroll Reveal ───────────────────────────────────────────────────────────

const animEls = document.querySelectorAll('[data-anim]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.animDelay) || 0;
      setTimeout(() => entry.target.classList.add('is-visible'), delay);
    } else {
      // Remove immediately on leave so it re-animates on scroll back
      entry.target.classList.remove('is-visible');
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

animEls.forEach(el => observer.observe(el));
