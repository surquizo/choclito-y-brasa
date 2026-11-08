(() => {
  const staticItems = window.MENU_ITEMS.filter(item => item.category !== 'Picadas');
  const categories = ['Todos', 'Picadas', ...new Set(staticItems.map(item => item.category))];
  const filters = document.querySelector('#menu-filters');
  const grid = document.querySelector('#menu-grid');
  let active = 'Todos';
  let selectedBase = '';
  let selectedProteins = [];

  const whatsappUrl = message => `https://wa.me/${window.RESTAURANT.whatsapp}?text=${encodeURIComponent(message)}`;
  const productCard = item => `<article class="menu-card ${item.image ? '' : 'no-image'}">${item.image ? `<img class="menu-card-image" src="${item.image}" alt="${item.name} de Choclito & Brasa" loading="lazy" />` : ''}<div class="menu-card-content"><p class="menu-card-category">${item.category}</p><h3>${item.name}</h3>${item.description ? `<p>${item.description}</p>` : ''}<div class="menu-card-footer"><span class="price">${item.price}</span><a class="order-small" href="${whatsappUrl(`Hola, quiero realizar un pedido de ${item.name} de Choclito & Brasa.`)}" target="_blank" rel="noopener">Pedir</a></div></div></article>`;

  function picadaBuilder() {
    const config = window.PICADA_MENU;
    const option = config.options[selectedProteins.length];
    const ready = Boolean(selectedBase);
    const proteinsText = selectedProteins.length ? selectedProteins.join(', ') : 'sin proteínas';
    const message = `Hola, quiero realizar un pedido de ${option.name} con base de ${selectedBase} y ${proteinsText} de Choclito & Brasa.`;
    return `<article class="picada-builder">
      <div class="picada-photo"><img src="${config.image}" alt="Picada de Choclito & Brasa" loading="lazy" /></div>
      <div class="picada-content">
        <p class="menu-card-category">Arma tu picada</p>
        <h3>Elige la base</h3>
        <div class="picada-options" role="group" aria-label="Bases para tu picada">${config.bases.map(base => `<button class="picada-choice ${selectedBase === base ? 'selected' : ''}" type="button" data-base="${base}" aria-pressed="${selectedBase === base}">${base}</button>`).join('')}</div>
        <h3>Agrega tus proteínas</h3>
        <p class="picada-help">Selecciona hasta cuatro: costilla, cuero, chorizo o pollo.</p>
        <div class="picada-options" role="group" aria-label="Proteínas para tu picada">${config.proteins.map(protein => `<button class="picada-choice ${selectedProteins.includes(protein) ? 'selected' : ''}" type="button" data-protein="${protein}" aria-pressed="${selectedProteins.includes(protein)}">${protein}</button>`).join('')}</div>
        <div class="picada-summary ${ready ? 'ready' : ''}"><div><span>${ready ? option.name : 'Elige una base para continuar'}</span><strong>${ready ? option.price : '—'}</strong><small>${ready ? `${selectedBase} · ${proteinsText}` : 'La salsa especial de la casa y queso manaba rallado están incluidos.'}</small></div>${ready ? `<a class="order-picada" href="${whatsappUrl(message)}" target="_blank" rel="noopener">Pedir esta picada <span aria-hidden="true">↗</span></a>` : '<span class="order-picada disabled">Pedir esta picada</span>'}</div>
      </div>
    </article>`;
  }

  function render() {
    filters.innerHTML = categories.map(category => `<button class="filter ${category === active ? 'active' : ''}" data-category="${category}" type="button" aria-pressed="${category === active}">${category}</button>`).join('');
    const showPicada = active === 'Todos' || active === 'Picadas';
    const items = active === 'Todos' ? staticItems : staticItems.filter(item => item.category === active);
    grid.innerHTML = `${showPicada ? picadaBuilder() : ''}${items.map(productCard).join('')}`;
  }

  filters.addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (!button) return; active = button.dataset.category; render(); });
  grid.addEventListener('click', event => {
    const base = event.target.closest('[data-base]');
    const protein = event.target.closest('[data-protein]');
    if (base) { selectedBase = base.dataset.base; render(); }
    if (protein) { const value = protein.dataset.protein; selectedProteins = selectedProteins.includes(value) ? selectedProteins.filter(item => item !== value) : [...selectedProteins, value]; render(); }
  });
  render();

  const toggle = document.querySelector('.nav-toggle'); const nav = document.querySelector('.site-nav');
  toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });
  nav.addEventListener('click', event => { if (event.target.matches('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); } });
  document.querySelector('#year').textContent = new Date().getFullYear();
  const dialog = document.querySelector('#lightbox'); const dialogImage = dialog.querySelector('img'); const caption = dialog.querySelector('figcaption');
  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => { dialogImage.src = button.dataset.lightbox; dialogImage.alt = button.querySelector('img').alt; caption.textContent = button.dataset.caption; dialog.showModal(); }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
})();
