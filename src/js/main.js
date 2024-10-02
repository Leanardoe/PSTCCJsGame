import Handlebars from 'handlebars/dist/handlebars.runtime';

if (import.meta.hot) {
    import.meta.hot.on('vite:beforeFullReload', () => {
      // Force a reload
      window.location.reload();
    });
  }