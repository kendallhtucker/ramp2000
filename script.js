// ===== RAMP.COM Y2K BEHAVIOR SCRIPT =====
// (c) MMXXVI Ramp Business Corp - written in NOTEPAD.EXE

// Increment hit counter slowly so it feels alive
(function () {
  var spans = document.querySelectorAll('.hit-counter span');
  if (!spans.length) return;
  setInterval(function () {
    var digits = Array.from(spans).map(function (s) { return parseInt(s.textContent, 10); });
    // increment from the last digit
    for (var i = digits.length - 1; i >= 0; i--) {
      digits[i] += 1;
      if (digits[i] < 10) break;
      digits[i] = 0;
    }
    spans.forEach(function (s, i) { s.textContent = digits[i]; });
  }, 4000);
})();

// Cursor sparkle trail (the most Y2K thing imaginable)
(function () {
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

// "You've got mail!" pop-up after 8 seconds
setTimeout(function () {
  try {
    var n = document.createElement('div');
    n.innerHTML =
      '<div style="font-family:Impact;font-size:18px;color:#ffff00;text-shadow:1px 1px 0 #000;">&#128231; YOU&apos;VE GOT MAIL!</div>' +
      '<div style="font-family:Arial;font-size:11px;color:#fff;margin-top:4px;">Your Q2 expense report is overdue. <a href="#expenses" style="color:#00ffff;">[Submit it on Ramp!]</a></div>' +
      '<div style="text-align:right;margin-top:6px;"><button onclick="this.parentNode.parentNode.remove()" style="font-family:Arial;font-size:10px;padding:2px 8px;">Close</button></div>';
    n.style.cssText =
      'position:fixed;bottom:18px;right:18px;width:240px;background:linear-gradient(180deg,#0000aa,#000044);' +
      'border:4px outset #c0c0c0;padding:10px;z-index:9998;box-shadow:4px 4px 0 rgba(0,0,0,.5);';
    document.body.appendChild(n);
    setTimeout(function () { n && n.remove && n.remove(); }, 12000);
  } catch (e) {}
}, 8000);

// Status bar cliche message
window.addEventListener('load', function () {
  // Only modern browsers... whatever
  console.log('%cRAMP.COM', 'font-family:Impact;font-size:36px;color:#ff00ff;text-shadow:2px 2px 0 #ffff00;');
  console.log('%cBest viewed in Netscape Navigator 4.0 at 800x600', 'color:#00ff00;font-family:monospace;');
});
