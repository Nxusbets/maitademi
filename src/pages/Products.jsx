import { 
  Collection,
  Card,
  Image,
  Text,
  Heading,
  Button,
  Flex
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
      image: "https://www.comidaereceitas.com.br/wp-content/uploads/2008/04/Cheesecake-freepik.jpg"
    },
    {
      id: 3,
      name: 'Cupcakes',
      price: 180,
      description: 'Pack de 6 cupcakes variados',
      image: "https://bakemetreats.com/wp-content/uploads/2022/12/Cupcakes-1-copy-2.jpg"
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
      <Collection
        items={products}
        type="grid"
        gap="medium"
        templateColumns="1fr 1fr 1fr"
        templateRows="1fr"
      >
        {(product) => (
          <Card key={product.id}>
            <Image
              src={product.image}
              alt={product.name}
              objectFit="cover"
              height="200px"
            />
            <Flex direction="column" padding="medium">
              <Heading level={2}>{product.name}</Heading>
              <Text>{product.description}</Text>
              <Text
                fontSize="large"
                fontWeight="bold"
                color="brand.primary.60"
              >
                ${product.price} MXN
              </Text>
              <Button 
                variation="primary"
                onClick={() => window.open(generateWhatsAppLink(product), '_blank')}
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
