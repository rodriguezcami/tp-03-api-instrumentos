const path = require('node:path');
const express = require('express');
const { leerArchivoJSON } = require('./archivos');

const PORT = 3000;
let instrumentos = [];

async function main() {
  try {
    const rutaArchivo = path.join(__dirname, '..', 'datos', 'instrumentos.json');
    instrumentos = await leerArchivoJSON(rutaArchivo);
  } catch (error) {
    console.error('Error de inicio: no se pudo leer o interpretar el archivo de datos iniciales.', error.message);
    process.exit(1);
  }

  const app = express();

  // Middleware para parsear JSON en el cuerpo de las peticiones
  app.use(express.json());

  // GET / -> Bienvenida
  app.get('/', (req, res) => {
    return res.status(200).json({
      mensaje: 'Bienvenido a la API del catálogo de instrumentos musicales. Servicio disponible.'
    });
  });

  // GET /api/instrumentos -> Listado general y filtro opcional
  app.get('/api/instrumentos', (req, res) => {
    const { familia } = req.query;

    if (familia) {
      const familiaBuscada = String(familia).trim().toLowerCase();
      const filtrados = instrumentos.filter(
        (inst) => inst.familia.toLowerCase() === familiaBuscada
      );
      return res.status(200).json(filtrados);
    }

    return res.status(200).json(instrumentos);
  });

  // GET /api/instrumentos/:id -> Detalle por id
  app.get('/api/instrumentos/:id', (req, res) => {
    const id = Number(req.params.id);
    const instrumentoEncontrado = instrumentos.find((inst) => inst.id === id);

    if (!instrumentoEncontrado) {
      return res.status(404).json({
        error: `Instrumento con identificador ${req.params.id} no encontrado.`
      });
    }

    return res.status(200).json(instrumentoEncontrado);
  });

  // POST /api/instrumentos -> Creación en memoria
  app.post('/api/instrumentos', (req, res) => {
    const { nombre, familia, origen, descripcion, disponible } = req.body;

    if (
      !nombre ||
      !familia ||
      !origen ||
      !descripcion ||
      disponible === undefined ||
      typeof disponible !== 'boolean'
    ) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios: nombre, familia, origen, descripcion y disponible (booleano).'
      });
    }

    const nuevoId = instrumentos.length > 0 ? instrumentos[instrumentos.length - 1].id + 1 : 1;

    const nuevoInstrumento = {
      id: nuevoId,
      nombre: String(nombre).trim(),
      familia: String(familia).trim(),
      origen: String(origen).trim(),
      descripcion: String(descripcion).trim(),
      disponible
    };

    instrumentos.push(nuevoInstrumento);

    return res.status(201).json(nuevoInstrumento);
  });

  app.listen(PORT, () => {
    console.log(`Servidor activo escuchando en http://localhost:${PORT}`);
  });
}

main();