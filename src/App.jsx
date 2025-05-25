import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Faqs from './pages/faqs';
import PromotionsBanner from './components/PromotionsBanner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import AvisoPrivacidad from './components/AvisoPrivacidad';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={
                <>
                  <Home />
                  <PromotionsBanner />
                  <Testimonials />
                  <Faqs />
                </>
              } />
              <Route path="/products" element={<Products />} />
              <Route path="/custom-cake" element={<CustomCake />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
            </Routes>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
