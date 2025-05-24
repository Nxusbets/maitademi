// Componente de preguntas frecuentes con acordeón
import React, { useState } from 'react';
import { View, Heading, Card, Text, Button } from '@aws-amplify/ui-react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Asegúrate de que el nombre de la función comience con mayúscula
function Faqs() {
  const [openItem, setOpenItem] = useState(null);
  
  const faqItems = [
    {
      question: "¿Con cuánta anticipación debo hacer mi pedido?",
      answer: "Recomendamos hacer tu pedido con 7 días de anticipación para pasteles con decoración en crema o impresión, y 15 días para decoración en fondant."
    },
    {
      question: "¿Hacen entregas a domicilio?",
      answer: "Sí, contamos con servicio de entrega en ciertas zonas de la ciudad. El costo varía según la distancia."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos transferencias bancarias, depósitos y pagos en efectivo al momento de la entrega."
    },
    {
      question: "¿Tienen opciones para personas con alergias o restricciones alimenticias?",
      answer: "Sí, tenemos opciones para personas alérgicas y diabéticas. Ofrecemos pasteles de zanahoria, cheesecake, galletas y podemos adaptar nuestras recetas para necesidades específicas como libre de gluten o lácteos. Consulta por opciones disponibles."
    },
    {
      question: "¿Puedo llevar mi propio diseño o referencia?",
      answer: "¡Claro! Puedes enviarnos referencias o ideas de diseño por WhatsApp y haremos lo posible por replicarlo."
    },
    {
      question: "¿Qué productos ofrecen para personas diabéticas?",
      answer: "Contamos con opciones especiales para personas diabéticas incluyendo pasteles de zanahoria, cheesecake y galletas preparados con endulzantes naturales. Consulta disponibilidad al hacer tu pedido."
    },
    {
      question: "¿Qué diferencia hay entre decoración en crema y fondant?",
      answer: "La decoración en crema permite diseños más naturales y sabores frescos, mientras que el fondant permite formas más precisas y colores vibrantes. El fondant requiere más tiempo de preparación (15 días vs 7 días para crema)."
    }
  ];
  
  return (
    <View className="faq-section" padding="medium">
      <Heading level={2} textAlign="center">Preguntas Frecuentes</Heading>
      
      {faqItems.map((item, index) => (
        <Card 
          key={index}
          variation="outlined"
          margin="small"
          backgroundColor={openItem === index ? "#FFF0F5" : "white"}
        >
          <Button
            onClick={() => setOpenItem(openItem === index ? null : index)}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            backgroundColor="transparent"
            padding="medium"
          >
            <Text fontWeight="bold">{item.question}</Text>
            {openItem === index ? <FaChevronUp /> : <FaChevronDown />}
          </Button>
          
          {openItem === index && (
            <View padding="medium" paddingTop="0">
              <Text>{item.answer}</Text>
            </View>
          )}
        </Card>
      ))}
    </View>
  );
}

// ¡Asegúrate de que esta línea exista!
export default Faqs;