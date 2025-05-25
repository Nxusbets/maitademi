import './Products.css'; // Asegúrate de crear este archivo CSS
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
      name: 'Pastel de Chocolate',
      price: 225,
      description: 'Relleno de ganache de chocolate, cobertura en crema de chocolate (8 porciones)',
      image: "https://res.cloudinary.com/ddi0sl10o/image/upload/v1748207926/1000075607_bhalw8.jpg",
    },
    {
      id: 2,
      name: 'Panqué de Vainilla o Naranja con Nuez',
      price: 120,
      description: 'Panqué de 8 porciones con sabor a vainilla o naranja, acompañado de nuez.',
      image: "https://res.cloudinary.com/ddi0sl10o/image/upload/v1748207926/1000075619_dpios8.jpg",
    },
    {
      id: 3,
      name: 'Panqué de Queso Crema',
      price: 190,
      description: 'Decorado con crema de queso y canela (8 porciones).',
      image: "https://res.cloudinary.com/ddi0sl10o/image/upload/v1748207927/1000075613_lego7g.jpg",
    },
    {
      id: 4,
      name: 'Flan Napolitano',
      price: 280,
      description: 'Flan clásico napolitano (8 porciones).',
      image: "https://res.cloudinary.com/ddi0sl10o/image/upload/v1748207926/1000075616_tnwkxo.jpg",
    },
    {
      id: 5,
      name: 'Cheesecake',
      price: 360,
      description: '8-10 porciones decorado con chocolate y nuez.',
      image: "https://res.cloudinary.com/ddi0sl10o/image/upload/v1748207926/1000075619_dpios8.jpg",
    },
    {
      id: 6,
      name: 'Pastel Red Velvet',
      price: 420,
      description: 'Pastel en capas relleno de crema de queso, decoración en líneas de chocolate oscuro y cerezas (8 porciones).',
      image: "https://res.cloudinary.com/ddi0sl10o/image/upload/v1748208179/1000075622_hqlryf.jpg",
    },
    {
      id: 7,
      name: 'Pastel de Zanahoria',
      price: 380,
      description: 'Bizcocho con nuez, pasitas, zanahoria y canela. Relleno y cobertura en crema de queso (8 porciones).',
      image: "https://res.cloudinary.com/ddi0sl10o/image/upload/v1748207926/1000075625_dlqevp.jpg",
    },
    {
      id: 8,
      name: 'Gelatinas Individuales (Varios Sabores)',
      price: 25,
      description: 'Sabores: mosaico, yogurt, rompope, tres leches con fruta encapsulada.',
      image: "https://res.cloudinary.com/ddi0sl10o/image/upload/v1748207926/1000075628_goy6un.jpg",
    }
  ];

  const generateWhatsAppLink = (product) => {
    const phoneNumber = "523326827809";
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
          <Card key={product.id} variation="elevated" className="product-card">
            <div className="image-container">
              <Image
                src={product.image}
                alt={product.name}
                className="product-image"
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
