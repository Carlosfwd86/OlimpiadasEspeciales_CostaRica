import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { getAtletas } from '../services/ServicesAtletas';
import { getTutores } from '../services/ServicesTutores';
import { getEntrenadores } from '../services/ServicesEntrenadores';
import { getVoluntarios } from '../services/ServicesVoluntarios';
import CarouselEventos from './CarouselEventos';
import BannerVoluntarios from './BannerVoluntarios';
import InfografiaImpacto from './InfografiaImpacto';

const Home = () => {

    /* --- Funciones de Acción --- */
    const navegar = useNavigate();
    const canvasRef = useRef(null);

    /* ── Animated lines canvas ── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;
        let w, h;

        const resize = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Generate nodes
        const NUM = 38;
        const nodes = Array.from({ length: NUM }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
        }));

        const LINK_DIST = 140;

        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            // Update positions
            nodes.forEach(n => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0) n.x = w;
                if (n.x > w) n.x = 0;
                if (n.y < 0) n.y = h;
                if (n.y > h) n.y = 0;
            });

            // Draw links
            for (let i = 0; i < NUM; i++) {
                for (let j = i + 1; j < NUM; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < LINK_DIST) {
                        const alpha = (1 - dist / LINK_DIST) * 0.25;
                        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw dots
            nodes.forEach(n => {
                ctx.beginPath();
                ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.25)';
                ctx.fill();
            });

            raf = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    const irAFormulario = (rol) => navegar(`/formulario?rol=${rol}`);

    const manejarUnete = () => navegar('/plataforma-registro');
    const manejarConoceMas = () => navegar('/nosotros');

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
        '/img/atleta_down_1.png',
        '/img/atleta_down_2.png',
        '/img/evento_competencia.png',
        '/img/evento_natacion.png',
        '/img/evento_ceremonia.png',
        '/img/voluntarios_accion.png'
    ];

    // Configuración dinámica para el fondo decorativo según la imagen actual
    const fondoConfig = [
        { br: "40px 0 0 150px", tr: "translateX(40px) rotate(-5deg) scale(1.1)", color: "#FF0000", op: 0.85 },
        { br: "150px 0 0 40px", tr: "translateX(-30px) rotate(3deg) scale(1.05)", color: "#D00000", op: 0.75 },
        { br: "0 0 0 200px", tr: "translateY(-30px) rotate(-2deg) scale(1.15)", color: "#FF4D4D", op: 0.80 },
        { br: "100px 100px 0 100px", tr: "translateX(20px) translateY(20px) rotate(5deg) scale(1.2)", color: "#E00000", op: 0.70 },
        { br: "40px 0 150px 0", tr: "translateX(-20px) scale(1.1) rotate(-8deg)", color: "#FF1A1A", op: 0.90 },
        { br: "80px 0 0 120px", tr: "translateY(30px) rotate(2deg) scale(1.08)", color: "#C00000", op: 0.82 }
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
            {/* Banner CTA Flotante - Arriba del Hero */}
            {/* Banner CTA Flotante - Arriba del Hero (Ahora con Video) */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(255,0,0,0.72) 0%, rgba(30,20,10,0.82) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '48px 24px',
                textAlign: 'center',
                fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'stretch', // Estirar para que la franja central sea de altura completa
                minHeight: '600px',
                width: '100%'
            }}>
                {/* Video de Fondo (Limpio y Único para todo el ancho) */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0
                    }}
                >
                    <source src="/img/videoHome.mp4" type="video/mp4" />
                </video>
                
                {/* Canvas de líneas animadas */}
                <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:1 }} />

                {/* Overlay Radial Sutil (Solo oscurece un poco el centro para legibilidad) */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)',
                    zIndex: 2
                }} />

                {/* Contenido Central con Efecto de Halo */}
                <div style={{ 
                    position: 'relative', 
                    zIndex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px 20px',
                    maxWidth: '900px',
                    textAlign: 'center'
                }}>
                    
                    {/* Círculos decorativos */}
                    <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'800px', height:'200px', borderRadius:'50%', background:'rgba(255,0,0,0.06)', pointerEvents:'none' }} />
                    <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:'150px', height:'150px', borderRadius:'50%', background:'rgba(255,0,0,0.04)', pointerEvents:'none' }} />

                    <p style={{
                        color: '#ffffff', fontWeight: '1000', textTransform: 'uppercase',
                        letterSpacing: '0.12em', fontSize: 'clamp(1.5rem, 5vw, 3.5rem)', marginBottom: '14px',
                        textShadow: `
                            0 0 20px rgba(0,0,0,0.9),
                            0 4px 10px rgba(0,0,0,0.8),
                            0 0 5px rgba(0,0,0,1)
                        `
                    }}>¿Primera vez aquí?</p>

                    <h2 style={{
                        color: '#ffffff',
                        fontSize: 'clamp(1.2rem, 4vw, 2.8rem)',
                        fontWeight: '900',
                        letterSpacing: '-1.5px',
                        margin: '0 0 20px',
                        lineHeight: '1.1',
                        textShadow: '0 4px 15px rgba(0,0,0,0.8)'
                    }}>
                        Empieza creando tu cuenta
                    </h2>

                    <p style={{
                        color: '#ffffff', fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: '1.6',
                        maxWidth: '550px', margin: '0 auto 40px',
                        fontWeight: '500',
                        textShadow: '0 2px 10px rgba(0,0,0,0.9)'
                    }}>
                        Necesitas una cuenta para guardar tu progreso y completar la inscripción.
                    </p>

                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navegar('/registro')}
                            style={{
                                padding: '16px 40px', background: '#FF0000', color: '#fff',
                                border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: '800',
                                cursor: 'pointer', boxShadow: '0 8px 25px rgba(255,0,0,0.4)',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#e60000'; e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#FF0000'; e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
                        >
                            Crear Cuenta
                        </button>
                        <button
                            onClick={() => navegar('/login')}
                            style={{
                                padding: '16px 40px', background: 'transparent', color: '#fff',
                                border: '2px solid rgba(255, 255, 255, 0.8)', borderRadius: '14px', fontSize: '1rem', fontWeight: '800',
                                cursor: 'pointer', transition: 'all 0.3s ease',
                                backdropFilter: 'blur(5px)'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = '#ffffff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'; }}
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </div>
            </div>

            <section className="contenedor_hero_principal">

                {/* Contenido Superior Principal */}
                <div className="hero_contenido_superior">

                    <div className="hero_texto_izquierdo">
                        <h1 className="hero_titulo">
                            Juntos transformamos <br />
                            <span className="hero_titulo_rojo">vidas a través del deporte</span>
                        </h1>

                        <p className="hero_descripcion">

                        </p>

                        <div className="hero_botones">
                            <button className="boton_rojo" onClick={manejarUnete}>
                                Únete a nosotros <span className="flecha_boton">&gt;</span>
                            </button>
                            <button className="boton_blanco" onClick={manejarConoceMas}>
                                Conoce más
                            </button>
                        </div>
                    </div>

                    <div className="hero_imagen_derecha" style={{ position: 'relative', width: '100%', height: '550px' }}>
                        {/* Capa de fondo 1: Principal dinámica */}
                        <div
                            className="hero_fondo_derecha"
                            style={{
                                position: 'absolute',
                                top: '-5%',
                                right: '-5%',
                                width: '100%',
                                height: '110%',
                                backgroundColor: '#FF0000',
                                transform: `translateX(${(heroImageIndex % 2 - 0.5) * 40}px) rotate(${(heroImageIndex % 3 - 1) * 3}deg)`,
                                borderRadius: heroImageIndex % 2 === 0 ? '40px 0 0 100px' : '100px 0 0 40px',
                                transition: 'all 2.0s cubic-bezier(0.4, 0, 0.2, 1)',
                                zIndex: 0
                            }}
                        ></div>

                        {/* CUADROS VACÍOS INTERACTIVOS (Wireframes) */}
                        <div
                            className="cuadro_vacio_decorativo_1"
                            style={{
                                position: 'absolute',
                                top: '-20px',
                                left: '-20px',
                                width: '100%',
                                height: '100%',
                                border: '8px solid white',
                                borderRadius: heroImageIndex % 2 === 0 ? '100px 0 100px 0' : '0 100px 0 100px',
                                transform: `translate(${heroImageIndex * 15}px, ${heroImageIndex * -10}px) rotate(${heroImageIndex * 2}deg)`,
                                transition: 'all 2.5s ease-out',
                                zIndex: 2,
                                pointerEvents: 'none',
                                opacity: 0.6
                            }}
                        ></div>

                        <div
                            className="cuadro_vacio_decorativo_2"
                            style={{
                                position: 'absolute',
                                bottom: '-30px',
                                right: '-30px',
                                width: '80%',
                                height: '80%',
                                border: '8px solid rgba(255,255,255,0.4)',
                                borderRadius: '50px',
                                transform: `translate(${heroImageIndex * -20}px, ${heroImageIndex * 20}px) rotate(${heroImageIndex * -5}deg)`,
                                transition: 'all 3s ease-in-out',
                                zIndex: 2,
                                pointerEvents: 'none',
                                opacity: 0.4
                            }}
                        ></div>

                        {heroImages.map((src, idx) => (
                            <div
                                key={idx}
                                className="imagen_ejemplo"
                                style={{
                                    backgroundImage: `url(${src})`,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '40px 10px 40px 10px',
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