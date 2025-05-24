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

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Pastel de Chocolate Premium",
      description: "Delicioso pastel de chocolate con ganache y decoración artesanal",
      price: 450,
      image: "https://1.bp.blogspot.com/-kM3FiRKJYzc/XxdM4_-MdVI/AAAAAAAAT4o/9EKOIQ43-zwMYY4HNXpqKBuy-oSLHZGYwCPcBGAYYCw/s1600/Pasteles-de-chocolate.jpg",
      badge: "Más Vendido"
    },
    {
      id: 2,
      name: 'Cheesecake',
      price: 300,
      description: 'Cheesecake tradicional con mermelada de frutos rojos',
      image: "https://www.comidaereceitas.com.br/wp-content/uploads/2008/04/Cheesecake-freepik.jpg",
      badge: "Opción Diabética"
    },
    {
      id: 3,
      name: 'Cupcakes',
      price: 180,
      description: 'Pack de 6 cupcakes variados',
      image: "https://bakemetreats.com/wp-content/uploads/2022/12/Cupcakes-1-copy-2.jpg"
    },
    {
      id: 4,
      name: 'Pastel de Zanahoria',
      price: 380,
      description: 'Pastel húmedo de zanahoria con especias y cobertura de queso crema',
      image: "https://www.recetasnestle.com.mx/sites/default/files/styles/recipe_detail_desktop/public/srh_recipes/4e4293857c03d819e4ae51de1e86d66a.jpg",
      badge: "Saludable"
    },
    {
      id: 5,
      name: 'Galletas Artesanales',
      price: 120,
      description: 'Galletas decoradas para cualquier ocasión especial',
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8fVqY4h0o4i4FWFYz3VHj_4zx9CeULn8n_w&s",
      badge: "Opción Diabética"
    },
    {
      id: 6,
      name: 'Red Velvet',
      price: 420,
      description: 'Clásico pastel Red Velvet con crema de queso',
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFn8T0oD4DUKtCBH4rGzCPFT-bJYSbqZp1Bg&s"
    }
  ];

  // Función para generar el enlace de WhatsApp con el pedido
  const generateWhatsAppLink = (product) => {
    const phoneNumber = "523326827809"; // Reemplaza con tu número de WhatsApp configurado
    const message = `Hola, me gustaría solicitar: ${product.name} - $${product.price} MXN`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <Flex direction="column" padding="medium">
      <Heading level={1} textAlign="center">
        Nuestras Delicias
      </Heading>
      <Text textAlign="center" fontSize="large" marginBottom="large">
        Descubre nuestra variedad de pasteles y postres, incluyendo opciones especiales para personas diabéticas y con alergias
      </Text>
      
      <Collection
        items={products}
        type="grid"
        gap="medium"
        templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
      >
        {(product) => (
          <Card key={product.id} variation="elevated">
            <div style={{ position: 'relative' }}>
              <Image
                src={product.image}
                alt={product.name}
                objectFit="cover"
                height="200px"
              />
              {product.badge && (
                <Badge
                  variation={product.badge === "Opción Diabética" ? "success" : 
                           product.badge === "Saludable" ? "info" : "warning"}
                  position="absolute"
                  top="10px"
                  right="10px"
                  backgroundColor={product.badge === "Opción Diabética" ? "#4CAF50" : 
                                 product.badge === "Saludable" ? "#2196F3" : "#FF9800"}
                >
                  {product.badge}
                </Badge>
              )}
            </div>
            <Flex direction="column" padding="medium">
              <Heading level={3}>{product.name}</Heading>
              <Text>{product.description}</Text>
              <Text
                fontSize="large"
                fontWeight="bold"
                color="#DB7093"
                marginTop="small"
              >
                ${product.price} MXN
              </Text>
              <Button 
                variation="primary"
                onClick={() => window.open(generateWhatsAppLink(product), '_blank')}
                marginTop="medium"
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

export default Products;
