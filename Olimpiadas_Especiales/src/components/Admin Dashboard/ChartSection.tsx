import React, { useState, useEffect } from 'react';
import '../../style/ChartSection.css';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import RegionalMap from './RegionalMap';
import { buildProvinciaCounts, enrichGraficosFromAtletas } from '../../utils/adminChartData';
import type { Graficos } from '../../types';

interface ChartSectionProps {
  onTabChange?: (tab: string) => void;
}

export default function ChartSection({ onTabChange }: ChartSectionProps): React.JSX.Element {
  const [graficos, setGraficos] = useState<Graficos | null>(null);
  const [mapCounts, setMapCounts] = useState<Record<string, number>>({});
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    Promise.all([
      ServicesAdmin.getCharts(),
      ServicesAdmin.getAtletas()
    ]).then(([chartData, atletas]) => {
      setGraficos(enrichGraficosFromAtletas(chartData, atletas));
      setMapCounts(buildProvinciaCounts(atletas));
    }).catch(error => console.error("Error al cargar datos de gráficos:", error));
  }, []);

  if (!graficos) return <div className="chart-section-container">Cargando gráficos...</div>;

  const getDonutGradient = () => {
    const list = graficos.distribucionRegional || [];
    if (list.length === 0) return 'conic-gradient(#e2e8f0 0% 100%)';
    
    const colorMap: Record<string, string> = {
      'san-jose': '#e62334',
      'alajuela': '#f97316',
      'cartago': '#2563eb',
      'heredia': '#eab308',
      'guanacaste': '#10b981',
      'puntarenas': '#06b6d4',
      'limon': '#8b5cf6',
      'desconocido': '#64748b'
    };
    
    const total = list.reduce((sum, item) => sum + item.valor, 0);
    if (total === 0) return 'conic-gradient(#e2e8f0 0% 100%)';
    
    let currentPercent = 0;
    const gradientParts: string[] = [];
    
    list.forEach(item => {
      const normalizedName = item.region
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, '-');
      const color = colorMap[normalizedName] || '#64748b';
      const percent = (item.valor / total) * 100;
      
      gradientParts.push(`${color} ${currentPercent}% ${currentPercent + percent}%`);
      currentPercent += percent;
    });
    
    return `conic-gradient(${gradientParts.join(', ')})`;
  };

  return (
    <div className="chart-section-container">

      {/* Left Column: Athletes by Sport */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3>Atletas por Deporte</h3>
          <span className="chart-badge">Temporada {currentYear}</span>
        </div>

        <div className="progress-list">
          {(graficos.atletasPorDeporte || []).length === 0 && (
            <p className="chart-empty-hint">No hay atletas registrados para mostrar estadísticas por deporte.</p>
          )}
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
          <a href="#" className="link-red" onClick={(e) => { e.preventDefault(); onTabChange?.('regiones'); }}>Ver Mapa</a>
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

          <div className="donut-chart-placeholder" style={{ background: getDonutGradient() }}>
            <div className="donut-inner">
              <span className="donut-total-label">Total</span>
              <span className="donut-total-value">{graficos.totalGeneral}</span>
            </div>
          </div>
        </div>

        <div className="map-summary-preview">
           <RegionalMap mini counts={mapCounts} />
        </div>
      </div>

    </div>
  );
}
