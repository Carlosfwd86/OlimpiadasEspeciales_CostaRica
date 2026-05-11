import React from 'react';
import '../../style/ModalNuevoRegistro.css'; // Reusing base modal styles

export default function ModalDetalleRegistro({ isOpen, onClose, data }) {
    if (!isOpen || !data) return null;

    // Helper para renderizar secciones de datos dinámicamente
    const renderSection = (title, fields) => {
        const activeFields = fields.filter(f => {
            const val = data[f.key];
            if (val === undefined || val === null || val === '') return false;
            if (Array.isArray(val) && val.length === 0) return false;
            return true;
        });
        if (activeFields.length === 0) return null;

        return (
            <div style={{ marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', color: '#e62334', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>{title}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
                    {activeFields.map(f => (
                        <div key={f.key}>
                            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>{f.label}</label>
                            <div style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>
                                {typeof data[f.key] === 'boolean' 
                                    ? (data[f.key] ? 'Sí' : 'No') 
                                    : Array.isArray(data[f.key]) 
                                        ? data[f.key].join(', ') 
                                        : String(data[f.key])}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
            <div className="modal-content" style={{ maxWidth: '700px', width: '90%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px', padding: '32px' }}>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <span style={{ background: '#FFF5F5', color: '#E00000', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', display: 'inline-block' }}>
                            Solicitud de {data.rol || 'Atleta'}
                        </span>
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{data.nombre || data.name}</h2>
                    </div>
                    <button className="btn-close-modal" onClick={onClose} style={{ background: '#f8fafc', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="modal-body">
                    {renderSection("Datos de Identidad", [
                        { key: 'cedula', label: 'Cédula / ID' },
                        { key: 'fechaNacimiento', label: 'Fecha Nacimiento' },
                        { key: 'genero', label: 'Género' },
                        { key: 'pais', label: 'País' },
                    ])}

                    {renderSection("Contacto y Ubicación", [
                        { key: 'correoElectronico', label: 'Email' },
                        { key: 'telefono', label: 'Teléfono' },
                        { key: 'direccion', label: 'Dirección Exacta' },
                    ])}

                    {renderSection("Deporte y Programa", [
                        { key: 'disciplina', label: 'Disciplina' },
                        { key: 'disciplinaPrincipal', label: 'Disciplina Principal' },
                        { key: 'deporte', label: 'Deporte' },
                        { key: 'sport', label: 'Deporte (Interno)' },
                        { key: 'programa', label: 'Programa / Sede' },
                        { key: 'nivelHabilidad', label: 'Nivel Habilidad' },
                    ])}

                    {/* Atleta Specific - Medical */}
                    {renderSection("Historial Médico (Atleta)", [
                        { key: 'condicionesMedicas', label: 'Condiciones Médicas' },
                        { key: 'dispositivosMovilidad', label: 'Dispositivos Movilidad' },
                        { key: 'ayudasEstiloVida', label: 'Ayudas Estilo de Vida' },
                        { key: 'comunicaciones', label: 'Comunicaciones' },
                        { key: 'dispositivosMedicos', label: 'Dispositivos Médicos' },
                        { key: 'tiposAlergia', label: 'Alergias' },
                        { key: 'especificacionAlergiaOtro', label: 'Detalle Alergias' },
                        { key: 'medicamentos', label: 'Medicamentos' },
                    ])}

                    {renderSection("Condiciones Específicas / Respuestas Médicas", [
                        { key: 'anemiaDepranocitica', label: 'Anemia Depranocítica' },
                        { key: 'medicoLimitoDeportes', label: 'Médico Limitó Deportes' },
                        { key: 'discAuditiva', label: 'Disc. Auditiva' },
                        { key: 'diabetes', label: 'Diabetes' },
                        { key: 'afeccionCardiaca', label: 'Afección Cardíaca' },
                        { key: 'reqDietetico', label: 'Requisito Dietético' },
                        { key: 'especificacionDietetico', label: 'Detalle Dieta' },
                        { key: 'otrosDispositivos', label: 'Otros Dispositivos' },
                        { key: 'especificacionOtrosDispositivos', label: 'Detalle Dispositivos' },
                        { key: 'asma', label: 'Asma' },
                        { key: 'discVisual', label: 'Disc. Visual' },
                        { key: 'trastornoHemorragico', label: 'Trast. Hemorrágico' },
                        { key: 'epilepsiaConvulsivo', label: 'Epilepsia/Convulsivo' },
                        { key: 'conmocionCerebral', label: 'Conmoción Cerebral' },
                        { key: 'cantidadConmociones', label: 'Cant. Conmociones' },
                        { key: 'fechaUltimaConmocion', label: 'Última Conmoción' },
                        { key: 'alergiasGraves', label: 'Alergias Graves' },
                        { key: 'afeccionesMentales', label: 'Afecciones Mentales' },
                        { key: 'especificacionAfeccionesMentales', label: 'Detalle Mentales' },
                        { key: 'tomaMedicamentos', label: 'Toma Medicación' },
                    ])}

                    {renderSection("Emergencia", [
                        { key: 'emergenciaNombre', label: 'Contacto Emergencia' },
                        { key: 'emergenciaTelefono', label: 'Teléfono Emergencia' },
                        { key: 'emergenciaParentesco', label: 'Parentesco' },
                    ])}

                    {/* Entrenador / Voluntario Specific */}
                    {renderSection("Perfil Entrenador / Voluntario", [
                        { key: 'aniosExperiencia', label: 'Años Experiencia' },
                        { key: 'certificaciones', label: 'Certificaciones' },
                        { key: 'horarioDisponible', label: 'Disponibilidad' },
                        { key: 'areasInteres', label: 'Áreas de Interés' },
                        { key: 'otraArea', label: 'Otra Área / Deporte' },
                        { key: 'experienciaPrevia', label: 'Experiencia Previa' },
                    ])}

                    {/* Autorizaciones y Tutores */}
                    {renderSection("Información de Tutor / Familiar", [
                        { key: 'nombreAtleta', label: 'Atleta que representa' },
                        { key: 'relacionConAtleta', label: 'Relación / Parentesco' },
                        { key: 'ocupacion', label: 'Ocupación' },
                        { key: 'motivacion', label: 'Motivación' },
                        { key: 'experienciaNecesidadesEspeciales', label: 'Experiencia Nec. Especiales' },
                    ])}

                    {renderSection("Tutor / Responsable Legal (Atleta)", [
                        { key: 'tutorNombre', label: 'Nombre Tutor' },
                        { key: 'tutorApellido', label: 'Apellido Tutor' },
                        { key: 'tutorRelacion', label: 'Relación con Atleta' },
                        { key: 'tutorCorreo', label: 'Correo Tutor' },
                        { key: 'tutorTelefono', label: 'Teléfono Tutor' },
                        { key: 'tutorCedula', label: 'Cédula Tutor' },
                    ])}

                    {renderSection("Autorizaciones y Exoneración", [
                        { key: 'terminosAceptados', label: 'Términos Aceptados' },
                        { key: 'objecionTratamientoMedico', label: 'Objeción Tratamiento Médico' },
                        { key: 'objecionTransfusiones', label: 'Objeción Transfusiones' },
                        { key: 'interesInvestigacion', label: 'Interés en Investigación' },
                        { key: 'firmaAtleta', label: 'Firma/Nombre Atleta' },
                        { key: 'fechaFirmaAtleta', label: 'Fecha Firma Atleta' },
                        { key: 'firmaTutor', label: 'Firma/Nombre Tutor' },
                        { key: 'fechaFirmaTutor', label: 'Fecha Firma Tutor' },
                    ])}

                    {renderSection("Archivos Adjuntos (Nombres)", [
                        { key: 'cedula_nombre', label: 'Cédula / ID' },
                        { key: 'consentimiento_nombre', label: 'Consentimiento Clínico' },
                        { key: 'exoneracion_nombre', label: 'Exoneración' },
                        { key: 'titulo_nombre', label: 'Certificados / CV' },
                        { key: 'delincuencia_nombre', label: 'Hoja Delincuencia' },
                        { key: 'foto_nombre', label: 'Foto Perfil' },
                    ])}
                </div>

                <div className="modal-footer" style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>
                        Cerrar Vista
                    </button>
                </div>
            </div>
        </div>
    );
}
