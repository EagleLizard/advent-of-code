
import { defineConfig } from 'vite';

const viteConfig = {
  test: {
    environment: 'node',
    coverage: {
      include: 'src/**/*.{js,ts}',
      all: true,
      provider: 'istanbul',
      reporter: [
        'text',
        'cobertura',
        'html',
      ]
    },
  },
};

export default defineConfig(viteConfig);
