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

const Home = () => {
  const { tokens } = useTheme();

  return (
    <div className="home">
      <View>
        {/* Hero Section */}
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          className="hero-section"
        >
          <Heading level={1} className="hero-title">
            Bienvenido a Maitademi
          </Heading>
          <Text className="hero-subtitle">
            Endulzamos tus momentos más especiales con pasteles y postres únicos.
          </Text>
          <Button className="hero-button">
            <Link to="/custom-cake">Personaliza tu Pastel</Link>
          </Button>
        </Flex>

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

        {/* Gallery Section */}
        <section className="gallery-section">
          <Heading level={2} className="gallery-title">
            Nuestras Creaciones
          </Heading>
          <div className="gallery">
            <img src="/images/cake1.jpg" alt="Pastel 1" />
            <img src="/images/cake2.jpg" alt="Pastel 2" />
            <img src="/images/cake3.jpg" alt="Pastel 3" />
          </div>
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
