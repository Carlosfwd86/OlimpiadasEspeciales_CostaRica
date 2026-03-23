import React from 'react'
import Navbar from '../Shared/Navbar'
import Footer from '../Shared/Footer'
import SelectorDeRol from './SelectorDeRol'
import FormAtleta from './FormAtleta'
import FormEntrenador from './FormEntrenador'
import FormTutor from './FormTutor'
import FormVoluntario from './FormVoluntario'
import { useState } from 'react'

function FormFormulario() {

  const [rol, setRol] = useState(null)


  return (
    <div>
      <Navbar />
      {!rol && <SelectorDeRol alElegir={setRol} />}
      {rol === 'atleta' && <FormAtleta onVolver={() => setRol(null)} />}
      {rol === 'entrenador' && <FormEntrenador onVolver={() => setRol(null)} />}
      {rol === 'tutor' && <FormTutor onVolver={() => setRol(null)} />}
      {rol === 'voluntario' && <FormVoluntario onVolver={() => setRol(null)} />}
      <Footer />
    </div>
  )
}

export default FormFormulario