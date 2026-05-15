import React from 'react';
import type { Competicion } from '../../types';

interface CompetitionCardProps {
  competition: Competicion;
  onEdit?: (comp: Competicion) => void;
  onDelete?: (id: string | number) => void;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition, onEdit, onDelete }) => {
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

    return (
        <div className="competition-card" style={{
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
                    {onDelete && (
                        <button onClick={() => onDelete(competition.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    )}
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
            `}} />
        </div>
    );
};

export default CompetitionCard;
