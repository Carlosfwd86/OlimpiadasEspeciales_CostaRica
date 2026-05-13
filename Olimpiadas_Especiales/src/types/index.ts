// ============================================================
// TIPOS BASE DEL DOMINIO — Olimpiadas Especiales Costa Rica
// ============================================================

// ------ Entidades principales ------

export interface Usuario {
  id: string | number;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  password_hash?: string;
  cedula?: string;
  rol_id: number;
  rol?: {
    id: number;
    nombre: string;
  };
  pais?: string;
  direccion?: string;
  telefono?: string;
  fecha_registro?: string;
  fecha_nacimiento?: string;
  genero?: string;
  avatar_url?: string;
  status: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  [key: string]: unknown;
}

export interface Atleta {
  id: string | number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido?: string;
  cedula?: string;
  fecha_nacimiento: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  telefono?: string;
  correo_electronico?: string;
  direccion?: string;
  pais?: string;
  programa_id?: number;
  status?: 'ACTIVO' | 'INACTIVO' | 'PENDIENTE';
  fecha_registro?: string;
  usuario_id?: string | number | null;
  [key: string]: unknown;
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
  id: string | number;
  usuario_id?: string | number | null;
  disciplina_id?: number;
  nombre: string;
  apellido: string;
  cedula?: string;
  fecha_nacimiento?: string;
  genero?: string;
  telefono?: string;
  correo_electronico?: string;
  anios_experiencia?: number;
  certificaciones?: string;
  horario_disponible?: string;
  afeccion_salud?: boolean;
  detalle_salud?: string;
  status: 'ACTIVO' | 'INACTIVO' | 'PENDIENTE';
  fecha_registro?: string;
  fecha_aprobacion?: string;
  [key: string]: unknown;
}

export interface Tutor {
  id: string | number;
  nombre: string;
  apellido: string;
  cedula?: string;
  telefono?: string;
  correo_electronico?: string;
  direccion?: string;
  pais?: string;
  relacion_con_atleta?: string;
  experiencia_necesidades_especiales?: boolean;
  status: 'ACTIVO' | 'INACTIVO' | 'PENDIENTE';
  fecha_registro?: string;
  usuario_id?: string | number | null;
  [key: string]: unknown;
}

export interface Voluntario {
  id: string | number;
  nombre: string;
  apellido: string;
  cedula?: string;
  fecha_nacimiento?: string;
  genero?: string;
  telefono?: string;
  correo_electronico?: string;
  otra_area?: string;
  disponibilidad?: string;
  experiencia_previa?: string;
  status: 'ACTIVO' | 'INACTIVO' | 'PENDIENTE';
  fecha_registro?: string;
  fecha_aprobacion?: string;
  usuario_id?: string | number | null;
  [key: string]: unknown;
}

export interface Consulta {
  id: string | number;
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
  fecha: string;
  leida?: boolean;
  usuario_id?: string | number | null;
}

// ------ Admin / Panel ------

export interface Registro {
  id: string;
  rol: 'atleta' | 'entrenador' | 'voluntario' | 'tutor';
  name: string; // Mantenemos name para la UI del dashboard
  email: string;
  phone?: string;
  sport?: string;
  region?: string;
  status: string;
  statusColor: string;
  bgColor: string;
  initials: string;
  time: string;
  usuario_id?: string | number | null;
  [key: string]: unknown;
}

export interface Activity {
  id: string;
  title: string;
  details: string;
  time: string;
  icon: string;
  iconColor: string;
}

export interface Competicion {
  id: string | number;
  nombre: string;
  deporte: string;
  fecha: string;
  fecha_fin?: string;
  ubicacion: string;
  descripcion: string;
  status: string;
  imagen?: string;
  enlace?: string;
}

export interface Stats {
  totalRegistros: { valor: number; porcentaje: string; tendencia: 'up' | 'down' | 'none' };
  atletasActivos: { valor: number; porcentaje: string; tendencia: 'up' | 'down' | 'none' };
  revisionesPendientes: { valor: number; textoExtra: string };
  voluntarios: { valor: number; porcentaje: string; tendencia: 'up' | 'down' | 'none' };
}

export interface AdminProfile {
  id: string | number;
  nombre: string;
  email: string;
  rol: string;
  avatar?: string;
  lastLogin?: string;
}

export interface SystemSettings {
  tema: 'light' | 'dark';
  notificaciones: boolean;
  registro_automatico: boolean;
  idioma: 'es' | 'en';
}

export interface Graficos {
  crecimiento: Array<{ mes: string; valor: number }>;
  distribucion: Array<{ label: string; valor: number }>;
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

export interface Consulta {
  id: string;
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
  leida: boolean;
  fecha: string;
  user_name?: string; // Temporales para migración
  user_email?: string;
  user_subject?: string;
  message?: string;
}
