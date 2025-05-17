import React from 'react';
import './Footer.css';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Maitademi</h4>
          <p>Endulzando tus momentos especiales</p>
        </div>
        <div className="footer-section">
          <h4>Contacto</h4>
          <div className="social-links">
            <a href="tel:+1234567890" target="_blank" aria-label="Teléfono">
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
            <a href="#" target="_blank" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" target="_blank" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" target="_blank" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Maitademi - Desarrollado con 💖 por <a href="https://github.com/nxusbets" target="_blank">NxuS</a></p>
      </div>
    </footer>
  );
};

export default Footer;
