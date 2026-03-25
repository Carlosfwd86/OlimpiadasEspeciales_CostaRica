import React from 'react';
import '../../style/StatCard.css';

export default function StatCard({ 
  icon, 
  iconColor = 'gray', 
  title, 
  value, 
  percentage, 
  trend, 
  text 
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-icon-wrapper color-${iconColor}`}>
          <i className={icon}></i>
        </div>
        
        {percentage && (
          <div className={`stat-badge ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
            {percentage}
          </div>
        )}
        
        {text && (
          <span className="stat-text-muted">{text}</span>
        )}
      </div>
      
      <div className="stat-card-body">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
    </div>
  );
}
