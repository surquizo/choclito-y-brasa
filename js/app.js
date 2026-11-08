(() => {
  const staticItems = window.MENU_ITEMS.filter(item => item.category !== 'Picadas');
  const categories = ['Todos', 'Picadas', ...new Set(staticItems.map(item => item.category))];
  const filters = document.querySelector('#menu-filters');
  const grid = document.querySelector('#menu-grid');
  const order = [];
  let active = 'Todos';
  let selectedBase = '';
  let selectedProteins = [];

  const moneyValue = price => Number(price.replace('$', ''));
  const money = value => `$${value.toFixed(2)}`;
  const whatsappUrl = message => `https://wa.me/${window.RESTAURANT.whatsapp}?text=${encodeURIComponent(message)}`;

  function addToOrder(item) {
    const existing = order.find(entry => entry.id === item.id);
    if (existing) existing.quantity += 1;
    else order.push({ ...item, quantity: 1 });
    render();
  }

  function orderPanel() {
    const total = order.reduce((sum, item) => sum + moneyValue(item.price) * item.quantity, 0);
    const messageLines = order.map(item => `${item.quantity} x ${item.name}${item.detail ? ` (${item.detail})` : ''} - ${money(moneyValue(item.price) * item.quantity)}`);
    const message = `Hola, quiero realizar el siguiente pedido en Choclito & Brasa:\n${messageLines.join('\n')}\n\nTotal: ${money(total)}`;
    return `<aside class="order-panel ${order.length ? 'has-items' : ''}" aria-live="polite">
      <div class="order-panel-heading"><div><p class="menu-card-category">Tu pedido</p><h3>${order.length ? `${order.reduce((sum, item) => sum + item.quantity, 0)} producto${order.reduce((sum, item) => sum + item.quantity, 0) === 1 ? '' : 's'}` : 'Aún no agregas productos'}</h3></div>${order.length ? `<strong class="order-total">${money(total)}</strong>` : ''}</div>
      ${order.length ? `<div class="order-items">${order.map(item => `<div class="order-item"><div><strong>${item.name}</strong>${item.detail ? `<small>${item.detail}</small>` : ''}<span>${item.price} c/u</span></div><div class="quantity-control"><button type="button" data-decrease="${item.id}" aria-label="Quitar una unidad de ${item.name}">−</button><span>${item.quantity}</span><button type="button" data-increase="${item.id}" aria-label="Agregar una unidad de ${item.name}">+</button></div></div>`).join('')}</div><a class="send-order" href="${whatsappUrl(message)}" target="_blank" rel="noopener">Enviar pedido por WhatsApp</a>` : '<p class="order-empty">Elige uno o varios productos del menú para armar tu pedido completo.</p>'}
    </aside>`;
  }

  const productCard = item => `<article class="menu-card ${item.image ? '' : 'no-image'}">${item.image ? `<img class="menu-card-image" src="${item.image}" alt="${item.name} de Choclito & Brasa" loading="lazy" />` : ''}<div class="menu-card-content"><p class="menu-card-category">${item.category}</p><h3>${item.name}</h3>${item.description ? `<p>${item.description}</p>` : ''}<div class="menu-card-footer"><span class="price">${item.price}</span><button class="order-small" type="button" data-add-product="${encodeURIComponent(item.name)}">Agregar</button></div></div></article>`;

  function picadaBuilder() {
    const config = window.PICADA_MENU;
    const option = config.options[selectedProteins.length];
    const ready = Boolean(selectedBase);
    const proteinsText = selectedProteins.length ? selectedProteins.join(', ') : 'sin proteínas';
    return `<article class="picada-builder">
      <div class="picada-photo"><img src="${config.image}" alt="Picada de Choclito & Brasa" loading="lazy" /></div>
      <div class="picada-content">
        <p class="menu-card-category">Arma tu picada</p>
        <h3>Elige la base</h3>
        <div class="picada-options" role="group" aria-label="Bases para tu picada">${config.bases.map(base => `<button class="picada-choice ${selectedBase === base ? 'selected' : ''}" type="button" data-base="${base}" aria-pressed="${selectedBase === base}">${base}</button>`).join('')}</div>
        <h3>Agrega tus proteínas</h3>
        <p class="picada-help">Selecciona hasta cuatro: costilla, cuero, chorizo o pollo.</p>
        <div class="picada-options" role="group" aria-label="Proteínas para tu picada">${config.proteins.map(protein => `<button class="picada-choice ${selectedProteins.includes(protein) ? 'selected' : ''}" type="button" data-protein="${protein}" aria-pressed="${selectedProteins.includes(protein)}">${protein}</button>`).join('')}</div>
        <p class="picada-included"><strong>Incluye:</strong> salsa especial de la casa y queso manaba rallado.</p>
        <div class="picada-summary ${ready ? 'ready' : ''}"><div><span>${ready ? option.name : 'Elige una base para continuar'}</span><strong>${ready ? option.price : '—'}</strong><small>${ready ? `${selectedBase} · ${proteinsText}` : 'Selecciona una base para agregar tu picada al pedido.'}</small></div>${ready ? `<button class="order-picada" type="button" data-add-picada="true">Agregar esta picada</button>` : '<span class="order-picada disabled">Agregar esta picada</span>'}</div>
      </div>
    </article>`;
  }

  function render() {
    filters.innerHTML = categories.map(category => `<button class="filter ${category === active ? 'active' : ''}" data-category="${category}" type="button" aria-pressed="${category === active}">${category}</button>`).join('');
    const showPicada = active === 'Todos' || active === 'Picadas';
    const items = active === 'Todos' ? staticItems : staticItems.filter(item => item.category === active);
    grid.innerHTML = `${orderPanel()}${showPicada ? picadaBuilder() : ''}${items.map(productCard).join('')}`;
  }

  filters.addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (!button) return; active = button.dataset.category; render(); });
  grid.addEventListener('click', event => {
    const base = event.target.closest('[data-base]');
    const protein = event.target.closest('[data-protein]');
    const productButton = event.target.closest('[data-add-product]');
    const picadaButton = event.target.closest('[data-add-picada]');
    const increaseButton = event.target.closest('[data-increase]');
    const decreaseButton = event.target.closest('[data-decrease]');
    if (base) { selectedBase = base.dataset.base; render(); return; }
    if (protein) { const value = protein.dataset.protein; selectedProteins = selectedProteins.includes(value) ? selectedProteins.filter(item => item !== value) : [...selectedProteins, value]; render(); return; }
    if (productButton) { const item = staticItems.find(entry => entry.name === decodeURIComponent(productButton.dataset.addProduct)); addToOrder({ id: `product-${item.name}`, name: item.name, price: item.price }); return; }
    if (picadaButton) { const option = window.PICADA_MENU.options[selectedProteins.length]; const detail = `${selectedBase} · ${selectedProteins.length ? selectedProteins.join(', ') : 'sin proteínas'}`; addToOrder({ id: `picada-${selectedBase}-${selectedProteins.join('-')}`, name: option.name, detail, price: option.price }); return; }
    if (increaseButton) { const item = order.find(entry => entry.id === increaseButton.dataset.increase); item.quantity += 1; render(); return; }
    if (decreaseButton) { const index = order.findIndex(entry => entry.id === decreaseButton.dataset.decrease); order[index].quantity -= 1; if (order[index].quantity === 0) order.splice(index, 1); render(); }
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
