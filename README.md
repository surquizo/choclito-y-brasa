# Choclito & Brasa

Sitio oficial estático de Choclito & Brasa, preparado para GitHub Pages.

## Tecnologías

- HTML5, CSS3 y JavaScript sin dependencias.
- GitHub Actions para despliegue automático.
- Datos del menú centralizados en `js/menu-data.js`.

## Vista local

Abre `index.html` en un navegador. Para probarlo con rutas y servidor local, en una terminal puedes usar `npx serve .` si cuentas con Node.js y acceso a npm.

## Actualizar menú

Abre `js/menu-data.js`. Cada producto es un objeto con estas propiedades:

```js
{ category: 'Picadas', name: 'Nombre', description: 'Descripción opcional', price: '$0.00', image: 'assets/images/foto.png' }
```

- Para cambiar un precio, modifica solo `price`.
- Para agregar un producto, duplica un objeto y edita sus campos.
- Para quitarlo, elimina el objeto completo, incluida su coma separadora correspondiente.
- Para crear una categoría, usa su nuevo nombre en `category`; se añadirá automáticamente al filtro.
- Usa `image` solamente cuando exista una foto real del producto. Guarda las nuevas imágenes dentro de `assets/images/` y coloca su ruta relativa.

## Actualizar datos del restaurante

- Textos, horario y dirección: `index.html`.
- WhatsApp: busca `593999880628` en `index.html` y en `js/menu-data.js`.
- SEO y datos de Google: actualiza las etiquetas de `<head>` y el bloque Schema.org de `index.html` si cambian datos reales del negocio.

## Publicar en GitHub Pages

El remoto previsto es `https://github.com/surquizo/choclito-y-brasa.git` y la URL final será `https://surquizo.github.io/choclito-y-brasa/`.

1. Crea el repositorio vacío en GitHub, con el nombre `choclito-y-brasa`, si todavía no existe.
2. En la carpeta del proyecto ejecuta:

```bash
git init
git add .
git commit -m "Publica sitio de Choclito y Brasa"
git branch -M main
git remote add origin https://github.com/surquizo/choclito-y-brasa.git
git push -u origin main
```

3. En GitHub abre **Settings > Pages**, en **Build and deployment** selecciona **GitHub Actions**.
4. Ve a **Actions** y espera que finalice el flujo “Deploy static site to GitHub Pages”.
5. Abre la URL final y comprueba que carga correctamente.

Cada `git push` a `main` volverá a publicar el sitio.
