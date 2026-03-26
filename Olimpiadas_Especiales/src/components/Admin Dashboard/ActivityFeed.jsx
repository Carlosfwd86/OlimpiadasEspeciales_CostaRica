import React, { useState, useEffect } from 'react';
import '../../style/ActivityFeed.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';

export default function ActivityFeed() {
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


  if (loading) return <div className="activity-feed-container">Cargando actividad...</div>;

  return (
    <div className="activity-feed-container">
      <div className="feed-header">
        <h3>Actividad del Sistema</h3>
      </div>
      
      <div className="feed-list">
        {activities.map(activity => (
          <div key={activity.id} className="feed-item">
            <div className={`feed-icon-wrapper feed-${activity.iconColor}`}>
              <i className={activity.icon}></i>
            </div>
            
            <div className="feed-content">
              <p className="feed-title">{activity.title}</p>
              <p className="feed-meta">
                {activity.time} &bull; {activity.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
