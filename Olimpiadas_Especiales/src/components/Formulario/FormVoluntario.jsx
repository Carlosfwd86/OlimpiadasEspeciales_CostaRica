import React from 'react'

function FormVoluntario({ onVolver }) {
  return (
    <div className="form-voluntario-container">
      <h2 className="form-title">Inscripción de Voluntario</h2>
      {/* TODO: Implementar campos del formulario de voluntario */}
      <div className="action-buttons">
        <button className="btn-volver" onClick={onVolver}>Volver</button>
      </div>
    </div>
  )
}

export default FormVoluntario
