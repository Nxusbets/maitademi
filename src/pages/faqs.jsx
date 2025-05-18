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
      answer: "Recomendamos hacer tu pedido con al menos 3-5 días de anticipación para pasteles estándar, y 7-10 días para diseños personalizados complejos."
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
      answer: "Sí, podemos adaptar nuestras recetas para necesidades específicas como libre de gluten o lácteos. Consulta por opciones disponibles."
    },
    {
      question: "¿Puedo llevar mi propio diseño o referencia?",
      answer: "¡Claro! Puedes enviarnos referencias o ideas de diseño por WhatsApp y haremos lo posible por replicarlo."
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