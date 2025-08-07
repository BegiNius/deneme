let observer;
const container = document.getElementById('rehber-icerik');
const template = document.getElementById('rehber-template');
const toggleBtn = document.getElementById('rehber-toggle');
const tocLinks = document.querySelectorAll('.toc-list a');
let expanded = false;

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

function expandGuide() {
  return new Promise(resolve => {
    if (expanded) return resolve();
    container.appendChild(template.content.cloneNode(true));
    const collapseBtn = document.createElement('button');
    collapseBtn.id = 'rehber-collapse';
    collapseBtn.className = 'btn-secondary mt-4';
    collapseBtn.textContent = 'Daha az göster';
    collapseBtn.addEventListener('click', collapseGuide);
    container.appendChild(collapseBtn);
    container.classList.add('fade-in');
    setupObserver();
    expanded = true;
    resolve();
  });
}

function collapseGuide() {
  if (!expanded) return;
  observer?.disconnect();
  container.innerHTML = '';
  container.classList.remove('fade-in');
  expanded = false;
  toggleBtn.style.display = 'block';
  document.getElementById('rehber')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleTocClick(evt) {
  evt.preventDefault();
  const id = this.getAttribute('href').substring(1);
  expandGuide().then(() => {
    toggleBtn.style.display = 'none';
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

if (container && template && toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    expandGuide().then(() => { toggleBtn.style.display = 'none'; });
  });
  tocLinks.forEach(link => link.addEventListener('click', handleTocClick));
}
