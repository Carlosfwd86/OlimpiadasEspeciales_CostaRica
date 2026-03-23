import React from 'react';
import Navbar from '../components/Navbar';
import Entrenadores from '../components/Entrenadores';
import Footer from '../components/Footer';

function EntrenadoresPage() {
  return (
    <div className="pagina-entrenadores-completa">
      <header>
        <Navbar />
      </header>

      <main>
        <Entrenadores />
      </main>

      <Footer />
    </div>
  );
}

export default EntrenadoresPage;