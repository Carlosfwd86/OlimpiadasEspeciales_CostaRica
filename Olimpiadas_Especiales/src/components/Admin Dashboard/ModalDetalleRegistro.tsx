import React from 'react';
import '../../style/ModalNuevoRegistro.css';
import type { Registro } from '../../types';

interface FieldDef {
  key: string;
  label: string;
}

interface ModalDetalleRegistroProps {
  isOpen: boolean;
  onClose: () => void;
  data: Registro | null;
}

export default function ModalDetalleRegistro({ isOpen, onClose, data }: ModalDetalleRegistroProps): React.JSX.Element | null {
    if (!isOpen || !data) return null;

    const renderSection = (title: string, fields: FieldDef[]): React.JSX.Element | null => {
        const activeFields = fields.filter(f =>
            data[f.key] !== undefined && data[f.key] !== null && data[f.key] !== ''
        );
        if (activeFields.length === 0) return null;

        return (
            <div style={{ marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', color: '#e62334', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>{title}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
                    {activeFields.map(f => (
                        <div key={f.key}>
                            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>{f.label}</label>
                            <div style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>
                                {typeof data[f.key] === 'boolean' ? (data[f.key] ? 'Sí' : 'No') : String(data[f.key] ?? '')}
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
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{String(data.nombre ?? data.name ?? '')}</h2>
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
                    {renderSection("Información Médica", [
                        { key: 'tipoSangre', label: 'Tipo de Sangre' },
                        { key: 'tipoDiscapacidad', label: 'Discapacidad' },
                        { key: 'usaSillaRuedas', label: 'Usa Silla de Ruedas' },
                        { key: 'alergias', label: 'Alergias' },
                        { key: 'medicamentos', label: 'Medicamentos' },
                        { key: 'detallesMedicos', label: 'Observaciones Médicas' },
                    ])}
                    {renderSection("Emergencia", [
                        { key: 'emergenciaNombre', label: 'Contacto Emergencia' },
                        { key: 'emergenciaTelefono', label: 'Teléfono Emergencia' },
                        { key: 'emergenciaParentesco', label: 'Parentesco' },
                    ])}
                    {renderSection("Perfil Profesional", [
                        { key: 'disciplinaPrincipal', label: 'Disciplina' },
                        { key: 'aniosExperiencia', label: 'Años Experiencia' },
                        { key: 'certificaciones', label: 'Certificaciones' },
                        { key: 'horarioDisponible', label: 'Disponibilidad' },
                    ])}
                    {renderSection("Colaboración", [
                        { key: 'areasInteres', label: 'Áreas de Interés' },
                        { key: 'disponibilidad', label: 'Disponibilidad' },
                        { key: 'experienciaPrevia', label: 'Experiencia' },
                    ])}
                    {renderSection("Vínculo", [
                        { key: 'nombreAtleta', label: 'Atleta a Cargo' },
                        { key: 'relacionConAtleta', label: 'Relación' },
                        { key: 'ocupacion', label: 'Ocupación' },
                    ])}
                    {renderSection("Documentación", [
                        { key: 'cedula_nombre', label: 'Documento ID' },
                        { key: 'consentimiento_nombre', label: 'Consentimiento' },
                        { key: 'exoneracion_nombre', label: 'Exoneración' },
                        { key: 'titulo_nombre', label: 'Certificados' },
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
