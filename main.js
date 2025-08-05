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

  // Load remaining sections after 500ms
  setTimeout(() => {
    fetch('sections.html')
      .then(res => res.text())
      .then(html => {
        const container = document.getElementById('lazy-sections');
        container.innerHTML = html;
        container.style.minHeight = '';
        container.classList.add('fade-in');

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
  }, 500);
});
