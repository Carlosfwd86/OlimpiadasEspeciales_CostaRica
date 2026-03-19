import React from 'react';
import '../Styles/Home.css';
/* --- COMPONENTE HOME (SECCIÓN HERO) --- */

const Home = () => {

    /* --- Funciones de Acción --- */
    const manejarRegistroAtleta = () => {
        console.log("Iniciando registro de atleta...");
    };

    const manejarVerRequisitos = () => {
        console.log("Mostrando requisitos de inscripción...");
    };

    return (
        <section className="seccion-hero-olimpiadas">
            <div className="contenido-hero">
                <span className="etiqueta-inclusion">INCLUSIÓN A TRAVÉS DEL DEPORTE</span>
                
                <h1 className="titulo-principal">
                    Plataforma de <span className="texto-resaltado">Registro</span> de Atletas
                </h1>
                
                <p className="descripcion-hero">
                    Esta plataforma permite registrar atletas de forma digital para facilitar el proceso 
                    de inscripción en Olimpiadas Especiales Costa Rica. Modernizamos el acceso al 
                    deporte para todos.
                </p>

                <div className="grupo-botones-hero">
                    <button className="boton-primario-rojo" onClick={manejarRegistroAtleta}>
                        <span className="icono-boton">👤+</span> Registrar atleta
                    </button>
                    <button className="boton-secundario-gris" onClick={manejarVerRequisitos}>
                        Ver Requisitos
                    </button>
                </div>
            </div>

            <div className="imagen-hero-contenedor">
                {/* Aquí va la imagen del logo grande con el degradado de fondo */}
                <div className="tarjeta-logo-especial">
                    <img src="src/assets/hero.png" alt="Special Olympics Logo" className="logo-central" />
                </div>
            </div>
        </section>
    );
};

export default Home;