import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import CustomCake from './pages/CustomCake';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import { theme } from './theme';
import './App.css';
import Testimonials from './components/Testimonials';
import Faqs from './pages/Faqs';
import PromotionsBanner from './components/PromotionsBanner';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<>
              <Home />
              <PromotionsBanner />
              <Testimonials />
              <Faqs />
            </>} />
            <Route path="/products" element={<Products />} />
            <Route path="/custom-cake" element={<CustomCake />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
