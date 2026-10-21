/* =========================================================
   EIKO FINANCE - LES CYCLES SUPERPOSÉS
   Trois cycles de durées différentes (Kitchin, Juglar,
   Kondratiev) tracés en or fin ; leur somme est la courbe
   claire. Schéma illustratif, pas une donnée réelle.
   ========================================================= */
(function () {
  var canvases = document.querySelectorAll('.cycles-canvas');
  if (!canvases.length) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GOLD = '197,160,89';
  var BRIGHT = '212,175,55';

  /* p : durée du cycle (années) · a : poids relatif de l'amplitude · ph : décalage */
  var CYCLES = [
    { p: 4,  a: 0.146, ph: 0.6, alpha: 0.40 },
    { p: 9,  a: 0.292, ph: 1.9, alpha: 0.45 },
    { p: 50, a: 0.562, ph: 0.3, alpha: 0.55 }
  ];

  Array.prototype.forEach.call(canvases, init);

  function init(cv) {
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, started = performance.now(), visible = true, running = false;
    var space = cv.parentElement.querySelector('.cycles-space');
    var zoneTop = 0, zoneH = 0;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      /* zone réservée à la courbe : entre le texte et la légende */
      zoneTop = space ? space.offsetTop : H * 0.55;
      zoneH = space ? space.offsetHeight : H * 0.35;
      if (!zoneH) { zoneTop = H * 0.55; zoneH = H * 0.35; }
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function stroke(fn, xmax, width, color, alpha) {
      ctx.beginPath();
      for (var x = 0; x <= xmax; x += 2) {
        var y = fn(x);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.lineWidth = width;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(' + color + ',' + alpha + ')';
      ctx.stroke();
    }

    function draw(now) {
      var el = reduce ? 99 : (now - started) / 1000;
      var progress = Math.min(1, el / 3.2);
      progress = 1 - Math.pow(1 - progress, 3);           /* le tracé ralentit en arrivant */
      var span = Math.max(30, W / 21);                      /* années visibles à l'écran */
      var drift = reduce ? 0 : el * 0.55;                   /* dérive lente : années par seconde */
      var base = zoneTop + zoneH / 2;
      var xmax = W * progress;

      ctx.clearRect(0, 0, W, H);

      /* ligne de base, très discrète */
      ctx.beginPath(); ctx.moveTo(0, base); ctx.lineTo(W, base);
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(' + GOLD + ',0.14)'; ctx.stroke();

      function wave(c) {
        return function (x) {
          var t = (x / W) * span + drift;
          return -c.a * zoneH * 0.45 * Math.sin(2 * Math.PI * t / c.p + c.ph);
        };
      }
      var waves = CYCLES.map(wave);

      CYCLES.forEach(function (c, i) {
        stroke(function (x) { return base + waves[i](x); }, xmax, 1.2, GOLD, c.alpha);
      });

      var sum = function (x) {
        return base + waves[0](x) + waves[1](x) + waves[2](x);
      };
      stroke(sum, xmax, 2.6, BRIGHT, 1);

      /* pointe du tracé pendant l'apparition */
      if (progress < 0.995) {
        ctx.beginPath(); ctx.arc(xmax, sum(xmax), 4, 0, 6.2832);
        ctx.fillStyle = 'rgba(' + BRIGHT + ',1)'; ctx.fill();
      }
    }

    function frame(now) {
      draw(now);
      if (!reduce && visible) requestAnimationFrame(frame); else running = false;
    }
    function start() {
      if (running) return;
      running = true; requestAnimationFrame(frame);
    }

    size();
    if (reduce) { draw(0); }
    else { start(); }

    window.addEventListener('resize', function () { size(); if (reduce) draw(0); });

    /* Pas de calcul quand le graphique n'est plus visible */
    if ('IntersectionObserver' in window && !reduce) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start();
      }).observe(cv);
    }
  }
})();
