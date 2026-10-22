(function () {
  var API = 'https://api.3tabz.com/v1';
  var params = new URLSearchParams(location.search || location.hash.replace(/^#/, '?'));
  var token = params.get('token') || '';
  if (history.replaceState) history.replaceState(null, '', location.pathname);
  var f = document.getElementById('f'), m = document.getElementById('m'), b = document.getElementById('b');
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    m.textContent = 'This link is invalid or incomplete. Request a new one from the app (Forgot password).';
    b.disabled = true;
    return;
  }
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var p1 = document.getElementById('p1').value, p2 = document.getElementById('p2').value;
    if (p1.length < 8 || p1.length > 72) { m.textContent = 'Use 8 to 72 characters.'; return; }
    if (p1 !== p2) { m.textContent = 'The passwords do not match.'; return; }
    b.disabled = true; m.textContent = 'Saving…';
    fetch(API + '/auth/reset-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit',
      body: JSON.stringify({ token: token, newPassword: p1 })
    }).then(function (r) {
      if (r.ok) { f.innerHTML = '<p><strong>Password changed.</strong> Open 3TABZ and sign in with your new password.</p>'; token = ''; return; }
      return r.json().catch(function () { return {}; }).then(function (j) {
        m.textContent = (j && j.message) ? String(j.message) : 'This link has expired or was already used. Request a new one in the app.';
        b.disabled = false;
      });
    }).catch(function () { m.textContent = 'No connection. Please try again.'; b.disabled = false; });
  });
})();
