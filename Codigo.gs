/**
 * DISTRITO® — Catálogo web
 * Google Apps Script que lee la hoja "Hoja 1" y la devuelve como JSON para la web.
 *
 * Columnas (fila 1, en este orden):
 * ID | Producto | Precio | Descripcion | Caracteristicas | Categoria | Talles | Estado | Foto1 | Foto2 | Foto3 | Foto4
 *
 * - Precio: número sin puntos (ej. 45000) o vacío -> la web muestra "Consultar precio".
 * - Caracteristicas: una por línea (Alt+Enter / Ctrl+Enter dentro de la celda).
 * - Estado: "Disponible" o "Agotado".
 * - Foto1..Foto4: links a imágenes (las del catálogo están en https://distritotw-hub.github.io/catalogo/img/).
 */

const HOJA = 'Hoja 1';
const CATALOGO_INICIAL = 'https://distritotw-hub.github.io/catalogo/data/productos.json';

function doGet() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA);
  const filas = hoja.getDataRange().getDisplayValues();
  const encabezados = filas.shift().map(h => String(h).trim());

  const productos = filas
    .filter(f => String(f[1]).trim() !== '') // sin nombre de producto = fila vacía
    .map(f => {
      const p = {};
      encabezados.forEach((h, i) => { p[h] = String(f[i] || '').trim(); });
      return p;
    });

  return ContentService
    .createTextOutput(JSON.stringify({ productos: productos, actualizado: new Date().toISOString() }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Ejecutar UNA sola vez: carga en la hoja los productos iniciales del catálogo.
 * Si la hoja ya tiene productos, no hace nada (para no pisar tus cambios).
 */
function cargarCatalogoInicial() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = libro.getSheetByName(HOJA) || libro.insertSheet(HOJA);
  if (hoja.getLastRow() > 1) {
    throw new Error('La hoja ya tiene productos. No se cargó nada para no borrar tus cambios.');
  }

  const datos = JSON.parse(UrlFetchApp.fetch(CATALOGO_INICIAL).getContentText());
  const encabezados = ['ID', 'Producto', 'Precio', 'Descripcion', 'Caracteristicas', 'Categoria', 'Talles', 'Estado', 'Foto1', 'Foto2', 'Foto3', 'Foto4'];
  const filas = datos.productos.map(p => encabezados.map(h => p[h] || ''));

  hoja.clear();
  hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados])
    .setFontWeight('bold').setBackground('#0a0a0a').setFontColor('#ffffff');
  hoja.getRange(2, 1, filas.length, 1).setNumberFormat('@'); // IDs como texto (001, 002…)
  hoja.getRange(2, 1, filas.length, encabezados.length).setValues(filas).setVerticalAlignment('top');
  hoja.setFrozenRows(1);

  // Precio resaltado para completarlo fácil
  hoja.getRange(2, 3, filas.length, 1).setBackground('#fff4cc').setNumberFormat('#,##0');

  // Lista desplegable para Estado
  const regla = SpreadsheetApp.newDataValidation().requireValueInList(['Disponible', 'Agotado'], true).build();
  hoja.getRange(2, 8, 500, 1).setDataValidation(regla);

  // Anchos cómodos
  [60, 260, 110, 380, 300, 150, 120, 110, 220, 220, 220, 220].forEach((w, i) => hoja.setColumnWidth(i + 1, w));
  hoja.getRange(2, 4, filas.length, 2).setWrap(true);
}

/**
 * Actualiza SOLO las columnas Foto1..Foto4 con las fotos publicadas en GitHub (por ID).
 * No toca precios, descripciones ni nada más.
 */
function actualizarFotos() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA);
  const datos = JSON.parse(UrlFetchApp.fetch(CATALOGO_INICIAL + '?v=' + Date.now()).getContentText());
  const porId = {};
  datos.productos.forEach(p => { porId[p.ID] = [p.Foto1 || '', p.Foto2 || '', p.Foto3 || '', p.Foto4 || '']; });
  const ids = hoja.getRange(2, 1, hoja.getLastRow() - 1, 1).getDisplayValues();
  ids.forEach((fila, i) => {
    const fotos = porId[String(fila[0]).trim()];
    if (fotos) hoja.getRange(i + 2, 9, 1, 4).setValues([fotos]);
  });
}
