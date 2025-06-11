import emailjs from '@emailjs/browser';

// Configuración de EmailJS
const EMAILJS_CONFIG = {
  serviceId: 'tu_service_id',
  templateId: 'tu_template_id',
  publicKey: 'tu_public_key'
};

export const emailService = {
  // Inicializar EmailJS
  init: () => {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  },

  // Enviar promoción por email
  sendPromotion: async (customers, promotionData) => {
    try {
      const results = [];
      
      for (const customer of customers) {
        const templateParams = {
          to_name: customer.name,
          to_email: customer.email,
          promotion_title: promotionData.title,
          promotion_description: promotionData.description,
          promotion_discount: promotionData.discount,
          promotion_code: promotionData.code,
          valid_until: promotionData.validUntil,
          business_name: 'Maitademi',
          business_phone: '3316921606'
        };

        try {
          const result = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
          );
          results.push({ customer: customer.email, success: true, result });
        } catch (error) {
          results.push({ customer: customer.email, success: false, error: error.message });
        }
      }

      return { success: true, results };
    } catch (error) {
      console.error('Error sending promotion emails:', error);
      return { success: false, error: error.message };
    }
  },

  // Enviar email individual
  sendSingle: async (customerEmail, customerName, subject, message) => {
    try {
      const templateParams = {
        to_name: customerName,
        to_email: customerEmail,
        subject: subject,
        message: message,
        business_name: 'Maitademi',
        business_phone: '3316921606'
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      return { success: true, result };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }
};