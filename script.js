(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var menu = document.getElementById('mobileMenu');

  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  }

  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) setMenu(false);
  });

  /* ---------- Savings calculator ---------- */
  var RATE = 12.5;          // rupees per unit
  var UNITS_PER_KW = 120;   // units generated per kW per month
  var COST_PER_KW = 65000;  // placeholder system cost per kW

  var billInput = document.getElementById('bill');
  var kindsBox = document.getElementById('kinds');
  var kind = 'Home';

  function inr(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }
  function setText(id, value) {
    document.getElementById(id).textContent = value;
  }

  function calculate() {
    var bill = Number(billInput.value);
    var kw = Math.max(1, Math.round((bill / RATE / UNITS_PER_KW) * 2) / 2);

    var subsidyRaw = Math.min(kw, 2) * 30000 + Math.max(0, Math.min(kw, 3) - 2) * 18000;
    var subsidy = kind === 'Home' ? Math.min(78000, subsidyRaw) : 0;
    var cost = kw * COST_PER_KW;
    var monthly = Math.min(bill, kw * UNITS_PER_KW * RATE);
    var youPay = cost - subsidy;
    var years = youPay / (monthly * 12);

    setText('billText', inr(bill));
    setText('kw', kw % 1 ? kw.toFixed(1) : String(kw));
    setText('subsidy', inr(subsidy));
    setText('subsidyNeg', '– ' + inr(subsidy));
    setText('monthly', inr(monthly));
    setText('payback', years.toFixed(1) + ' yrs');
    setText('lifetime', inr(monthly * 12 * 25));
    setText('cost', inr(cost));
    setText('youPay', inr(youPay));
  }

  billInput.addEventListener('input', calculate);

  kindsBox.addEventListener('click', function (e) {
    var btn = e.target.closest('.kind');
    if (!btn) return;
    kind = btn.getAttribute('data-kind');
    kindsBox.querySelectorAll('.kind').forEach(function (b) {
      var on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    calculate();
  });

  calculate();

  /* ---------- FAQ accordion ---------- */
  var faqList = document.getElementById('faq-list');

  faqList.addEventListener('click', function (e) {
    var q = e.target.closest('.faq-q');
    if (!q) return;
    var item = q.parentElement;
    var willOpen = !item.classList.contains('is-open');

    faqList.querySelectorAll('.faq-item').forEach(function (it) {
      var open = it === item && willOpen;
      it.classList.toggle('is-open', open);
      var btn = it.querySelector('.faq-q');
      btn.setAttribute('aria-expanded', String(open));
      btn.querySelector('.sign').textContent = open ? '–' : '+';
    });
  });
})();
