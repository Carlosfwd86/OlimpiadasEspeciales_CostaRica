import React, { useEffect, useState } from "react";
import type { ProvincePath } from "../../types";

interface RegionalMapProps {
  mini?: boolean;
}

interface ProvinceData {
  name: string;
  count: number;
}

const RegionalMap: React.FC<RegionalMapProps> = ({ mini = false }) => {
  const [data, setData] = useState<Record<string, number>>({});
  const [provincePaths, setProvincePaths] = useState<ProvincePath[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceData | null>(null);

  // Datos reales del prompt para demostración si no hay datos en el backend
  const demoData: Record<string, number> = {
    "San José": 62,
    "Alajuela": 45,
    "Cartago": 31,
    "Heredia": 28,
    "Puntarenas": 15,
    "Guanacaste": 0,
    "Limón": 0
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);

        // Importar paths precisos
        const { default: mapPaths } = await import('../../data/mapa-cr.json') as { default: ProvincePath[] };
        setProvincePaths(mapPaths);

        // Intentar obtener atletas reales
        const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
        const token = localStorage.getItem('token') ?? '';
        const athletesRes = await fetch(`${BACKEND_URL}/atletas`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        let counts: Record<string, number> = { ...demoData }; // Empezamos con demo
        
        if (athletesRes.ok) {
          const json = await athletesRes.json() as any;
          const atletas = Array.isArray(json) ? json : (json.data?.items || json.data || []);
          
          if (atletas.length > 0) {
            // Si hay atletas en el backend, los usamos
            const realCounts: Record<string, number> = {
              "San José": 0, "Alajuela": 0, "Cartago": 0, "Heredia": 0, 
              "Guanacaste": 0, "Puntarenas": 0, "Limón": 0
            };
            
            const provincesList = Object.keys(realCounts);
            
            atletas.forEach((a: any) => {
              const region = a.region || a.programa;
              if (region && provincesList.includes(region)) {
                realCounts[region]++;
              } else if (a.direccion) {
                const found = provincesList.find(p => a.direccion.toLowerCase().includes(p.toLowerCase()));
                if (found) realCounts[found]++;
              }
            });
            counts = realCounts;
          }
        }
        
        setData(counts);
      } catch (err) {
        console.error('Error cargando mapa:', err);
        setData(demoData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-map">Cargando mapa interactivo...</div>;

  const provincesOrdered = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <div className={`regional-map-card ${mini ? 'mini' : ''}`}>
      {!mini && (
        <div className="map-card-header">
          <div className="header-text">
            <h3>Distribución Geográfica de Atletas</h3>
            <p>Mapa interactivo (Basado en {Object.values(data).reduce((a, b) => a + b, 0)} atletas con provincia registrada)</p>
          </div>
        </div>
      )}

      <div className="map-content-wrapper">
        <div className="map-svg-container">
          <svg viewBox="100 0 800 600" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            {provincePaths.map((prov) => {
              const count = data[prov.name] || 0;
              const isActive = count > 0;
              return (
                <path
                  key={prov.name}
                  d={prov.path}
                  stroke="#fff"
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredProvince({ name: prov.name, count })}
                  onMouseLeave={() => setHoveredProvince(null)}
                  className={`province-path-precise ${isActive ? 'active' : 'empty'}`}
                  style={{
                    transition: 'fill 0.3s ease, transform 0.2s ease',
                    cursor: 'pointer'
                  }}
                />
              );
            })}
          </svg>
        </div>

        {!mini && (
          <div className="map-floating-legend">
            <span className="legend-header">Provincias</span>
            <ul className="legend-list">
              {provincesOrdered.map(([name, count]) => (
                <li key={name} className={hoveredProvince?.name === name ? 'active' : ''}>
                  <span className={`dot ${count > 0 ? 'active' : 'empty'}`}></span>
                  <span className="name">{name}</span>
                  <span className="count">({count} Atletas)</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {!mini && (
        <div className="map-card-footer">
          <div className="gradient-bar-container">
            <span>Menos Atletas</span>
            <div className="gradient-bar"></div>
            <span>Más Atletas</span>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .regional-map-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          transition: all 0.3s ease;
        }
        .regional-map-card.mini {
          padding: 0;
          box-shadow: none;
          background: transparent;
          border: none;
        }
        .map-card-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #1e293b;
          font-weight: 700;
        }
        .map-card-header p {
          margin: 4px 0 0;
          font-size: 0.875rem;
          color: #64748b;
        }
        .map-content-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
          min-height: 400px;
        }
        .regional-map-card.mini .map-content-wrapper {
          min-height: auto;
          margin-top: 0;
        }
        .map-svg-container {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        .province-path-precise {
          fill: #e2e8f0;
        }
        .province-path-precise.active {
          fill: #e62334;
        }
        .province-path-precise.active:hover {
          fill: #c31b2b !important;
          transform: scale(1.015);
          filter: drop-shadow(0 4px 10px rgba(230,35,52,0.3));
        }
        .province-path-precise.empty:hover {
          fill: #cbd5e1 !important;
          transform: scale(1.01);
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.08));
        }
        .map-floating-legend {
          position: absolute;
          top: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          width: 200px;
        }
        .legend-header {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 12px;
          letter-spacing: 0.05em;
        }
        .legend-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .legend-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
          color: #334155;
          margin-bottom: 8px;
          transition: all 0.2s;
        }
        .legend-list li.active {
          transform: translateX(-4px);
          font-weight: 600;
        }
        .legend-list .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          background-color: #e2e8f0;
        }
        .legend-list .dot.active {
          background-color: #e62334;
        }
        .legend-list .count {
          color: #64748b;
          margin-left: auto;
          font-size: 0.75rem;
        }
        .map-card-footer {
          margin-top: 24px;
          border-top: 1px solid #f1f5f9;
          padding-top: 20px;
        }
        .gradient-bar-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .gradient-bar {
          height: 8px;
          width: 200px;
          border-radius: 4px;
          background: linear-gradient(to right, #e2e8f0, #e62334);
        }
        .loading-map {
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        /* Dark Mode Overrides */
        .dark-mode .regional-map-card {
          background: #1e1e24;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          border: 1px solid #2e2e38;
        }
        .dark-mode .regional-map-card.mini {
          background: transparent;
          border: none;
          box-shadow: none;
        }
        .dark-mode .map-card-header h3 {
          color: #f3f4f6;
        }
        .dark-mode .map-card-header p {
          color: #9ca3af;
        }
        .dark-mode .province-path-precise {
          fill: #334155;
        }
        .dark-mode .province-path-precise.active {
          fill: #e62334;
        }
        .dark-mode .province-path-precise.empty:hover {
          fill: #475569 !important;
        }
        .dark-mode .map-floating-legend {
          background: rgba(30, 30, 36, 0.95);
          border-color: #2e2e38;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .dark-mode .legend-header {
          color: #6b7280;
        }
        .dark-mode .legend-list li {
          color: #e5e7eb;
        }
        .dark-mode .legend-list .dot {
          background-color: #334155;
        }
        .dark-mode .legend-list .dot.active {
          background-color: #e62334;
        }
        .dark-mode .legend-list .count {
          color: #9ca3af;
        }
        .dark-mode .map-card-footer {
          border-top-color: #2e2e38;
        }
        .dark-mode .gradient-bar-container {
          color: #6b7280;
        }
        .dark-mode .gradient-bar {
          background: linear-gradient(to right, #334155, #e62334);
        }
      `}} />
    </div>
  );
};

export default RegionalMap;

