if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(console.error);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('hero');
  if (hero && typeof addBottomWave === 'function') {
    addBottomWave(hero, 'text-brand-bg dark:text-gray-900');
  }
  const article = document.querySelector('#rehber-wrapper article');
  if (article) {
    const progress = document.getElementById('guideProgress');
    article.querySelectorAll('h3').forEach(h3 => {
      const wave = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      wave.setAttribute('width', '100');
      wave.setAttribute('height', '12');
      wave.setAttribute('viewBox', '0 0 100 12');
      wave.innerHTML = '<path d="M0 6C20 0 30 12 50 6C70 0 80 12 100 6" stroke="#fb8c00" stroke-width="2" fill="none"/>';
      h3.insertAdjacentElement('afterend', wave);
    });
    article.querySelectorAll('ul').forEach(ul => {
      ul.classList.remove('list-disc', 'list-inside');
      ul.classList.add('guide-list');
    });
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    article.querySelectorAll('p, ul, h3, .summary-card').forEach(el => {
      el.classList.add('fade-in');
      fadeObserver.observe(el);
    });
    const updateProgress = () => {
      const total = article.offsetHeight - window.innerHeight;
      const progressVal = Math.min(Math.max((window.scrollY - article.offsetTop) / total, 0), 1);
      progress.style.width = `${progressVal * 100}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  const container = document.getElementById('lazy-sections');

  const initRehber = root => {
    const extra = root.querySelector('#rehber-extra');
    const toggle = root.querySelector('#rehber-toggle');
    const nav = root.querySelector('#rehber-nav');
    if (toggle && extra) {
      toggle.addEventListener('click', () => {
        const isHidden = extra.classList.toggle('hidden');
        toggle.textContent = isHidden ? 'Devamını Oku' : 'Daha Az Göster';
      });
    }
    if (nav && extra && toggle) {
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (extra.classList.contains('hidden')) {
            extra.classList.remove('hidden');
            toggle.textContent = 'Daha Az Göster';
          }
        });
      });
    }
  };

  const loadSections = () => {
    fetch('sections.html')
      .then(res => res.text())
      .then(html => {
        const fragment = document.createRange().createContextualFragment(html);
        container.style.minHeight = '';
        container.replaceChildren(fragment);
        const rehber = document.getElementById('rehber-wrapper');
        const kariyer = container.querySelector('#kariyer');
        if (rehber && kariyer) {
          kariyer.insertAdjacentElement('afterend', rehber);
          rehber.classList.remove('hidden');
        }
        const neden = container.querySelector('#neden');
        if (neden && typeof addTopWave === 'function') {
          addTopWave(neden, 'text-brand-bg dark:text-gray-900');
        }
        requestAnimationFrame(() => {
          container.classList.add('fade-in');

          const lazyImgs = container.querySelectorAll('img[loading="lazy"]');
          lazyImgs.forEach(img => {
            img.src = img.dataset.src;
          });

          const slider = container.querySelector('.testimonial-slider');
          if (slider) {
            const cards = slider.querySelectorAll('.testimonial-card');
            let index = 0;
            const getPerView = () =>
              window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
            const render = () => {
              const perView = getPerView();
              const maxIndex = cards.length - perView;
              if (index > maxIndex) index = 0;
              if (index < 0) index = maxIndex;
              slider.style.transform = `translateX(-${(100 / perView) * index}%)`;
            };
            const rafRender = () => requestAnimationFrame(render);
            const next = container.querySelector('#nextTestimonial');
            next?.addEventListener('click', () => {
              index++;
              rafRender();
            });
            const prev = container.querySelector('#prevTestimonial');
            if (prev) {
              prev.addEventListener('click', () => {
                index--;
                rafRender();
              });
            }
            let resizeRAF;
            window.addEventListener('resize', () => {
              cancelAnimationFrame(resizeRAF);
              resizeRAF = requestAnimationFrame(render);
            });
            render();
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
                const openTrigger = openItem.querySelector('.faq-trigger');
                openItem.classList.remove('active', 'bg-orange-50');
                openContent.classList.add('hidden');
                openChevron.classList.remove('rotate-180');
                openTrigger?.setAttribute('aria-expanded', 'false');
              }
              const expanded = btn.getAttribute('aria-expanded') === 'true';
              btn.setAttribute('aria-expanded', String(!expanded));
              item.classList.toggle('active');
              item.classList.toggle('bg-orange-50');
              content.classList.toggle('hidden');
              chevron.classList.toggle('rotate-180');
            });
          });

          const equipToggle = container.querySelector('#equip-toggle');
          const equipMore = container.querySelector('#equip-more');
          const equipExtra = container.querySelector('#equip-extra');
          if (equipToggle && equipMore && equipExtra) {
            equipToggle.addEventListener('click', () => {
              const hidden = equipExtra.classList.toggle('hidden');
              equipMore.classList.toggle('hidden');
              equipToggle.textContent = hidden ? 'Devamını Oku' : 'Daha Az Göster';
            });
          }

          initRehber(container);
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
