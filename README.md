# website-freelance

This project includes a basic service worker to cache core assets for faster repeat visits.

## Performance

- **HTTP Caching**: A service worker (`sw.js`) caches static assets.
- **Compression**: Enable Gzip or Brotli on your hosting or CDN to reduce payload size.
- **CDN**: Serve static assets via a CDN for better global performance.

### Image optimization

The hero section preloads `src/img/head1.webp` and now supports a responsive source set. Create a 768 px-wide variant and place it at `src/img/head1-768.webp` to cut transfer size on small screens:

```bash
cwebp -q 80 head1.webp -resize 768 512 -o head1-768.webp
```

Alternatively, install `sharp` and `imagetools-core` and run the included generator:

```bash
npm install sharp imagetools-core
node generate-images.js
```

## Development

Install dependencies and run a local server if needed.
