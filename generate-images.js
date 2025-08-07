const { generateTransforms, applyTransforms, builtins } = require('imagetools-core');
const sharp = require('sharp');
const path = require('path');

const src = path.join(__dirname, 'src/img/head1.webp');
const widths = [480, 768, 1280, 1536];
const formats = ['webp', 'avif'];

async function build() {
  const image = sharp(src);
  for (const width of widths) {
    for (const format of formats) {
      const { transforms } = generateTransforms({ width: String(width), format }, builtins);
      const { image: out } = await applyTransforms(transforms, image.clone());
      const outPath = path.join(__dirname, `src/img/head1-${width}.${format}`);
      await out.toFile(outPath);
    }
  }
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
