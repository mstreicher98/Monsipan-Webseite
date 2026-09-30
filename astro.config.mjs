// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://monsipan.at',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  image: { responsiveStyles: false },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
