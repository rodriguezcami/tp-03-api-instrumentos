const fs = require('node:fs/promises');

/**
 * Lee de forma asíncrona un archivo JSON y retorna su contenido interpretado.
 * @param {string} ruta - Ruta completa del archivo a leer.
 * @returns {Promise<Array|Object>} Contenido parseado del JSON.
 */
async function leerArchivoJSON(ruta) {
  const contenidoTexto = await fs.readFile(ruta, 'utf8');
  return JSON.parse(contenidoTexto);
}

module.exports = {
  leerArchivoJSON
};