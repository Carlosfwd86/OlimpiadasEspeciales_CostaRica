import React from 'react';
import Navbar from '../components/Navbar';
import Register from '../components/Register';
import Footer from '../components/Footer';

const RegisterPage: React.FC = () => {
  return (
    <div className="register-page">
      <header>
        <Navbar />
      </header>
      <main>
        <Register />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default RegisterPage;
