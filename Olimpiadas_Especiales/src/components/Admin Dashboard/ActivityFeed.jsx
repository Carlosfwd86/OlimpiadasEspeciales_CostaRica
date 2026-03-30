import React, { useState, useEffect } from 'react';
import '../../style/ActivityFeed.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';

export default function ActivityFeed({ fullWidth = false }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ServicesAdmin.getActivities()
      .then(data => {
        // Mostrar los más recientes primero
        setActivities(data.reverse());
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar la actividad del sistema:", error);
        setLoading(false);
      });
  }, []);


  if (loading) return <div className={`activity-feed-container ${fullWidth ? 'feed-full' : ''}`}>Cargando actividad...</div>;

  return (
    <div className={`activity-feed-container ${fullWidth ? 'feed-full' : ''}`} style={{ maxWidth: fullWidth ? '100%' : '450px' }}>
      {!fullWidth && (
        <div className="feed-header">
          <h3>Actividad del Sistema</h3>
        </div>
      )}
      
      <div className="feed-list">
        {activities.length > 0 ? (
            activities.map(activity => (
                <div key={activity.id} className="feed-item">
                    <div className={`feed-icon-wrapper feed-${activity.iconColor}`}>
                        <i className={activity.icon}></i>
                    </div>
                    
                    <div className="feed-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <p className="feed-title" style={{ fontWeight: '700', fontSize: '14px' }}>{activity.title}</p>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{activity.time}</span>
                        </div>
                        <p className="feed-meta" style={{ fontSize: '13px', margin: 0, opacity: 0.8 }}>
                            {activity.details}
                        </p>
                    </div>
                </div>
            ))
        ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <i className="fa-solid fa-ghost" style={{ fontSize: '40px', marginBottom: '15px', display: 'block' }}></i>
                No se han registrado actividades recientemente.
            </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .feed-full .feed-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 20px;
        }
        .feed-full .feed-item {
            border: 1px solid #f1f5f9;
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .feed-full .feed-item:hover {
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        .feed-full .feed-icon-wrapper {
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        @media (max-width: 900px) {
            .feed-full .feed-list {
                grid-template-columns: 1fr;
            }
        }
      `}} />
    </div>
  );
}
