import React, { useState, useEffect } from 'react';
import '../../style/ChartSection.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import RegionalMap from './RegionalMap';

export default function ChartSection({ onTabChange }) {
  const [graficos, setGraficos] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    ServicesAdmin.getAtletas()
      .then(atletas => {
        const provinces = ["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"];
        const sports = ["Fútbol", "Natación", "Atletismo", "Bochas", "Baloncesto", "Levantamiento de Pesas"];
        
        // 1. Calcular Distribución Regional
        const regionalCounts = {};
        atletas.forEach(a => {
          let r = a.region || "Otro";
          regionalCounts[r] = (regionalCounts[r] || 0) + 1;
        });

        const distribucionRegional = Object.entries(regionalCounts).map(([name, val]) => ({
          region: name,
          valor: val,
          colorClase: `color-${name.toLowerCase().replace(/\s/g, '-')}`
        }));

        // 2. Calcular Atletas por Deporte
        const officialSports = [
            "Atletismo", "Baloncesto", "Balonmano", "Bochas", "Ciclismo", 
            "Deportes de Invierno", "Ecuestre", "Fútbol", "Gimnasia Rítmica", 
            "Halterofilia", "Judo", "Natación", "Tenis de Campo", 
            "Tenis de Mesa", "Triatlón", "Voleibol"
        ];
        
        const sportCounts = {};
        officialSports.forEach(s => sportCounts[s] = 0);

        atletas.forEach(a => {
          let s = a.disciplina || a.sport || "Otro";
          if (s === "Levantamiento de Pesas") s = "Halterofilia";
          
          if (sportCounts[s] !== undefined) {
             sportCounts[s]++;
          }
        });

        const totalAtletas = atletas.length || 1;
        const atletasPorDeporte = Object.entries(sportCounts).map(([name, val]) => ({
          deporte: name,
          valor: val,
          porcentaje: Math.round((val / totalAtletas) * 100),
          colorClase: `color-${name.toLowerCase().replace(/\s/g, '-').replace(/[áéíóú]/g, 'a')}`
        }));

        setGraficos({
          atletasPorDeporte,
          distribucionRegional,
          totalGeneral: atletas.length
        });
      })
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
          <a href="#" className="link-red" onClick={(e) => { e.preventDefault(); onTabChange && onTabChange('regiones'); }}>Ver Mapa</a>
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

        <div className="map-summary-preview">
           <RegionalMap mini={true} />
        </div>
      </div>

    </div>
  );
}
