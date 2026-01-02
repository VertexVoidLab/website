import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      // This allows you to use Tailwind classes inside your React 3D components if needed
      applyBaseStyles: true,
    }),
    mdx(),
  ],

  adapter: vercel(),
});