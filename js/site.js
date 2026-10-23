/* =========================================================
   EIKO FINANCE - ARBORESCENCE DU SITE (source unique)
   Quatre chemins : Comprendre, Investir, Mesurer, Optimiser.
   Le menu, l'arbre de l'accueil et le jeu lisent cet objet :
   pour ajouter une leçon, on l'ajoute ici, dans le bon chemin.
   ========================================================= */
(function () {
  var SITE = {
    branches: [
      {
        id: 'comprendre',
        title: 'Comprendre',
        tagline: "L'argent, l'économie et le monde",
        items: [
          { title: "L'histoire de la monnaie", file: 'monnaie.html',
            desc: "Du troc aux monnaies d'aujourd'hui : étalon-or, Bretton Woods, économie de la dette, QE et QT." },
          { title: "L'économie et les cycles", file: 'economie-cycles.html',
            desc: 'Un parcours en quatre chapitres de 5 minutes, du quotidien aux grands mécanismes.' },
          { title: 'Géopolitique & rapports de force', file: 'geopolitique.html',
            desc: 'Commerce, énergie, monnaies, technologie : comment les tensions entre pays touchent les prix.' },
          { title: 'La macroéconomie', file: 'macro.html',
            desc: "Indicateurs, taux, dette : le tableau de bord d'un pays et les leviers des banques centrales." }
        ]
      },
      {
        id: 'investir',
        title: 'Investir',
        tagline: 'Actions, immobilier, crypto et autres actifs',
        items: [
          { title: 'Actions', file: 'actions.html',
            desc: "Posséder un morceau d'entreprise." },
          { title: 'Obligations', file: 'obligations.html',
            desc: 'Prêter de l\'argent, contre intérêts.' },
          { title: 'ETF', file: 'etf.html',
            desc: 'Un panier diversifié en un seul achat.' },
          { title: 'Or & argent', file: 'or-argent.html',
            desc: 'Des valeurs refuges, sans revenu.' },
          { title: 'Valeurs cycliques', file: 'valeurs-cycliques.html',
            desc: 'Ces entreprises qui suivent la conjoncture.' },
          { title: 'Cryptomonnaies', file: 'crypto.html',
            desc: 'Bitcoin, Ethereum, stablecoins : fonctionnement, risques et fiscalité.' },
          { title: 'SCPI', file: 'scpi.html',
            desc: "L'immobilier en pierre-papier : frais, avantages et limites." },
          { title: 'Vin', file: 'vin.html',
            desc: 'Du primeur à la cave.' },
          { title: 'Montres', file: 'montres.html',
            desc: 'Marché secondaire et authenticité.' },
          { title: 'Art', file: 'art.html',
            desc: 'Un marché opaque.' },
          { title: 'Autos de collection', file: 'autos-collection.html',
            desc: 'Passion et coûts.' },
          { title: 'Private equity', file: 'private-equity.html',
            desc: 'Financer des entreprises non cotées.' },
          { title: 'Trading', file: 'trading.html',
            desc: 'Day trading, CFD, levier : ce que disent les chiffres et comment limiter les risques.' }
        ]
      },
      {
        id: 'mesurer',
        title: 'Mesurer',
        tagline: 'Simuler pour décider avec des chiffres',
        items: [
          { title: 'Simulation Monte Carlo', file: 'outils.html',
            desc: "L'application Android qui teste des milliers d'évolutions possibles d'un portefeuille." },
          { title: 'Intérêts composés', file: 'outils.html',
            desc: 'Voir comment le temps et la régularité font grandir un capital.' }
        ]
      },
      {
        id: 'optimiser',
        title: 'Optimiser',
        tagline: 'Fiscalité, enveloppes et transmission',
        items: [
          { title: 'Placements et enveloppes fiscales', file: 'fiscalite.html',
            desc: 'PEA, compte-titres, assurance-vie, PER : où placer, et avec quelle fiscalité.' },
          { title: 'Transmission et dons', file: 'fiscalite.html',
            desc: 'Donations et succession : préparer et organiser la transmission.' },
          { title: 'Études de cas', file: 'etudes.html',
            desc: "Six profils d'épargnants comparés : livrets, ETF, stock picking, SCPI, matières premières et crypto." }
        ]
      }
    ],
    extras: [
      { title: 'Contact', file: 'contact.html' }
    ]
  };
  window.EIKO_SITE = SITE;

  /* ---------- Outils ---------- */
  function h(tag, props, kids) {
    var e = document.createElement(tag);
    for (var k in props || {}) {
      if (k === 'text') e.textContent = props[k];
      else e.setAttribute(k, props[k]);
    }
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  function link(file, title, isActive) {
    return h('a', isActive ? { href: file, text: title, class: 'active' } : { href: file, text: title });
  }

  var page = location.pathname.split('/').pop() || 'index.html';
  var isHome = page === 'index.html';
  var current = SITE.branches.filter(function (b) {
    return b.items.some(function (i) { return i.file === page; });
  })[0];

  /* ---------- Menu ---------- */
  function buildNav() {
    var nav = document.querySelector('header nav');
    if (!nav) return;
    var ul = h('ul');

    /* Sur l'accueil, l'arbre remplace le menu : seul le contact reste en haut */
    if (!isHome) {
      SITE.branches.forEach(function (b) {
        var li = h('li', { class: 'has-sub' });
        li.appendChild(h('a', Object.assign({ href: 'index.html#' + b.id, text: b.title }, current === b ? { class: 'active' } : {})));
        var btn = h('button', {
          type: 'button', class: 'sub-toggle', text: '▾',
          'aria-expanded': 'false', 'aria-label': 'Afficher les leçons : ' + b.title
        });
        btn.addEventListener('click', function () {
          var open = li.classList.toggle('open');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        var sub = h('ul', { class: 'sub' });
        b.items.forEach(function (it) {
          sub.appendChild(h('li', {}, [link(it.file, it.title, it.file === page)]));
        });
        li.appendChild(btn);
        li.appendChild(sub);
        ul.appendChild(li);
      });
    }
    SITE.extras.forEach(function (x) {
      ul.appendChild(h('li', {}, [link(x.file, x.title, x.file === page)]));
    });
    nav.replaceChildren(ul);

    /* Le logo ramène à l'accueil */
    var logo = document.querySelector('header .logo-container');
    if (logo && !isHome) {
      logo.setAttribute('role', 'link');
      logo.setAttribute('tabindex', '0');
      logo.setAttribute('aria-label', "Retour à l'accueil");
      logo.addEventListener('click', function () { location.href = 'index.html'; });
      logo.addEventListener('keydown', function (e) { if (e.key === 'Enter') location.href = 'index.html'; });
    }
  }

  /* ---------- Accueil : quatre boutons, chacun donne accès à ses leçons ---------- */
  function buildTree() {
    var box = document.querySelector('[data-eiko="tree"]');
    if (!box) return;

    var roots = h('div', { class: 'roots', role: 'group', 'aria-label': 'Choisissez un chemin' });
    var branches = h('div', { class: 'branches' });
    var views = {};

    SITE.branches.forEach(function (b) {
      var btn = h('button', {
        type: 'button', class: 'root', 'data-id': b.id,
        'aria-expanded': 'false', 'aria-controls': 'branch-' + b.id
      }, [h('span', { class: 'root-title', text: b.title }), h('small', { text: b.tagline })]);
      roots.appendChild(btn);

      var list = h('ol', { class: 'leaves' });
      list.style.setProperty('--n', b.items.length);
      b.items.forEach(function (it, j) {
        var li = h('li', { class: 'leaf' }, [
          h('span', { class: 'leaf-no', text: String(j + 1) }),
          h('h3', {}, [h('a', { href: it.file, text: it.title })]),
          h('p', { text: it.desc })
        ]);
        if (it.sub) {
          var chips = h('div', { class: 'leaf-sub' });
          it.sub.forEach(function (s) { chips.appendChild(h('a', { href: s.file, text: s.title })); });
          li.appendChild(chips);
        }
        list.appendChild(li);
      });
      var br = h('div', { class: 'branch', id: 'branch-' + b.id, role: 'region', 'aria-label': b.title + ' : leçons', hidden: '' }, [list]);
      branches.appendChild(br);
      views[b.id] = { btn: btn, br: br };
    });

    box.appendChild(roots);
    box.appendChild(branches);

    var openId = null;
    function close() {
      if (!openId) return;
      views[openId].btn.setAttribute('aria-expanded', 'false');
      views[openId].br.hidden = true;
      box.classList.remove('has-open');
      openId = null;
    }
    function open(id) {
      close();
      views[id].btn.setAttribute('aria-expanded', 'true');
      views[id].br.hidden = false;
      box.classList.add('has-open');
      openId = id;
    }

    SITE.branches.forEach(function (b) {
      views[b.id].btn.addEventListener('click', function () {
        if (openId === b.id) { close(); history.replaceState(null, '', location.pathname); }
        else { open(b.id); history.replaceState(null, '', '#' + b.id); }
      });
    });

    /* Un lien du type index.html#investir ouvre directement le bon chemin */
    function fromHash() {
      var id = location.hash.replace('#', '');
      if (views[id] && id !== openId) {
        open(id);
        box.scrollIntoView({ block: 'start' });
      }
    }
    window.addEventListener('hashchange', fromHash);
    fromHash();
  }

  function init() {
    buildNav();
    buildTree();
    document.querySelectorAll('.subnav').forEach(function (n) { n.remove(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
