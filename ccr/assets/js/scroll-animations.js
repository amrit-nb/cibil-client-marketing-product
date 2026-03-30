document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const enter = 'play none none reverse';

  // Hero — animate on page load (no scroll trigger)
  const heroTl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power2.out' } });
  heroTl
    .from('.hero-label', { opacity: 0, y: 30 })
    .from('.hero-headline', { opacity: 0, y: 30 }, '-=0.5')
    .from('.hero-cta', { opacity: 0, y: 20 }, '-=0.4')
    .from('.hero-play', { opacity: 0, y: 20 }, '-=0.3');

  // Banks section
  gsap.from('.banks-header .section-title', {
    scrollTrigger: { trigger: '.banks-header', start: 'top 85%', toggleActions: enter },
    opacity: 0, y: 40, duration: 0.7, ease: 'power2.out'
  });
  gsap.from('.banks-subtitle', {
    scrollTrigger: { trigger: '.banks-header', start: 'top 85%', toggleActions: enter },
    opacity: 0, y: 30, duration: 0.7, delay: 0.15, ease: 'power2.out'
  });
  gsap.from('.banks-tabs', {
    scrollTrigger: { trigger: '.banks-tabs', start: 'top 85%', toggleActions: enter },
    opacity: 0, y: 30, duration: 0.7, ease: 'power2.out'
  });

  // CCR section
  gsap.from('.ccr-header', {
    scrollTrigger: { trigger: '.ccr-section', start: 'top 80%', toggleActions: enter },
    opacity: 0, y: 40, duration: 0.7, ease: 'power2.out'
  });
  gsap.from('.ccr-item', {
    scrollTrigger: { trigger: '.ccr-list', start: 'top 80%', toggleActions: enter },
    opacity: 0, x: -30, duration: 0.5, stagger: 0.1, ease: 'power2.out'
  });
  gsap.from('.ccr-image', {
    scrollTrigger: { trigger: '.ccr-image', start: 'top 85%', toggleActions: enter },
    opacity: 0, x: 40, duration: 0.8, ease: 'power2.out'
  });

  // Plans section
  gsap.from('.plans-title', {
    scrollTrigger: { trigger: '.plans-section', start: 'top 80%', toggleActions: enter },
    opacity: 0, y: 40, duration: 0.7, ease: 'power2.out'
  });
  gsap.from('.plan-card', {
    scrollTrigger: { trigger: '.plans-grid', start: 'top 85%', toggleActions: enter },
    opacity: 0, y: 40, duration: 0.6, stagger: 0.1, ease: 'power2.out'
  });

  // FAQ section
  gsap.from('.faq-title', {
    scrollTrigger: { trigger: '.faq-section', start: 'top 80%', toggleActions: enter },
    opacity: 0, y: 40, duration: 0.7, ease: 'power2.out'
  });
  gsap.from('.faq-tabs', {
    scrollTrigger: { trigger: '.faq-section', start: 'top 80%', toggleActions: enter },
    opacity: 0, y: 20, duration: 0.5, delay: 0.15, ease: 'power2.out'
  });
  gsap.from('.faq-item', {
    scrollTrigger: { trigger: '.faq-list', start: 'top 85%', toggleActions: enter },
    opacity: 0, y: 25, duration: 0.5, stagger: 0.08, ease: 'power2.out'
  });
});
