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
let observer;

function initTOC() {
  const tocLinks = document.querySelectorAll('.toc-list a');
  tocLinks.forEach(link => {
    if (!link.dataset.bound) {
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
      link.dataset.bound = 'true';
    }
  });

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const key = Object.keys(sectionMap).find(k => sectionMap[k] === id);
        if (key) {
          document.querySelectorAll('.toc-list li').forEach(li => li.classList.remove('active'));
          const activeLink = document.querySelector(`.toc-list a[href="#${key}"]`);
          activeLink?.parentElement?.classList.add('active');
        }
      }
    });
  }, { rootMargin: '0px 0px -70% 0px' });

  Object.values(sectionMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

function destroyTOC() {
  observer?.disconnect();
}

const container = document.getElementById('rehber-icerik');
const template = document.getElementById('rehber-template');
const toggleBtn = document.getElementById('rehber-toggle');
const tocCard = document.querySelector('.toc-card');

if (container && template && toggleBtn) {
  let expanded = false;
  toggleBtn.addEventListener('click', () => {
    if (!expanded) {
      container.appendChild(template.content.cloneNode(true));
      toggleBtn.textContent = 'Daha az göster';
      tocCard?.classList.remove('hidden');
      initTOC();
    } else {
      destroyTOC();
      container.innerHTML = '';
      toggleBtn.textContent = 'Devamını oku';
      tocCard?.classList.add('hidden');
    }
    expanded = !expanded;
  });
}
