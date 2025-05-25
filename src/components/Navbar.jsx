import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/products', label: 'Pasteles', icon: '🎂' },
    { path: '/custom-cake', label: 'Personalizar', icon: '✨' },
    { path: '/contact', label: 'Contacto', icon: '📞' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav 
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="navbar-container">
          <Link to="/" className="logo-container">
            <motion.div
              className="logo-wrapper"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="https://res.cloudinary.com/ddi0sl10o/image/upload/v1748210121/Gemini_Generated_Image_y4i2any4i2any4i2_aeyc9u.png"
                alt="Maitademi Logo"
                className="navbar-logo"
                style={{ height: "65px", width: "auto", borderRadius: "8px" }}
              />
            </motion.div>
          </Link>

          <div className="nav-links-desktop">
            {navLinks.map(({ path, label, icon }) => (
              <motion.div
                key={path}
                className="nav-link-wrapper"
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to={path}
                  className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                  aria-current={location.pathname === path ? "page" : undefined}
                >
                  <span className="nav-link-icon">{icon}</span>
                  <span className="nav-link-text">{label}</span>
                  {location.pathname === path && (
                    <motion.div 
                      className="underline"
                      layoutId="underline"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.button 
            className="order-button"
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(255, 105, 180, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/custom-cake">
              <span className="button-icon">🎨</span>
              <span className="button-text">Diseña tu Pastel</span>
            </Link>
          </motion.button>

          <motion.button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            role="dialog"
            aria-labelledby="mobile-menu-title"
            aria-hidden={!isMenuOpen}
          >
            <h2 id="mobile-menu-title" className="sr-only">Menú de navegación móvil</h2>
            <div className="mobile-menu-content">
              {navLinks.map(({ path, label, icon }) => (
                <motion.div
                  key={path}
                  whileHover={{ x: 10, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to={path}
                    className="mobile-nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">{icon}</span>
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
