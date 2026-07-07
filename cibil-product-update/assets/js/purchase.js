const puPlansEl = document.getElementById('puPlans');
const puOtherEl = document.getElementById('puOtherPlans');
let puActiveTab = 'individual';

const PLAN_ORDER = {
  individual: ['basic', 'standard', 'premium', 'starter'],
  combo: ['basic', 'standard', 'premium']
};

function getAllRows() {
  return [...puPlansEl.querySelectorAll('.pu-plan-row'), ...puOtherEl.querySelectorAll('.pu-plan-row')];
}

function getFirstPlanForTab(tab) {
  return PLAN_ORDER[tab][0];
}

function insertRowInOrder(row) {
  const order = PLAN_ORDER[row.dataset.tab] || [];
  for (const plan of order) {
    if (plan === row.dataset.plan) continue;
    const existing = puOtherEl.querySelector(`.pu-plan-row[data-tab="${row.dataset.tab}"][data-plan="${plan}"]`);
    if (existing) {
      puOtherEl.insertBefore(row, existing);
      return;
    }
  }
  puOtherEl.appendChild(row);
}

puPlansEl.addEventListener('click', (e) => {
  const row = e.target.closest('.pu-plan-row');
  if (!row || e.target.closest('.pu-addon-row')) return;
  selectPlan(row);
});

puOtherEl.addEventListener('click', (e) => {
  const row = e.target.closest('.pu-plan-row');
  if (!row || e.target.closest('.pu-addon-row')) return;
  selectPlan(row);
});

function selectPlan(row) {
  const prev = document.querySelector('.pu-plan-row.is-selected');
  if (prev === row) return;

  if (prev) {
    prev.classList.remove('is-selected');
    prev.querySelector('input[type="radio"]').checked = false;
    const addonPrev = prev.querySelector('.pu-addon-checkbox');
    if (addonPrev) { addonPrev.checked = false; addonPrev.closest('.pu-addon-row').classList.remove('is-checked'); }
  }

  row.classList.remove('hidden');
  row.classList.add('is-selected');
  row.querySelector('input[type="radio"]').checked = true;

  if (puOtherEl.classList.contains('pu-collapsed')) {
    const currentTop = puPlansEl.querySelector('.pu-plan-row');
    if (currentTop && currentTop !== row) {
      insertRowInOrder(currentTop);
    }
    puPlansEl.insertBefore(row, document.getElementById('puHideToggle'));
  }

  updateSummary();
}

function toggleAddMember(checkbox) {
  checkbox.closest('.pu-addon-row').classList.toggle('is-checked', checkbox.checked);
  updateSummary();
}

function updateSummary() {
  const selected = puPlansEl.querySelector('.pu-plan-row.is-selected');
  const price = parseInt(selected.dataset.price, 10);
  const addonCheckbox = selected.querySelector('.pu-addon-checkbox');
  const addMemberChecked = !!(addonCheckbox && addonCheckbox.checked);
  const addonPrice = addMemberChecked ? parseInt(selected.dataset.addonPrice, 10) : 0;

  document.getElementById('puSummaryName').textContent = selected.dataset.name;
  document.getElementById('puSummaryPrice').textContent = '₹' + price.toLocaleString('en-IN');
  document.getElementById('puSummaryDuration').textContent = selected.dataset.summaryDuration;
  document.getElementById('puTotalAmount').textContent = '₹' + (price + addonPrice).toLocaleString('en-IN');

  const addMemberLine = document.getElementById('puAddMemberLine');
  addMemberLine.classList.toggle('hidden', !addMemberChecked);
  if (addMemberChecked) {
    document.getElementById('puAddMemberAmount').textContent = '+ ' + selected.dataset.addonPriceLabel;
  }
}

function toggleOtherPlans() {
  const isCollapsed = puOtherEl.classList.toggle('pu-collapsed');
  document.getElementById('puHideToggleLabel').textContent = isCollapsed ? 'Show other plans' : 'Hide other plans';
  document.getElementById('puHideChevron').classList.toggle('is-collapsed', isCollapsed);

  if (isCollapsed) {
    const selected = puOtherEl.querySelector('.pu-plan-row.is-selected');
    const currentTop = puPlansEl.querySelector('.pu-plan-row');
    if (currentTop && currentTop !== selected) {
      insertRowInOrder(currentTop);
    }
    if (selected) {
      puPlansEl.insertBefore(selected, document.getElementById('puHideToggle'));
    }
  }
}

function switchPlanTab(btn, tab, preselectPlan) {
  puActiveTab = tab;
  puPlansEl.querySelectorAll('.pu-plan-toggle-btn').forEach(b => b.classList.toggle('is-active', b === btn));

  getAllRows().forEach(row => {
    row.classList.toggle('hidden', row.dataset.tab !== tab);
    if (row.dataset.tab !== tab) {
      row.classList.remove('is-selected');
      row.querySelector('input[type="radio"]').checked = false;
      const addon = row.querySelector('.pu-addon-checkbox');
      if (addon) { addon.checked = false; addon.closest('.pu-addon-row').classList.remove('is-checked'); }
    }
  });

  const prev = puPlansEl.querySelector('.pu-plan-row');
  if (prev) {
    insertRowInOrder(prev);
  }

  const allRows = getAllRows().filter(r => r.dataset.tab === tab);
  const targetPlan = preselectPlan || getFirstPlanForTab(tab);
  const targetRow = allRows.find(r => r.dataset.plan === targetPlan) || allRows[0];

  targetRow.classList.remove('hidden');
  targetRow.classList.add('is-selected');
  targetRow.querySelector('input[type="radio"]').checked = true;
  puPlansEl.insertBefore(targetRow, document.getElementById('puHideToggle'));

  document.querySelectorAll('[data-includes-tab]').forEach(el => {
    el.classList.toggle('hidden', el.dataset.includesTab !== tab);
  });

  updateSummary();
}

const PROMO_VALID_CODES = ['CIBIL100', 'SAVE10'];

function togglePromo() {
  const row = document.querySelector('.pu-promo-row');
  const chevron = document.querySelector('.pu-promo-chevron');
  const open = row.classList.toggle('pu-open');
  chevron.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
  if (open) {
    document.getElementById('puPromoInput').focus();
  } else {
    const input = document.getElementById('puPromoInput');
    const msg   = document.getElementById('puPromoMsg');
    input.value = '';
    input.classList.remove('is-success', 'is-error');
    msg.classList.remove('is-visible', 'is-success', 'is-error');
  }
}

function applyPromo() {
  const input = document.getElementById('puPromoInput');
  const msg   = document.getElementById('puPromoMsg');
  const code  = input.value.trim().toUpperCase();

  input.classList.remove('is-success', 'is-error');
  msg.classList.remove('is-visible', 'is-success', 'is-error');

  if (!code) {
    input.classList.add('is-error');
    msg.classList.add('is-visible', 'is-error');
    msg.textContent = 'Please enter a promo code.';
    return;
  }

  if (PROMO_VALID_CODES.includes(code)) {
    input.classList.add('is-success');
    msg.classList.add('is-visible', 'is-success');
    msg.textContent = 'Promo code applied successfully!';
  } else {
    input.classList.add('is-error');
    msg.classList.add('is-visible', 'is-error');
    msg.textContent = 'Invalid promo code. Please try again.';
  }
  input.blur();
}

(function initFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab') === 'combo' ? 'combo' : 'individual';
  const rawPlan = params.get('plan');
  const isDuo = rawPlan === 'premium-duo';
  const plan = isDuo ? 'premium' : rawPlan;
  const btn = document.querySelector(`.pu-plan-toggle-btn[data-plan-tab="${tab}"]`);
  // Start collapsed — no transition on load
  puOtherEl.style.transition = 'none';
  puOtherEl.classList.add('pu-collapsed');
  document.getElementById('puHideChevron').classList.add('is-collapsed');
  requestAnimationFrame(() => { puOtherEl.style.transition = ''; });
  switchPlanTab(btn, tab, plan);
  if (isDuo) {
    const selectedRow = document.querySelector('.pu-plan-row.is-selected');
    const addon = selectedRow && selectedRow.querySelector('.pu-addon-checkbox');
    if (addon) { addon.checked = true; addon.closest('.pu-addon-row').classList.add('is-checked'); updateSummary(); }
  }
})();
