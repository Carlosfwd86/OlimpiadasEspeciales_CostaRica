import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/Contacto.css';
import { s3Url } from '../utils/s3';

// ─── EMAILJS CREDENTIALS ───────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
// ──────────────────────────────────────────────────────────────────────────────

const ASUNTOS = ['SALUDO', 'VOLUNTARIADO', 'PATROCINIO', 'OTROS'];

interface ContactFormState {
  user_name: string;
  user_email: string;
  user_subject: string;
  message: string;
}

const initialForm: ContactFormState = {
  user_name:    '',
  user_email:   '',
  user_subject: '',
  message:      '',
};

const Contacto = (): React.JSX.Element => {
  const formRef               = useRef<HTMLFormElement>(null);
  const [form, setForm]       = useState<ContactFormState>(initialForm);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError]     = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { user_name, user_email, user_subject, message } = form;

    if (!user_name || !user_email || !user_subject || !message) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');

    const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';
    try {
      const response = await fetch(`${BACKEND_URL}/consultas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: user_name,
          correo: user_email,
          asunto: user_subject,
          mensaje: message,
        }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error('Error del servidor:', responseData);
        const details = responseData.details?.[0];
        const msg = details
          ? (Object.values(details)[0] as string)
          : (responseData.message || responseData.error || 'Error al procesar la consulta.');
        setError(msg);
        setLoading(false);
        return;
      }

    } catch (dbErr) {
      console.error('Error al conectar con la BD:', dbErr);
      setError('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
      setLoading(false);
      return;
    }

    // ── 2. EmailJS (solo si las credenciales son reales) ───────
    // ... rest of the logic
    const credencialesReales =
      EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID' &&
      EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
      EMAILJS_PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY';

    if (credencialesReales && formRef.current) {
      try {
        await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          formRef.current,
          EMAILJS_PUBLIC_KEY
        );
      } catch (emailErr) {
        console.error('Error al enviar email:', emailErr);
        // Aquí no bloqueamos el flujo porque ya se guardó en BD
      }
    }

    setForm(initialForm);
    setSuccess(true);
    setLoading(false);
    setTimeout(() => setSuccess(false), 6000);
  };

  return (
    <div className="contenedor_contacto_principal">

      {/* ── HERO BANNER con título ─────────────────────────────────────── */}
      <div className="hero_consultas" style={{ backgroundImage: `url(${s3Url('img/fotocontacto.jpg')})` }}>
        <div className="overlay_hero_consultas"></div>
        <h1 className="titulo_hero_consultas">CONTÁCTANOS</h1>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SECCIÓN 1: TARJETAS DE CONTACTO (arriba)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="contenedor_tarjetas_contacto">

        {/* Tarjeta Teléfono */}
        <div
          className="tarjeta_contacto tarjeta_telefono"
          onClick={() => window.location.href = 'tel:22240000'}
          style={{ cursor: 'pointer' }}
        >
          <div className="circulo_icono circulo_telefono">
            <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <h3>Teléfono</h3>
          <p>+506 2224 0000</p>
        </div>

        {/* Tarjeta Email */}
        <div
          className="tarjeta_contacto tarjeta_email"
          onClick={() => window.location.href = 'mailto:info@olimpiadasespeciales.cr'}
          style={{ cursor: 'pointer' }}
        >
          <div className="circulo_icono circulo_email">
            <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h3>Email</h3>
          <p>info@olimpiadasespeciales.cr</p>
        </div>

        {/* Tarjeta Redes Sociales */}
        <div className="tarjeta_contacto tarjeta_redes">
          <div className="circulo_icono circulo_redes">
            <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <h3>Redes Sociales</h3>
          <ul className="lista_redes">
            <li className="red_item red_facebook" onClick={() => window.open('https://www.facebook.com/OlimpiadasEspecialesCR', '_blank')} style={{ cursor: 'pointer' }}>
              <span className="icono_mini_red icono_facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/>
                </svg>
              </span>
              Facebook
            </li>
            <li className="red_item red_instagram" onClick={() => window.open('http://www.instagram.com/oe_cr', '_blank')} style={{ cursor: 'pointer' }}>
              <span className="icono_mini_red icono_instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </span>
              Instagram
            </li>
            <li className="red_item red_x" onClick={() => window.open('https://x.com/Olimpiadas_CR', '_blank')} style={{ cursor: 'pointer' }}>
              <span className="icono_mini_red icono_x">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </span>
              X
            </li>
          </ul>
        </div>

      </div>
      {/* ── FIN TARJETAS ──────────────────────────────────────────────── */}

      {/* ══════════════════════════════════════════════════════════════════
          SECCIÓN 2: FORMULARIO + MAPA (abajo)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="cuerpo_consultas">

        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="col_formulario_consultas">
          <h2 className="subtitulo_formulario">Envíanos tu consulta</h2>

          {success && (
            <div className="alerta_exito" role="alert">
              ¡Consulta enviada con éxito! Nos pondremos en contacto contigo pronto.
            </div>
          )}
          {error && (
            <div className="alerta_error" role="alert">
              ⚠️ {error}
            </div>
          )}

          <form
            id="formulario_consultas_asuntos"
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Nombre y Apellidos */}
            <div className="grupo_campo">
              <label htmlFor="user_name" className="etiqueta_campo">NOMBRE Y APELLIDOS</label>
              <input
                id="user_name"
                type="text"
                name="user_name"
                className="campo_texto"
                placeholder="Ingrese su nombre completo"
                value={form.user_name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            {/* E-mail */}
            <div className="grupo_campo">
              <label htmlFor="user_email" className="etiqueta_campo">E-MAIL</label>
              <input
                id="user_email"
                type="email"
                name="user_email"
                className="campo_texto"
                placeholder="ejemplo@correo.com"
                value={form.user_email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            {/* Asunto */}
            <div className="grupo_campo">
              <label htmlFor="user_subject" className="etiqueta_campo">ASUNTO</label>
              <div className="wrapper_select_asunto">
                <select
                  id="user_subject"
                  name="user_subject"
                  className="campo_select_asunto"
                  value={form.user_subject}
                  onChange={handleChange}
                >
                  <option value="">ASUNTO</option>
                  {ASUNTOS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <div className="flecha_select_asunto" aria-hidden="true">
                  <svg viewBox="0 0 10 6" width="14" height="14" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Mensaje */}
            <div className="grupo_campo">
              <label htmlFor="message" className="etiqueta_campo">MENSAJE</label>
              <textarea
                id="message"
                name="message"
                className="campo_texto campo_textarea"
                placeholder="Escribe tu mensaje aquí..."
                rows={6}
                value={form.message}
                onChange={handleChange}
              />
            </div>

            {/* Botón ENVIAR */}
            <div className="contenedor_boton_enviar">
              <button
                type="submit"
                id="btn_enviar_consulta"
                className="boton_enviar_consulta"
                disabled={loading}
              >
                {loading ? 'ENVIANDO...' : 'ENVIAR'}
              </button>
            </div>
          </form>
        </div>

        {/* COLUMNA DERECHA: MAPA */}
        <div className="col_mapa_consultas">
          <h2 className="subtitulo_mapa">Sede Central — Zapote</h2>
          <p className="direccion_mapa">
            125 metros sur del Centro Evangelístico,<br />
            Urbanización Montealegre, Zapote,<br />
            San José, Costa Rica
          </p>
          <div className="wrapper_mapa">
            <iframe
              title="Sede Central Olimpiadas Especiales Costa Rica"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.109220926242!2d-84.0630661!3d9.924861099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0e30c032a498d%3A0xc00cd73156236265!2sOlimpiadas%20Especiales%20Costa%20Rica!5e0!3m2!1ses-419!2scr!4v1774558600505!5m2!1ses-419!2scr"
            />
          </div>
          <a
            href="https://www.google.com/maps/place/Olimpiadas+Especiales+Costa+Rica/@9.9248611,-84.0630661,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="btn_abrir_mapa"
          >
            📍 Abrir en Google Maps
          </a>
        </div>

      </div>
      {/* ── FIN FORMULARIO + MAPA ─────────────────────────────────────── */}

    </div>
  );
};

export default Contacto;
