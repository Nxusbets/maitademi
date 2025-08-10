import {
  View,
  Heading,
  Text,
  Button,
  Flex,
  useTheme
} from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import { FaStar, FaPalette, FaHandsHelping } from 'react-icons/fa';
import './Home.css';
import { motion } from 'framer-motion';
import React from 'react';
import Welcome from '../components/Welcome';
import HomePromotions from '../components/HomePromotions'; // <-- Agrega esta línea
import { useFirebaseData } from '../hooks/useFirebaseData';

const Home = () => {
  const { tokens } = useTheme();
  const { data } = useFirebaseData(); // <-- Usa el hook para obtener creaciones

  return (
    <div className="home">
      <Welcome />
      <View>
        {/* Hero Section */}
    

        {/* Features Section */}
        <section className="features-section">
          <Heading level={2} className="features-title">
            ¿Por qué elegirnos?
          </Heading>
          <Flex className="features-container">
            <div className="feature-card">
              <FaStar className="feature-icon" />
              <Heading level={3} className="feature-heading">Calidad Premium</Heading>
              <Text className="feature-description">
                Utilizamos los mejores ingredientes para garantizar un sabor excepcional.
              </Text>
            </div>
            <div className="feature-card">
              <FaPalette className="feature-icon" />
              <Heading level={3} className="feature-heading">Diseños Únicos</Heading>
              <Text className="feature-description">
                Creamos pasteles personalizados que reflejan tu estilo y ocasión.
              </Text>
            </div>
            <div className="feature-card">
              <FaHandsHelping className="feature-icon" />
              <Heading level={3} className="feature-heading">Atención al Cliente</Heading>
              <Text className="feature-description">
                Nuestro equipo está dedicado a hacer realidad tus ideas.
              </Text>
            </div>
          </Flex>
        </section>

        {/* Promociones Section */}
        <section className="promotions-section">
          <HomePromotions />
        </section>

        {/* Gallery Section */}
        <section className="gallery-section">
          <motion.h2
            className="gallery-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Nuestras Creaciones
          </motion.h2>
          <motion.div
            className="gallery"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
            }}
          >
            {(data.creations && data.creations.length > 0
              ? data.creations
              : [
                  { image: "https://res.cloudinary.com/ddi0sl10o/image/upload/v1748116064/1000074648_hfm3wl.jpg", title: "Pastel 1" },
                  { image: "https://res.cloudinary.com/ddi0sl10o/image/upload/v1748116064/1000074654_orzqu7.jpg", title: "Pastel 2" },
                  { image: "https://res.cloudinary.com/ddi0sl10o/image/upload/v1748116064/1000075448_hu6074.jpg", title: "Pastel 3" }
                ]
            ).map((creation, index) => (
              <motion.img
                key={index}
                src={creation.image}
                alt={creation.title || `Pastel ${index + 1}`}
                className="gallery-image"
                whileHover={{ scale: 1.1, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              />
            ))}
          </motion.div>
        </section>

        {/* Call to Action */}
        <Flex
          direction="column"
          alignItems="center"
          className="cta-section"
        >
          <Heading level={2} className="cta-title">
            ¿Listo para diseñar tu pastel perfecto?
          </Heading>
          <Button className="cta-button">
            <Link to="/custom-cake">Comienza Ahora</Link>
          </Button>
        </Flex>
      </View>
    </div>
  );
};

export default Home;
