import React from 'react'
import "../../styles/Formulario/SelectorRoles.css"

const roles = [
    { id: 'atleta', nombre: 'Atleta', icono: '🏃‍♂️' },
    { id: 'entrenador', nombre: 'Entrenador', icono: '📋' },
    { id: 'tutor', nombre: 'Tutor', icono: '👪' },
    { id: 'voluntario', nombre: 'Voluntario', icono: '🤝' },
  ];

function SelectorDeRol({alElegir}) {
  return (
    <div className="selector-container">
        <h2 className="selector-title">¿Quién se registra hoy?</h2>
        <div className="botonesDeRol">
            {roles.map((rol) => (
                <button
                    key={rol.id}
                    onClick={() => alElegir(rol.id)}
                    className="botonRol"
                    data-role={rol.id}
                >
                    <span className="iconoRol">{rol.icono}</span>
                    <span className="nombreRol">{rol.nombre}</span>
                </button>
            ))}
        </div>
    </div>
  )
}

export default SelectorDeRol