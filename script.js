// ===== RAMP.COM Y2K BEHAVIOR SCRIPT =====
// (c) MMXIX-MMXXVI Ramp Business Corp - written in NOTEPAD.EXE

// ============ CONFIG ============
var WEBMASTER_EMAIL = 'kendall.tucker@ramp.com';
var FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/' + WEBMASTER_EMAIL;
var REFERRAL_BASE = 'https://ramp.com/?rc=6S7S4B&referral_location=referral_page';

// ============ HIT COUNTER ============
(function () {
  var spans = document.querySelectorAll('.hit-counter span');
  if (!spans.length) return;
  setInterval(function () {
    var digits = Array.from(spans).map(function (s) { return parseInt(s.textContent, 10); });
    for (var i = digits.length - 1; i >= 0; i--) {
      digits[i] += 1;
      if (digits[i] < 10) break;
      digits[i] = 0;
    }
    spans.forEach(function (s, i) { s.textContent = digits[i]; });
  }, 4000);
})();

// ============ CURSOR SPARKLES ============
(function () {
  // Disable on touch devices (mobile) — sparkles look wrong & block interaction
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
  var colors = ['#ff00ff', '#ffff00', '#00ffff', '#ff8800', '#00ff00', '#ff0000'];
  document.addEventListener('mousemove', function (e) {
    if (Math.random() > 0.4) return;
    var s = document.createElement('div');
    s.textContent = ['*', '+', '.', '\u2728', '\u2605'][Math.floor(Math.random() * 5)];
    s.style.cssText =
      'position:fixed;pointer-events:none;left:' + e.clientX + 'px;top:' + e.clientY +
      'px;color:' + colors[Math.floor(Math.random() * colors.length)] +
      ';font-size:' + (10 + Math.random() * 14) + 'px;font-weight:bold;' +
      'z-index:9999;text-shadow:0 0 4px #fff;transition:all 1s ease-out;';
    document.body.appendChild(s);
    requestAnimationFrame(function () {
      s.style.transform = 'translate(' + (Math.random() * 60 - 30) + 'px,' + (40 + Math.random() * 40) + 'px) rotate(' + (Math.random() * 360) + 'deg)';
      s.style.opacity = '0';
    });
    setTimeout(function () { s.remove(); }, 1100);
  });
})();

// ============ "YOU'VE GOT MAIL" POPUP ============
setTimeout(function () {
  try {
    var n = document.createElement('div');
    n.innerHTML =
      '<div style="font-family:Impact;font-size:18px;color:#ffff00;text-shadow:1px 1px 0 #000;">\u2709 YOU\u2019VE GOT MAIL!</div>' +
      '<div style="font-family:Arial;font-size:11px;color:#fff;margin-top:4px;">Your Q2 expense report is overdue. <a href="#expenses" style="color:#00ffff;">[Submit it on Ramp!]</a></div>' +
      '<div style="text-align:right;margin-top:6px;"><button onclick="this.parentNode.parentNode.remove()" style="font-family:Arial;font-size:10px;padding:2px 8px;">Close</button></div>';
    n.style.cssText =
      'position:fixed;bottom:18px;right:18px;width:240px;background:linear-gradient(180deg,#0000aa,#000044);' +
      'border:4px outset #c0c0c0;padding:10px;z-index:9998;box-shadow:4px 4px 0 rgba(0,0,0,.5);';
    document.body.appendChild(n);
    setTimeout(function () { n && n.remove && n.remove(); }, 12000);
  } catch (e) {}
}, 8000);

// ============ GUESTBOOK SUBMIT ============
function submitGuestbook(e) {
  e.preventDefault();
  var form = document.getElementById('gb-form');
  var fd = new FormData(form);
  var name = fd.get('name') || '';
  var city = fd.get('city') || '';
  var email = fd.get('email') || '';
  var url = fd.get('url') || '';
  var msg = fd.get('msg') || '';

  // 1) Show on-page entry immediately
  appendGuestbookEntry(name, city, msg);

  // 2) Save to localStorage so they persist for this visitor's future visits
  saveGuestbookEntry({ name: name, city: city, email: email, url: url, msg: msg, ts: Date.now() });

  // 3) Show thanks message
  document.getElementById('gb-thanks').style.display = 'block';
  setTimeout(function () { document.getElementById('gb-thanks').style.display = 'none'; }, 5000);

  // 4) Email the webmaster via FormSubmit (no signup required for AJAX endpoint)
  var payload = {
    _subject: '\u2728 New ramp2000 guestbook entry from ' + name,
    name: name,
    city: city,
    email: email,
    url: url,
    message: msg,
    source: 'ramp2000_guestbook'
  };
  fetch(FORMSUBMIT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(function () { /* fail silently — entry already shown locally */ });

  form.reset();
  return false;
}

function appendGuestbookEntry(name, city, msg) {
  var ul = document.getElementById('gb-list');
  if (!ul) return;
  var li = document.createElement('li');
  var d = new Date();
  var dateStr = (d.getMonth() + 1) + '/' + d.getDate() + '/MMXXVI';
  li.innerHTML = '<b>' + escapeHtml(name) +
    (city ? ' from ' + escapeHtml(city) : '') + '</b> writes: <i>\u201C' +
    escapeHtml(msg) + '\u201D</i> <font size="1">[' + dateStr + ']</font> ' +
    '<font size="1" color="#008000"><b>\u2728 NEW!</b></font>';
  ul.insertBefore(li, ul.firstChild);
}

function saveGuestbookEntry(entry) {
  try {
    var key = 'ramp2000_gb';
    var existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(entry);
    if (existing.length > 50) existing = existing.slice(0, 50);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (e) {}
}

function loadGuestbookEntries() {
  try {
    var key = 'ramp2000_gb';
    var entries = JSON.parse(localStorage.getItem(key) || '[]');
    entries.reverse().forEach(function (e) {
      appendGuestbookEntry(e.name, e.city, e.msg);
    });
  } catch (e) {}
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// ============ iPad GIVEAWAY SUBMIT ============
function submitIpad(e) {
  e.preventDefault();
  var form = document.getElementById('ipad-form');
  var fd = new FormData(form);
  var intent = fd.get('ramp_intent');

  var payload = {
    _subject: '\ud83c\udfae NEW PS1 GIVEAWAY ENTRY: ' + (fd.get('name') || ''),
    name: fd.get('name'),
    email: fd.get('email'),
    company: fd.get('company'),
    role: fd.get('role'),
    ramp_intent: intent,
    source: 'ramp2000_ps1_giveaway',
    submitted_at: new Date().toISOString()
  };

  // Email to webmaster
  fetch(FORMSUBMIT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(function () { /* fail silently */ });

  // Show thanks
  document.getElementById('ipad-form-wrap').style.display = 'none';
  document.getElementById('ipad-thanks').style.display = 'block';

  // Redirect to Ramp w/ giveaway UTM after 2.5s if they said yes
  setTimeout(function () {
    var rampUrl = REFERRAL_BASE + '&utm_source=ramp2000&utm_medium=ps1_giveaway&utm_campaign=y2k_ps1_giveaway';
    if (intent === 'yes_signup_now') {
      window.open(rampUrl, '_blank');
    }
    // Close modal after a moment
    setTimeout(function () {
      document.getElementById('ipad-modal').style.display = 'none';
      document.getElementById('ipad-form-wrap').style.display = 'block';
      document.getElementById('ipad-thanks').style.display = 'none';
      form.reset();
    }, 1500);
  }, 2500);

  return false;
}

// ============ CHAT-ROOM ============
function openChat() {
  // If Tawk.to is loaded, open it. Otherwise show a friendly fallback popup.
  if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
    try { window.Tawk_API.maximize(); return; } catch (e) {}
  }
  // Fallback: show a Y2K-styled "chat" modal that emails Kendall
  showChatFallback();
}

function showChatFallback() {
  if (document.getElementById('chat-fallback')) {
    document.getElementById('chat-fallback').style.display = 'flex';
    return;
  }
  var modal = document.createElement('div');
  modal.id = 'chat-fallback';
  modal.className = 'modal';
  modal.style.display = 'flex';
  modal.innerHTML =
    '<div class="modal-box" style="max-width:480px;">' +
      '<div class="modal-header"><span>\ud83d\udcac LIVE CHAT-ROOM \u2014 Connecting to webmaster...</span>' +
      '<a href="#" onclick="event.preventDefault();document.getElementById(\'chat-fallback\').style.display=\'none\';" class="modal-close">[X]</a></div>' +
      '<div class="modal-body">' +
        '<div style="background:#000;color:#0f0;font-family:\'Courier New\',monospace;padding:10px;border:2px inset #888;height:160px;overflow:auto;font-size:12px;">' +
          '<div>&gt; Connecting to chat-room...</div>' +
          '<div>&gt; <span style="color:#ff0">webmaster@ramp.com</span> has joined the channel.</div>' +
          '<div>&gt; <b style="color:#0ff">Webmaster:</b> Hey! What\'s on your mind? Drop a message below \u2014 I\'ll get an e-mail and reply directly!</div>' +
        '</div>' +
        '<form id="chat-form" onsubmit="return submitChat(event);" style="margin-top:8px;">' +
          '<table border="0" cellpadding="3" width="100%"><tr>' +
            '<td><font size="2"><b>Your name:</b></font></td>' +
            '<td><input type="text" name="name" required size="20" placeholder="Your handle"></td>' +
          '</tr><tr>' +
            '<td><font size="2"><b>Your e-mail:</b></font></td>' +
            '<td><input type="email" name="email" required size="20" placeholder="you@somewhere.com"></td>' +
          '</tr><tr>' +
            '<td valign="top"><font size="2"><b>Message:</b></font></td>' +
            '<td><textarea name="msg" required rows="3" cols="40" placeholder="Type your message..."></textarea></td>' +
          '</tr></table>' +
          '<div align="center" style="margin-top:6px;"><input type="submit" value=" SEND \u00BB "></div>' +
        '</form>' +
        '<div id="chat-thanks" style="display:none;text-align:center;padding:12px;">' +
          '<font color="#008000" size="3"><b>\u2728 Sent! Webmaster will reply by e-mail. \u2728</b></font>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) modal.style.display = 'none';
  });
}

function submitChat(e) {
  e.preventDefault();
  var form = document.getElementById('chat-form');
  var fd = new FormData(form);
  var payload = {
    _subject: '\ud83d\udcac New ramp2000 chat message from ' + (fd.get('name') || ''),
    name: fd.get('name'),
    email: fd.get('email'),
    message: fd.get('msg'),
    source: 'ramp2000_chat'
  };
  fetch(FORMSUBMIT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(function () {});
  document.getElementById('chat-form').style.display = 'none';
  document.getElementById('chat-thanks').style.display = 'block';
  return false;
}

// ============ WEBRING RANDOM ============
function ringRandom() {
  var sites = [
    'https://stripe.com', 'https://rippling.com', 'https://affirm.com',
    'https://figma.com', 'https://asana.com', 'https://palantir.com',
    'https://anduril.com', 'https://spacex.com', 'https://openai.com',
    'https://nubank.com.br', 'https://airbnb.com', 'https://spotify.com',
    'https://polymarket.com', 'https://cognition.ai', 'https://traderepublic.com'
  ];
  window.open(sites[Math.floor(Math.random() * sites.length)], '_blank');
}

// ============ ON LOAD ============
window.addEventListener('load', function () {
  console.log('%cRAMP.COM', 'font-family:Impact;font-size:36px;color:#ff00ff;text-shadow:2px 2px 0 #ffff00;');
  console.log('%cBest viewed in Netscape Navigator 4.0 at 800x600', 'color:#00ff00;font-family:monospace;');
  // Restore guestbook entries from localStorage
  loadGuestbookEntries();
});
