import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import type { Competicion } from '../../types';
import { ServicesAdmin } from '../../services/ServicesAdmin';

interface CompetitionCardProps {
  onEdit?: (comp: Competicion) => void;
  onDelete?: (id: string | number) => void;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ onEdit, onRefresh }) => {
    const [competiciones, setCompeticiones] = useState<Competicion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompeticiones = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiClient.get<Competicion[]>('/competiciones');
                setCompeticiones(response.data);
            } catch (err: any) {
                setError('No se pudieron cargar las competiciones. Por favor, intenta nuevamente más tarde.');
                console.error("Error fetching competiciones:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompeticiones();
    }, []);
    const getSportIcon = (sport: string): string => {
        switch(sport) {
            case 'Fútbol': return 'fa-futbol';
            case 'Baloncesto': return 'fa-basketball';
            case 'Atletismo': return 'fa-person-running';
            case 'Natación': return 'fa-person-swimming';
            case 'Tenis': return 'fa-table-tennis-paddle-ball';
            default: return 'fa-trophy';
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de eliminar este evento o competición?")) {
            try {
                await ServicesAdmin.deleteCompeticion(id);
                setCompeticiones(prev => prev.filter(c => c.id !== id));
                if (onRefresh) onRefresh();
            } catch (err: any) {
                alert("Error al eliminar competición: " + err.message);
            }
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', height: '180px', animation: 'pulse 1.5s infinite' }} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>
                {error}
            </div>
        );
    }

    if (competiciones.length === 0) {
        return (
            <div style={{ padding: '60px', background: 'white', borderRadius: '15px', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
                <div style={{ fontSize: '60px', color: '#cbd5e1', marginBottom: '20px' }}>
                    <i className="fa-solid fa-calendar-plus"></i>
                </div>
                <h3 style={{ color: '#64748b' }}>No hay competiciones o eventos programados</h3>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {competiciones.map(competition => (
                <div key={competition.id} className="competition-card" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'default',
            borderLeft: '4px solid #e62334',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#fee2e2',
                    color: '#e62334',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                }}>
                    <i className={`fa-solid ${getSportIcon(competition.deporte)}`}></i>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {onEdit && (
                        <button onClick={() => onEdit(competition)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                            <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                    )}
                    <button onClick={() => competition.id && handleDelete(competition.id.toString())} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>

            <div>
                <h3 style={{ margin: '0', fontSize: '16px', color: '#1e293b' }}>{competition.nombre}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>{competition.deporte}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                    <i className="fa-solid fa-calendar-day" style={{ width: '14px' }}></i>
                    <span>{new Date(competition.fecha).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                    <i className="fa-solid fa-location-dot" style={{ width: '14px' }}></i>
                    <span>{competition.ubicacion || 'Por definir'}</span>
                </div>
            </div>

            <div className="card-actions" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="btn-details" style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}>
                    Ver Detalles
                </button>
                {onEdit && (
                    <button onClick={() => onEdit(competition)} className="btn-edit-comp" style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#3b82f6',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white',
                        cursor: 'pointer'
                    }}>
                        Editar
                    </button>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .competition-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .btn-details:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }
                .btn-edit-comp:hover {
                    background: #2563eb;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
            `}} />
        </div>
        ))}
        </div>
    );
};

export default CompetitionCard;
