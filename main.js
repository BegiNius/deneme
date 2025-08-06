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
