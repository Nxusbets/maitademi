import { useEffect, useState } from 'react';
import { Flex, Card, Heading, Text, Badge, Button, View } from '@aws-amplify/ui-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import './PromotionsBanner.css';

function PromotionsBanner() {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Número de WhatsApp de la pastelería
  const phoneNumber = '523326827809';
  
  const promotions = [
    {
      title: "¡15% DE DESCUENTO EN TU PRIMER PEDIDO!",
      code: "NUEVO15",
      description: "Usa el código al solicitar tu cotización por WhatsApp",
      backgroundColor: "#FFE6F0",
      buttonText: "Pedir con descuento"
    },
    {
      title: "OFERTAS DE TEMPORADA",
      code: "PRIMAVERA25",
      description: "Pasteles temáticos de primavera con 25% de descuento",
      backgroundColor: "#F0FFFF",
      buttonText: "Ver diseños"
    },
    {
      title: "¡PROMO DEL MES!",
      code: "MAYO2025",
      description: "Cupcakes gratis en pedidos mayores a $500",
      backgroundColor: "#FFF0F5",
      buttonText: "Ordenar ahora"
    }
  ];
  
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentPromo((prev) => (prev + 1) % promotions.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isPaused, promotions.length]);
  
  const handlePromoClick = (code) => {
    const message = `Hola, me gustaría aprovechar la promoción con el código: ${code}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  const promo = promotions[currentPromo];
  
  return (
    <Card 
      variation="elevated" 
      backgroundColor={promo.backgroundColor} 
      padding="medium" 
      className="promo-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPromo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Flex direction="column" alignItems="center" textAlign="center" gap="medium">
            <Badge variation="info" size="large" className="promo-badge">PROMOCIÓN</Badge>
            <Heading level={3} className="promo-title">{promo.title}</Heading>
            <motion.div
              className="promo-code"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Text fontSize="large" fontWeight="bold">Código: {promo.code}</Text>
            </motion.div>
            <Text className="promo-description">{promo.description}</Text>
            <Button 
              variation="primary" 
              className="promo-button"
              onClick={() => handlePromoClick(promo.code)}
              startIcon={<FaWhatsapp />}
            >
              {promo.buttonText}
            </Button>
          </Flex>
        </motion.div>
      </AnimatePresence>
      
      <View className="promo-indicators">
        {promotions.map((_, index) => (
          <button 
            key={index}
            className={`promo-indicator ${index === currentPromo ? 'active' : ''}`}
            onClick={() => setCurrentPromo(index)}
            aria-label={`Ver promoción ${index + 1}`}
          />
        ))}
      </View>
    </Card>
  );
}

export default PromotionsBanner;