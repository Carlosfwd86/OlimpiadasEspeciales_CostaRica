import React, { useState, useEffect } from 'react';
import '../../style/ChartSection.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import RegionalMap from './RegionalMap';
import type { Graficos } from '../../types';

interface ChartSectionProps {
  onTabChange?: (tab: string) => void;
}

export default function ChartSection({ onTabChange }: ChartSectionProps): React.JSX.Element {
  const [graficos, setGraficos] = useState<Graficos | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    Promise.all([
      ServicesAdmin.getCharts(),
      ServicesAdmin.getAtletas()
    ]).then(([chartData, atletas]) => {
      const processedCharts: Graficos = { ...chartData };

      if ((processedCharts.distribucionRegional?.length || 0) === 0 && atletas.length > 0) {
        const provinces = ["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"];
        const counts: Record<string, number> = {};
        atletas.forEach(a => {
          let r = a.region || "Desconocido";
          if (r === "Desconocido" && a.direccion) {
            const found = provinces.find(p => a.direccion!.toLowerCase().includes(p.toLowerCase()));
            if (found) r = found;
          }
          const key = r as string;
          counts[key] = (counts[key] || 0) + 1;
        });

        processedCharts.distribucionRegional = Object.entries(counts).map(([name, val]) => ({
          region: name,
          valor: val,
          colorClase: `color-${name.toLowerCase().replace(/\s/g, '-')}`
        }));
        processedCharts.totalGeneral = atletas.length;
      }

      setGraficos(processedCharts);
    }).catch(error => console.error("Error al cargar datos de gráficos:", error));
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
          {(graficos.atletasPorDeporte || []).map((deporte, i) => (
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
            {(graficos.distribucionRegional || []).map((region, i) => (
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
