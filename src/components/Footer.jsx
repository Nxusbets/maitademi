import React, { useState } from 'react';
import './Footer.css';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import AdminLogin from './AdminLogin';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Maitademi</h4>
          <p>Endulzando tus momentos especiales</p>
          <Link to="/aviso-privacidad" className="privacy-link">Aviso de Privacidad</Link>
        </div>
        <div className="footer-section">
          <h4>Contacto</h4>
          <div className="social-links">
            <a href="tel:3316921606" target="_blank" aria-label="Teléfono">
              <FaPhoneAlt />
            </a>
            <a href="mailto:info@maitademi.com" target="_blank" aria-label="Correo">
              <FaEnvelope />
            </a>
          </div>
        </div>
        <div className="footer-section">
          <h4>Síguenos</h4>
          <div className="social-links">
            <a href="https://www.instagram.com/maitademi" target="_blank" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/Maitademii" target="_blank" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://wa.me/3316921606" target="_blank" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2025 Maitademi. Todos los derechos reservados. Creado por <a href="https://portfolio1-beta-livid.vercel.app/" target="_blank" rel="noopener noreferrer">NxuS</a>.
           Tu proyecto puede ser realidad con él.</p>
          
          <div className="admin-access">
            {isAuthenticated ? (
              <div className="admin-logged">
                <span className="admin-status">Admin: {user?.username}</span>
                <a href="/admin/dashboard" className="dashboard-link">Dashboard</a>
                <button onClick={logout} className="admin-logout">Salir</button>
              </div>
            ) : (
              <button 
                className="admin-access-btn"
                onClick={() => setShowAdminLogin(true)}
                title="Acceso administrativo"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </div>

      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
    </footer>
  );
};

export default Footer;
