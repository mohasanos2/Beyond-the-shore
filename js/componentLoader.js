window.ComponentLoader = {
  async load(id, path, base) {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.location.protocol === 'file:') {
      console.warn('[ComponentLoader] Running on file:// — components will not load.\nUse Live Server or: npx serve .\nSee SETUP.md for details.');
      return;
    }
    try {
      const html = await fetch(path).then(r => r.ok ? r.text() : '');
      if (html) {
        // Parse via DOMParser to strip executable scripts from fetched HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // Remove any script tags that shouldn't be in components
        doc.querySelectorAll('script[src]').forEach(s => s.remove());
        // Re-serialize body content only
        el.innerHTML = doc.body ? doc.body.innerHTML : html;
        // Rewrite relative href/src so components work from any page depth (e.g. /trips/*.html)
        if (base) {
          el.querySelectorAll('[href], [src]').forEach(node => {
            ['href', 'src'].forEach(attr => {
              const val = node.getAttribute(attr);
              if (val && !/^([a-z]+:|\/\/|\/|#)/i.test(val)) {
                node.setAttribute(attr, base + val);
              }
            });
          });
        }
        // Re-run inline scripts (needed for navbar auth logic)
        el.querySelectorAll('script').forEach(oldScript => {
          const newScript = document.createElement('script');
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
        el.dispatchEvent(new CustomEvent('component:loaded', {
          bubbles: true,
          detail: { id, path }
        }));
      }
    } catch(e) {
      // fetch failed silently in production
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Resolve base path from this script's own src, so components +
  // their internal links work correctly from subdirectories (e.g. /trips/*.html)
  const scriptEl = document.querySelector('script[src*="componentLoader.js"]');
  const src = scriptEl ? scriptEl.getAttribute('src') : 'js/componentLoader.js';
  const base = src.replace(/js\/componentLoader\.js.*$/, '');

  ComponentLoader.load('navbar-component', base + 'components/navbar.html', base);
  ComponentLoader.load('footer-component', base + 'components/footer.html', base);
  ComponentLoader.load('whatsapp-component', base + 'components/whatsapp.html', base);
});
