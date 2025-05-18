// Banner de promociones rotativas
import { useEffect, useState } from 'react';
import { Flex, Card, Heading, Text, Badge, Button } from '@aws-amplify/ui-react';

function PromotionsBanner() {
  const [currentPromo, setCurrentPromo] = useState(0);
  
  const promotions = [
    {
      title: "¡15% DE DESCUENTO EN TU PRIMER PEDIDO!",
      code: "NUEVO15",
      description: "Usa el código al solicitar tu cotización por WhatsApp"
    },
    {
      title: "OFERTAS DE TEMPORADA",
      code: "PRIMAVERA25",
      description: "Pasteles temáticos de primavera con 25% de descuento"
    },
    {
      title: "¡PROMO DEL MES!",
      code: "MAYO2025",
      description: "Cupcakes gratis en pedidos mayores a $500"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotions.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const promo = promotions[currentPromo];
  
  return (
    <Card variation="elevated" backgroundColor="#FFF0F5" padding="medium" className="promo-banner">
      <Flex direction="column" alignItems="center" textAlign="center">
        <Badge variation="info" size="large">PROMOCIÓN</Badge>
        <Heading level={3}>{promo.title}</Heading>
        <Text fontSize="large" fontWeight="bold">Código: {promo.code}</Text>
        <Text>{promo.description}</Text>
        <Button variation="primary">Aprovechar Ahora</Button>
      </Flex>
    </Card>
  );
}