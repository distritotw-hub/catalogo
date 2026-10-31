# DISTRITO® — Web catálogo

Web: **https://distritotw-hub.github.io/catalogo/**

La web lee los productos del Google Sheets **"Catálogo DISTRITO"** (hoja `Hoja 1`).
Todo lo que cambies en el Sheets aparece en la web al recargarla. No hace falta tocar código.

## Cómo editar el catálogo (desde el Google Sheets)

| Columna | Qué poner |
|---|---|
| **ID** | Un número único (001, 002…). Se usa en el link para compartir. |
| **Producto** | Nombre de la prenda. Si lo dejás vacío, la fila no aparece. |
| **Precio** | Solo el número, sin puntos ni `$` (ej. `45000`). Vacío = "Consultar precio". |
| **Descripcion** | Texto corto de la prenda. |
| **Caracteristicas** | Una por línea (dentro de la celda: `Ctrl + Enter` para saltar de línea). |
| **Categoria** | Ej. `Buzos y hoodies`. Las categorías de la web se arman solas con esta columna. |
| **Talles** | Ej. `S - M - L - XL`. Vacío = no se muestran talles. |
| **Estado** | `Disponible` o `Agotado` (lista desplegable). Agotado se ve en gris al final. |
| **Foto1 … Foto4** | Links de las fotos (la primera es la portada). |

### Agregar una prenda nueva
1. Agregá una fila al final con un ID nuevo.
2. Fotos: subilas a la carpeta `img` del repositorio en GitHub
   (github.com/distritotw-hub/catalogo → carpeta `img` → **Add file → Upload files**)
   y usá el link `https://distritotw-hub.github.io/catalogo/img/NOMBRE.jpg`.
   También sirve cualquier link directo a una imagen (.jpg / .png).
3. Las fotos del catálogo son cuadradas (1000×1000) con la prenda centrada sobre fondo gris oscuro con luz suave.
   Para que una prenda nueva combine, usá el mismo estilo (o pedile a Claude que la procese igual).

### Sacar una prenda
Borrá la fila, o poné `Agotado` en Estado si querés que se siga viendo.

### Funciones del script (Extensiones → Apps Script)
- `doGet`: es lo que lee la web. No hace falta ejecutarla.
- `cargarCatalogoInicial`: solo se usa una vez con la hoja vacía.
- `actualizarFotos`: reescribe Foto1–Foto4 con las fotos de GitHub según el ID, sin tocar precios ni textos.

## Cambiar otras cosas
En `index.html` (se edita desde GitHub con el ícono del lápiz), al principio del `<script>`, en el bloque **CONFIG**:
- `WHATSAPP`: número de ventas (código de país, sin + ni espacios).
- `MARQUESINA`: los textos de la franja roja.
- `BENEFICIOS`: los 4 cuadros del pie (envíos, pagos, etc.).
- `SHEET_URL`: la URL del Apps Script (no tocar salvo que crees uno nuevo).

Los colores están arriba de todo, en `:root` (por ejemplo `--rojo`).

## Archivos
- `index.html` — la web completa.
- `Codigo.gs` — el Apps Script que conecta el Sheets con la web (copia de respaldo).
- `data/productos.json` — copia de respaldo del catálogo: la web la usa si el Sheets no responde.
- `img/` — fotos de las prendas con fondo blanco.
- `assets/logo.png` — logo.
