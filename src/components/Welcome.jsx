import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';
import { motion } from 'framer-motion';

const Welcome = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const scrollPosition = window.scrollY;
        const offset = scrollPosition * 0.15; // Reducido para un efecto más sutil
        imageRef.current.style.transform = `translateY(${offset}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="welcome-section">
      <div className="welcome-container">
        <div className="welcome-text-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="welcome-header"
          >
            <span className="welcome-badge">Pastelería Artesanal</span>
            <h1>Bienvenido a <span className="highlight">Maitademi</span></h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="welcome-description"
          >
            Creamos experiencias dulces a través de postres artesanales elaborados 
            con ingredientes de primera calidad. Cada bocado es una explosión de sabor 
            que hará de tus momentos especiales algo inolvidable.
          </motion.p>
          
          <motion.div 
            className="welcome-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="feature">
              <div className="feature-icon">🧁</div>
              <div className="feature-text">
                <h3>Calidad Artesanal</h3>
                <p>Recetas únicas hechas con amor</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🎂</div>
              <div className="feature-text">
                <h3>Diseño Personalizado</h3>
                <p>El postre de tus sueños hecho realidad</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="welcome-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Link to="/products" className="cta-button primary">
              Ver Productos
            </Link>
            <Link to="/custom-cake" className="cta-button secondary">
              Personaliza tu Pastel
            </Link>
          </motion.div>
        </div>
        
        <div className="welcome-image-container">
          <div className="image-decoration"></div>
          <motion.img
            ref={imageRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src="https://res.cloudinary.com/ddi0sl10o/image/upload/v1748116064/1000074679_bzgzil.jpg" 
            alt="Delicioso pastel de Maitademi"
            className="welcome-image"
          />
          <div className="floating-badge">
            <span className="badge-text">Hecho con ♥</span>
          </div>
        </div>
      </div>
      
      {/* Movido más abajo para que no sea tapado por la imagen */}
      <motion.div 
        className="welcome-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="scroll-text">Descubre más</div>
        <div className="scroll-arrow">↓</div>
      </motion.div>
    </section>
  );
};

export default Welcome;