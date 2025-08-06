/* guide.js */
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
        target.scrollIntoView({behavior: 'smooth'});
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

/* main.js */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(console.error);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Load high-resolution hero background
  const heroBg = document.getElementById('hero-bg');
  const img = new Image();
  img.src = 'src/img/head1.webp';
  img.onload = () => {
    heroBg.style.backgroundImage = "url('src/img/head1.webp')";
    heroBg.style.filter = 'none';
  };

  const container = document.getElementById('lazy-sections');

  const loadSections = () => {
    fetch('sections.html')
      .then(res => res.text())
      .then(html => {
        container.innerHTML = html;
        container.style.minHeight = '';
        container.classList.add('fade-in');

        const slider = container.querySelector('.testimonial-slider');
        if (slider) {
          const cards = slider.querySelectorAll('.testimonial-card');
          let index = 0;
          const getPerView = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
          const update = () => {
            const perView = getPerView();
            const maxIndex = cards.length - perView;
            if (index > maxIndex) index = 0;
            slider.style.transform = `translateX(-${(100 / perView) * index}%)`;
          };
          container.querySelector('#nextTestimonial')?.addEventListener('click', () => {
            const perView = getPerView();
            const maxIndex = cards.length - perView;
            index = index >= maxIndex ? 0 : index + 1;
            update();
          });
          const prev = container.querySelector('#prevTestimonial');
          if (prev) {
            prev.addEventListener('click', () => {
              const perView = getPerView();
              const maxIndex = cards.length - perView;
              index = index <= 0 ? maxIndex : index - 1;
              update();
            });
          }
          window.addEventListener('resize', update);
          update();
        }

        // FAQ accordion
        container.querySelectorAll('.faq-trigger').forEach(btn => {
          btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const openItem = container.querySelector('.faq-item.active');
            if (openItem && openItem !== item) {
              openItem.classList.remove('active', 'bg-orange-50');
              openItem.querySelector('.faq-content').classList.add('hidden');
              openItem.querySelector('.chevron').classList.remove('rotate-180');
              openItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            }
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            item.classList.toggle('active');
            item.classList.toggle('bg-orange-50');
            item.querySelector('.faq-content').classList.toggle('hidden');
            item.querySelector('.chevron').classList.toggle('rotate-180');
          });
        });

        // load guide script
        const guideScript = document.createElement('script');
        guideScript.src = 'guide.js';
        guideScript.defer = true;
        document.body.appendChild(guideScript);
      });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadSections();
        observer.disconnect();
      }
    });
  });

  observer.observe(container);
});

/* sw.js */
const CACHE_NAME = 'site-cache-v1';
const ASSETS = [
  '/',
  'index.html',
  'main.css',
  'main.js',
  'guide.js',
  'sections.html',
  'src/img/head1.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

/* tailwind.config.js */
module.exports = {
  content: [
    './index.html',
    './sections.html',
    './guide.html',
    './main.js',
    './guide.js',
    './src/**/*.{html,js}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#8c3600',
        'brand-bg': '#fff8f3'
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
        headline: ['Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};

