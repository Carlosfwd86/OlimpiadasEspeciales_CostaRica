/* --- ENRUTADOR PRINCIPAL DEL PROYECTO --- */
import React from 'react';
/* Importamos solo lo necesario, sin repetir */
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePages from '../pages/HomePages';

const Routing = () => {
    return (
        <Routes>
            {/* Ruta principal que carga la página de inicio */}
            <Route path="/" element={<HomePages />} />

            {/* Redirección por defecto: si el usuario pone cualquier otra cosa, lo manda al inicio */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default Routing;