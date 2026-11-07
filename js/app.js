(() => {
  const categories = ['Todos', ...new Set(window.MENU_ITEMS.map(item => item.category))];
  const filters = document.querySelector('#menu-filters');
  const grid = document.querySelector('#menu-grid');
  let active = 'Todos';
  const whatsappUrl = name => `https://wa.me/${window.RESTAURANT.whatsapp}?text=${encodeURIComponent(`Hola, quiero realizar un pedido de ${name} de Choclito & Brasa.`)}`;
  function render() {
    filters.innerHTML = categories.map(category => `<button class="filter ${category === active ? 'active' : ''}" data-category="${category}" type="button" aria-pressed="${category === active}">${category}</button>`).join('');
    const items = active === 'Todos' ? window.MENU_ITEMS : window.MENU_ITEMS.filter(item => item.category === active);
    grid.innerHTML = items.map(item => `<article class="menu-card ${item.image ? '' : 'no-image'}">${item.image ? `<img class="menu-card-image" src="${item.image}" alt="${item.name} de Choclito & Brasa" loading="lazy" />` : ''}<div class="menu-card-content"><p class="menu-card-category">${item.category}</p><h3>${item.name}</h3>${item.description ? `<p>${item.description}</p>` : ''}<div class="menu-card-footer"><span class="price">${item.price}</span><a class="order-small" href="${whatsappUrl(item.name)}" target="_blank" rel="noopener">Pedir</a></div></div></article>`).join('');
  }
  filters.addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (!button) return; active = button.dataset.category; render(); });
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
