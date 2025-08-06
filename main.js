if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(console.error);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('lazy-sections');

  const loadSections = () => {
    fetch('sections.html')
      .then(res => res.text())
      .then(html => {
        const fragment = document.createRange().createContextualFragment(html);
        container.style.minHeight = '';
        container.replaceChildren(fragment);
        requestAnimationFrame(() => {
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
            const scheduleUpdate = () => requestAnimationFrame(update);
            container.querySelector('#nextTestimonial')?.addEventListener('click', () => {
              const perView = getPerView();
              const maxIndex = cards.length - perView;
              index = index >= maxIndex ? 0 : index + 1;
              scheduleUpdate();
            });
            const prev = container.querySelector('#prevTestimonial');
            if (prev) {
              prev.addEventListener('click', () => {
                const perView = getPerView();
                const maxIndex = cards.length - perView;
                index = index <= 0 ? maxIndex : index - 1;
                scheduleUpdate();
              });
            }
            let resizeRAF;
            window.addEventListener('resize', () => {
              cancelAnimationFrame(resizeRAF);
              resizeRAF = requestAnimationFrame(update);
            });
            update();
          }

          // FAQ accordion
          container.querySelectorAll('.faq-trigger').forEach(btn => {
            const item = btn.parentElement;
            const content = item.querySelector('.faq-content');
            const chevron = item.querySelector('.chevron');

            btn.addEventListener('click', () => {
              const openItem = container.querySelector('.faq-item.active');
              if (openItem && openItem !== item) {
                const openContent = openItem.querySelector('.faq-content');
                const openChevron = openItem.querySelector('.chevron');
                openItem.classList.remove('active', 'bg-orange-50');
                openContent.classList.add('hidden');
                openChevron.classList.remove('rotate-180');
                openItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
              }
              const expanded = btn.getAttribute('aria-expanded') === 'true';
              btn.setAttribute('aria-expanded', String(!expanded));
              item.classList.toggle('active');
              item.classList.toggle('bg-orange-50');
              content.classList.toggle('hidden');
              chevron.classList.toggle('rotate-180');
            });
          });

          // load guide script
          const guideScript = document.createElement('script');
          guideScript.src = 'guide.js';
          guideScript.defer = true;
          document.body.appendChild(guideScript);
        });
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
