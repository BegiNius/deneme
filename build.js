const fs = require('fs');
const path = require('path');
const Critters = require('critters');

async function build() {
  const critters = new Critters({
    path: '.',
    preload: 'media',
    pruneSource: false,
    inlineFonts: true,
    compress: true
  });

  const outDir = 'dist';
  fs.mkdirSync(outDir, { recursive: true });

  const html = fs.readFileSync('index.html', 'utf8');
  const processed = await critters.process(html);
  fs.writeFileSync(path.join(outDir, 'index.html'), processed);
  fs.copyFileSync('sections.html', path.join(outDir, 'sections.html'));
  if (fs.existsSync('serve.json')) {
    fs.copyFileSync('serve.json', path.join(outDir, 'serve.json'));
  }

  for (const asset of ['main.css', 'heading.css', 'diagonal.css', 'main.js', 'guide.js', 'sw.js']) {
    if (fs.existsSync(asset)) {
      fs.copyFileSync(asset, path.join(outDir, asset));
    }
  }
  fs.cpSync('src', path.join(outDir, 'src'), { recursive: true });
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
