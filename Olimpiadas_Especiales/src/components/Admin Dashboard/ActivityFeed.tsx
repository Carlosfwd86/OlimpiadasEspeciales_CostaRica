import React, { useState, useEffect } from 'react';
import '../../style/ActivityFeed.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import type { Activity } from '../../types';

export default function ActivityFeed(): React.JSX.Element {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    ServicesAdmin.getActivities()
      .then(data => {
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
        {activities.map((activity, idx) => (
          <div key={activity.id ?? idx} className="feed-item">
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
