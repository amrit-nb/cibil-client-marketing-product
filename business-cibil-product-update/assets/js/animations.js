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

// ─── Features: sticky section + GSAP scrub (desktop only) ───────────────────
// CSS makes .features-section sticky; JS sets wrapper height = section + extra,
// then uses ScrollTrigger scrub to drive the cards' x transform.
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const mq = window.matchMedia('(min-width: 992px)');
  const wrapper = document.querySelector('.features-scroll-wrapper');
  const section = document.querySelector('.features-section');
  if (!wrapper || !section) return;

  let st = null;

  function initFeatureScroll() {
    if (st) { st.kill(); st = null; }

    // Reset wrapper height so layout re-settles before measuring
    wrapper.style.height = '';

    if (!mq.matches) return;

    const cards = [...section.querySelectorAll('.features-cards')]
      .find(c => !c.classList.contains('hidden'));
    if (!cards) return;

    gsap.set(cards, { x: 0 });
    const extra = cards.scrollWidth - cards.clientWidth;
    if (extra <= 0) {
      wrapper.style.height = '';  // no overflow — normal flow, no scroll distance
      return;
    }

    // Tall wrapper = scroll distance for the horizontal reveal
    wrapper.style.height = (section.offsetHeight + extra) + 'px';

    st = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: () => '+=' + extra,
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: self => gsap.set(cards, { x: -extra * self.progress }),
      onLeaveBack: () => gsap.set(cards, { x: 0 }),
    });
  }

  if (document.readyState === 'complete') {
    initFeatureScroll();
  } else {
    window.addEventListener('load', initFeatureScroll);
  }
  mq.addEventListener('change', initFeatureScroll);

  window.refreshFeatureScroll = function () {
    requestAnimationFrame(() => requestAnimationFrame(initFeatureScroll));
    // Re-sync after tab panel CSS animation finishes (panel-anim = 0.4s)
    setTimeout(() => ScrollTrigger.refresh(), 450);
  };
})();
