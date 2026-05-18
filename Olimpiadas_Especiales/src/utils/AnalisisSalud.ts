/**
 * [FUNCIÓN]: Analista de Salud y Prevención
 * Esta función procesa datos médicos de un atleta para generar un resumen
 * ejecutivo de alertas preventivas para entrenadores.
 */
export const obtenerResumenAlertasPreventivas = (
    atleta_condiciones: any[], 
    atleta_medicamentos: any[]
) => {
    // [BLOQUE]: Inicialización del resumen categorizado
    const resumen = {
        riesgosInmediatos: [] as string[],
        protocoloMedicacion: [] as string[],
        recomendacionesActividad: [] as string[]
    };

    // [LÓGICA]: Procesamiento de Condiciones y Alergias
    atleta_condiciones.forEach(condicion => {
        const nombre = (condicion.tipo_alergia || condicion.nombre || condicion.diagnostico || '').toLowerCase();
        const detalle = condicion.especificacion || condicion.descripcion || '';

        // Identificación de riesgos críticos (Alergias severas, asma, epilepsia, etc.)
        if (nombre.includes('severa') || nombre.includes('anafiláctico') || nombre.includes('epilepsia') || nombre.includes('corazón')) {
            resumen.riesgosInmediatos.push(`⚠️ CRÍTICO: ${condicion.tipo_alergia || condicion.nombre} - ${detalle}`);
        } else {
            resumen.recomendacionesActividad.push(`📋 NOTA: ${condicion.tipo_alergia || condicion.nombre} (${detalle})`);
        }
    });

    // [LÓGICA]: Procesamiento de Medicamentos
    atleta_medicamentos.forEach(med => {
        const infoMed = `💊 ${med.nombre} (${med.dosis}) - Horario: ${med.horario || 'No especificado'}`;
        resumen.protocoloMedicacion.push(infoMed);

        // Si el medicamento sugiere efectos secundarios relevantes para el ejercicio
        if (med.nombre.toLowerCase().includes('insulina') || med.nombre.toLowerCase().includes('inhalador')) {
            resumen.riesgosInmediatos.push(`⚠️ VIGILANCIA: El atleta utiliza ${med.nombre}. Tener a mano en caso de emergencia.`);
        }
    });

    // [LÓGICA]: Generación de Recomendaciones Basadas en Salud
    if (resumen.riesgosInmediatos.length > 0) {
        resumen.recomendacionesActividad.push('📋 RECOMENDACIÓN: Mantener intensidad moderada y supervisión constante.');
    } else {
        resumen.recomendacionesActividad.push('📋 RECOMENDACIÓN: Sin restricciones críticas detectadas para actividad física estándar.');
    }

    return resumen;
};

/**
 * [EVENTO]: Ejemplo de manejo de clic para obtener el resumen
 */
export const manejarClickAnalisis = (condiciones: any[], medicamentos: any[]) => {
    // [ACCIÓN]: Obtener el resumen lógico
    const alertas = obtenerResumenAlertasPreventivas(condiciones, medicamentos);

    // [SALIDA]: Formatear para consola o estado de UI
    console.log("--- RESUMEN DE ALERTAS PREVENTIVAS ---");
    console.log("Riesgos Inmediatos:", alertas.riesgosInmediatos);
    console.log("Protocolos:", alertas.protocoloMedicacion);
    console.log("Recomendaciones:", alertas.recomendacionesActividad);
    
    return alertas;
};
