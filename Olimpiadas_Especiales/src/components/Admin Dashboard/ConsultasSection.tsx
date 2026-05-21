import React, { useState, useEffect } from 'react';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import Swal from 'sweetalert2';
import type { Consulta } from '../../types';

interface ConsultasSectionProps {
    searchQuery?: string;
}

export default function ConsultasSection({ searchQuery = '' }: ConsultasSectionProps): React.JSX.Element {
    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [localSearch, setLocalSearch] = useState<string>('');

    const fetchConsultas = () => {
        ServicesAdmin.getConsultas()
            .then((data: Consulta[]) => {
                setConsultas(Array.isArray(data) ? data.sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) : []);
                setLoading(false);
            })
            .catch((err: any) => {
                console.error("Error al cargar consultas:", err);
                setError("No se pudieron cargar las consultas. Por favor, intente de nuevo más tarde.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchConsultas();
    }, []);

    const filteredConsultas = consultas.filter(c => {
        const q = (localSearch || searchQuery).toLowerCase();
        return (
            (c.nombre || '').toLowerCase().includes(q) ||
            (c.correo || '').toLowerCase().includes(q) ||
            (c.asunto || '').toLowerCase().includes(q) ||
            (c.mensaje || '').toLowerCase().includes(q)
        );
    });

    const handleDelete = (id: string | number) => {
        // ... existing logic
        Swal.fire({
            title: '¿Eliminar Mensaje?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e62334',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                ServicesAdmin.deleteConsulta(id)
                    .then(() => {
                        Swal.fire('¡Eliminado!', 'El mensaje ha sido borrado.', 'success');
                        fetchConsultas();
                    })
                    .catch(() => Swal.fire('Error', 'No se pudo eliminar el mensaje.', 'error'));
            }
        });
    };

    const handleView = (consulta: Consulta) => {
        Swal.fire({
            title: `Asunto: ${consulta.asunto || 'Sin Asunto'}`,
            html: `
                <div style="text-align: left; background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="margin: 0 0 5px;"><strong>De:</strong> ${consulta.nombre}</p>
                    <p style="margin: 0 0 5px;"><strong>Email:</strong> <a href="mailto:${consulta.correo}" style="color: #3b82f6; text-decoration: none;">${consulta.correo}</a></p>
                    <p style="margin: 0; font-size: 12px; color: #64748b;"><strong>Fecha:</strong> ${new Date(consulta.fecha).toLocaleString()}</p>
                </div>
                <div style="text-align: left; background: #ffffff; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; white-space: pre-wrap; font-size: 14px; color: #334155;">
                    ${consulta.mensaje}
                </div>
            `,
            showDenyButton: true,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#64748b',
            denyButtonText: '🪄 Borrador IA',
            denyButtonColor: '#e62334',
            width: '600px'
        }).then((result) => {
            if (result.isDenied) {
                Swal.fire({
                    title: 'Redactando borrador...',
                    html: 'Nuestro Asistente de IA está redactando la mejor respuesta institucional.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                ServicesAdmin.sugerirRespuesta(consulta.id)
                    .then((res) => {
                        const correosMasivos = Array.from(new Set(consultas.map(c => c.correo).filter((c): c is string => !!c)));
                        const consultaIds = consultas.map(c => c.id);

                        Swal.fire({
                            title: '🪄 Sugerencia de Respuesta IA',
                            html: `
                                <div style="text-align: left; margin-bottom: 15px; font-size: 13px; color: #64748b;">
                                    Aquí tienes un borrador profesional redactado para <strong>${consulta.nombre}</strong>. Puedes editarlo antes de enviar:
                                </div>
                                <textarea id="copiloto-respuesta-texto" style="width: 100%; height: 180px; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-family: inherit; resize: vertical; background: #ffffff; color: #334155;">${res.borrador}</textarea>
                                <div style="text-align: left; margin-top: 15px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                                    <span style="font-weight: 600; font-size: 13px; display: block; margin-bottom: 8px; color: #334155;">¿A quién deseas enviar esta respuesta?</span>
                                    <label style="display: block; font-size: 13px; margin-bottom: 8px; cursor: pointer; color: #475569;">
                                        <input type="radio" name="destinatarios-tipo" value="individual" defaultChecked style="margin-right: 8px; accent-color: #3b82f6;" />
                                        Solo a <strong>${consulta.nombre}</strong> (${consulta.correo})
                                    </label>
                                    <label style="display: block; font-size: 13px; cursor: pointer; color: #475569;">
                                        <input type="radio" name="destinatarios-tipo" value="masivo" style="margin-right: 8px; accent-color: #3b82f6;" />
                                        <strong>Envío Masivo</strong> a todos los remitentes (${correosMasivos.length} correos)
                                    </label>
                                </div>
                            `,
                            showDenyButton: true,
                            confirmButtonText: '📧 Enviar por Correo',
                            confirmButtonColor: '#10b981',
                            denyButtonText: '📋 Copiar Texto',
                            denyButtonColor: '#3b82f6',
                            showCancelButton: true,
                            cancelButtonText: 'Volver',
                            cancelButtonColor: '#64748b',
                            width: '600px',
                            preConfirm: () => {
                                const textarea = document.getElementById('copiloto-respuesta-texto') as HTMLTextAreaElement;
                                const textVal = textarea ? textarea.value : res.borrador;
                                if (!textVal.trim()) {
                                    Swal.showValidationMessage('El mensaje no puede estar vacío.');
                                    return false;
                                }
                                const radioInput = document.querySelector('input[name="destinatarios-tipo"]:checked') as HTMLInputElement;
                                const sendType = radioInput ? radioInput.value : 'individual';
                                return { textVal, sendType };
                            }
                        }).then((subRes) => {
                            if (subRes.isConfirmed && subRes.value) {
                                const { textVal: mensajeFinal, sendType } = subRes.value;

                                if (sendType === 'masivo') {
                                    Swal.fire({
                                        title: 'Enviando correos...',
                                        html: `Enviando mensaje a ${correosMasivos.length} destinatarios.`,
                                        allowOutsideClick: false,
                                        didOpen: () => {
                                            Swal.showLoading();
                                        }
                                    });

                                    const asunto = `Respuesta Oficial - Olimpiadas Especiales`;
                                    ServicesAdmin.responderMasivo(correosMasivos, asunto, mensajeFinal, consultaIds)
                                        .then((envio) => {
                                            Swal.fire({
                                                title: '¡Enviado con Éxito!',
                                                text: envio.message || 'Los correos han sido enviados.',
                                                icon: 'success',
                                                confirmButtonColor: '#10b981'
                                            });
                                            fetchConsultas();
                                        })
                                        .catch((err: any) => {
                                            console.error(err);
                                            const errorMsg = err.message || err.error || 'Error interno del servidor';
                                            Swal.fire('Error', `No se pudo enviar masivamente: ${errorMsg}`, 'error');
                                        });
                                } else {
                                    Swal.fire({
                                        title: 'Enviando correo...',
                                        html: 'El sistema está enviando tu mensaje.',
                                        allowOutsideClick: false,
                                        didOpen: () => {
                                            Swal.showLoading();
                                        }
                                    });

                                    // Usar únicamente el backend (SMTP / OAuth2 / Simulador)
                                    ServicesAdmin.responderConsulta(consulta.id, mensajeFinal)
                                        .then((envio) => {
                                            Swal.fire({
                                                title: '¡Enviado con Éxito!',
                                                text: envio.message || 'La respuesta ha sido enviada.',
                                                icon: 'success',
                                                confirmButtonColor: '#10b981'
                                            });
                                            fetchConsultas();
                                        })
                                        .catch((err: any) => {
                                            console.error(err);
                                            const errorMsg = err.message || err.error || 'Error interno del servidor';
                                            Swal.fire('Error', `No se pudo enviar el correo: ${errorMsg}`, 'error');
                                        });
                                }
                            } else if (subRes.isDenied) {
                                const textarea = document.getElementById('copiloto-respuesta-texto') as HTMLTextAreaElement;
                                if (textarea) {
                                    textarea.select();
                                    document.execCommand('copy');
                                    Swal.fire({
                                        title: '¡Copiado!',
                                        text: 'El borrador ha sido copiado al portapapeles.',
                                        icon: 'success',
                                        timer: 1500,
                                        showConfirmButton: false
                                    });
                                }
                            } else if (subRes.isDismissed && subRes.dismiss === Swal.DismissReason.cancel) {
                                handleView(consulta);
                            }
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        Swal.fire('Error', 'No se pudo generar la sugerencia con IA.', 'error');
                    });
            }
        });
    };



    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '24px', color: '#3b82f6', marginBottom: '10px' }}></i>
                <p>Cargando consultas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
                <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '40px', marginBottom: '15px' }}></i>
                <h4>Error</h4>
                <p>{error}</p>
                <button 
                    onClick={fetchConsultas}
                    style={{ marginTop: '15px', padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h3 style={{ color: 'var(--admin-text-main)', margin: 0 }}><i className="fa-solid fa-envelope" style={{ color: '#3b82f6', marginRight: '10px' }}></i> Bandeja de Consultas</h3>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', margin: 0 }}>Gestión de los mensajes recibidos desde el Formulario de Contacto público.</p>
                </div>
                <div style={{ position: 'relative', display: 'flex', gap: '10px' }}>
                    <div style={{ position: 'relative' }}>
                        <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px' }}></i>
                        <input 
                            type="text" 
                            placeholder="Buscar mensajes..." 
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            style={{ padding: '8px 12px 8px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', width: '250px', background: 'var(--admin-white)', color: 'var(--admin-text-main)' }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ background: 'var(--admin-white)', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                {filteredConsultas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                        <i className="fa-solid fa-inbox" style={{ fontSize: '40px', marginBottom: '15px' }}></i>
                        <h4>{searchQuery ? 'No hay resultados' : 'Bandeja vacía'}</h4>
                        <p>{searchQuery ? `No se encontraron mensajes para "${searchQuery}".` : 'No tienes mensajes o consultas pendientes.'}</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'var(--admin-bg)' }}>
                                <tr style={{ textAlign: 'left', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                                    <th style={{ padding: '12px', borderRadius: '8px 0 0 8px' }}>Remitente</th>
                                    <th style={{ padding: '12px' }}>Email</th>
                                    <th style={{ padding: '12px' }}>Asunto</th>
                                    <th style={{ padding: '12px' }}>Fecha</th>
                                    <th style={{ padding: '12px', borderRadius: '0 8px 8px 0', textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredConsultas.map(consulta => (
                                    <tr key={consulta.id} style={{ borderBottom: '1px solid var(--admin-border)', fontSize: '13px' }}>
                                        <td style={{ padding: '12px', fontWeight: '500' }}>{consulta.nombre}</td>
                                        <td style={{ padding: '12px', color: '#64748b' }}>{consulta.correo}</td>
                                        <td style={{ padding: '12px', color: '#1d1d1f' }}>{consulta.asunto}</td>
                                        <td style={{ padding: '12px', color: '#64748b' }}>{new Date(consulta.fecha).toLocaleDateString()}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <button 
                                                onClick={() => handleView(consulta)} 
                                                style={{ background: '#eff6ff', border: 'none', color: '#2563eb', padding: '6px 10px', borderRadius: '6px', marginRight: '5px', cursor: 'pointer' }}
                                                title="Ver o Responder"
                                            >
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(consulta.id)} 
                                                style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                                                title="Eliminar"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
