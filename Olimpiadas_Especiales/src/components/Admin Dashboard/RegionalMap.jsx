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
  const getColor = (count) => {
    if (count === 0) return "#f1f5f9";
    const counts = Object.values(data);
    const max = Math.max(...counts, 1);
    const index = Math.min(Math.floor((count / max) * (provinceColorScale.length - 1)), provinceColorScale.length - 1);
    return provinceColorScale[index];
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
