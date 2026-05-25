/** Calcula edad en años a partir de fecha ISO (YYYY-MM-DD). */
export function calcularEdad(fechaNacimiento: string): number | null {
  if (!fechaNacimiento) return null;
  const nacimiento = new Date(`${fechaNacimiento}T12:00:00`);
  if (Number.isNaN(nacimiento.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

export function fechaNacimientoEsFutura(fechaNacimiento: string): boolean {
  if (!fechaNacimiento) return false;
  const nacimiento = new Date(`${fechaNacimiento}T12:00:00`);
  if (Number.isNaN(nacimiento.getTime())) return false;
  const hoy = new Date();
  hoy.setHours(23, 59, 59, 999);
  return nacimiento > hoy;
}

export function esMenorDeEdad(fechaNacimiento: string, edadMinima = 18): boolean {
  const edad = calcularEdad(fechaNacimiento);
  if (edad === null) return false;
  return edad < edadMinima;
}

export function mensajeValidacionFechaAdulto(
  fechaNacimiento: string,
  rol: 'entrenador' | 'voluntario' | 'tutor' = 'entrenador'
): string | null {
  if (!fechaNacimiento) return null;
  if (fechaNacimientoEsFutura(fechaNacimiento)) {
    return 'La fecha de nacimiento no puede ser futura.';
  }
  if (esMenorDeEdad(fechaNacimiento)) {
    return `Debe ser mayor de 18 años para registrarse como ${rol}.`;
  }
  return null;
}
