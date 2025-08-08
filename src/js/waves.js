function createWave(type, frontClass) {
  const paths = {
    top: 'M0 120 Q 360 40 720 120 T 1440 120 V0 H0 Z',
    bottom: 'M0 0 Q 360 80 720 0 T 1440 0 V120 H0 Z'
  };
  const positions = { top: 'top-[-1px]', bottom: 'bottom-[-1px]' };
  const wrapper = document.createElement('div');
  wrapper.className = `pointer-events-none absolute ${positions[type]} left-0 w-full h-[clamp(60px,10vw,160px)]`;
  const path = paths[type];
  wrapper.innerHTML = `
    <svg class="absolute inset-0 w-full h-full text-brand-orange/20" viewBox="0 0 1440 120" width="1440" height="120" role="presentation" aria-hidden="true" preserveAspectRatio="none">
      <path d="${path}" fill="currentColor"/>
    </svg>
    <svg class="absolute inset-0 w-full h-full ${frontClass}" viewBox="0 0 1440 120" width="1440" height="120" role="presentation" aria-hidden="true" preserveAspectRatio="none">
      <path d="${path}" fill="currentColor"/>
    </svg>`;
  return wrapper;
}

function addTopWave(el, frontClass) {
  if (!el) return;
  el.classList.add('relative');
  el.prepend(createWave('top', frontClass));
}

function addBottomWave(el, frontClass) {
  if (!el) return;
  el.classList.add('relative');
  el.appendChild(createWave('bottom', frontClass));
}

window.addTopWave = addTopWave;
window.addBottomWave = addBottomWave;
