import React, { useState, useEffect } from 'react';
import '../style/ChartSection.css';

export default function ChartSection() {
  const [graficos, setGraficos] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetch('http://localhost:3001/graficos')
      .then(response => response.json())
      .then(data => setGraficos(data))
      .catch(error => console.error("Error al cargar datos de gráficos:", error));
  }, []);

  if (!graficos) return <div className="chart-section-container">Cargando gráficos...</div>;

  return (
    <div className="chart-section-container">
      
      {/* Left Column: Athletes by Sport */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3>Atletas por Deporte</h3>
          <span className="chart-badge">Temporada {currentYear}</span>
        </div>
        
        <div className="progress-list">
          {graficos.atletasPorDeporte.map((deporte, i) => (
            <div className="progress-item" key={i}>
              <div className="progress-info">
                <span>{deporte.deporte}</span>
                <span>{deporte.porcentaje}% ({deporte.valor})</span>
              </div>
              <div className="progress-bar-bg">
                <div className={`progress-bar-fill ${deporte.colorClase}`} style={{ width: `${deporte.porcentaje}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Regional Distribution */}
      <div className="chart-card chart-card-regional">
        <div className="chart-card-header d-flex-between">
          <h3>Distribución Regional</h3>
          <a href="#" className="link-red" onClick={(e) => { e.preventDefault(); alert("Abriendo mapa interactivo..."); }}>Ver Mapa</a>
        </div>
        
        <div className="regional-content">
          <div className="regional-list">
            {graficos.distribucionRegional.map((region, i) => (
              <div className="region-item" key={i}>
                <span className={`region-dot ${region.colorClase}`}></span>
                <span className="region-name">{region.region}</span>
                <span className="region-value">{region.valor}</span>
              </div>
            ))}
          </div>
          
          <div className="donut-chart-placeholder">
            <div className="donut-inner">
              <span className="donut-total-label">Total</span>
              <span className="donut-total-value">{graficos.totalGeneral}</span>
            </div>
          </div>
        </div>

        <div className="map-placeholder">
          <div className="map-image-stub">
            <i className="fa-solid fa-map-location-dot map-icon"></i>
            <span>Visualización del Mapa de Costa Rica</span>
          </div>
        </div>
      </div>

    </div>
  );
}
