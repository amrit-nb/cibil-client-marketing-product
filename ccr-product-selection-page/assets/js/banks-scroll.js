function setTab(idx) {
  const tabs = Array.from(document.querySelectorAll('.banks-tab'));

  tabs.forEach((tab, tabIdx) => {
    const isActive = tabIdx === idx;
    const bar = tab.querySelector('.tab-bar');
    const desc = tab.querySelector('.tab-desc');

    tab.classList.toggle('active', isActive);
    tab.classList.toggle('inactive', !isActive);

    if (bar) {
      bar.className = isActive ? 'tab-bar blue' : 'tab-bar grey';
    }

    if (desc) {
      desc.style.display = isActive ? 'flex' : 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const section = document.querySelector('.banks-section');
  const stickyWrap = section?.querySelector('.banks-sticky-wrap');
  const tabs = Array.from(section?.querySelectorAll('.banks-tab') || []);

  if (!section || !stickyWrap || !tabs.length) return;

  let activeIndex = 0;
  let isClickScrolling = false;
  setTab(0);
  section.style.setProperty('--banks-progress', 1 / tabs.length);

  const PIN_TOP = 24;

  ScrollTrigger.create({
    trigger: section,
    pin: stickyWrap,
    start: 'top top',
    end: '+=150%',
    scrub: true,
    pinSpacing: true,
    onUpdate: (self) => {
      if (self.isActive) {
        stickyWrap.style.top = PIN_TOP + 'px';
      }
      const progress = self.progress;

      if (!isClickScrolling) {
        const nextIndex = Math.min(tabs.length - 1, Math.floor(progress * tabs.length));

        if (nextIndex !== activeIndex) {
          activeIndex = nextIndex;
          setTab(nextIndex);
        }
      }

      // Smooth progress but offset so tab 0 starts at 1/tabs.length
      const offsetProgress = (1 + progress * (tabs.length - 1)) / tabs.length;
      section.style.setProperty('--banks-progress', Math.min(offsetProgress, 1));
    }
  });

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      activeIndex = idx;
      setTab(idx);
      isClickScrolling = true;

      const trigger = ScrollTrigger.getAll().find(t => t.trigger === section);
      if (trigger) {
        const targetProgress = tabs.length === 1 ? 0 : idx / (tabs.length - 1);
        const targetScroll = trigger.start + (trigger.end - trigger.start) * targetProgress;
        gsap.to(window, {
          scrollTo: targetScroll,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => { isClickScrolling = false; }
        });
      } else {
        isClickScrolling = false;
      }
    });
  });
});
