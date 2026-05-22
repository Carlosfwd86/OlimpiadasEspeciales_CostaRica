import React, { useState, useEffect } from 'react';
import '../../style/ModalNuevoRegistro.css';
import type { Registro } from '../../types';
import apiClient from '../../api/apiClient';

interface FieldDef {
  key: string;
  label: string;
}

interface ModalDetalleRegistroProps {
  isOpen: boolean;
  onClose: () => void;
  data: Registro | null;
}

// ─── Componente de Semáforo de Riesgo IA ─────────────────────────────────────
interface AnalisisSalud {
  nivelRiesgo: 'Rojo' | 'Amarillo' | 'Verde';
  alertas: string[];
  recomendaciones: string[];
}

const CONFIG_SEMAFORO = {
  Rojo:    { bg: '#fff1f2', border: '#fecaca', badge: '#E00000', badgeTxt: '#fff', icono: '🔴', label: 'Riesgo Alto' },
  Amarillo:{ bg: '#fffbeb', border: '#fde68a', badge: '#d97706', badgeTxt: '#fff', icono: '🟡', label: 'Supervisión Requerida' },
  Verde:   { bg: '#f0fdf4', border: '#bbf7d0', badge: '#16a34a', badgeTxt: '#fff', icono: '🟢', label: 'Sin Restricciones' },
};

const SemaforoRiesgo: React.FC<{ atletaId: string | number }> = ({ atletaId }) => {
  const [analisis, setAnalisis] = useState<AnalisisSalud | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!atletaId) return;
    setCargando(true);
    setError(null);
    apiClient
      .get<{ success: boolean; analisis?: AnalisisSalud }>(`/ia/salud/analizar/${atletaId}`)
      .then(res => {
        if (res.data.success && res.data.analisis) setAnalisis(res.data.analisis);
        else setError('No se pudo obtener el análisis.');
      })
      .catch(() => setError('Error de conexión con el servicio de IA.'))
      .finally(() => setCargando(false));
  }, [atletaId]);

  if (cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '16px' }}>
        <div style={{ width: '20px', height: '20px', border: '3px solid #e2e8f0', borderTopColor: '#E00000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Analizando perfil de salud con IA...</span>
      </div>
    );
  }

  if (error || !analisis) {
    return (
      <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '16px', fontSize: '13px', color: '#94a3b8' }}>
        ⚠️ Análisis de IA no disponible para este perfil.
      </div>
    );
  }

  const config = CONFIG_SEMAFORO[analisis.nivelRiesgo] ?? CONFIG_SEMAFORO.Verde;

  return (
    <div style={{ background: config.bg, border: `1.5px solid ${config.border}`, borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
      {/* Header del semáforo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>{config.icono}</span>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.08em' }}>Análisis Preventivo IA</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{config.label}</div>
          </div>
        </div>
        <span style={{ background: config.badge, color: config.badgeTxt, fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
          {analisis.nivelRiesgo}
        </span>
      </div>

      {/* Alertas */}
      {analisis.alertas.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>⚠️ Alertas</div>
          {analisis.alertas.map((a, i) => (
            <div key={i} style={{ fontSize: '13px', color: '#334155', padding: '6px 12px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', marginBottom: '5px', fontWeight: 500 }}>
              {a}
            </div>
          ))}
        </div>
      )}

      {/* Recomendaciones */}
      {analisis.recomendaciones.length > 0 && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>📋 Recomendaciones para el Entrenador</div>
          {analisis.recomendaciones.map((r, i) => (
            <div key={i} style={{ fontSize: '13px', color: '#334155', padding: '6px 12px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', marginBottom: '5px', fontWeight: 500 }}>
              • {r}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '12px', fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>
        Generado por IA · gpt-4o-mini · No sustituye consejo médico
      </div>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

export default function ModalDetalleRegistro({ isOpen, onClose, data }: ModalDetalleRegistroProps): React.JSX.Element | null {
    if (!isOpen || !data) return null;

    const renderSection = (title: string, fields: FieldDef[]): React.JSX.Element | null => {
        const activeFields = fields.filter(f => {
            const val = (data as Record<string, unknown>)[f.key];
            return val !== undefined && val !== null && val !== '';
        });
        if (activeFields.length === 0) return null;

        return (
            <div style={{ marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', color: '#e62334', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>{title}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
                    {activeFields.map(f => {
                        const val = (data as Record<string, unknown>)[f.key];
                        const display = typeof val === 'boolean' ? (val ? 'Sí' : 'No') : String(val ?? '');
                        return (
                            <div key={f.key}>
                                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>{f.label}</label>
                                <div style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>{display}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const datosExtra = (data as Registro & { datos?: Record<string, unknown> }).datos;
    const atletaId: string | number | null =
        data.rol === 'atleta'
            ? (datosExtra?.atleta_id ?? datosExtra?.atletaId ?? null) as string | number | null
            : null;
    const esAtletaPendiente = data.rol === 'atleta' && !atletaId;

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
                    {esAtletaPendiente && (
                        <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '16px', fontSize: '13px', color: '#64748b' }}>
                            El análisis de salud con IA estará disponible después de aprobar e registrar al atleta en el sistema.
                        </div>
                    )}
                    {atletaId != null && <SemaforoRiesgo atletaId={atletaId} />}

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
