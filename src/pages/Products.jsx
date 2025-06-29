import './Products.css';
import { 
  Collection,
  Card,
  Image,
  Text,
  Heading,
  Button,
  Flex,
  Badge
} from '@aws-amplify/ui-react';
import { useFirebaseData } from '../hooks/useFirebaseData'; // Asegúrate de tener este hook

const Products = () => {
  const { data, loading } = useFirebaseData();

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <Flex direction="column" padding="medium">
      <Heading level={1} textAlign="center">
        Nuestras Delicias
      </Heading>
      <Text textAlign="center" fontSize="large" marginBottom="large">
        Descubre nuestra variedad de pasteles y postres, incluyendo opciones especiales para personas diabéticas y con alergias
      </Text>
      
      <Collection
        items={data.products}
        type="grid"
        gap="medium"
        templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
      >
        {(product) => (
          <Card key={product.id} variation="elevated" className="product-card">
            <div className="image-container" style={{ position: 'relative' }}>
              <Image
                src={product.image}
                alt={product.name}
                className="product-image"
                style={{ borderRadius: '16px', objectFit: 'cover', height: 220, width: '100%' }}
              />
              {/* Badge de categoría elegante */}
              {product.category && (
                <Badge
                  variation="info"
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    background: '#fff',
                    color: '#DB7093',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '4px 12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    fontSize: 13,
                    letterSpacing: 1
                  }}
                >
                  {product.category}
                </Badge>
              )}
              {/* Badge especial si existe */}
              {product.badge && (
                <Badge
                  variation={product.badge === "Opción Diabética" ? "success" : 
                             product.badge === "Saludable" ? "info" : "warning"}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: product.badge === "Opción Diabética" ? "#4CAF50" : 
                                     product.badge === "Saludable" ? "#2196F3" : "#FF9800",
                    color: "#fff",
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    padding: '4px 12px',
                    fontSize: 13,
                    letterSpacing: 1
                  }}
                >
                  {product.badge}
                </Badge>
              )}
            </div>
            <Flex direction="column" padding="medium" gap="xs">
              <Heading level={3} marginBottom="xxs" style={{ color: "#DB7093" }}>
                {product.name}
              </Heading>
              <Text fontSize="small" color="gray" marginBottom="xxs" fontStyle="italic">
                {product.description}
              </Text>
              <Text
                fontSize="large"
                fontWeight="bold"
                color="#DB7093"
                marginTop="small"
                marginBottom="small"
                style={{ fontSize: 22 }}
              >
                ${product.price} MXN
              </Text>
              <Button 
                variation="primary"
                onClick={() => window.open(generateWhatsAppLink(product), '_blank')}
                marginTop="medium"
                style={{ borderRadius: 20, fontWeight: 'bold', background: "#DB7093", border: "none" }}
              >
                Solicitar postre
              </Button>
            </Flex>
          </Card>
        )}
      </Collection>
    </Flex>
  );
};

// Utiliza la misma función para WhatsApp
const generateWhatsAppLink = (product) => {
  const phoneNumber = "523326827809";
  const message = `Hola, me gustaría solicitar: ${product.name} - $${product.price} MXN`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

export default Products;
