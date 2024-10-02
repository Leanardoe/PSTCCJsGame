// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const pageData = {
    '/index.html': {
      title: 'Games',
      copyright: "2023",
    }
}

export default defineConfig({
    base: '/',
    server: {
        host: true,
        watch: {
          include: ['src/templates/**/*.html'],
          onWatchEvent({ event, path }) {
            console.log(event, path);
          },
        }
    },
    plugins: [
        handlebars({
          // Define any global data you want to pass to the templates
          context(pagePath) {
            return pageData[pagePath];
          },
          hmr: true,
          // Define the path to the partials
          partialDirectory: [resolve(__dirname, 'src/templates/common')],
        }),
      ],
    // Other configurations...
  });