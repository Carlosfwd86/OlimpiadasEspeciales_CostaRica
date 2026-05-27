// ─────────────────────────────────────────────────────────────────────────────
// ARCHIVO: c:\Users\FWD8D\OneDrive\Desktop\OlimpiadasEspeciales_CostaRica\Backend\middlewares\manejoArchivos.js
// DESCRIPCIÓN: Middleware para la gestión de subida de archivos (certificados) utilizando Multer en memoria.
// ─────────────────────────────────────────────────────────────────────────────

const multer = require('multer');

// Configuración de almacenamiento en memoria para evitar guardar archivos temporales en el disco.
// Esto permite que el archivo se procese directamente desde el buffer de RAM para pasarlo al servicio de IA.
const almacenamientoMemoria = multer.memoryStorage();

// Filtro para validar los tipos de archivos permitidos (JPEG, WEBP y PDF). PNG exluido por limitaciones del modelo de IA.
const filtroArchivos = (peticion, archivo, callback) => {
  const tiposPermitidos = [
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'application/pdf'
  ];

  if (tiposPermitidos.includes(archivo.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Formato no soportado. Use JPG, JPEG, WebP o PDF. El formato PNG no es compatible con el procesador de IA.'), false);
  }
};

// Instanciación y configuración de Multer con límite de tamaño (5 Megabytes).
const subirArchivo = multer({
  storage: almacenamientoMemoria,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5 Megabytes
  },
  fileFilter: filtroArchivos
});

const cargarCertificado = subirArchivo.single('certificado');

const cargarDocumentosRegistro = subirArchivo.fields([
  { name: 'cedula', maxCount: 1 },
  { name: 'certificado', maxCount: 1 },
  { name: 'foto', maxCount: 1 },
  { name: 'identificacion_tutor', maxCount: 1 },
  { name: 'delincuencia', maxCount: 1 },
  { name: 'titulo', maxCount: 1 },
]);

const cargarDocumentoAtleta = subirArchivo.single('archivo');

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'El archivo supera el límite de 5 MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

module.exports = {
  cargarCertificado,
  cargarDocumentosRegistro,
  cargarDocumentoAtleta,
  handleMulterError,
};
