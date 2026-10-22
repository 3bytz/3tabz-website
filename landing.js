(function () {
  var api = (document.querySelector('meta[name="api-base"]') || {}).content || 'https://api.3tabz.com/v1';
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { tz = ''; }
  var lang = (navigator.language || 'en-US').split('-');
  var country = (lang[1] || '').toUpperCase();
  if (tz === 'Africa/Lagos') country = 'NG';
  var ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/.test(ua)) document.querySelectorAll('[data-store="android"]').forEach(function (a) { a.style.display = 'none'; });
  if (/Android/.test(ua)) document.querySelectorAll('[data-store="ios"]').forEach(function (a) { a.style.display = 'none'; });
  function fmt(minor, cur) {
    try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur, maximumFractionDigits: cur === 'NGN' ? 0 : 2 }).format(minor / 100); }
    catch (e) { return cur + ' ' + (minor / 100).toFixed(2); }
  }
  fetch(api + '/billing/web/prices?country=' + encodeURIComponent(country), { credentials: 'omit' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (body) {
      var d = body && (body.data || body);
      if (!d || !d.enabled || !d.prices || !d.prices.length) return;
      var preferred = d.providers && d.providers[0];
      ['pro_yearly', 'family_yearly'].forEach(function (plan) {
        var el = document.querySelector('[data-price="' + plan + '"]');
        var p = d.prices.find(function (x) { return x.plan === plan && x.provider === preferred; }) || d.prices.find(function (x) { return x.plan === plan; });
        if (el && p) el.innerHTML = fmt(p.amountMinor, p.currency) + ' <small>/ ' + p.interval + '</small>';
      });
      var note = document.getElementById('price-note');
      if (note) note.textContent = 'Shown in your local currency. Taxes may apply at checkout.';
    })
    .catch(function () { return null; });
})();
