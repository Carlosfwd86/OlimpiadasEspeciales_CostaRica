// ─────────────────────────────────────────────────────────────────────────────
// ARCHIVO: c:\Users\FWD8D\OneDrive\Desktop\OlimpiadasEspeciales_CostaRica\Backend\middlewares\manejoArchivos.js
// DESCRIPCIÓN: Middleware para la gestión de subida de archivos (certificados) utilizando Multer en memoria.
// ─────────────────────────────────────────────────────────────────────────────

const multer = require('multer');

// Configuración de almacenamiento en memoria para evitar guardar archivos temporales en el disco.
// Esto permite que el archivo se procese directamente desde el buffer de RAM para pasarlo al servicio de IA.
const almacenamientoMemoria = multer.memoryStorage();

// Filtro para validar los tipos de archivos permitidos (JPG, JPEG, PNG, WEBP y PDF).
const filtroArchivos = (peticion, archivo, callback) => {
  const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'application/pdf'
  ];

  if (tiposPermitidos.includes(archivo.mimetype)) {
    // Si el tipo de archivo es válido, se acepta.
    callback(null, true);
  } else {
    // Si no es válido, se retorna un error indicando los formatos soportados.
    callback(new Error('Formato de archivo no soportado. Debe ser una imagen (JPG, PNG, WEBP) o un documento PDF.'), false);
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

// Middleware Express que captura un único archivo bajo el campo "certificado".
const cargarCertificado = subirArchivo.single('certificado');

module.exports = {
  cargarCertificado
};
