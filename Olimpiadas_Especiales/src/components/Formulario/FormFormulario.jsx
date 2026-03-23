import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import SelectorDeRol from './SelectorDeRol'
import FormAtleta from './FormAtleta'
import FormEntrenador from './FormEntrenador'
import FormTutor from './FormTutor'
import FormVoluntario from './FormVoluntario'

function FormFormulario() {
  const [rol, setRol] = useState(null)
  const [searchParams] = useSearchParams()

  // Si viene con ?rol=X en la URL, saltar directo al formulario
  useEffect(() => {
    const rolParam = searchParams.get('rol')
    if (rolParam) setRol(rolParam)
  }, [searchParams])


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