import React, { useState, useEffect } from 'react';
import '../../style/ModalNuevoRegistro.css';
import type { Registro } from '../../types';
import apiClient from '../../api/apiClient';
import { ServicesAdmin } from '../../services/ServicesAdmin';

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

type EstadoIA = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'NO_APLICA';

type DocPendiente = {
  id: number;
  categoria: string;
  nombre_original: string;
  mime_type: string;
  tamano_bytes: number;
  estado_ia?: EstadoIA;
  analisis_ia?: string | null;
};

const CATEGORIA_LABEL: Record<string, string> = {
  cedula: 'Cédula',
  certificado_medico: 'Certificado médico',
  foto: 'Foto',
  id_tutor: 'ID tutor',
  antecedentes: 'Antecedentes',
  titulo: 'Título / certificado',
  otro: 'Otro',
};

// ─── Panel de Análisis IA por Documento ──────────────────────────────────────
const CONFIG_IA: Record<EstadoIA, { bg: string; border: string; badge: string; badgeTxt: string; icono: string; label: string }> = {
  APROBADO:  { bg: '#f0fdf4', border: '#bbf7d0', badge: '#16a34a', badgeTxt: '#fff', icono: '✅', label: 'Aprobado por IA' },
  RECHAZADO: { bg: '#fff1f2', border: '#fecaca', badge: '#dc2626', badgeTxt: '#fff', icono: '❌', label: 'Rechazado por IA' },
  PENDIENTE: { bg: '#fffbeb', border: '#fde68a', badge: '#d97706', badgeTxt: '#fff', icono: '⏳', label: 'Análisis pendiente' },
  NO_APLICA: { bg: '#f8fafc', border: '#e2e8f0', badge: '#94a3b8', badgeTxt: '#fff', icono: '—',  label: 'No analizable' },
};

const PanelAnalisisIA: React.FC<{ doc: DocPendiente }> = ({ doc }) => {
  const estado: EstadoIA = doc.estado_ia ?? 'PENDIENTE';
  const cfg = CONFIG_IA[estado];
  return (
    <div style={{ marginTop: '8px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '10px', padding: '10px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: doc.analisis_ia ? '6px' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>{cfg.icono}</span>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em' }}>Análisis IA</span>
        </div>
        <span style={{ background: cfg.badge, color: cfg.badgeTxt, fontSize: '10px', fontWeight: 800, padding: '2px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {cfg.label}
        </span>
      </div>
      {doc.analisis_ia && (
        <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.5', fontStyle: 'italic' }}>
          "{doc.analisis_ia}"
        </p>
      )}
      {estado === 'PENDIENTE' && !doc.analisis_ia && (
        <p style={{ margin: 0, fontSize: '12px', color: '#92400e' }}>
          El análisis automático aún está procesando o requiere revisión manual.
        </p>
      )}
      <div style={{ marginTop: '5px', fontSize: '10px', color: '#94a3b8', textAlign: 'right' }}>gpt-4o · No sustituye revisión humana</div>
    </div>
  );
};

const ResumenGeneralIA: React.FC<{ documentos: DocPendiente[] }> = ({ documentos }) => {
  if (documentos.length === 0) return null;
  const docsValidos = documentos.filter(d => d.estado_ia && d.estado_ia !== 'NO_APLICA');
  if (docsValidos.length === 0) return null;

  const aprobados = docsValidos.filter(d => d.estado_ia === 'APROBADO').length;
  const rechazados = docsValidos.filter(d => d.estado_ia === 'RECHAZADO').length;
  const pendientes = docsValidos.filter(d => d.estado_ia === 'PENDIENTE').length;
  
  let estadoGeneral = 'PENDIENTE';
  let color = '#d97706';
  let bg = '#fffbeb';
  let border = '#fde68a';
  
  if (rechazados > 0) {
    estadoGeneral = 'ATENCIÓN REQUERIDA';
    color = '#dc2626';
    bg = '#fff1f2';
    border = '#fecaca';
  } else if (pendientes === 0 && aprobados > 0) {
    estadoGeneral = 'APROBADO';
    color = '#16a34a';
    bg = '#f0fdf4';
    border = '#bbf7d0';
  }

  const advertencias = docsValidos
    .filter(d => d.estado_ia === 'RECHAZADO' || d.estado_ia === 'PENDIENTE')
    .map(d => `${CATEGORIA_LABEL[d.categoria] || d.categoria}: ${d.analisis_ia || 'Requiere revisión manual'}`);

  return (
    <div style={{ marginBottom: '16px', background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
         <span style={{ fontSize: '18px' }}>🧠</span>
         <h4 style={{ margin: 0, fontSize: '14px', color, fontWeight: 800, textTransform: 'uppercase' }}>Mini Resumen IA de Documentos</h4>
      </div>
      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
        Se procesaron {docsValidos.length} documentos analizables: {aprobados} aprobados, {rechazados} rechazados/observados, {pendientes} pendientes.
      </p>
      {advertencias.length > 0 && (
         <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>
           {advertencias.map((adv, i) => <li key={i} style={{ marginBottom: '4px' }}>{adv}</li>)}
         </ul>
      )}
      {advertencias.length === 0 && aprobados > 0 && (
         <p style={{ margin: 0, fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Todos los documentos revisados cumplen con los criterios automáticamente.</p>
      )}
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

export default function ModalDetalleRegistro({ isOpen, onClose, data }: ModalDetalleRegistroProps): React.JSX.Element | null {
    const [documentos, setDocumentos] = useState<DocPendiente[]>([]);
    const [cargandoDocs, setCargandoDocs] = useState(false);

    useEffect(() => {
        if (!isOpen || !data?.id) {
            setDocumentos([]);
            return;
        }
        setCargandoDocs(true);
        ServicesAdmin.getDocumentosRegistro(data.id)
            .then(setDocumentos)
            .catch(() => setDocumentos([]))
            .finally(() => setCargandoDocs(false));
    }, [isOpen, data?.id]);

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

                    <div style={{ marginTop: '24px', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Archivos adjuntos</h4>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Cifrados · Analizados por IA</span>
                        </div>
                        {cargandoDocs && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '13px' }}>
                                <div style={{ width: '16px', height: '16px', border: '2px solid #e2e8f0', borderTopColor: '#E00000', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                                Cargando documentos...
                            </div>
                        )}
                        {!cargandoDocs && documentos.length === 0 && (
                            <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No hay archivos adjuntos en este registro.</p>
                        )}
                        {!cargandoDocs && documentos.length > 0 && <ResumenGeneralIA documentos={documentos} />}
                        {!cargandoDocs && documentos.map((doc, idx) => (
                            <div
                                key={doc.id}
                                style={{
                                    background: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    padding: '14px 16px',
                                    marginBottom: idx < documentos.length - 1 ? '12px' : 0,
                                }}
                            >
                                {/* Fila superior: nombre + botón descargar */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', marginBottom: '2px' }}>
                                            {CATEGORIA_LABEL[doc.categoria] || doc.categoria}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {doc.nombre_original} · {(doc.tamano_bytes / 1024).toFixed(1)} KB
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => ServicesAdmin.descargarDocumentoRegistro(data.id, doc.id, doc.nombre_original)}
                                        style={{ flexShrink: 0, padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <i className="fa-solid fa-download" style={{ fontSize: '10px' }}></i>
                                        Descargar
                                    </button>
                                </div>
                                {/* Panel de análisis IA */}
                                <PanelAnalisisIA doc={doc} />
                            </div>
                        ))}
                    </div>
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
