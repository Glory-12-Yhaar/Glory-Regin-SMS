const PageTemplates = (() => {
  const cache = new Map();

  function load(path) {
    if (cache.has(path)) return cache.get(path);

    const request = new XMLHttpRequest();
    request.open('GET', path, false);
    request.send(null);

    if (request.status >= 200 && request.status < 300) {
      cache.set(path, request.responseText);
      return request.responseText;
    }

    console.error('Unable to load page template:', path, request.status);
    return `<div class="card" style="padding:24px;color:var(--danger)">Unable to load page template: ${path}</div>`;
  }

  function render(path, data = {}) {
    return load(path).replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, (_, key) => (
      Object.prototype.hasOwnProperty.call(data, key) ? String(data[key]) : ''
    ));
  }

  return { load, render };
})();

function renderPageTemplate(path, data = {}) {
  return PageTemplates.render(path, data);
}
