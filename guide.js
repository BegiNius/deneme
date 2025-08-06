const sectionMap = {
  'evden-cagri': 'evden-cagri-merkezi',
  'ekipman': 'gerekli-ekipmanlar',
  'ilanlar': 'is-ilanlari',
  'avantaj': 'avantajlar',
  'ozellikler': 'aranan-ozellikler',
  'saatler': 'calisma-saatleri',
  'performans': 'performans',
  'vergi': 'vergi-avantajlari',
  'basvuru': 'basvuru-sureci',
  'ozet': 'ozet'
};
function initTOC() {
  const tocLinks = document.querySelectorAll('.toc-list a');
  tocLinks.forEach(link => {
    link.addEventListener('click', evt => {
      evt.preventDefault();
      const key = link.getAttribute('href').substring(1);
      const targetId = sectionMap[key];
      const target = document.getElementById(targetId);
      if (target) {
        const rect = target.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const key = Object.keys(sectionMap).find(k => sectionMap[k] === id);
        if (key) {
          document.querySelectorAll('.toc-list li').forEach(li => li.classList.remove('active'));
          const activeLink = document.querySelector(`.toc-list a[href="#${key}"]`);
          if (activeLink && activeLink.parentElement) {
            activeLink.parentElement.classList.add('active');
          }
        }
      }
    });
  }, {rootMargin: '0px 0px -70% 0px'});

  Object.values(sectionMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

fetch('src/rehber.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('rehber-icerik').innerHTML = html;
    initTOC();
  })
  .catch(err => console.error('Rehber içeriği yüklenemedi:', err));
