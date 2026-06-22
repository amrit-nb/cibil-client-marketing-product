// ─── CIBIL Score: form validation + result screen ────────────────────────────

(function () {
  const form = document.getElementById('scoreForm');
  if (!form) return;

  const formScreen = document.getElementById('formScreen');
  const resultScreen = document.getElementById('resultScreen');
  const updateBtn = document.getElementById('updateScoreBtn');

  const fullName = document.getElementById('fullName');
  const phone = document.getElementById('phone');
  const consent = document.getElementById('consent');

  function setError(input, msg) {
    const slot = form.querySelector('[data-error-for="' + input.id + '"]');
    if (slot) slot.textContent = msg || '';
    const wrap = input.closest('.field-input');
    if (wrap) wrap.classList.toggle('is-invalid', !!msg);
  }

  function validate() {
    let ok = true;

    if (!fullName.value.trim()) {
      setError(fullName, 'Please enter your full name.');
      ok = false;
    } else {
      setError(fullName, '');
    }

    if (!/^\d{10}$/.test(phone.value.trim())) {
      setError(phone, 'Enter a valid 10-digit phone number.');
      ok = false;
    } else {
      setError(phone, '');
    }

    const consentSlot = form.querySelector('[data-error-for="consent"]');
    if (!consent.checked) {
      if (consentSlot) consentSlot.textContent = 'Please accept the consent to continue.';
      ok = false;
    } else if (consentSlot) {
      consentSlot.textContent = '';
    }

    return ok;
  }

  // clear errors as the user fixes them
  [fullName, phone].forEach((input) =>
    input.addEventListener('input', () => setError(input, ''))
  );
  // phone: digits only
  phone.addEventListener('input', () => {
    phone.value = phone.value.replace(/\D/g, '').slice(0, 10);
  });
  consent.addEventListener('change', () => {
    const slot = form.querySelector('[data-error-for="consent"]');
    if (consent.checked && slot) slot.textContent = '';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstInvalid = form.querySelector('.field-input.is-invalid input, [data-error-for]:not(:empty)');
      if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
      return;
    }

    document.getElementById('resName').textContent = fullName.value.trim();
    document.getElementById('resPhone').textContent = phone.value.trim();

    formScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    window.scrollTo(0, 0);

    showScore(randomScore());
  });

  let arcsSwitched = false;

  if (updateBtn) {
    updateBtn.addEventListener('click', () => {
      if (!arcsSwitched) {
        document.getElementById('arcs-figma').style.opacity = '0';
        document.getElementById('arcs-equal').style.opacity = '1';
        document.querySelector('.result-title').textContent = 'The next evolution of the CIBIL Score enabling sharper borrower differentiation for smarter lending';
        document.querySelector('.result-card-label').textContent = 'Enhanced CreditVision Score';
        document.querySelector('.score-note').innerHTML = 'To leverage the power of next generation<br/>CIBIL Score reach out to your Relationship Manager';
        updateBtn.textContent = 'DISCOVER WHAT\'S NEW';
        arcsSwitched = true;
      }
      const inc = Math.floor(Math.random() * 41) + 10; // +10 to +50
      const next = Math.min(SCORE_MAX, currentScore + inc);
      animateToScore(currentScore, next, false);
      currentScore = next;
    });
  }

  // ── Gauge: animate needle + count-up ──

  const SCORE_MIN = 0, SCORE_MAX = 900;
  const needle = document.getElementById('gaugeNeedle');
  const scoreEl = document.getElementById('resScore');
  let currentScore = 0;

  function randomScore() {
    return Math.floor(SCORE_MIN + Math.random() * (SCORE_MAX - SCORE_MIN + 1));
  }

  function angleFor(score) {
    return -90 + ((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 180;
  }

  function animateToScore(from, to, resetFirst) {
    if (resetFirst) {
      needle.style.transition = 'none';
      needle.style.transform = 'rotate(-90deg)';
      void needle.getBBox();
    }
    requestAnimationFrame(() => {
      needle.style.transition = '';
      needle.style.transform = 'rotate(' + angleFor(to) + 'deg)';
    });

    const dur = 1600;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      scoreEl.textContent = Math.round(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(tick);
      else scoreEl.textContent = to;
    }
    requestAnimationFrame(tick);
  }

  function showScore(score) {
    currentScore = score;
    animateToScore(0, score, true);
  }
})();
