import type { Atleta, Graficos } from '../types';

export const PROVINCIAS_CR = [
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón',
] as const;

const PROVINCE_ALIASES: Record<string, string> = {
  'san jose': 'San José',
  'san josé': 'San José',
  'sanjose': 'San José',
  alajuela: 'Alajuela',
  cartago: 'Cartago',
  heredia: 'Heredia',
  guanacaste: 'Guanacaste',
  puntarenas: 'Puntarenas',
  limon: 'Limón',
  'limón': 'Limón',
};

const SPORT_FILL_CLASSES = ['fill-red', 'fill-blue', 'fill-green', 'fill-yellow'] as const;

const normalizeKey = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

export const regionColorClass = (region: string): string =>
  `color-${normalizeKey(region)}`;

type AtletaRow = Atleta & {
  region?: string;
  equipo?: string;
  disciplina?: string;
  deporte?: string;
  programa?: string | { nombre?: string; provincia?: string };
  programa_id?: number;
};

const normalizeProvinceToken = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const key = trimmed
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (PROVINCE_ALIASES[key]) return PROVINCE_ALIASES[key];

  const found = PROVINCIAS_CR.find(
    (p) =>
      key ===
        p
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') ||
      key.includes(
        p
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      )
  );
  return found ?? null;
};

const programaFromAtleta = (atleta: AtletaRow): { nombre?: string; provincia?: string } | null => {
  const p = atleta.programa;
  if (!p) return null;
  if (typeof p === 'string') return { nombre: p };
  if (typeof p === 'object') return p;
  return null;
};

/** Resuelve la provincia de un atleta usando programa, dirección u otros campos. */
export const resolveProvincia = (atleta: AtletaRow): string => {
  const programa = programaFromAtleta(atleta);

  if (programa?.provincia) {
    const fromProvincia = normalizeProvinceToken(programa.provincia);
    if (fromProvincia) return fromProvincia;
  }

  if (programa?.nombre) {
    const fromNombre = normalizeProvinceToken(programa.nombre);
    if (fromNombre) return fromNombre;
  }

  const candidates = [
    atleta.region,
    typeof atleta.programa === 'string' ? atleta.programa : undefined,
    atleta.direccion,
    atleta.pais,
  ].filter(Boolean) as string[];

  for (const text of candidates) {
    const found = normalizeProvinceToken(text);
    if (found) return found;
    for (const prov of PROVINCIAS_CR) {
      if (text.toLowerCase().includes(prov.toLowerCase())) return prov;
    }
  }

  return 'Desconocido';
};

const deporteFromAtleta = (atleta: AtletaRow): string => {
  const raw =
    atleta.equipo ||
    atleta.disciplina ||
    atleta.deporte ||
    (typeof atleta.programa === 'object' ? undefined : undefined);
  const label = typeof raw === 'string' ? raw.trim() : '';
  return label || 'Sin deporte asignado';
};

export const buildDistribucionRegional = (
  atletas: AtletaRow[]
): NonNullable<Graficos['distribucionRegional']> => {
  const counts: Record<string, number> = {};
  atletas.forEach((a) => {
    const prov = resolveProvincia(a);
    counts[prov] = (counts[prov] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([region, valor]) => ({
      region,
      valor,
      colorClase: regionColorClass(region),
    }));
};

export const buildAtletasPorDeporte = (
  atletas: AtletaRow[]
): NonNullable<Graficos['atletasPorDeporte']> => {
  if (atletas.length === 0) return [];

  const counts: Record<string, number> = {};
  atletas.forEach((a) => {
    const deporte = deporteFromAtleta(a);
    counts[deporte] = (counts[deporte] || 0) + 1;
  });

  const total = atletas.length;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([deporte, valor], index) => ({
      deporte,
      valor,
      porcentaje: Math.round((valor / total) * 100),
      colorClase: SPORT_FILL_CLASSES[index % SPORT_FILL_CLASSES.length],
    }));
};

export const buildProvinciaCounts = (atletas: AtletaRow[]): Record<string, number> => {
  const counts: Record<string, number> = Object.fromEntries(
    PROVINCIAS_CR.map((p) => [p, 0])
  ) as Record<string, number>;

  atletas.forEach((a) => {
    const prov = resolveProvincia(a);
    if (prov in counts) counts[prov]++;
  });

  return counts;
};

export const enrichGraficosFromAtletas = (
  chartData: Graficos,
  atletas: AtletaRow[]
): Graficos => {
  const hasRegional = (chartData.distribucionRegional?.length ?? 0) > 0;
  const hasDeportes = (chartData.atletasPorDeporte?.length ?? 0) > 0;

  const distribucionRegional = hasRegional
    ? chartData.distribucionRegional!.map((item) => ({
        ...item,
        colorClase: item.colorClase || regionColorClass(item.region),
      }))
    : buildDistribucionRegional(atletas);

  const atletasPorDeporte = hasDeportes
    ? chartData.atletasPorDeporte!
    : buildAtletasPorDeporte(atletas);

  const regionalTotal = distribucionRegional.reduce((sum, item) => sum + item.valor, 0);
  const totalGeneral =
    chartData.totalGeneral ?? (regionalTotal > 0 ? regionalTotal : atletas.length);

  return {
    ...chartData,
    distribucionRegional,
    atletasPorDeporte,
    totalGeneral,
  };
};
