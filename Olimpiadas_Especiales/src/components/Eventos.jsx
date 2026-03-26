import React, { useState, useEffect } from 'react';

const getSportIcon = (sport) => {
  const icons = {
    'Fútbol': 'fa-futbol',
    'Baloncesto': 'fa-basketball',
    'Atletismo': 'fa-person-running',
    'Natación': 'fa-person-swimming',
    'Tenis': 'fa-table-tennis-paddle-ball',
    'Ciclismo': 'fa-bicycle',
    'Bolos': 'fa-bowling-ball',
    'Gimnasia': 'fa-star',
  };
  return icons[sport] || 'fa-trophy';
};

const getSportGradient = (sport) => {
  const gradients = {
    'Fútbol': 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    'Baloncesto': 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
    'Atletismo': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    'Natación': 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
    'Tenis': 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)',
    'Ciclismo': 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
  };
  return gradients[sport] || 'linear-gradient(135deg, #e62334 0%, #991b1b 100%)';
};

const formatDate = (fecha, fechaFin) => {
  const opts = { day: 'numeric', month: 'long', year: 'numeric' };
  const start = new Date(fecha + 'T12:00:00').toLocaleDateString('es-CR', opts);
  if (!fechaFin || fechaFin === fecha) return start;
  const end = new Date(fechaFin + 'T12:00:00').toLocaleDateString('es-CR', opts);
  return `Del ${start} al ${end}`;
};

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/competiciones")
      .then(res => res.json())
      .then(data => {
        setEventos(data);
        if (data.length > 0) setSelected(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#fff', minHeight: '80vh' }}>
      {/* ───── HERO HEADER ───── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '60px 24px 50px',
        textAlign: 'center',
        color: 'white'
      }}>
        <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e62334', marginBottom: '10px' }}>
          Olimpiadas Especiales Costa Rica
        </p>
        <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          Próximos Eventos
        </h1>
        <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '480px', margin: '0 auto' }}>
          Competiciones nacionales e internacionales de nuestros atletas.
        </p>
      </div>

      {/* ───── CONTENIDO ───── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 24px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '60px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }} />
            Cargando eventos...
          </p>
        ) : eventos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🏅</p>
            <h3 style={{ color: '#475569' }}>No hay eventos próximos</h3>
            <p style={{ color: '#94a3b8' }}>¡Vuelve pronto para ver nuestras competiciones!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '48px', alignItems: 'start' }}>

            {/* ── LISTA IZQUIERDA ── */}
            <div>
              <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '0' }}>
                Todos los eventos
              </h2>

              {eventos.map((ev, i) => (
                <div
                  key={ev.id}
                  onClick={() => setSelected(ev)}
                  style={{
                    padding: '22px 0',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    borderLeft: selected?.id === ev.id ? '3px solid #e62334' : '3px solid transparent',
                    paddingLeft: selected?.id === ev.id ? '14px' : '0',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Fecha pequeña */}
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontStyle: 'italic' }}>
                    {formatDate(ev.fecha, ev.fechaFin)}
                    {ev.ubicacion && ` · ${ev.ubicacion}`}
                  </p>

                  {/* Título */}
                  <h3 style={{
                    fontSize: '17px',
                    fontWeight: '800',
                    color: selected?.id === ev.id ? '#e62334' : '#1e293b',
                    margin: '0 0 8px',
                    lineHeight: '1.3',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px'
                  }}>
                    {ev.nombre}
                    {ev.enlace && (
                      <a href={ev.enlace} target="_blank" rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ color: '#e62334', fontSize: '12px', marginTop: '3px', flexShrink: 0 }}>
                        <i className="fa-solid fa-arrow-up-right-from-square" />
                      </a>
                    )}
                  </h3>

                  {/* Descripción corta */}
                  {ev.descripcion && (
                    <p style={{
                      fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.55',
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                    }}>
                      {ev.descripcion}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* ── DETALLE DERECHA ── */}
            {selected && (
              <div style={{ position: 'sticky', top: '24px' }}>
                {/* Imagen o gradiente */}
                <div style={{
                  height: '280px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: selected.imagen ? `url(${selected.imagen}) center/cover` : getSportGradient(selected.deporte),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '80px',
                  marginBottom: '28px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                }}>
                  {!selected.imagen && <i className={`fa-solid ${getSportIcon(selected.deporte)}`} />}
                </div>

                {/* Badge deporte */}
                <span style={{
                  display: 'inline-block',
                  fontSize: '11px', fontWeight: '700',
                  color: '#e62334', textTransform: 'uppercase',
                  letterSpacing: '0.08em', marginBottom: '10px'
                }}>
                  {selected.deporte}
                </span>

                {/* Título destacado */}
                <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#e62334', margin: '0 0 16px', lineHeight: '1.2' }}>
                  {selected.nombre}
                  {selected.enlace && (
                    <a href={selected.enlace} target="_blank" rel="noreferrer"
                      style={{ marginLeft: '10px', fontSize: '18px', color: '#e62334' }}>
                      <i className="fa-solid fa-arrow-up-right-from-square" />
                    </a>
                  )}
                </h2>

                {/* Descripción larga */}
                {selected.descripcion && (
                  <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7', marginBottom: '24px' }}>
                    {selected.descripcion}
                  </p>
                )}

                {/* Metadata pills */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#475569' }}>
                    <i className="fa-solid fa-calendar-days" style={{ color: '#e62334', width: '16px' }} />
                    {formatDate(selected.fecha, selected.fechaFin)}
                  </div>
                  {selected.ubicacion && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#475569' }}>
                      <i className="fa-solid fa-location-dot" style={{ color: '#e62334', width: '16px' }} />
                      {selected.ubicacion}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#475569' }}>
                    <i className="fa-solid fa-circle-check" style={{ color: '#16a34a', width: '16px' }} />
                    {selected.status || 'Programado'}
                  </div>
                </div>

                {selected.enlace && (
                  <a href={selected.enlace} target="_blank" rel="noreferrer" style={{
                    display: 'inline-block', marginTop: '24px',
                    padding: '12px 24px', background: '#e62334',
                    color: 'white', textDecoration: 'none',
                    borderRadius: '8px', fontWeight: '700', fontSize: '14px'
                  }}>
                    Más información <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginLeft: '6px' }} />
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Eventos;
