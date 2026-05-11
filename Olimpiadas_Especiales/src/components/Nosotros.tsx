import React from 'react';
import '../styles/Nosotros.css';

const Nosotros = (): React.JSX.Element => {
  return (
    <div className="contenedor_nosotros_principal">
      {/* Banner Superior con Imagen de Fondo */}
      <div className="banner_nosotros">
        <div className="overlay_nosotros"></div>
        <h1 className="titulo_nosotros">¿QUIÉNES SOMOS?</h1>
      </div>

      {/* Contenido de la Página */}
      <div className="seccion_texto_nosotros">
        <p className="parrafo_nosotros">
          Olimpiadas Especiales es una organización global que atiende a atletas con discapacidad intelectual y trabaja 
          con cientos de miles de voluntarios y entrenadores cada año. Desde su fundación en 1968, el número de personas 
          con y sin discapacidad intelectual que participan en la organización ha ido en aumento, pero la necesidad 
          insatisfecha de llegar a más personas con discapacidad intelectual es abrumadora.
        </p>

        <div className="resalte_nosotros">
          Es a nivel local, aquí mismo, donde los voluntarios interesados se reúnen con los atletas. Ahí es donde las 
          percepciones empiezan a cambiar y donde se produce el milagro de la transformación.
        </div>

        {/* Misión y Visión */}
        <div className="contenedor_mision_vision">
          <div className="bloque_nosotros_info">
            <h2>MISIÓN</h2>
            <p>
              Proporcionar entrenamiento deportivo y competición atlética durante todo el año en una variedad 
              de deportes de tipo olímpico para niños y adultos con discapacidad intelectual, ofreciéndoles 
              oportunidades continuas para desarrollar su condición física, demostrar valentía, experimentar 
              alegría y compartir sus talentos.
            </p>
          </div>
          <div className="bloque_nosotros_info">
            <h2>VISIÓN</h2>
            <p>
              Transformar comunidades a través del deporte, fomentando un mundo donde cada persona sea 
              aceptada y acogida como un miembro valioso de la sociedad, eliminando barreras y promoviendo 
              la inclusión radical.
            </p>
          </div>
        </div>

        <div className="objetivos_plataforma">
          <h3>Nuestra Plataforma Digital</h3>
          <p>
            Este portal ha sido desarrollado con el firme propósito de fortalecer la conectividad entre nuestra 
            fundación y la comunidad. Buscamos optimizar la gestión de atletas y voluntarios, alineándonos 
            con nuestros objetivos de transparencia y eficiencia para que cada entrenamiento y evento sea 
            una oportunidad de éxito para todos.
          </p>
        </div>

        <p className="parrafo_nosotros">
          Olimpiadas Especiales ofrece entrenamiento deportivo y competencia atlética durante todo el año en una variedad 
          de deportes de tipo olímpico para niños y adultos con discapacidad intelectual. Estas actividades les brindan 
          oportunidades continuas para desarrollar su aptitud física, demostrar valentía, experimentar la alegría y 
          compartir dones, habilidades y amistad.
        </p>

        {/* Foto del Equipo */}
        <div className="contenedor_foto_equipo">
          <img 
            src="/src/img/fotoNosotros.jpg" 
            alt="Equipo Olimpiadas Especiales" 
            className="foto_equipo_nosotros"
          />
          <p className="caption_foto">Nuestra familia de atletas y voluntarios trabajando por un futuro inclusivo.</p>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;
