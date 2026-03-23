import React from 'react'

function FormEntrenador({ onVolver }) {
  return (
    <div className="form-entrenador-container">
      <h2 className="form-title">Inscripción de Entrenador</h2>
      {/* TODO: Implementar campos del formulario de entrenador */}
      <div className="action-buttons">
        <button className="btn-volver" onClick={onVolver}>Volver</button>
      </div>
    </div>
  )
}

export default FormEntrenador
