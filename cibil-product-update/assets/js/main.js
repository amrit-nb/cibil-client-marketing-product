// ─── Tab switch: Individual / Combo ─────────────────────────────────────────

function switchTab(tab) {
  // make sure the combo pill intro state is dismissed
  expandComboPill();

  // switch pill state
  document.querySelectorAll('.plan-switch-tab').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.tab === tab);
  });

  // swap any element tied to a tab (titles, panels, features headers, toggle)
  document.querySelectorAll('[data-tab-show]').forEach(el => {
    el.classList.toggle('hidden', el.dataset.tabShow !== tab);
  });

  // swap pricing panels with a fade-up replay
  document.querySelectorAll('.tab-panel').forEach(panel => {
    const active = panel.dataset.panel === tab;
    panel.classList.toggle('is-active', active);
    if (active) {
      panel.classList.remove('panel-anim');
      void panel.offsetWidth; // restart animation
      panel.classList.add('panel-anim');
    }
  });

  // combo always starts on Consumer feature cards
  if (tab === 'combo') {
    switchFeatTab('individual');
  } else {
    setFeatPanel('individual');
  }
}

// ─── Consumer / Commercial feature cards (Combo) ────────────────────────────

function switchFeatTab(name) {
  document.querySelectorAll('.feat-toggle-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.feat === name);
  });
  setFeatPanel(name);
}

function setFeatPanel(name) {
  document.querySelectorAll('[data-feat-panel]').forEach(row => {
    const active = row.dataset.featPanel === name;
    row.classList.toggle('hidden', !active);
    if (active) {
      row.classList.remove('panel-anim');
      void row.offsetWidth;
      row.classList.add('panel-anim');
    }
  });
}

// ─── Mobile: View / Hide Features on plan cards ─────────────────────────────

function toggleCardFeatures(btn) {
  const card = btn.closest('.plan-card');
  const features = card.querySelector('.plan-card-features');
  const isOpen = card.classList.contains('is-open');

  if (isOpen) {
    features.style.maxHeight = features.scrollHeight + 'px';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      features.style.maxHeight = '0';
      features.style.opacity = '0';
    }));
    card.classList.remove('is-open');
  } else {
    card.classList.add('is-open');
    features.style.maxHeight = features.scrollHeight + 'px';
    features.style.opacity = '1';
    features.addEventListener('transitionend', () => {
      if (card.classList.contains('is-open')) features.style.maxHeight = 'none';
    }, { once: true });
  }
}

// ─── More Plans collapsible ─────────────────────────────────────────────────

function toggleMorePlans(head) {
  const card = head.closest('.more-plans-card');
  const body = card.querySelector('.mp-body');
  const isOpen = card.classList.contains('is-open');

  if (isOpen) {
    body.style.maxHeight = body.scrollHeight + 'px';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      body.style.maxHeight = '0';
      body.style.opacity = '0';
    }));
    card.classList.remove('is-open');
  } else {
    card.classList.add('is-open');
    body.style.maxHeight = body.scrollHeight + 'px';
    body.style.opacity = '1';
    body.addEventListener('transitionend', () => {
      if (card.classList.contains('is-open')) body.style.maxHeight = 'none';
    }, { once: true });
  }
}

// ─── FAQ accordion ──────────────────────────────────────────────────────────

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('is-open');

  // close any other open item
  document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
    if (openItem !== item) {
      const a = openItem.querySelector('.faq-answer');
      a.style.maxHeight = a.scrollHeight + 'px';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        a.style.maxHeight = '0';
        a.style.opacity = '0';
      }));
      openItem.classList.remove('is-open');
    }
  });

  if (isOpen) {
    answer.style.maxHeight = answer.scrollHeight + 'px';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      answer.style.maxHeight = '0';
      answer.style.opacity = '0';
    }));
    item.classList.remove('is-open');
  } else {
    item.classList.add('is-open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    answer.style.opacity = '1';
    answer.addEventListener('transitionend', () => {
      if (item.classList.contains('is-open')) answer.style.maxHeight = 'none';
    }, { once: true });
  }
}

// ─── Combo pill intro animation ─────────────────────────────────────────────
// Stage 1: only Individual visible (cream bg, white border)
// Stage 2: gold "New" teaser appears (cream bg, yellow border)
// Stage 3 (final): full Combo pill revealed (white bg)

function expandComboPill() {
  const sw = document.querySelector('.plan-switch');
  if (sw) sw.classList.remove('plan-switch--s1', 'plan-switch--s2');
}

setTimeout(() => {
  const sw = document.querySelector('.plan-switch');
  if (sw && sw.classList.contains('plan-switch--s1')) {
    sw.classList.remove('plan-switch--s1');
    sw.classList.add('plan-switch--s2');
  }
}, 1200);

setTimeout(expandComboPill, 2800);

// ─── Init defaults ──────────────────────────────────────────────────────────

// default-open FAQ item
document.querySelectorAll('.faq-item.is-open .faq-answer').forEach(a => {
  a.style.maxHeight = 'none';
  a.style.opacity = '1';
});

// default-open plan cards (mobile expanded state — Premium Duo)
document.querySelectorAll('.plan-card.is-open .plan-card-features').forEach(f => {
  f.style.maxHeight = 'none';
  f.style.opacity = '1';
});
