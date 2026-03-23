import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {

    /* --- Funciones de Acción --- */
    const navegar = useNavigate();
    const irAFormulario = (rol) => navegar(`/formulario?rol=${rol}`);

    const manejarUnete = () => navegar('/formulario?rol=atleta');
    const manejarConoceMas = () => console.log('Conocer más...');

    return (
        <section className="contenedor_hero_principal">
            <div className="hero_fondo_derecha"></div>

            {/* Contenido Superior Principal */}
            <div className="hero_contenido_superior">
                
                <div className="hero_texto_izquierdo">
                    <h1 className="hero_titulo">
                        Juntos transformamos <br/>
                        <span className="hero_titulo_rojo">vidas a través del deporte</span>
                    </h1>
                    
                    <p className="hero_descripcion">
                        Promovemos la inclusión, el respeto y el desarrollo de personas 
                        con discapacidad intelectual a través del deporte.
                    </p>

                    <div className="hero_botones">
                        <button className="boton_rojo" onClick={manejarUnete}>
                            Únete como atleta <span className="flecha_boton">&gt;</span>
                        </button>
                        <button className="boton_blanco" onClick={manejarConoceMas}>
                            Conoce más
                        </button>
                    </div>
                </div>

                <div className="hero_imagen_derecha">
                    <div className="imagen_ejemplo"></div>
                </div>

            </div>

            {/* Tarjetas Inferiores Flotantes */}
            <div className="hero_tarjetas_inferiores">
                
                {/* 1. Tarjeta Atleta */}
                <div className="tarjeta_info" onClick={() => irAFormulario('atleta')} style={{ cursor: 'pointer' }}>
                    <div className="icono_tarjeta">
                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="5" />
                            <path d="M3 21v-2a7 7 0 0 1 14 0v2" />
                        </svg>
                    </div>
                    <div className="texto_tarjeta">
                        <h4>Atleta</h4>
                        <p>Promovemos la inclusión, el respeto y el desarrollo.</p>
                    </div>
                    <div className="flecha_tarjeta_roja">&rarr;</div>
                </div>

                {/* 2. Tarjeta Familiar */}
                <div className="tarjeta_info" onClick={() => irAFormulario('tutor')} style={{ cursor: 'pointer' }}>
                    <div className="icono_tarjeta">
                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <div className="texto_tarjeta">
                        <h4>Tutor / Familiar</h4>
                        <p>Todas las familias forman parte de nuestra red.</p>
                    </div>
                    <div className="flecha_tarjeta_roja">&rarr;</div>
                </div>

                {/* 3. Tarjeta Entrenador */}
                <div className="tarjeta_info" onClick={() => irAFormulario('entrenador')} style={{ cursor: 'pointer' }}>
                    <div className="icono_tarjeta">
                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        </svg>
                    </div>
                    <div className="texto_tarjeta">
                        <h4>Entrenador</h4>
                        <p>Guía el camino de nuestros atletas hacia el éxito.</p>
                    </div>
                    <div className="flecha_tarjeta_roja">&rarr;</div>
                </div>

                {/* 4. Tarjeta Voluntario */}
                <div className="tarjeta_info" onClick={() => irAFormulario('voluntario')} style={{ cursor: 'pointer' }}>
                    <div className="icono_tarjeta">
                        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </div>
                    <div className="texto_tarjeta">
                        <h4>Voluntario</h4>
                        <p>Sé parte del impacto y ayuda a nuestra comunidad.</p>
                    </div>
                    <div className="flecha_tarjeta_roja">&rarr;</div>
                </div>

            </div>
        </section>
    );
};

export default Home;