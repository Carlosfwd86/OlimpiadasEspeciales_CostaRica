import React, { useEffect, useState } from "react";
const provinceColorScale = [
  "#ffedea",
  "#ffcec5",
  "#ffadad",
  "#ff8a8a",
  "#ff5a5a",
  "#ef4444",
  "#dc2626"
];

const RegionalMap = ({ mini = false }) => {
  const [data, setData] = useState({});
  const [provincePaths, setProvincePaths] = useState([]);
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load both Map Paths and Athlete distribution
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch map shapes
        const mapRes = await fetch("http://localhost:3001/mapa");
        const mapPaths = await mapRes.json();
        setProvincePaths(mapPaths);

        // 2. Fetch Athletes
        const athletesRes = await fetch("http://localhost:3001/atletas");
        const atletas = await athletesRes.json();
        
        const counts = {};
        const provincesList = ["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"];
        
        atletas.forEach((a) => {
          let region = a.region;
          if (!region && a.direccion) {
            const found = provincesList.find(p => a.direccion.toLowerCase().includes(p.toLowerCase()));
            if (found) region = found;
          }
          if (!region) region = "Desconocido";
          counts[region] = (counts[region] || 0) + 1;
        });
        setData(counts);
      } catch (err) {
        console.error("Error cargando datos para el mapa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Simple scale logic to replace d3-scale
  const getBaseColor = (provinceName) => {
    const provinceColors = {
      'Guanacaste': '#7c3aed', // Morado
      'Alajuela': '#f97316', // Naranja
      'Heredia': '#1e3a8a', // Azul oscuro
      'Limón': '#ef4444', // Rojo
      'Cartago': '#0ea5e9', // Azul claro
      'San José': '#f59e0b', // Amarillo/Oro
      'Puntarenas': '#22c55e' // Verde
    };
    return provinceColors[provinceName] || '#cbd5e1';
  };

  const getOpacity = (count) => {
    if (count === 0) return 0.5; // Opacidad media si no hay atletas, para mostrar el color base atenuado
    if (count < 5) return 0.7; // Algo más sólido
    if (count < 15) return 0.9;
    return 1.0; // Color completo para mucha concentración
  };

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
          viewBox="-2 17.46 964 925.08" 
          width="100%" 
          height={mini ? "200" : "450"}
          style={{ maxWidth: mini ? '300px' : '700px' }}
        >
          {provincePaths.map((prov) => {
            const count = data[prov.name] || 0;
            return (
              <path
                key={prov.name}
                d={prov.path}
                fill={getBaseColor(prov.name)}
                fillOpacity={getOpacity(count)}
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinejoin="round"
                onMouseEnter={() => setHoveredProvince({ name: prov.name, count })}
                onMouseLeave={() => setHoveredProvince(null)}
                style={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
