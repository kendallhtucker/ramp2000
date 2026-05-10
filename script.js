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

// (PS1 giveaway form lives on ps1.html — submit handler is inline there.)

// ============ FAKE LIVE CHAT-ROOM (#ramp-fans) ============
// Auto-scrolling IRC-style channel populated with paraphrased real Ramp customer
// testimonials. The user can type a message and a random regular will reply.

var CHAT_MESSAGES = [
  // Paraphrased / Y2K-ified from real ramp.com/customers testimonials
  { nick: 'JuliaH_EB',      color: '#ff69b4', text: 'lol obsessed with Ramp. like genuinely.' },
  { nick: 'JuliaH_EB',      color: '#ff69b4', text: 'tangible value for my finance team AND for me personally. that never happens' },
  { nick: 'controller_mike', color: '#00ffff', text: 'before ramp our expense process was literally the dark ages' },
  { nick: 'controller_mike', color: '#00ffff', text: 'we had ppl doing expenses FULL TIME. miserable. nothing integrated. all manual :(' },
  { nick: 'sarah_H_athletics', color: '#ffff66', text: 'when my teams need something they need it YESTERDAY. ramp gives me time back for the athletes' },
  { nick: 'kaustubh_VP',    color: '#ff8c00', text: 'closing faster with the automation. couldnt have done it without ramp tbh' },
  { nick: 'joeH_VPController', color: '#ff00ff', text: 'lean team gang. ramp\'s AI does the manual stuff so we can do strategy' },
  { nick: 'tim_T&E_payroll', color: '#9999ff', text: 'onboarding was PAINLESS. integrates w/ everything. close goes brrrr' },
  { nick: 'heidi_BGC_SF',   color: '#33ff99', text: 'used to pay 20k/yr for our AP platform. with ramp we EARN that back. that\'s money for the mission now not back office bs' },
  { nick: 'mike_foursquare', color: '#ff5050', text: 'chose ramp bc it replaced like 6 disparate tools. if it\'s not in ramp it doesn\'t get paid lol' },
  { nick: 'shafak_shortcut', color: '#00ff80', text: 'we close our books in ONE HOUR a month. used to take days. i\'m not joking' },
  { nick: 'rama_Notion',    color: '#cccccc', text: 'ppl ask how we use AI in finance. simple answer: we use ramp.' },
  { nick: 'lisa_norris',    color: '#ffcc00', text: 'audited thousands of txns in record time. transaction-level granularity is *chef\'s kiss*' },
  { nick: 'cfo_gillsOnions', color: '#88ff88', text: 'we shaved 20 DAYS off month-end close. twenty. days.' },
  { nick: 'poshmark_FP&A',  color: '#ff77ff', text: 'hit our free cash flow goal in 7 months instead of 12 \u{1F92F}' },
  { nick: 'classpass_ops',  color: '#7fffff', text: 'card issuance went from DAYS to 1 day per employee. game changer for hiring' },
  { nick: 'heyday_FP&A',    color: '#ffaa55', text: '3-5% total savings across ALL spend. literally just from switching to ramp' },
  { nick: 'candid_finance', code: '#aaaaff', color: '#aaaaff', text: '$250K in savings that ramp\'s insight tool found. money we didn\'t know we were losing' },
  { nick: 'advisor360_ctrl', color: '#ff9966', text: '$80k+ in savings from cashback + software consolidation. 4x ROI in under a year' },
  // Y2K reactions / spice
  { nick: 'CyberCFO_98',    color: '#33ccff', text: 'reimbursement in 1-2 DAYS???? IS THIS REAL?' },
  { nick: 'spreadsheet_jenny', color: '#ff66cc', text: 'i used to live in netsuite. now i live in ramp. happier. fewer tears.' },
  { nick: 'AP_andy2000',    color: '#99ff66', text: 'closed the books in 1hr today. went to a yoga class. life is good' },
  { nick: 'expense_xena',   color: '#ffcc66', text: 'my CEO asked how we automated procurement. i just showed her ramp. she cried (good tears)' },
  { nick: 'cashback_carl',  color: '#66ffcc', text: 'pulled $40k in cashback last quarter. boss thinks i\'m a wizard' },
  { nick: 'rampGirl4eva',   color: '#ff99ff', text: 'is it weird to love a software company. asking for a friend (me)' },
  { nick: 'webmaster',      color: '#ffff00', text: 'lol same' },
  { nick: 'fp&a_phil',      color: '#88ccff', text: 'bro the policy agent caught 7x more out-of-policy spend than my manual reviews. embarrassing for me honestly' },
  { nick: 'tax_tammy',      color: '#ff7777', text: 'receipts auto-match to txns. i haven\'t opened a receipt photo in 6 months' },
  { nick: 'CFO_brenda',     color: '#ccff66', text: 'showed the audit team transaction-level data. they were SHOOK. fastest audit ever' }
];

var CHAT_REPLIES = [
  'totally agree',
  'preach \u{1F64C}',
  'lol same here',
  'wait til you try the policy agent',
  'welcome to the club',
  'sounds like you need a free demo \u{1F609}',
  'i felt that in my soul',
  'huge same energy',
  'have you tried the cashback dashboard?',
  'lmaoo so real',
  'reimbursement in 1-2 days will heal you'
];

var chatTimer = null;
var chatIdx = 0;

function appendChatLine(nick, color, text) {
  var log = document.getElementById('chat-log');
  if (!log) return;
  var div = document.createElement('div');
  var ts = new Date();
  var hh = String(ts.getHours()).padStart(2,'0');
  var mm = String(ts.getMinutes()).padStart(2,'0');
  div.innerHTML = '<span style="color:#666;">[' + hh + ':' + mm + ']</span> ' +
                  '<b style="color:' + color + ';">&lt;' + nick + '&gt;</b> ' +
                  '<span style="color:#0f0;">' + escapeHtml(text) + '</span>';
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function appendChatSystem(text) {
  var log = document.getElementById('chat-log');
  if (!log) return;
  var div = document.createElement('div');
  div.style.color = '#888';
  div.innerHTML = '&gt; ' + text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'})[c];
  });
}

function tickChat() {
  // Pick the next message (cycle, but jitter so it feels organic)
  if (chatIdx >= CHAT_MESSAGES.length) {
    // Reshuffle
    for (var i = CHAT_MESSAGES.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = CHAT_MESSAGES[i]; CHAT_MESSAGES[i] = CHAT_MESSAGES[j]; CHAT_MESSAGES[j] = tmp;
    }
    chatIdx = 0;
  }
  var m = CHAT_MESSAGES[chatIdx++];
  appendChatLine(m.nick, m.color, m.text);
  // Random join/quit noise occasionally
  if (Math.random() < 0.12) {
    var fakeNick = ['receipt_rita','procure_pete','ledger_lola','GLAccount_greg','close_carlos'][Math.floor(Math.random()*5)];
    appendChatSystem('<span style="color:#0ff;">' + fakeNick + '</span> has joined #ramp-fans');
  }
  // Schedule next at random interval (2-5s)
  chatTimer = setTimeout(tickChat, 2000 + Math.random() * 3000);
}

function sendChatMsg() {
  var input = document.getElementById('chat-input');
  if (!input) return;
  var txt = (input.value || '').trim();
  if (!txt) return;
  appendChatLine('you', '#ffffff', txt);
  input.value = '';
  // Bot reply after a beat
  setTimeout(function() {
    var bot = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
    var reply = CHAT_REPLIES[Math.floor(Math.random() * CHAT_REPLIES.length)];
    appendChatLine(bot.nick, bot.color, reply);
  }, 700 + Math.random() * 900);
}

function initChat() {
  var log = document.getElementById('chat-log');
  if (!log) return;
  // Seed a couple of messages immediately so it feels alive
  setTimeout(function(){ appendChatLine('JuliaH_EB', '#ff69b4', 'lol obsessed with Ramp. like genuinely.'); }, 600);
  setTimeout(function(){ appendChatLine('webmaster', '#ffff00', 'welcome to #ramp-fans \u{1F44B} say hi!'); }, 1400);
  chatIdx = 2;
  chatTimer = setTimeout(tickChat, 2500);
  // Enter-to-send
  var input = document.getElementById('chat-input');
  if (input) {
    input.addEventListener('keydown', function(e){
      if (e.key === 'Enter') { e.preventDefault(); sendChatMsg(); }
    });
  }
}

// Keep old footer/link handlers working: clicking "Chat" now just scrolls to the chat box.
function openChat() {
  var el = document.getElementById('chat-log');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  // Boot the fake live chat-room
  initChat();
});
