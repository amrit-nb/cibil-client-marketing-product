const popupOverlay = document.getElementById('popupOverlay');

function openPopup() {
  popupOverlay.classList.remove('hidden');
  popupOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  popupOverlay.classList.add('hidden');
  popupOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.getElementById('openPopupButton').addEventListener('click', openPopup);
document.getElementById('popupClose').addEventListener('click', closePopup);
popupOverlay.addEventListener('click', (e) => {
  if (e.target === popupOverlay) closePopup();
});

const VALID_CODES = ['CIBIL100', 'SAVE10'];

function applyPopupCode() {
  const input = document.getElementById('discountCode');
  const wrap  = document.getElementById('ppCodeWrap');
  const msg   = document.getElementById('ppCodeMsg');
  const code  = input.value.trim().toUpperCase();

  wrap.classList.remove('is-success', 'is-error');
  msg.classList.remove('is-visible', 'is-success', 'is-error');

  if (!code) {
    wrap.classList.add('is-error');
    msg.classList.add('is-visible', 'is-error');
    msg.textContent = 'Please enter a promo code.';
    return;
  }

  if (VALID_CODES.includes(code)) {
    wrap.classList.add('is-success');
    msg.classList.add('is-visible', 'is-success');
    msg.textContent = 'Promo code applied successfully!';
  } else {
    wrap.classList.add('is-error');
    msg.classList.add('is-visible', 'is-error');
    msg.textContent = 'Invalid promo code. Please try again.';
  }
  input.blur();
}
