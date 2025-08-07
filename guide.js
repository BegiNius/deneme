let observer;
const container = document.getElementById('rehber-icerik');
const template = document.getElementById('rehber-template');
const loadBtn = document.getElementById('rehber-toggle');
const showMoreBtn = document.getElementById('rehber-show-more');
const tocLinks = document.querySelectorAll('.toc-list a');
let loaded = false;

function setupObserver() {
  observer?.disconnect();
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.toc-list li').forEach(li => li.classList.remove('active'));
        const activeLink = document.querySelector(`.toc-list a[href="#${entry.target.id}"]`);
        activeLink?.parentElement?.classList.add('active');
      }
    });
  }, { rootMargin: '0px 0px -70% 0px' });
  container.querySelectorAll('h3').forEach(h => observer.observe(h));
}

function loadGuide() {
  return new Promise(resolve => {
    if (loaded) {
      resolve();
      return;
    }
    if (!template || !container) {
      resolve();
      return;
    }
    container.innerHTML = template.innerHTML;
    container.classList.add('fade-in', 'collapsed');
    showMoreBtn?.classList.remove('hidden');
    setupObserver();
    loaded = true;
    resolve();
  });
}

function showAll() {
  container.classList.remove('collapsed');
  showMoreBtn?.classList.add('hidden');
}

function handleTocClick(evt) {
  evt.preventDefault();
  const id = this.getAttribute('href').substring(1);
  loadGuide().then(() => {
    showAll();
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

if (container && template) {
  loadBtn?.addEventListener('click', () => {
    loadGuide().then(() => {
      loadBtn.style.display = 'none';
    });
  });
  showMoreBtn?.addEventListener('click', showAll);
  tocLinks.forEach(link => link.addEventListener('click', handleTocClick));
}
