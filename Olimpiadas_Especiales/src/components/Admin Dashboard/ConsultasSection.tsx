import React, { useState, useEffect } from 'react';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import Swal from 'sweetalert2';
import type { Consulta } from '../../types';

export default function ConsultasSection(): React.JSX.Element {
    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConsultas = () => {
        setLoading(true);
        setError(null);
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

    const handleDelete = (id: string | number) => {
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
                ServicesAdmin.deleteConsulta(String(id))
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
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#2563eb',
            width: '600px'
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
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--admin-text-main)' }}><i className="fa-solid fa-envelope" style={{ color: '#3b82f6', marginRight: '10px' }}></i> Bandeja de Consultas</h3>
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px' }}>Gestión de los mensajes recibidos desde el Formulario de Contacto público.</p>
            </div>

            <div style={{ background: 'var(--admin-white)', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                {consultas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                        <i className="fa-solid fa-inbox" style={{ fontSize: '40px', marginBottom: '15px' }}></i>
                        <h4>Bandeja vacía</h4>
                        <p>No tienes mensajes o consultas pendientes.</p>
                    </div>
                ) : (
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
                            {consultas.map(consulta => (
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
                )}
            </div>
        </div>
    );
}
