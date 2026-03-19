// © 2026 technonyte
// SF Symbols Library
const iconCache = new Map();

customElements.define('sf-sym', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() { return ['name']; }
  attributeChangedCallback(n, o, v) { if (o !== v) this.render(); }
  connectedCallback() { this.render(); }

  async render() {
    const name = this.getAttribute('name');
    if (!name) return;

    const url = `https://cdn.jsdelivr.net/gh/technonyte00/sf-symbols@main/icons/${name}.svg`;

    try {
      let svgText = iconCache.get(url);
      if (!svgText) {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        let raw = await res.text();

        raw = raw.replace(/fill="[^"]*"/g, "").replace(/fill-opacity="[^"]*"/g, "");

        const doc = new DOMParser().parseFromString(raw, 'image/svg+xml');
        const svg = doc.querySelector('svg');

        if (svg) {
          const vb = svg.getAttribute('viewBox');
          if (vb) {
            const [x, y, w, h] = vb.split(/\s+/).map(Number);
            const m = Math.max(w, h);
            svg.setAttribute('viewBox', `${x - (m - w) / 2} ${y - (m - h) / 2} ${m} ${m}`);
          }
          svg.removeAttribute('width');
          svg.removeAttribute('height');
          svg.setAttribute('fill', 'currentColor');
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          svgText = svg.outerHTML;
          iconCache.set(url, svgText);
        }
      }

      this.shadowRoot.innerHTML = `
        <style>
          :host { display: inline-flex; width: 1em; height: 1em; vertical-align: -0.125em; color: inherit; }
          svg { width: 100%; height: 100%; display: block; fill: currentColor; }
          path { fill: currentColor; }
        </style>${svgText}`;
    } catch (e) {
      this.shadowRoot.innerHTML = '';
    }
  }
});
