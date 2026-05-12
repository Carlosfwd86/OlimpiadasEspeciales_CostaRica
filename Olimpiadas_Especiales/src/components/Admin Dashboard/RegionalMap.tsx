import React, { useEffect, useState } from "react";
import type { ProvincePath } from "../../types";

const provinceColorScale: string[] = [
  "#ffedea",
  "#ffcec5",
  "#ffadad",
  "#ff8a8a",
  "#ff5a5a",
  "#ef4444",
  "#dc2626"
];

interface RegionalMapProps {
  mini?: boolean;
}

interface HoveredProvince {
  name: string;
  count: number;
}

const RegionalMap: React.FC<RegionalMapProps> = ({ mini = false }) => {
  const [data, setData] = useState<Record<string, number>>({});
  const [provincePaths, setProvincePaths] = useState<ProvincePath[]>([]);
  const [hoveredProvince, setHoveredProvince] = useState<HoveredProvince | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);

        // Paths SVG del mapa CR — datos estáticos (no dependen del backend)
        const { default: mapPaths } = await import('../../data/mapa-cr.json') as { default: ProvincePath[] };
        setProvincePaths(mapPaths);

        // Atletas reales del backend con JWT
        const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
        const token = localStorage.getItem('token') ?? '';
        const athletesRes = await fetch(`${BACKEND_URL}/atletas`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        let atletas: Array<{ region?: string; direccion?: string }> = [];
        if (athletesRes.ok) {
          const json = await athletesRes.json() as unknown;
          // Soporta { data: { items: [] } }, { data: [] } o []
          if (Array.isArray(json)) {
            atletas = json as typeof atletas;
          } else {
            const j = json as Record<string, unknown>;
            const d = j?.data as Record<string, unknown> | undefined;
            atletas = (Array.isArray(d?.items) ? d!.items : Array.isArray(j?.data) ? j.data : []) as typeof atletas;
          }
        }

        const counts: Record<string, number> = {};
        const provincesList = ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'];

        atletas.forEach((a) => {
          let region = a.region;
          if (!region && a.direccion) {
            const found = provincesList.find(p => a.direccion!.toLowerCase().includes(p.toLowerCase()));
            if (found) region = found;
          }
          if (!region) region = 'Desconocido';
          counts[region] = (counts[region] || 0) + 1;
        });
        setData(counts);
      } catch (err) {
        console.error('Error cargando datos para el mapa:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getColor = (count: number): string => {
    if (count === 0) return "#f1f5f9";
    const counts = Object.values(data);
    const max = Math.max(...counts, 1);
    const index = Math.min(Math.floor((count / max) * (provinceColorScale.length - 1)), provinceColorScale.length - 1);
    return provinceColorScale[index];
  };

  if (loading) return <div>Cargando mapa...</div>;

  return (
    <div className={`regional-map-container ${mini ? 'mini-map-mode' : ''}`}>
      {!mini && (
        <div className="map-header">
          <div className="map-title">
            <h4>Distribución Geográfica de Atletas</h4>
            <p>Mapa interactivo (Basado en {Object.values(data).reduce((a, b) => a + b, 0)} atletas)</p>
          </div>
          {hoveredProvince && (
            <div className="map-tooltip-fixed">
              <span className="province-name">{hoveredProvince.name}</span>
              <span className="province-count">{hoveredProvince.count} atletas</span>
            </div>
          )}
        </div>
      )}

      <div className="map-wrapper" style={{ display: 'flex', justifyContent: 'center', padding: mini ? '0' : '20px', border: mini ? 'none' : '' }}>
        <svg
          viewBox="0 0 800 600"
          width="100%"
          height={mini ? "200" : "400"}
          style={{ maxWidth: mini ? '300px' : '600px' }}
        >
          {provincePaths.map((prov) => {
            const count = data[prov.name] || 0;
            return (
              <path
                key={prov.name}
                d={prov.path}
                fill={getColor(count)}
                stroke="#fff"
                strokeWidth="1"
                onMouseEnter={() => setHoveredProvince({ name: prov.name, count })}
                onMouseLeave={() => setHoveredProvince(null)}
                style={{
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  outline: 'none'
                }}
                className="province-path"
              />
            );
          })}
        </svg>
      </div>

      {!mini && (
        <div className="map-legend">
          <span>Menos Atletas</span>
          <div className="legend-gradient"></div>
          <span>Más Atletas</span>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .province-path:hover {
          fill: #e62334 !important;
          stroke-width: 2;
        }
      `}} />
    </div>
  );
};

export default RegionalMap;
