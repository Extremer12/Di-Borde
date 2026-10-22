// Client router supporting hash navigation (#/path)
class Router {
  constructor() {
    this.routes = {};
    this.currentPath = '/';
    this.params = {};
    this.onChangeCallbacks = new Set();

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('popstate', () => this.handleRoute());
  }

  on(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  onChange(callback) {
    this.onChangeCallbacks.add(callback);
    return () => this.onChangeCallbacks.delete(callback);
  }

  navigate(path) {
    if (window.location.hash.slice(1) === path) {
      this.handleRoute();
      return;
    }
    window.location.hash = path;
  }

  getCurrentRoute() {
    let hash = window.location.hash.slice(1) || '/';
    if (!hash.startsWith('/')) {
      hash = '/' + hash;
    }
    return hash;
  }

  handleRoute() {
    const rawPath = this.getCurrentRoute();
    const [pathOnly, queryString] = rawPath.split('?');
    this.currentPath = pathOnly || '/';

    // Parse query params if any
    const queryParams = new URLSearchParams(queryString || '');

    // Match exact route or parameterized route (/productos/:id)
    let matchedHandler = this.routes[this.currentPath];
    this.params = {};

    if (!matchedHandler) {
      // Try parameter pattern matching
      for (const routePattern in this.routes) {
        if (routePattern.includes(':')) {
          const patternParts = routePattern.split('/');
          const actualParts = this.currentPath.split('/');

          if (patternParts.length === actualParts.length) {
            let matches = true;
            const extractedParams = {};

            for (let i = 0; i < patternParts.length; i++) {
              if (patternParts[i].startsWith(':')) {
                const paramKey = patternParts[i].slice(1);
                extractedParams[paramKey] = decodeURIComponent(actualParts[i]);
              } else if (patternParts[i] !== actualParts[i]) {
                matches = false;
                break;
              }
            }

            if (matches) {
              matchedHandler = this.routes[routePattern];
              this.params = extractedParams;
              break;
            }
          }
        }
      }
    }

    // Fallback to Home if not found
    if (!matchedHandler) {
      matchedHandler = this.routes['/'];
      this.currentPath = '/';
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Notify listeners
    this.onChangeCallbacks.forEach(cb => {
      try {
        cb(this.currentPath, this.params, queryParams);
      } catch (e) {
        console.error('Route callback error:', e);
      }
    });

    if (matchedHandler) {
      matchedHandler(this.params, queryParams);
    }
  }

  start() {
    this.handleRoute();
  }
}

export const router = new Router();
