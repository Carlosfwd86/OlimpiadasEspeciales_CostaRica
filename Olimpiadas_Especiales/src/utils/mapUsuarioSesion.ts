/** Normaliza fecha de BD o ISO a YYYY-MM-DD para inputs type="date". */
export const normalizarFechaInput = (valor: unknown): string => {
  if (!valor) return '';
  if (typeof valor === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(valor)) return valor.slice(0, 10);
    const parsed = new Date(valor);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
    return '';
  }
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return valor.toISOString().slice(0, 10);
  }
  return '';
};

export type UsuarioSesionRaw = Record<string, unknown>;

export interface DatosPrefillAtleta {
  nombre?: string;
  cedula?: string;
  correoElectronico?: string;
  telefono?: string;
  direccion?: string;
  pais?: string;
  genero?: string;
  fechaNacimiento?: string;
}

/** Mapea usuario de login/perfil (snake_case o camelCase) a campos del formulario atleta. */
export const mapUsuarioToDatosAtleta = (user: UsuarioSesionRaw | null | undefined): DatosPrefillAtleta => {
  if (!user || typeof user !== 'object') return {};

  const nombre = [user.nombre, user.apellido]
    .filter(v => typeof v === 'string' && v.trim())
    .join(' ')
    .trim();

  const correo =
    (user.correoElectronico as string) ||
    (user.correo_electronico as string) ||
    (user.email as string) ||
    '';

  const fechaRaw = user.fechaNacimiento ?? user.fecha_nacimiento;

  return {
    nombre: nombre || (user.nombre as string) || '',
    cedula: (user.cedula as string) || '',
    correoElectronico: correo,
    telefono: (user.telefono as string) || '',
    direccion: (user.direccion as string) || '',
    pais: (user.pais as string) || '',
    genero: (user.genero as string) || '',
    fechaNacimiento: normalizarFechaInput(fechaRaw)
  };
};

/** Lee y normaliza usuario desde localStorage. */
export const leerUsuarioSesion = (): UsuarioSesionRaw | null => {
  try {
    const raw = localStorage.getItem('usuarioSesion');
    if (!raw) return null;
    return JSON.parse(raw) as UsuarioSesionRaw;
  } catch {
    return null;
  }
};
