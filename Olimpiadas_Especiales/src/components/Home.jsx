import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { getAtletas } from '../services/ServicesAtletas';
import { getTutores } from '../services/ServicesTutores';
import { getEntrenadores } from '../services/ServicesEntrenadores';
import { getVoluntarios } from '../services/ServicesVoluntarios';
import CarouselEventos from './CarouselEventos';
import BannerVoluntarios from './BannerVoluntarios';
import InfografiaImpacto from './InfografiaImpacto';

// Hero Images
import imgDown1 from '../img/atleta_down_1.png';
import imgDown2 from '../img/atleta_down_2.png';
import imgEvento1 from '../img/evento_competencia.png';
import imgEvento2 from '../img/evento_natacion.png';
import imgEvento3 from '../img/evento_ceremonia.png';
import imgVoluntario from '../img/voluntarios_accion.png';

const Home = () => {

    /* --- Funciones de Acción --- */
    const navegar = useNavigate();
    const irAFormulario = (rol) => navegar(`/formulario?rol=${rol}`);

    const manejarUnete = () => navegar('/formulario?rol=atleta');
    const manejarConoceMas = () => console.log('Conocer más...');

    const [counts, setCounts] = useState({
        atletas: 0,
        tutores: 0,
        entrenadores: 0,
        voluntarios: 0,
        competiciones: 0,
        porSexo: { masc: 0, fem: 0 },
        porEdad: { jovenes: 0, adultos: 0, ninos: 0 }
    });

    const [heroImageIndex, setHeroImageIndex] = useState(0);
    const heroImages = [
        imgDown1,
        imgDown2,
        imgEvento1,
        imgEvento2,
        imgEvento3,
        imgVoluntario,
        'https://images.unsplash.com/photo-1541250848049-b4f71413cc30?q=80&w=1000&auto=format&fit=crop', // Atleta 7
        'https://images.unsplash.com/photo-1579383616558-f9104f42f633?q=80&w=1000&auto=format&fit=crop'  // Atleta 8
    ];

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [atletas, tutores, entrenadores, voluntarios, compsRes] = await Promise.all([
                    getAtletas().catch(() => []),
                    getTutores().catch(() => []),
                    getEntrenadores().catch(() => []),
                    getVoluntarios().catch(() => []),
                    fetch('http://localhost:3001/competiciones').then(r => r.json()).catch(() => [])
                ]);

                // Calcular estadísticas detalladas
                const masc = atletas.filter(a => a.genero === 'Masculino').length;
                const fem = atletas.filter(a => a.genero === 'Femenino').length;

                const ahora = new Date();
                const edades = atletas.map(a => {
                    const cumple = new Date(a.fechaNacimiento);
                    return ahora.getFullYear() - cumple.getFullYear();
                });

                setCounts({
                    atletas: atletas.length || 0,
                    tutores: tutores.length || 0,
                    entrenadores: entrenadores.length || 0,
                    voluntarios: voluntarios.length || 0,
                    competiciones: compsRes.length || 0,
                    porSexo: { masc, fem },
                    porEdad: {
                        ninos: edades.filter(e => e < 15).length,
                        jovenes: edades.filter(e => e >= 15 && e < 25).length,
                        adultos: edades.filter(e => e >= 25).length
                    }
                });
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };
        fetchCounts();

        // Image rotation timer
        const timer = setInterval(() => {
            setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 3000);
        
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <section className="contenedor_hero_principal">

            {/* Contenido Superior Principal */}
            <div className="hero_contenido_superior">
                
                <div className="hero_texto_izquierdo">
                    <h1 className="hero_titulo">
                        Juntos transformamos <br/>
                        <span className="hero_titulo_rojo">vidas a través del deporte</span>
                    </h1>
                    
                    <p className="hero_descripcion">
                      Nuestra mision es proporcionar entrenamiento deportivo y competición atlética durante todo el año en una variedad de deportes de tipo olímpico para niños y adultos con discapacidad intelectual, ofreciéndoles oportunidades continuas para desarrollar su condición física, demostrar valentía, experimentar alegría y compartir sus talentos, habilidades y amistad con sus familias, otros atletas de las Olimpiadas Especiales y la comunidad.
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
                    <div 
                        className="hero_fondo_derecha"
                        style={{
                            position: 'absolute',
                            top: '-5%',
                            right: '-5%',
                            width: '100%',
                            height: '110%',
                            transform: `translateX(${(heroImageIndex % 2 - 0.5) * 40}px) translateY(${(heroImageIndex % 3 - 1) * 20}px) scale(${1 + (heroImageIndex % 2) * 0.1}) rotate(${(heroImageIndex % 3 - 1) * 3}deg)`,
                            borderRadius: heroImageIndex % 2 === 0 ? '40px 0 0 100px' : '100px 0 0 40px',
                            transition: 'all 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            zIndex: 0
                        }}
                    ></div>
                    {heroImages.map((src, idx) => (
                        <div 
                            key={idx}
                            className="imagen_ejemplo" 
                            style={{ 
                                backgroundImage: `url(${src})`,
                                position: idx === 0 ? 'relative' : 'absolute',
                                top: 0,
                                left: 0,
                                opacity: heroImageIndex === idx ? 1 : 0,
                                transition: 'opacity 1s ease-in-out',
                                zIndex: 1
                            }}
                        ></div>
                    ))}
                </div>

            </div>
        </section>

        {/* Sección de Estadísticas de Impacto */}
        <div className="hero_tarjetas_inferiores_contenedor">
            <div className="stats_header_seccion">
                <span className="stats_badge">Cifras que transforman vidas</span>
                <h2 className="titulo_registro_seccion">NUESTRO IMPACTO EN COSTA RICA</h2>
            </div>
            
            <div className="hero_tarjetas_inferiores">
                
                {/* 1. Deportistas */}
                <div className="tarjeta_info stat_card" onClick={() => navegar('/atletas')}>
                    <div className="stat_number">{counts.atletas.toLocaleString()}</div>
                    <div className="stat_content">
                        <div className="icono_tarjeta">
                            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="5" />
                                <path d="M3 21v-2a7 7 0 0 1 14 0v2" />
                            </svg>
                        </div>
                        <div className="texto_tarjeta">
                            <h4>Deportistas</h4>
                            <p>Atletas con discapacidad intelectual entrenando cada día.</p>
                        </div>
                    </div>
                </div>

                {/* 2. Voluntarios */}
                <div className="tarjeta_info stat_card" onClick={() => navegar('/voluntarios')}>
                    <div className="stat_number">{counts.voluntarios.toLocaleString()}</div>
                    <div className="stat_content">
                        <div className="icono_tarjeta">
                            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <div className="texto_tarjeta">
                            <h4>Voluntarios</h4>
                            <p>Personas que regalan su tiempo para fomentar la inclusión.</p>
                        </div>
                    </div>
                </div>

                {/* 3. Competiciones */}
                <div className="tarjeta_info stat_card" onClick={() => navegar('/eventos')}>
                    <div className="stat_number">{counts.competiciones.toLocaleString()}</div>
                    <div className="stat_content">
                        <div className="icono_tarjeta">
                            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                <path d="M4 22h16" />
                                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                            </svg>
                        </div>
                        <div className="texto_tarjeta">
                            <h4>Competiciones</h4>
                            <p>Eventos anuales donde celebramos el espíritu deportivo.</p>
                        </div>
                    </div>
                </div>

                {/* 4. Tutores / Familia */}
                <div className="tarjeta_info stat_card" onClick={() => navegar('/nosotros')}>
                    <div className="stat_number">{counts.tutores.toLocaleString()}</div>
                    <div className="stat_content">
                        <div className="icono_tarjeta">
                            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div className="texto_tarjeta">
                            <h4>Familias</h4>
                            <p>Una red de apoyo dedicada a empoderar a nuestros campeones.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <InfografiaImpacto stats={counts} />

        <CarouselEventos />
        <BannerVoluntarios />
    </>
);
};

export default Home;