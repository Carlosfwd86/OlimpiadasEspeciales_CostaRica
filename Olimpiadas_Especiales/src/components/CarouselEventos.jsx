import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CarouselEventos.css';

// Importación de imágenes
import imgCompetencia from '../img/evento_competencia.png';
import imgNatacion from '../img/evento_natacion.png';
import imgCeremonia from '../img/evento_ceremonia.png';

const CarouselEventos = () => {
  const navigate = useNavigate();

  const handleVerEventos = () => {
    navigate('/eventos');
  };

  const eventos = [
    {
      id: 1,
      titulo: "Competencia de Atletismo",
      resumen: "Nuestros atletas demuestran su velocidad y determinación en la pista olímpica. Un evento lleno de energía y superación personal.",
      imagen: imgCompetencia,
      categoria: "Deportes"
    },
    {
      id: 2,
      titulo: "Torneo de Natación",
      resumen: "Nadadores de todas las categorías compiten en una jornada refrescante y llena de técnica. ¡Ven a apoyar a nuestros tiburones!",
      imagen: imgNatacion,
      categoria: "Acuáticos"
    },
    {
      id: 3,
      titulo: "Ceremonia de Premiación",
      resumen: "Celebramos los logros de cada participante. Un momento de orgullo, medallas y sonrisas que quedan grabadas para siempre.",
      imagen: imgCeremonia,
      categoria: "Social"
    }
  ];

  return (
    <section className="carrusel-eventos-section">
      <div className="carrusel-eventos-header">
        <h2>Próximos Eventos</h2>
        <p className="subtitulo">Sigue de cerca el impacto y las alegrías de nuestra comunidad</p>
      </div>

      <div className="carrusel-contenedor" role="list">
        {eventos.map((evento) => (
          <article 
            key={evento.id} 
            className="evento-card" 
            onClick={handleVerEventos}
          >
            <div className="evento-imagen-wrapper">
              <img src={evento.imagen} alt={evento.titulo} />
              <span className="evento-badge">{evento.categoria}</span>
            </div>
            <div className="evento-contenido">
              <h3>{evento.titulo}</h3>
              <p>{evento.resumen}</p>
              <div className="evento-link">
                Ver detalles &rarr;
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CarouselEventos;
