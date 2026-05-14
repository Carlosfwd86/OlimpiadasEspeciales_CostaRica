import React, { useState, useEffect } from 'react';
import '../../style/ActivityFeed.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import type { Activity } from '../../types';

interface ActivityFeedProps {
  searchQuery?: string;
}

export default function ActivityFeed({ searchQuery = '' }: ActivityFeedProps): React.JSX.Element {
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

  const filteredActivities = activities.filter(a => {
    const q = searchQuery.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.details.toLowerCase().includes(q);
  });

  if (loading) return <div className="activity-feed-container">Cargando actividad...</div>;

  return (
    <div className="activity-feed-container">
      <div className="feed-header">
        <h3>Actividad del Sistema</h3>
      </div>

      <div className="feed-list">
        {filteredActivities.length > 0 ? filteredActivities.map((activity, idx) => (
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
        )) : (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            No se encontraron actividades.
          </div>
        )}
      </div>
    </div>
  );
}
