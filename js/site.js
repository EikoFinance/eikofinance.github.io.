/* =========================================================
   EIKO FINANCE - ARBORESCENCE DU SITE (source unique)
   Le menu, l'accueil, les pages d'entrée et le jeu lisent
   tous cet objet : pour ajouter une leçon, on l'ajoute ici.
   ========================================================= */
(function () {
  var SITE = {
    sections: [
      {
        id: 'economie',
        title: 'Économie & Géopolitique',
        hub: 'economie.html',
        intro: 'Cycles (Kitchin, Juglar, Kondratiev), macroéconomie, création monétaire, rapports de force entre pays.',
        lessons: [
          { title: 'Parcours débutant : Économie & Cycles', file: 'economie-cycles.html',
            desc: 'Quatre chapitres de 5 minutes : on part du quotidien et on remonte vers les grands mécanismes.' },
          { title: 'Macroéconomie', file: 'macro.html',
            desc: 'Les indicateurs, les leviers des États et des banques centrales, et ce que les chiffres changent pour les marchés.' },
          { title: 'Géopolitique & rapports de force', file: 'geopolitique.html',
            desc: 'Commerce, énergie, monnaies, dette, technologie : comment les tensions entre pays atteignent les prix et les marchés.' }
        ]
      },
      {
        id: 'marches',
        title: 'Marchés & Actifs',
        hub: 'marches.html',
        intro: 'Actions, obligations, ETF, or et argent, cryptomonnaies, SCPI, investissements alternatifs et trading.',
        lessons: [
          { title: 'Les classiques', file: 'marches-classiques.html',
            desc: 'Actions, obligations, ETF, or et argent, valeurs cycliques : à quoi sert chaque actif et quel risque il comporte.' },
          { title: 'Cryptomonnaies', file: 'crypto.html',
            desc: 'Bitcoin, Ethereum, stablecoins : fonctionnement, risques et fiscalité.' },
          { title: 'SCPI', file: 'scpi.html',
            desc: "L'immobilier en pierre-papier : France, Europe, frais, avantages et limites." },
          { title: 'Investissements alternatifs', file: 'alternatifs.html',
            desc: 'Private equity, vin, montres, automobiles de collection, art.' },
          { title: 'Trading', file: 'trading.html',
            desc: 'Day trading, CFD, levier : ce que disent les chiffres et comment limiter les risques.' }
        ]
      },
      {
        id: 'fiscalite',
        title: 'Fiscalité & Transmission',
        hub: 'fiscalite.html',
        intro: 'PEA, compte-titres, assurance-vie, PER, donations et succession.',
        lessons: []
      },
      {
        id: 'etudes',
        title: 'Études de cas',
        hub: 'etudes.html',
        intro: "Six profils d'épargnants comparés : livrets, ETF, stock picking, SCPI, matières premières et crypto.",
        lessons: []
      }
    ],
    extras: [
      { title: 'Outils & Simulateurs', file: 'outils.html' },
      { title: 'Contact & À propos', file: 'contact.html' }
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
  var current = SITE.sections.filter(function (s) {
    return s.hub === page || s.lessons.some(function (l) { return l.file === page; });
  })[0];

  /* ---------- Menu (remplace le menu écrit dans la page) ---------- */
  function buildNav() {
    var nav = document.querySelector('header nav');
    if (!nav) return;
    var ul = h('ul');
    ul.appendChild(h('li', {}, [link('index.html', 'Accueil', page === 'index.html')]));

    SITE.sections.forEach(function (s) {
      var li = h('li', s.lessons.length ? { class: 'has-sub' } : {});
      li.appendChild(link(s.hub, s.title, current === s));
      if (s.lessons.length) {
        var btn = h('button', {
          type: 'button', class: 'sub-toggle', text: '▾',
          'aria-expanded': 'false', 'aria-label': 'Afficher les leçons : ' + s.title
        });
        btn.addEventListener('click', function () {
          var open = li.classList.toggle('open');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        var sub = h('ul', { class: 'sub' });
        s.lessons.forEach(function (l) {
          sub.appendChild(h('li', {}, [link(l.file, l.title, l.file === page)]));
        });
        li.appendChild(btn);
        li.appendChild(sub);
      }
      ul.appendChild(li);
    });

    SITE.extras.forEach(function (x) {
      ul.appendChild(h('li', {}, [link(x.file, x.title, x.file === page)]));
    });
    nav.replaceChildren(ul);
  }

  /* ---------- Accueil : une carte par rubrique, avec ses leçons ---------- */
  function buildCards() {
    var box = document.querySelector('[data-eiko="cards"]');
    if (!box) return;
    SITE.sections.forEach(function (s) {
      var card = h('div', { class: 'card' });
      card.appendChild(h('h3', {}, [h('a', { href: s.hub, text: s.title })]));
      card.appendChild(h('p', { text: s.intro }));
      if (s.lessons.length) {
        var ul = h('ul', { class: 'card-links' });
        s.lessons.forEach(function (l) {
          ul.appendChild(h('li', {}, [h('a', { href: l.file, text: l.title })]));
        });
        card.appendChild(ul);
      }
      box.appendChild(card);
    });
  }

  /* ---------- Pages d'entrée : la liste des leçons de la rubrique ---------- */
  function buildLessons() {
    var box = document.querySelector('[data-eiko="lessons"]');
    if (!box || !current) return;
    current.lessons.forEach(function (l, i) {
      box.appendChild(h('a', { class: 'card', href: l.file }, [
        h('span', { class: 'lesson-no', text: 'Leçon ' + (i + 1) }),
        h('h3', { text: l.title }),
        h('p', { text: l.desc })
      ]));
    });
  }

  function init() {
    buildNav();
    buildCards();
    buildLessons();
    /* La barre de sous-menu est remplacée par le menu déroulant */
    document.querySelectorAll('.subnav').forEach(function (n) { n.remove(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
