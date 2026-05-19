/**
 * @function s3Url
 * @description Genera la URL completa de un asset almacenado en el bucket S3 público.
 * @param path - Ruta relativa dentro del bucket (ej: 'img/Logo Olimpiadas.png')
 * @returns URL completa del asset en S3
 */
export const s3Url = (path: string): string =>
  `${import.meta.env.VITE_S3_URL}/${path}`;
