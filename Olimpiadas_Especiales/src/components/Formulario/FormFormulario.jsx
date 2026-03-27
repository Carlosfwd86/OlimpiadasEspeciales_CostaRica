import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import SelectorDeRol from './SelectorDeRol'
import FormAtleta from './FormAtleta'
import FormEntrenador from './FormEntrenador'
import FormTutor from './FormTutor'
import FormVoluntario from './FormVoluntario'
import Swal from 'sweetalert2'

function FormFormulario() {
  const [rol, setRol] = useState(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Si viene con ?rol=X en la URL, saltar directo al formulario
  useEffect(() => {
    const rolParam = searchParams.get('rol')
    if (rolParam) setRol(rolParam)
  }, [searchParams])

  const manejarVerRequisitos = () => {
    Swal.fire({
      title: '<h4 style="color: #FF0000; font-weight: 900; margin: 0; letter-spacing: -1px;">REQUISITOS DE INSCRIPCIÓN</h4>',
      html: `
        <div style="text-align: left; padding: 20px; font-family: 'Inter', sans-serif;">
            <p style="color: #4a5568; margin-bottom: 25px; line-height: 1.5;">Para garantizar un proceso exitoso, asegúrese de cumplir con los siguientes puntos:</p>
            <div style="display: flex; flex-direction: column; gap: 18px;">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="background: #FFF5F5; color: #FF0000; min-width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">1</div>
                    <div><strong style="color: #1a1a1a;">Identificación Oficial:</strong> Cédula de identidad, DIMEX o partida de nacimiento.</div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="background: #FFF5F5; color: #FF0000; min-width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">2</div>
                    <div><strong style="color: #1a1a1a;">Edad Mínima:</strong> Atletas a partir de los 8 años de edad.</div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="background: #FFF5F5; color: #FF0000; min-width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">3</div>
                    <div><strong style="color: #1a1a1a;">Certificación Médica:</strong> Diagnóstico formal de discapacidad intelectual.</div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="background: #FFF5F5; color: #FF0000; min-width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">4</div>
                    <div><strong style="color: #1a1a1a;">Historial de Salud:</strong> Información sobre alergias o medicación actual.</div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="background: #FFF5F5; color: #FF0000; min-width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">5</div>
                    <div><strong style="color: #1a1a1a;">Fotografía:</strong> Imagen del rostro tipo carné, clara y reciente.</div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="background: #FFF5F5; color: #FF0000; min-width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">6</div>
                    <div><strong style="color: #1a1a1a;">Representación Legal:</strong> Firma de padre o tutor para menores de 18 años.</div>
                </div>
            </div>
            <div style="margin-top: 30px; padding: 15px; background: #F8F9FA; border-radius: 12px; border-left: 4px solid #FF0000;">
                <p style="margin: 0; font-size: 0.85rem; color: #64748b;">
                    <strong>Nota:</strong> Este formulario digital le solicitará adjuntar los documentos conforme avance en el registro.
                </p>
            </div>
        </div>
      `,
      confirmButtonText: 'ENTENDIDO',
      confirmButtonColor: '#FF0000',
      width: '550px',
      padding: '1.5rem',
      borderRadius: '30px',
      showCloseButton: true
    });
  }


  return (
    <div className="pagina_formulario_layout">
      <Navbar />
      
      {/* Estilos dinámicos para las tarjetas de pasos */}
      <style>{`
        .pasos_card {
          background: #f8fafc;
          padding: 40px 30px;
          border-radius: 28px;
          text-align: center;
          border: 1px solid #f1f5f9;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: default;
        }

        .pasos_card:hover {
          background: #ffffff;
          transform: translateY(-12px);
          box-shadow: 0 25px 40px -15px rgba(255, 0, 0, 0.12);
          border-color: #ff0000;
        }

        .pasos_card .icon_box {
          width: 70px;
          height: 70px;
          background: #fff1f2;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px auto;
          transition: all 0.4s ease;
        }

        .pasos_card:hover .icon_box {
          background: #ff0000;
          transform: rotate(10deg) scale(1.1);
          box-shadow: 0 10px 15px rgba(255, 0, 0, 0.2);
        }

        .pasos_card:hover .icon_box svg path {
          stroke: #ffffff;
        }

        .pasos_card h3 {
          transition: color 0.3s ease;
        }

        .pasos_card:hover h3 {
          color: #ff0000 !important;
        }

        .boton_regresar {
          position: absolute;
          top: 30px;
          left: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 22px;
          background: #ffffff;
          border: 1px solid #ff0000;
          border-radius: 12px;
          color: #ff0000;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .boton_regresar:hover {
          background: #f8fafc;
          color: #1e293b;
          border-color: #1e293b;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transform: translateX(-5px);
        }

        .boton_regresar svg {
          transition: transform 0.3s ease;
          stroke: #ff0000;
        }

        .boton_regresar:hover svg {
          transform: translateX(-3px);
          stroke: #1e293b;
        }
      `}</style>

      {/* Banner de Título de la Plataforma */}
      <div className="banner_plataforma_registro" style={{
        position: 'relative',
        backgroundColor: '#ffffff',
        padding: '100px 20px 80px 20px',
        textAlign: 'center',
        borderBottom: '1px solid #f1f5f9',
        fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif"
      }}>
        <button className="boton_regresar" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Regresar
        </button>
        <h1 style={{
          fontSize: '3.8rem',
          fontWeight: '950',
          color: '#0f172a',
          margin: 0,
          letterSpacing: '-3px',
          lineHeight: '0.95',
          textTransform: 'uppercase'
        }}>
          Plataforma de <br />
          <span style={{color: '#FF0000'}}>Inscripción Oficial</span>
        </h1>
        <p style={{
          color: '#64748b',
          marginTop: '25px',
          fontSize: '1.25rem',
          maxWidth: '700px',
          margin: '25px auto 0',
          lineHeight: '1.8',
          fontWeight: '500'
        }}>
          Inicie su camino hacia la inclusión deportiva. Registre la información del atleta de forma segura y sencilla.
        </p>

        {/* Botones de Acción Estilo Referencia */}
        <div className="form_header_buttons" style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginTop: '40px'
        }}>
            <button 
                className="boton_blanco"
                onClick={manejarVerRequisitos}
                style={{
                    padding: '16px 35px',
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0'
                }}
            >
                Ver Requisitos
            </button>
        </div>

        {/* Sección Interactiva: Pasos para el registro */}
        <div className="pasos_registro_seccion" style={{
            marginTop: '80px',
            textAlign: 'center',
            paddingBottom: '40px'
        }}>
            <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                color: '#0f172a',
                marginBottom: '15px'
            }}>Pasos para el registro</h2>
            <p style={{
                color: '#64748b',
                fontSize: '1.15rem',
                maxWidth: '750px',
                margin: '0 auto 60px auto',
                lineHeight: '1.8'
            }}>
                Sigue estos sencillos pasos para completar la inscripción de los deportistas de manera segura y eficiente.
            </p>

            <div className="pasos_cards_container" style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Paso 1 */}
                <div className="pasos_card">
                    <div className="icon_box">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19 8V14M16 11H22" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '15px' }}>Crea una cuenta</h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        Regístrate como tutor o entrenador autorizado para gestionar los perfiles de los atletas.
                    </p>
                </div>

                {/* Paso 2 */}
                <div className="pasos_card">
                    <div className="icon_box">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 4H19C19.5304 4 20.0391 4.21071 20.4142 4.58579C20.7893 4.96086 21 5.46957 21 6V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H8" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 12H15M9 16H15" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '15px' }}>Ingresa los datos</h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        Completa cuidadosamente el perfil médico y deportivo del atleta para garantizar su seguridad.
                    </p>
                </div>

                {/* Paso 3 */}
                <div className="pasos_card">
                    <div className="icon_box">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 16V10M12 10L9 13M12 10L15 13M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '15px' }}>Sube documentos</h3>
                    <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.75' }}>
                        Adjunta los requisitos legales, consentimientos y fichas médicas necesarias digitalmente.
                    </p>
                </div>
            </div>

            {/* Nuevo botón Crear Cuenta debajo de las tarjetas */}
            <div style={{ marginTop: '60px' }}>
                <button 
                    className="boton_rojo" 
                    onClick={() => navigate('/registro')}
                    style={{
                        padding: '20px 60px',
                        fontSize: '1.3rem',
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        borderRadius: '20px',
                        boxShadow: '0 15px 30px rgba(255, 0, 0, 0.25)',
                        margin: '0 auto'
                    }}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 8V14M16 11H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    CREAR CUENTA
                </button>
            </div>
        </div>
      </div>

      <div id="form-inicio">
        {!rol && <SelectorDeRol alElegir={setRol} />}
        {rol === 'atleta' && <FormAtleta onVolver={() => setRol(null)} />}
        {rol === 'entrenador' && <FormEntrenador onVolver={() => setRol(null)} />}
        {rol === 'tutor' && <FormTutor onVolver={() => setRol(null)} />}
        {rol === 'voluntario' && <FormVoluntario onVolver={() => setRol(null)} />}
      </div>
      <Footer />
    </div>
  );
}

export default FormFormulario;