const fs = require('fs');
const Critters = require('critters');
(async () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const critters = new Critters({ path: 'dist', publicPath: '', preload: 'swap' });
  const output = await critters.process(html);
  fs.writeFileSync('dist/index.html', output);
})();
