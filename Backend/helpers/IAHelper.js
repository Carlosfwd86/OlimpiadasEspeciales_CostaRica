/**
 * Helper para limpieza y validación de entradas de texto para la IA
 */
const IAHelper = {
    /**
     * Limpia el prompt del usuario eliminando caracteres especiales innecesarios
     * y validando que no exceda los límites razonables.
     */
    limpiarYValidarPrompt: (prompt) => {
        if (!prompt || typeof prompt !== 'string') {
            throw new Error('El prompt es inválido o está vacío.');
        }

        // Eliminar espacios en blanco excesivos y caracteres de control
        let limpio = prompt.trim().replace(/[\x00-\x1F\x7F-\x9F]/g, "");

        // Validar longitud (ejemplo: máximo 2000 caracteres)
        if (limpio.length > 2000) {
            limpio = limpio.substring(0, 2000);
        }

        return limpio;
    },

    /**
     * Valida que los datos del atleta existan antes de procesar alertas de salud
     */
    validarDatosSalud: (atleta, condiciones, medicamentos, alergias = []) => {
        if (!atleta) throw new Error('Información del atleta no encontrada.');
        
        const nombreCompleto = [atleta.nombre, atleta.primer_apellido, atleta.segundo_apellido]
            .filter(Boolean)
            .join(' ')
            .trim();

        return {
            nombre: nombreCompleto || 'Atleta',
            condiciones: condiciones.map(c => c.condicion).join(', ') || 'Ninguna registrada',
            medicamentos: medicamentos
                .map(m => {
                    const nombreMed = m.nombre || m.medicamento || 'Medicamento';
                    return `${nombreMed} (${m.dosis || 'dosis no especificada'}, ${m.frecuencia || 'frecuencia no especificada'})`;
                })
                .join(', ') || 'Ninguno registrado',
            alergias: alergias
                .map(a => {
                    const base = a.tipo_alergia || a.alergia || 'Alergia';
                    return a.especificacion ? `${base}: ${a.especificacion}` : base;
                })
                .join(', ') || 'Ninguna registrada'
        };
    }
};

module.exports = IAHelper;
