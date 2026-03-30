import React from 'react';

const CompetitionCard = ({ competition, onEdit, onDelete }) => {
    const getSportIcon = (sport) => {
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
            gap: '12px',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'relative', margin: '-20px -20px 10px -20px', height: '140px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                {competition.img ? (
                    <img 
                        src={competition.img} 
                        alt={competition.nombre} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div style={{ 
                    display: competition.img ? 'none' : 'flex', 
                    width: '100%', 
                    height: '100%', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: '#e62334',
                    background: '#fee2e2'
                }}>
                    <i className={`fa-solid ${getSportIcon(competition.categoria || competition.deporte)}`}></i>
                </div>
                
                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                    {onEdit && (
                        <button onClick={() => onEdit(competition)} style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', cursor: 'pointer', color: '#64748b', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                    )}
                    {onDelete && (
                        <button onClick={() => onDelete(competition.id)} style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', cursor: 'pointer', color: '#ef4444', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    )}
                </div>
            </div>
            
            <div>
                <h3 style={{ margin: '0', fontSize: '16px', color: '#1e293b', fontWeight: '700' }}>{competition.nombre}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#e62334', fontWeight: '600' }}>{competition.categoria || competition.deporte}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                    <i className="fa-solid fa-calendar-day" style={{ width: '14px', color: '#94a3b8' }}></i>
                    <span>{new Date(competition.fecha).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                    <i className="fa-solid fa-location-dot" style={{ width: '14px', color: '#94a3b8' }}></i>
                    <span>{competition.ubicacion || 'Por definir'}</span>
                </div>
            </div>

            <div className="card-actions" style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px' }}>
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
