/* --- ENRUTADOR PRINCIPAL DEL PROYECTO --- */
import React from 'react';
/* Importamos solo lo necesario, sin repetir */
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePages from '../pages/HomePages';
import FormularioPages from '../pages/FormularioPages';
import NosotrosPages from '../pages/NosotrosPages';
import EventosPages from '../pages/EventosPages';
import VoluntariosPages from '../pages/VoluntariosPages';
import ContactoPages from '../pages/ContactoPages';
import EntrenadoresPage from '../pages/EntrenadoresPage';
import LoginPage from '../pages/LoginPage';
import PanelAdministrativo from '../components/Admin Dashboard/Panel-Administrativo';


const Routing = () => {
    return (
        <Routes>
            {/* Ruta principal que carga la página de inicio */}
            <Route path="/" element={<HomePages />} />
            <Route path="/entrenadores" element={<EntrenadoresPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Ruta para el Panel Administrativo */}
            <Route path="/admin" element={<PanelAdministrativo />} />

            {/* Ruta del formulario */}
            <Route path="/formulario" element={<FormularioPages />} />

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