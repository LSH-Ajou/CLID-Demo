(function () {
  'use strict';
  const sections = [...document.querySelectorAll('.page-section')];
  const links = [...document.querySelectorAll('[data-route]')];
  const pages = new Set(sections.map(section => section.id));
  const aliases = {'model-overview':'method','emotion-classification-results':'results','demo-samples':'comparison','korean-benchmark-samples':'benchmark','same-text-different-emotions':'control'};
  let activePage;
  function showPage(initial) {
    const requested = location.hash.replace(/^#\/?/, '');
    const page = pages.has(requested) ? requested : (Object.hasOwn(aliases, requested) ? aliases[requested] : 'overview');
    if (location.hash !== '#/' + page) history.replaceState(null, '', '#/' + page);
    window.CLIDAudio?.pauseAll();
    sections.forEach(section => { section.hidden = section.id !== page; });
    links.forEach(link => {
      if (link.dataset.route === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.documentElement.classList.add('routed');
    document.documentElement.dataset.page = page;
    document.title = 'CLID-TTS · ' + links.find(link => link.dataset.route === page).textContent;
    if (!initial && activePage !== page) {
      document.getElementById(page).querySelector('h2').focus({preventScroll:true});
      window.scrollTo({top:0,behavior:'instant'});
    }
    activePage = page;
  }
  window.addEventListener('hashchange', () => showPage(false));
  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    const heading = document.getElementById(activePage).querySelector('h2');
    heading.focus({preventScroll:true});
    heading.scrollIntoView({block:'start'});
  });
  showPage(true);
})();
