import React from 'react'

const roles = [
    { id: 'atleta', nombre: 'Atleta', icono: '🏃‍♂️' },
    { id: 'entrenador', nombre: 'Entrenador', icono: '📋' },
    { id: 'tutor', nombre: 'Tutor', icono: '👪' },
    { id: 'voluntario', nombre: 'Voluntario', icono: '🤝' },
  ];

function SelectorDeRol({alElegir}) {
  return (
    <div>
        <h2>¿Quién se registra hoy?</h2>
        <div className="botonesDeRol">
            {roles.map((rol) => (
                <button
                    key={rol.id}
                    onClick={() => alElegir(rol.id)}
                    className="botonRol"
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