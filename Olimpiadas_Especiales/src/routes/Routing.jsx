/* --- ENRUTADOR PRINCIPAL DEL PROYECTO --- */
import React from 'react';
/* Importamos solo lo necesario, sin repetir */
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePages from '../pages/HomePages';
import NosotrosPages from '../pages/NosotrosPages';
import EventosPages from '../pages/EventosPages';
import VoluntariosPages from '../pages/VoluntariosPages';
import ContactoPages from '../pages/ContactoPages';

const Routing = () => {
    return (
        <Routes>
            {/* Ruta principal que carga la página de inicio */}
            <Route path="/" element={<HomePages />} />
            

            {/* Redirección por defecto: si el usuario pone cualquier otra cosa, lo manda al inicio */}
            <Route path="*" element={<Navigate to="/" />} />

            {/* rutas de navbar */}
            <Route path="/nosotros" element={<NosotrosPages />} />
            <Route path="/eventos" element={<EventosPages />} />
            <Route path="/voluntarios" element={<VoluntariosPages />} />
            <Route path="/contacto" element={<ContactoPages />} />
        </Routes>
    );
};

export default Routing;