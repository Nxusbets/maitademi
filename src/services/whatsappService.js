export const whatsappService = {
  // Generar mensaje de promoción
  generatePromotionMessage: (customerName, promotionData) => {
    return `¡Hola ${customerName}! 🎉

🍰 *${promotionData.title}* 🍰

${promotionData.description}

💰 *${promotionData.discount}% de descuento*
🏷️ Código: *${promotionData.code}*
⏰ Válido hasta: ${promotionData.validUntil}

¡No te pierdas esta oportunidad única!

Maitademi - Creaciones Dulces
📞 3316921606`;
  },

  // Abrir WhatsApp Web con mensaje
  sendToCustomer: (phoneNumber, message) => {
    const cleanPhone = phoneNumber.replace(/\D/g, ''); // Remover caracteres no numéricos
    const formattedPhone = cleanPhone.startsWith('52') ? cleanPhone : `52${cleanPhone}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  },

  // Enviar promoción masiva por WhatsApp
  sendPromotionToMultiple: (customers, promotionData) => {
    customers.forEach((customer, index) => {
      if (customer.phone) {
        setTimeout(() => {
          const message = whatsappService.generatePromotionMessage(customer.name, promotionData);
          whatsappService.sendToCustomer(customer.phone, message);
        }, index * 2000); // Esperar 2 segundos entre cada mensaje
      }
    });
  },

  // Generar mensaje personalizado
  generateCustomMessage: (customerName, message) => {
    return `¡Hola ${customerName}!

${message}

Maitademi - Creaciones Dulces
📞 3316921606`;
  }
};