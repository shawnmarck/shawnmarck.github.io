// holon-search.js — self-describing graph search
// Uses search-index.json built from verified docs + concept graph
(function() {
  const INDEX_PATH = 'search-index.json';
  let index = null;

  async function load() {
    if (index) return index;
    try {
      const r = await fetch(INDEX_PATH);
      index = await r.json();
      return index;
    } catch(e) { console.error('Search index load failed:', e); return null; }
  }

  function tokenize(q) {
    return q.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  }

  function search(query) {
    if (!index) return [];
    const terms = tokenize(query);
    if (!terms.length) return [];
    
    // Score each node
    const scores = {};
    
    terms.forEach(term => {
      // Exact index lookup
      const entries = index.index[term];
      if (entries) {
        entries.forEach(e => {
          scores[e.node] = (scores[e.node] || 0) + e.score;
        });
      }
      
      // Partial match: term is a prefix of indexed term
      for (const [idxTerm, entries] of Object.entries(index.index)) {
        if (idxTerm.startsWith(term) || term.startsWith(idxTerm)) {
          if (idxTerm !== term) {
            entries.forEach(e => {
              scores[e.node] = (scores[e.node] || 0) + e.score * 0.3;
            });
          }
        }
      }
    });
    
    // Boost: if multiple terms match same node, multiply
    // Boost: title match
    terms.forEach(term => {
      for (const [nid, node] of Object.entries(index.nodes)) {
        if (node.title.toLowerCase().includes(term)) {
          scores[nid] = (scores[nid] || 0) + 8;
        }
      }
    });
    
    // Sort by score, return top results with expansion
    const ranked = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([nid, score]) => {
        const node = index.nodes[nid];
        if (!node) return null;
        return {
          id: nid,
          title: node.title,
          file: node.file,
          score: Math.round(score * 10) / 10,
          tier: node.tier,
          // Expand edges: related nodes
          related: [
            ...node.depends_on.map(d => index.nodes[d]).filter(Boolean).slice(0, 3),
            ...node.used_by.map(u => index.nodes[u]).filter(Boolean).slice(0, 3)
          ].map(n => ({ id: n.id, title: n.title, file: n.file }))
        };
      })
      .filter(Boolean);
    
    return ranked;
  }

  function render(results, container) {
    if (!results.length) {
      container.innerHTML = '<div class="search-empty">No results</div>';
      return;
    }
    container.innerHTML = results.map(r => {
      const related = r.related.length 
        ? `<div class="search-related">${r.related.map(rel => 
            `<a href="${rel.file}" class="search-rel-link" onclick="event.stopPropagation()">${rel.title}</a>`
          ).join(' → ')}</div>`
        : '';
      return `<a href="${r.file}" class="search-result">
        <div class="search-title">${r.title} <span class="search-score">${r.score}</span></div>
        <div class="search-meta">tier ${r.tier}</div>
        ${related}
      </a>`;
    }).join('');
  }

  // Wire up search UI
  function init() {
    const input = document.getElementById('holon-search');
    const results = document.getElementById('holon-results');
    if (!input || !results) return;

    let debounce;
    input.addEventListener('input', async () => {
      clearTimeout(debounce);
      debounce = setTimeout(async () => {
        const q = input.value.trim();
        if (q.length < 2) { results.style.display = 'none'; return; }
        const idx = await load();
        if (!idx) return;
        const res = search(q);
        results.style.display = 'block';
        render(res, results);
      }, 150);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#holon-search') && !e.target.closest('#holon-results')) {
        results.style.display = 'none';
      }
    });

    // Keyboard nav
    input.addEventListener('keydown', (e) => {
      const items = results.querySelectorAll('.search-result');
      const active = results.querySelector('.search-result.active');
      if (e.key === 'Escape') { results.style.display = 'none'; input.blur(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (active) active.classList.remove('active');
        const next = e.key === 'ArrowDown' ? (active?.nextElementSibling || items[0]) : (active?.previousElementSibling || items[items.length-1]);
        if (next) { next.classList.add('active'); next.scrollIntoView({ block: 'nearest' }); }
      }
      if (e.key === 'Enter' && active) {
        e.preventDefault();
        active.click();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.holonSearch = { load, search };
})();
