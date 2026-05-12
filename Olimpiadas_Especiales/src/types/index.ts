// ============================================================
// TIPOS BASE DEL DOMINIO — Olimpiadas Especiales Costa Rica
// ============================================================

// ------ Entidades principales ------

export interface Usuario {
  id: string;
  nombre?: string;
  apellidos?: string;
  correoElectronico?: string;
  contrasena?: string;
  cedula?: string;
  rol?: 'usuario' | 'admin' | 'atleta' | 'entrenador' | 'tutor' | 'voluntario' | string;
  pais?: string;
  direccion?: string;
  telefono?: string;
  fechaRegistro?: string;
  fechaNacimiento?: string;
  genero?: string;
  [key: string]: unknown;
}

export interface Atleta {
  id: number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido?: string;
  fecha_nacimiento: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  telefono?: string;
  correo_electronico?: string;
  fecha_registro?: string;
  // [verde] Relaciones con tablas de salud y documentos
  documentos?: AtletaDocumento[];
  medicamentos?: AtletaMedicamento[];
  condiciones?: AtletaCondicion[];
  dispositivos?: AtletaDispositivo[];
  alergias?: AtletaAlergia[];
}

export interface AtletaDocumento {
  id: number;
  atleta_id: number;
  nombre_documento: string;
  tipo_documento: string;
  ruta_archivo: string;
  fecha_subida?: string;
}

export interface AtletaMedicamento {
  id: number;
  atleta_id: number;
  nombre: string;
  dosis: string;
  frecuencia: string;
}

export interface AtletaCondicion {
  id: number;
  atleta_id: number;
  condicion: string;
}

export interface AtletaDispositivo {
  id: number;
  atleta_id: number;
  tipo: string;
  nombre: string;
}

export interface AtletaAlergia {
  id: number;
  atleta_id: number;
  tipo_alergia: string;
  especificacion?: string;
}


export interface Entrenador {
  id: string;
  nombre?: string;
  correoElectronico?: string;
  telefono?: string;
  disciplina?: string;
  region?: string;
  fechaRegistro?: string;
  status?: string;
  usuarioId?: string | null;
  rol?: string;
  apellidos?: string;
  correo?: string;
  especialidad?: string;
  [key: string]: unknown;
}

export interface Tutor {
  id: string;
  nombre?: string;
  correoElectronico?: string;
  telefono?: string;
  fechaRegistro?: string;
  status?: string;
  usuarioId?: string | null;
  rol?: string;
  [key: string]: unknown;
}

export interface Voluntario {
  id: string;
  nombre?: string;
  correoElectronico?: string;
  telefono?: string;
  fechaRegistro?: string;
  status?: string;
  usuarioId?: string | null;
  rol?: string;
  [key: string]: unknown;
}

// ------ Admin / Panel ------

export interface Registro {
  id: string;
  rol?: string;
  name?: string;
  email?: string;
  phone?: string;
  sport?: string;
  region?: string;
  correoElectronico?: string;
  usuarioId?: string | null;
  pais?: string;
  direccion?: string;
  telefono?: string;
  status?: string;
  statusColor?: string;
  bgColor?: string;
  time?: string;
  initials?: string;
  fechaAprobacion?: string;
  [key: string]: unknown;
}

export interface Activity {
  id?: string | number;
  title: string;
  details: string;
  icon: string;
  iconColor: string;
  time: string;
}

export interface Competicion {
  id?: string;
  nombre: string;
  deporte: string;
  fecha: string;
  fechaFin?: string;
  ubicacion?: string;
  descripcion?: string;
  imagen?: string;
  enlace?: string;
  status?: string;
  [key: string]: unknown;
}

export interface StatItem {
  valor: number;
  porcentaje?: string;
  tendencia?: 'up' | 'down' | 'none';
  textoExtra?: string;
}

export interface Stats {
  totalRegistros: StatItem;
  atletasActivos: StatItem;
  revisionesPendientes: StatItem;
  voluntarios: StatItem;
}

export interface AdminProfile {
  id: string | number;
  nombre?: string;
  email?: string;
  [key: string]: unknown;
}

export interface SystemSettings {
  tema?: string;
  notificaciones?: boolean;
  registro_automatico?: boolean;
  idioma?: string;
  [key: string]: unknown;
}

// ------ Gráficos ------

export interface DeporteStat {
  deporte: string;
  porcentaje: number;
  valor: number;
  colorClase: string;
}

export interface RegionStat {
  region: string;
  valor: number;
  colorClase: string;
}

export interface Graficos {
  atletasPorDeporte: DeporteStat[];
  distribucionRegional: RegionStat[];
  totalGeneral: number;
  [key: string]: unknown;
}

// ------ Province paths (mapa SVG) ------
export interface ProvincePath {
  name: string;
  path: string;
}

// ------ Config / Catálogos ------
export interface ConfigItem {
  id: string | number;
  nombre: string;
  [key: string]: unknown;
}

export interface ConfigData {
  disciplinas: ConfigItem[];
  programas: ConfigItem[];
  niveles_habilidad: ConfigItem[];
  roles?: ConfigItem[];
  areas_voluntariado?: ConfigItem[];
  tipos_recursos?: ConfigItem[];
  categorias_eventos?: ConfigItem[];
}

// ------ Tipos de rol ------
export type RolType = 'atleta' | 'entrenador' | 'tutor' | 'voluntario';
