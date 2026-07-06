// ─── Plan selection ──────────────────────────────────────────────────────────

const puPlansEl = document.getElementById('puPlans');
let puActiveTab = 'individual';

puPlansEl.querySelectorAll('.pu-plan-row').forEach(row => {
  row.addEventListener('click', (e) => {
    if (e.target.closest('.pu-addon-row')) return; // don't reselect when toggling the addon checkbox itself
    selectPlan(row);
  });
});

function selectPlan(row) {
  puPlansEl.querySelectorAll(`.pu-plan-row[data-tab="${puActiveTab}"]`).forEach(r => {
    r.classList.remove('is-selected');
    r.querySelector('input[type="radio"]').checked = false;
  });
  row.classList.add('is-selected');
  row.querySelector('input[type="radio"]').checked = true;
  // Don't reorder here — while the list is expanded, the plan should stay in place.
  // Reordering (selected plan moves to top) only happens when the list collapses.
  updateSummary();
}

// Move the selected row to the top, followed by the hide-toggle and tab-pill,
// so collapsing always shows the selected plan first with the toggle right below it.
function reorderPlans(selectedRow) {
  const hideToggle = document.getElementById('puHideToggle');
  const tabToggle = puPlansEl.querySelector('.pu-plan-toggle');
  puPlansEl.prepend(selectedRow);
  selectedRow.insertAdjacentElement('afterend', hideToggle);
  hideToggle.insertAdjacentElement('afterend', tabToggle);
}

// ─── Add another member (Premium only) ──────────────────────────────────────

function toggleAddMember(checkbox) {
  checkbox.closest('.pu-addon-row').classList.toggle('is-checked', checkbox.checked);
  updateSummary();
}

// ─── Price summary sync ──────────────────────────────────────────────────────

function updateSummary() {
  const selected = puPlansEl.querySelector(`.pu-plan-row[data-tab="${puActiveTab}"].is-selected`);
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

// ─── Hide/show other (non-selected) plans ───────────────────────────────────

function toggleOtherPlans() {
  const collapsed = puPlansEl.classList.toggle('pu-plans-collapsed');
  document.getElementById('puHideToggleLabel').textContent = collapsed ? 'Show other plans' : 'Hide other plans';
  document.getElementById('puHideChevron').classList.toggle('is-collapsed', collapsed);

  if (collapsed) {
    const selected = puPlansEl.querySelector(`.pu-plan-row[data-tab="${puActiveTab}"].is-selected`);
    reorderPlans(selected);
  }
}

// ─── Individual / Combo tab ──────────────────────────────────────────────────

function switchPlanTab(btn, tab, preselectPlan) {
  puActiveTab = tab;
  puPlansEl.querySelectorAll('.pu-plan-toggle-btn').forEach(b => b.classList.toggle('is-active', b === btn));

  // Clear stale selection state from the tab we're leaving — a row hidden by
  // tab mismatch must not also carry .is-selected, or the collapse rule
  // (":not(.is-selected)") can't reliably tell which single row to show.
  puPlansEl.querySelectorAll('.pu-plan-row').forEach(row => {
    row.classList.toggle('hidden', row.dataset.tab !== tab);
    if (row.dataset.tab !== tab) {
      row.classList.remove('is-selected');
      row.querySelector('input[type="radio"]').checked = false;
    }
  });

  const rowsForTab = [...puPlansEl.querySelectorAll(`.pu-plan-row[data-tab="${tab}"]`)];
  const targetRow = (preselectPlan && rowsForTab.find(r => r.dataset.plan === preselectPlan)) || rowsForTab[0];
  rowsForTab.forEach(r => {
    const isTarget = r === targetRow;
    r.classList.toggle('is-selected', isTarget);
    r.querySelector('input[type="radio"]').checked = isTarget;
    const addon = r.querySelector('.pu-addon-checkbox');
    if (addon) { addon.checked = false; addon.closest('.pu-addon-row').classList.remove('is-checked'); }
  });
  if (puPlansEl.classList.contains('pu-plans-collapsed')) {
    reorderPlans(targetRow);
  }

  // Swap "Your selected subscription includes" content
  document.querySelectorAll('[data-includes-tab]').forEach(el => {
    el.classList.toggle('hidden', el.dataset.includesTab !== tab);
  });

  updateSummary();
}

// ─── Promo code (no backend — placeholder) ──────────────────────────────────

function applyPromo() {
  const input = document.getElementById('puPromoInput');
  // ponytail: no real promo validation/backend wired yet, add when promo API exists
  input.blur();
}

// ─── Deep link from index.html Subscribe buttons: ?tab=individual|combo&plan=basic ──

(function initFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab') === 'combo' ? 'combo' : 'individual';
  const plan = params.get('plan');

  const btn = document.querySelector(`.pu-plan-toggle-btn[data-plan-tab="${tab}"]`);
  switchPlanTab(btn, tab, plan);
})();
