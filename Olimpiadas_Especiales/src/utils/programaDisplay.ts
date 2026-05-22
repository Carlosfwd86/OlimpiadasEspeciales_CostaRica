import { s3Url } from './s3';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

/** Rutas legacy en BD (oe.cr) → assets reales en S3 */
const LEGACY_IMG_ALIASES: Record<string, string> = {
  'img/evento_natacion.png': 'img/Hero_contenedor_02.jpeg',
};

function extractAssetPath(url: string): string {
  return url.replace(/^https?:\/\/[^/]+\//, '').replace(/^\//, '');
}

/**
 * Normaliza URLs de imagen: S3 para assets del proyecto, ignora hosts rotos (oe.cr).
 */
export function resolveProgramaImagen(
  ...sources: (string | undefined)[]
): string | undefined {
  const raw = sources.find((s) => typeof s === 'string' && s.trim());
  if (!raw) return undefined;

  const trimmed = raw.trim();

  if (/oe\.cr\//i.test(trimmed) || trimmed.startsWith('https://oe.cr')) {
    const path = extractAssetPath(trimmed);
    const aliased = LEGACY_IMG_ALIASES[path] ?? path;
    return s3Url(aliased);
  }

  if (trimmed.startsWith('/img/') || trimmed.startsWith('img/')) {
    const path = trimmed.replace(/^\//, '');
    return s3Url(LEGACY_IMG_ALIASES[path] ?? path);
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return s3Url(trimmed);
}

export interface ProgramaDisplay {
  id: string;
  nombre: string;
  img?: string;
  imagen?: string;
  categoria?: string;
  deporte?: string;
  resumen?: string;
  descripcion?: string;
  fecha?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  status?: string;
  enlace?: string;
  [key: string]: unknown;
}

export function formatRangoFechas(inicio?: string, fin?: string): string {
  if (!inicio) return '';
  const inicioStr = String(inicio).slice(0, 10);
  if (!fin) return inicioStr;
  const finStr = String(fin).slice(0, 10);
  if (finStr === inicioStr) return inicioStr;
  return `${inicioStr} – ${finStr}`;
}

export function mapCompeticionFromApi(item: ProgramaDisplay): ProgramaDisplay {
  const img = resolveProgramaImagen(
    item.img,
    item.img_url as string | undefined,
    item.imagen
  );
  return {
    ...item,
    id: `competicion-${item.id}`,
    fecha: item.fecha ?? formatRangoFechas(item.fecha_inicio, item.fecha_fin),
    img,
    imagen: img,
    resumen: item.resumen ?? item.descripcion ?? '',
  };
}

export function mapMockPrograma(item: ProgramaDisplay): ProgramaDisplay {
  const img = resolveProgramaImagen(item.img, item.imagen);
  return {
    ...item,
    id: `mock-${item.id}`,
    img,
    imagen: img,
  };
}

export function programaListKey(programa: ProgramaDisplay, idx: number): string {
  const id = String(programa.id);
  if (id.startsWith('competicion-') || id.startsWith('mock-')) return id;
  return `item-${idx}-${programa.nombre}`;
}
