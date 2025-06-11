import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { leadService } from '../services/firebaseService'; // Agregar esta importación
import './CustomCake.css';

const CustomCake = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    servings: '',
    flavor: 'vanilla',
    filling: '',
    toppings: [],
    decorationType: '',
    occasion: '',
    date: '',
    specialInstructions: '',
    name: '',
    email: '',
    phone: '',
    budget: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Agregar estado de carga

  const validateField = (name, value) => {
    let error = '';
    if (!value) {
      error = 'Este campo es obligatorio.';
    } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Por favor, introduce un correo válido.';
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const updatedToppings = checked
        ? [...formData.toppings, value]
        : formData.toppings.filter(item => item !== value);
      setFormData({ ...formData, toppings: updatedToppings });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Función para obtener el nombre legible del sabor
  const getFlavorName = (flavor) => {
    const flavors = {
      vanilla: 'Vainilla',
      vanillaNut: 'Vainilla con Nuez',
      orange: 'Naranja',
      chocolate: 'Chocolate',
      marble: 'Marmoleado (Mantequilla/Chocolate)',
      carrot: 'Zanahoria',
      redVelvet: 'Red Velvet',
      tresLechesVanilla: 'Tres Leches (Vainilla)',
      tresLechesChocolate: 'Tres Leches (Chocolate)',
      tresLechesMoka: 'Tres Leches (Moka)'
    };
    return flavors[flavor] || flavor;
  };

  // Función para obtener el nombre legible del relleno
  const getFillingName = (filling) => {
    const fillings = {
      mermelada: 'Mermeladas',
      cremaBatida: 'Crema Batida',
      cremaPastelera: 'Crema Pastelera',
      cajetaNuez: 'Cajeta con Nuez',
      cremaAvellanas: 'Crema de Avellanas',
      fresasCrema: 'Fresas con Crema',
      duraznosCrema: 'Duraznos con Crema',
      ganacheChocolate: 'Ganache de Chocolate',
      flanNapolitano: 'Flan Napolitano',
      cremaQueso: 'Crema de Queso'
    };
    return fillings[filling] || filling;
  };

  // Número de WhatsApp de la pastelería
  const phoneNumber = '523326827809';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevenir doble envío
    setIsSubmitting(true);

    try {
      // Preparar datos para Firebase
      const leadData = {
        // Información del cliente
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        
        // Información del evento/ocasión
        eventType: formData.occasion || 'Pastel personalizado',
        eventDate: formData.date,
        
        // Detalles del pastel
        cakeDetails: {
          servings: formData.servings,
          flavor: getFlavorName(formData.flavor),
          filling: getFillingName(formData.filling),
          toppings: formData.toppings,
          decorationType: formData.decorationType,
          specialInstructions: formData.specialInstructions
        },
        
        // Información adicional
        budget: formData.budget,
        message: `Solicitud de pastel personalizado:
        - Porciones: ${formData.servings}
        - Sabor: ${getFlavorName(formData.flavor)}
        - Relleno: ${getFillingName(formData.filling)}
        - Ocasión: ${formData.occasion}
        - Fecha: ${formData.date}
        - Instrucciones: ${formData.specialInstructions}
        ${formData.budget ? `- Presupuesto: $${formData.budget} MXN` : ''}`,
        
        // Metadatos
        status: 'new',
        source: 'website_custom_cake',
        type: 'custom_cake_quote',
        createdAt: new Date()
      };

      // Guardar en Firebase
      const result = await leadService.create(leadData);
      
      if (result.success) {
        console.log('Lead guardado exitosamente:', result.id);
        
        // Preparar mensaje para WhatsApp
        const whatsappMessage = `
¡Hola! Me gustaría cotizar un pastel personalizado con las siguientes características:

🎂 *Detalles del Pastel:*
• Porciones: ${formData.servings}
• Sabor: ${getFlavorName(formData.flavor)}
• Relleno: ${getFillingName(formData.filling)}
• Ocasión: ${formData.occasion}
• Fecha de entrega: ${formData.date}
• Instrucciones especiales: ${formData.specialInstructions}

👤 *Información de contacto:*
• Nombre: ${formData.name}
• Email: ${formData.email}
• Teléfono: ${formData.phone}
${formData.budget ? `• Presupuesto aproximado: $${formData.budget} MXN` : ''}

*Referencia:* Lead #${result.id}
        `.trim();

        // Mostrar confirmación y enviar a WhatsApp
        if (window.confirm('¡Tu solicitud ha sido registrada! ¿Deseas continuar con WhatsApp para recibir una respuesta más rápida?')) {
          const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
          window.open(whatsappUrl, '_blank');
        }
        
        // Mostrar mensaje de éxito
        alert('¡Cotización enviada exitosamente! Te contactaremos pronto.');
        
        // Redirigir a la página de inicio
        navigate('/');
        
      } else {
        console.error('Error guardando lead:', result.error);
        alert('Hubo un problema al enviar tu cotización. Por favor, intenta nuevamente.');
      }
      
    } catch (error) {
      console.error('Error al procesar la cotización:', error);
      alert('Hubo un problema al enviar tu cotización. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="custom-cake-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Personaliza tu Pastel Soñado</h1>
      <p className="subtitle">Cuéntanos todos los detalles para crear tu pastel perfecto</p>

      <form onSubmit={handleSubmit} className="custom-cake-form">
        <div className="form-section">
          <h3>Detalles del Pastel</h3>
          
          <div className="form-group">
            <label>Número de Porciones</label>
            <select 
              name="servings" 
              value={formData.servings} 
              onChange={handleChange} 
              required
              disabled={isSubmitting}
            >
              <option value="">Selecciona las porciones</option>
              <option value="8-10">8 a 10 porciones</option>
              <option value="11-15">11 a 15 porciones</option>
              <option value="16-20">16 a 20 porciones</option>
              <option value="21-25">21 a 25 porciones</option>
              <option value="26-30">26 a 30 porciones</option>
              <option value="30+">Más de 30 porciones (cotización especial)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sabor del Pastel</label>
            <select 
              name="flavor" 
              value={formData.flavor} 
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="vanilla">Vainilla</option>
              <option value="vanillaNut">Vainilla con Nuez</option>
              <option value="orange">Naranja</option>
              <option value="chocolate">Chocolate</option>
              <option value="marble">Marmoleado (Mantequilla/Chocolate)</option>
              <option value="carrot">Zanahoria</option>
              <option value="redVelvet">Red Velvet</option>
              <option value="tresLechesVanilla">Tres Leches (Vainilla)</option>
              <option value="tresLechesChocolate">Tres Leches (Chocolate)</option>
              <option value="tresLechesMoka">Tres Leches (Moka)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Relleno</label>
            <select 
              name="filling" 
              value={formData.filling} 
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Selecciona un relleno</option>
              <optgroup label="Básico">
                <option value="mermelada">Mermeladas</option>
                <option value="cremaBatida">Crema Batida</option>
                <option value="cremaPastelera">Crema Pastelera</option>
              </optgroup>
              <optgroup label="Especial">
                <option value="cajetaNuez">Cajeta con Nuez</option>
                <option value="cremaAvellanas">Crema de Avellanas</option>
                <option value="fresasCrema">Fresas con Crema</option>
                <option value="duraznosCrema">Duraznos con Crema</option>
                <option value="ganacheChocolate">Ganache de Chocolate</option>
                <option value="flanNapolitano">Flan Napolitano</option>
                <option value="cremaQueso">Crema de Queso</option>
              </optgroup>
            </select>
          </div>

          <div className="form-group">
            <label>Ocasión Especial</label>
            <input 
              type="text" 
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              placeholder="Ej: Boda, Cumpleaños, Aniversario..."
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Fecha Deseada de Entrega</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Instrucciones Especiales</label>
            <textarea 
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              placeholder="Describe cómo te gustaría la decoración, alergias, o cualquier detalle especial..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Información de Contacto</h3>
          
          <div className="form-group">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={isSubmitting}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label>Presupuesto Aproximado (MXN)</label>
            <input 
              type="number" 
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Opcional"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <motion.button 
          className="submit-button btn-sm"
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.05 } : {}}
          whileTap={!isSubmitting ? { scale: 0.95 } : {}}
        >
          {isSubmitting ? 'Enviando...' : 'Solicitar Cotización'}
        </motion.button>

        {isSubmitting && (
          <p className="loading-message">
            Enviando tu solicitud... Por favor espera.
          </p>
        )}
      </form>
    </motion.div>
  );
};

export default CustomCake;
