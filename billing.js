(function () {
  var api = (document.querySelector('meta[name="api-base"]') || {}).content || 'https://api.3tabz.com/v1';
  var mode = document.body.getAttribute('data-mode') || 'subscribe';
  var KEY = '3tabz_billing_session';
  var $ = function (id) { return document.getElementById(id); };
  var state = { email: '', token: null, session: null, plan: null, provider: null };
  var params = new URLSearchParams(location.search);
  if (params.get('plan')) state.plan = params.get('plan');

  function hint() {
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { tz = ''; }
    if (tz === 'Africa/Lagos') return 'NG';
    var parts = (navigator.language || '').split('-');
    return (parts[1] || '').toUpperCase().slice(0, 2) || undefined;
  }

  function show(step) {
    ['step-email', 'step-code', 'step-plans', 'step-account', 'step-busy'].forEach(function (s) {
      var el = $(s);
      if (el) el.hidden = s !== step;
    });
  }

  function msg(id, text, tone) {
    var el = $(id);
    if (!el) return;
    el.textContent = text || '';
    el.className = 'note' + (tone ? ' ' + tone : '');
    el.hidden = !text;
  }

  function call(path, body, auth) {
    var headers = { 'content-type': 'application/json' };
    if (auth && state.token) headers.authorization = 'Bearer ' + state.token;
    return fetch(api + path, { method: 'POST', headers: headers, body: JSON.stringify(body || {}), credentials: 'omit' })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (!r.ok) {
            var m = j && (Array.isArray(j.message) ? j.message.join(' ') : j.message);
            var err = new Error(m || 'Something went wrong. Please try again.');
            err.status = r.status;
            throw err;
          }
          return j && j.data !== undefined ? j.data : j;
        });
      });
  }

  function fmt(minor, cur) {
    try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur, maximumFractionDigits: cur === 'NGN' ? 0 : 2 }).format(minor / 100); }
    catch (e) { return cur + ' ' + (minor / 100).toFixed(2); }
  }

  function saveToken(t) {
    state.token = t;
    try { sessionStorage.setItem(KEY, JSON.stringify({ t: t, at: Date.now() })); } catch (e) { return; }
  }

  function loadToken() {
    try {
      var raw = sessionStorage.getItem(KEY);
      if (!raw) return null;
      var v = JSON.parse(raw);
      if (Date.now() - v.at > 25 * 60 * 1000) { sessionStorage.removeItem(KEY); return null; }
      return v.t;
    } catch (e) { return null; }
  }

  function signOut() {
    try { sessionStorage.removeItem(KEY); } catch (e) { state.token = null; }
    state.token = null;
    show('step-email');
  }

  function providerLabel(p, currency) {
    if (p === 'paystack') return 'Pay in ' + currency + ' · card, bank transfer or USSD';
    return 'Pay by card · ' + currency;
  }

  function renderPlans(s) {
    state.session = s;
    $('who').textContent = s.email;
    var list = $('plans');
    list.innerHTML = '';
    if (s.isPro && s.subscription && s.subscription.status !== 'expired') {
      $('already').hidden = false;
      $('plan-area').hidden = true;
      return;
    }
    $('already').hidden = true;
    $('plan-area').hidden = false;
    if (!s.providers || !s.providers.length || !s.prices || !s.prices.length) {
      msg('plans-msg', 'Web checkout is not available in your region yet. You can subscribe inside the app from the App Store or Google Play.', 'warn');
      return;
    }
    var order = ['pro_yearly', 'pro_monthly', 'family_yearly'];
    if (!state.provider) state.provider = s.providers[0];
    var providers = $('providers');
    providers.innerHTML = '';
    if (s.providers.length > 1) {
      s.providers.forEach(function (p) {
        var cur = (s.prices.find(function (x) { return x.provider === p; }) || {}).currency || '';
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip' + (state.provider === p ? ' on' : '');
        b.textContent = providerLabel(p, cur);
        b.onclick = function () { state.provider = p; renderPlans(s); };
        providers.appendChild(b);
      });
    }
    var prices = s.prices.filter(function (x) { return x.provider === state.provider; })
      .sort(function (a, b) { return order.indexOf(a.plan) - order.indexOf(b.plan); });
    var seen = {};
    prices = prices.filter(function (p) {
      var k = p.plan;
      if (seen[k]) return false;
      seen[k] = true;
      return true;
    });
    if (!state.plan || !prices.some(function (p) { return p.plan === state.plan; })) state.plan = prices[0] && prices[0].plan;
    prices.forEach(function (p) {
      var row = document.createElement('label');
      row.className = 'plan-row' + (state.plan === p.plan ? ' on' : '');
      var perMonth = p.interval === 'year' ? ' · ' + fmt(Math.round(p.amountMinor / 12), p.currency) + ' a month' : '';
      row.innerHTML = '<input type="radio" name="plan" ' + (state.plan === p.plan ? 'checked' : '') + ' />' +
        '<span class="pl"><b></b><small></small></span><span class="pp"></span>';
      row.querySelector('b').textContent = p.label;
      row.querySelector('small').textContent = (p.interval === 'year' ? 'Billed yearly' : 'Billed monthly') + perMonth;
      row.querySelector('.pp').textContent = fmt(p.amountMinor, p.currency) + ' / ' + p.interval;
      row.onclick = function () { state.plan = p.plan; renderPlans(s); };
      list.appendChild(row);
    });
    var sel = prices.find(function (p) { return p.plan === state.plan; });
    $('legal').textContent = sel
      ? 'You will be charged ' + fmt(sel.amountMinor, sel.currency) + ' every ' + sel.interval + ' until you cancel. Cancel any time from your account page; Pro stays active until the end of the paid period. Your reminders and records are always free.'
      : '';
  }

  function renderAccount(s) {
    state.session = s;
    $('acct-email').textContent = s.email;
    var sub = s.subscription;
    var active = sub && (sub.status === 'active' || sub.status === 'grace_period');
    $('acct-status').textContent = active ? (sub.status === 'grace_period' ? 'Pro · payment needs attention' : 'Pro · active') : 'Free plan';
    var end = sub && sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : null;
    $('acct-detail').textContent = !active ? 'You are on the free plan. Reminders, logging and safety checks are always free.'
      : sub.billedOnWeb ? ((sub.autoRenew ? 'Renews on ' : 'Ends on ') + end + '. Billed on this website.')
      : sub.store === 'app_store' ? 'Billed by Apple. Manage it in iPhone Settings, then your name, then Subscriptions.'
      : sub.store === 'play_store' ? 'Billed by Google Play. Manage it in the Play Store, then Payments and subscriptions.'
      : (end ? 'Active until ' + end + '.' : 'Active.');
    $('manage').hidden = !(active && sub.billedOnWeb);
    $('upgrade').hidden = !!active;
  }

  function loadSession() {
    show('step-busy');
    return call('/billing/web/session', { country: hint() }, true)
      .then(function (s) {
        if (mode === 'account') { renderAccount(s); show('step-account'); }
        else { renderPlans(s); show('step-plans'); }
      })
      .catch(function (e) {
        if (e.status === 401) { signOut(); msg('email-msg', 'Please sign in again.', 'warn'); }
        else { show(mode === 'account' ? 'step-account' : 'step-plans'); msg(mode === 'account' ? 'acct-msg' : 'plans-msg', e.message, 'danger'); }
      });
  }

  $('email-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var email = $('email').value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg('email-msg', 'Enter the email you use in the 3TABZ app.', 'warn'); return; }
    state.email = email;
    $('email-btn').disabled = true;
    call('/billing/web/start', { email: email })
      .then(function () {
        $('code-email').textContent = email;
        show('step-code');
        $('code').focus();
      })
      .catch(function (e) { msg('email-msg', e.message, 'danger'); })
      .finally(function () { $('email-btn').disabled = false; });
  });

  $('code-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var code = $('code').value.replace(/\D/g, '');
    if (code.length !== 6) { msg('code-msg', 'Enter the 6-digit code from your email.', 'warn'); return; }
    $('code-btn').disabled = true;
    call('/billing/web/verify', { email: state.email, code: code })
      .then(function (r) { saveToken(r.token); return loadSession(); })
      .catch(function (e) { msg('code-msg', e.message, 'danger'); })
      .finally(function () { $('code-btn').disabled = false; });
  });

  var back = $('code-back');
  if (back) back.addEventListener('click', function () { show('step-email'); });

  var pay = $('pay');
  if (pay) pay.addEventListener('click', function () {
    if (!state.plan || !state.provider) return;
    pay.disabled = true;
    call('/billing/web/checkout', { plan: state.plan, provider: state.provider, country: hint() }, true)
      .then(function (r) { if (r && r.url && /^https:\/\//.test(r.url)) location.href = r.url; })
      .catch(function (e) { msg('plans-msg', e.message, 'danger'); pay.disabled = false; });
  });

  var manage = $('manage');
  if (manage) manage.addEventListener('click', function () {
    manage.disabled = true;
    call('/billing/web/portal', {}, true)
      .then(function (r) { if (r && r.url && /^https:\/\//.test(r.url)) location.href = r.url; })
      .catch(function (e) { msg('acct-msg', e.message, 'danger'); manage.disabled = false; });
  });

  document.querySelectorAll('[data-signout]').forEach(function (b) { b.addEventListener('click', signOut); });

  if (params.get('status') === 'success') msg(mode === 'account' ? 'acct-msg' : 'plans-msg', 'Payment received. Open the 3TABZ app and sign in with the same email: Pro unlocks automatically.', '');
  if (params.get('status') === 'cancelled') msg('plans-msg', 'Checkout was cancelled. You have not been charged.', 'warn');

  state.token = loadToken();
  if (state.token) loadSession(); else show('step-email');
})();
