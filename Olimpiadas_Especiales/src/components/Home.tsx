import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { ServicesAtletas } from '../services/ServicesAtletas';
import BannerVoluntarios from './BannerVoluntarios';
import { s3Url } from '../utils/s3';
import apiClient from '../api/apiClient';
import type { Atleta, Tutor, Entrenador, Voluntario, Competicion } from '../types';


interface CountsState {
    atletas: number;
    tutores: number;
    entrenadores: number;
    voluntarios: number;
    competiciones: number;
    porSexo: { masc: number; fem: number };
    porEdad: { jovenes: number; adultos: number; ninos: number };
}

const Home = (): React.JSX.Element => {

    /* --- Funciones de Acción --- */
    const navegar = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    /* ── Animated lines canvas ── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let raf: number;
        let w: number, h: number;

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

    const manejarUnete = () => navegar('/plataforma-registro');
    const manejarConoceMas = () => navegar('/nosotros');

    const [counts, setCounts] = useState<CountsState>({
        atletas: 0,
        tutores: 0,
        entrenadores: 0,
        voluntarios: 0,
        competiciones: 0,
        porSexo: { masc: 0, fem: 0 },
        porEdad: { jovenes: 0, adultos: 0, ninos: 0 }
    });

    const [heroImageIndex, setHeroImageIndex] = useState(0);
    const [usuarioSesion, setUsuarioSesion] = useState<Record<string, unknown> | null>(null);
    const heroImages = [
        s3Url('img/Hero_contenedor_01.jpeg'),
        s3Url('img/Hero_contenedor_02.jpeg'),
        s3Url('img/Hero_contenedor_03.jpeg'),
        s3Url('img/Hero_contenedor_04.jpeg')
    ];

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [statsRes, compsRes] = await Promise.all([
                    apiClient.get('/stats/public').then(r => r.data).catch(() => null),
                    apiClient.get('/competiciones').then(r => r.data).catch(() => null)
                ]);

                if (statsRes?.data) {
                    const stats = statsRes.data;
                    setCounts({
                        atletas: stats.atletasActivos?.valor || 0,
                        tutores: stats.tutores?.valor || 0,
                        entrenadores: 0,
                        voluntarios: stats.voluntarios?.valor || 0,
                        competiciones: compsRes?.data?.length || compsRes?.length || 0,
                        porSexo: { masc: 0, fem: 0 },
                        porEdad: { jovenes: 0, adultos: 0, ninos: 0 }
                    });
                } else {
                     setCounts(prev => ({ ...prev, competiciones: compsRes?.data?.length || compsRes?.length || 0 }));
                }

            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };
        fetchCounts();

        // Image rotation timer
        const timer = setInterval(() => {
            setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 3000);

        // Leer sesión
        const sesion = localStorage.getItem('usuarioSesion');
        if (sesion) setUsuarioSesion(JSON.parse(sesion));

        return () => clearInterval(timer);
    }, []);

    const [isBannerHovered, setIsBannerHovered] = useState(false);

    return (
        <>
            {/* Banner CTA Flotante - Arriba del Hero (Ahora con Video) */}
            <section style={{
                position: 'relative',
                minHeight: '600px',
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: '30px 5%'
            }}>
                {/* Video de Fondo */}
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
                    <source src={s3Url('img/videoHome.mp4')} type="video/mp4" />
                </video>

                {/* Overlay oscuro sutil para todo el video */}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1 }} />

                {/* Tarjeta de Contenido Estilo Referencia - Solo si no hay sesión */}
                {!usuarioSesion && (
                    <div 
                        style={{
                            position: 'relative',
                            zIndex: 2,
                            maxWidth: '380px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        onMouseEnter={() => setIsBannerHovered(true)}
                        onMouseLeave={() => setIsBannerHovered(false)}
                    >
                        {/* Parte Superior: Caja Roja con Título */}
                        <div 
                            className="caja-roja-titilante"
                            style={{
                                backgroundColor: '#FF0000',
                                padding: '15px 30px',
                                boxShadow: '0 8px 25px rgba(255,0,0,0.4)',
                                width: 'fit-content',
                                marginBottom: '5px',
                                cursor: 'pointer',
                                borderRadius: '16px',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            <h2 style={{
                                color: '#ffffff',
                                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                                fontWeight: '1000',
                                margin: 0,
                                lineHeight: '1.1',
                                textTransform: 'none',
                                textShadow: '0 4px 10px rgba(0,0,0,0.5)'
                            }}>
                                ¿Primera vez aquí?
                            </h2>
                            {/* Imagen de Puntero (Cargada desde public/img/hand-pointer.png) */}
                            <img 
                                src={s3Url('img/hand-pointer.png')}
                                alt="Click indicator" 
                                className="icono-click-titilante"
                                style={{
                                    width: '35px',
                                    height: '35px',
                                    objectFit: 'contain',
                                    filter: 'brightness(0) invert(1)' // La hace blanca
                                }}
                            />
                        </div>

                        {/* Parte Inferior: Caja Gris Traslúcida con Descripción y Botones */}
                        <div style={{
                            backgroundColor: 'rgba(45, 45, 45, 0.7)',
                            backdropFilter: 'blur(8px)',
                            padding: '25px',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                            opacity: isBannerHovered ? 1 : 0,
                            visibility: isBannerHovered ? 'visible' : 'hidden',
                            transform: isBannerHovered ? 'translateY(0)' : 'translateY(-10px)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            pointerEvents: isBannerHovered ? 'auto' : 'none',
                            borderRadius: '16px', // Redondeado uniforme
                            marginTop: '5px'
                        }}>
                            <p style={{
                                color: '#ffffff',
                                fontSize: '1rem',
                                lineHeight: '1.5',
                                fontWeight: '700',
                                margin: '0 0 20px'
                            }}>
                                Cada día reafirmamos nuestro compromiso con la inclusión, el respeto y la igualdad de oportunidades a través del deporte.
                            </p>

                            <div className="hero_botones">
                                <button className="boton_rojo" onClick={() => navegar('/registro')}>
                                    Registrarme Ahora <span className="flecha_boton">&gt;</span>
                                </button>
                                <button className="boton_blanco" onClick={() => navegar('/login')}>
                                    Iniciar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

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
                    <div className="tarjeta_info stat_card" onClick={() => navegar('/formulario?rol=atleta')}>
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
                    <div className="tarjeta_info stat_card" onClick={() => navegar('/formulario?rol=voluntario')}>
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

            <BannerVoluntarios />
        </>
    );
};

export default Home;
