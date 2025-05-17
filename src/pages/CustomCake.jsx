import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './CustomCake.css';

const CustomCake = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    size: 'medium',
    flavor: 'vanilla',
    filling: '',
    toppings: [],
    decorationType: '',
    occasion: '',
    servings: '',
    date: '',
    specialInstructions: '',
    name: '',
    email: '',
    phone: '',
    budget: ''
  });

  const [errors, setErrors] = useState({});

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

  // Número de WhatsApp de la pastelería (reemplazar con el número real)
  const phoneNumber = '523326827809';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const message = `
¡Hola! Me gustaría cotizar un pastel con las siguientes características:

🎂 Tamaño: ${formData.size}
🍰 Sabor: ${formData.flavor}
🍫 Relleno: ${formData.filling}
🎉 Ocasión: ${formData.occasion}
📅 Fecha de entrega: ${formData.date}
📝 Instrucciones especiales: ${formData.specialInstructions}

👤 Datos de contacto:
- Nombre: ${formData.name}
- Email: ${formData.email}
- Teléfono: ${formData.phone}
${formData.budget ? `- Presupuesto aproximado: $${formData.budget} MXN` : ''}
    `.trim();

    if (window.confirm('¿Deseas enviar esta cotización por WhatsApp?')) {
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      navigate('/'); // Redirige a la página de inicio
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
            <label>Tamaño del Pastel (Porciones)</label>
            <select name="size" value={formData.size} onChange={handleChange}>
              <option value="small">Pequeño (8-10 porciones)</option>
              <option value="medium">Mediano (11-15 porciones)</option>
              <option value="large">Grande (16-20 porciones)</option>
              <option value="xl">Extra Grande (21-25 porciones)</option>
              <option value="jumbo">Jumbo (26-30 porciones)</option>
              <option value="custom">Más de 30 porciones (cotización especial)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sabor del Pastel</label>
            <select name="flavor" value={formData.flavor} onChange={handleChange}>
              <option value="vanilla">Vainilla con Nuez</option>
              <option value="marble">Marmoleado (Mantequilla-Chocolate)</option>
              <option value="tresLechesVanilla">Tres Leches (Vainilla)</option>
              <option value="tresLechesChocolate">Tres Leches (Chocolate)</option>
              <option value="tresLechesMocca">Tres Leches (Mocca)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Relleno</label>
            <select name="filling" value={formData.filling} onChange={handleChange}>
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
            />
          </div>

          <div className="form-group">
            <label>Fecha Deseada de Entrega</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Instrucciones Especiales</label>
            <textarea 
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              placeholder="Describe cómo te gustaría la decoración, alergias, o cualquier detalle especial..."
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
            />
          </div>
        </div>

        <motion.button 
          className="submit-button btn-sm"
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Solicitar Cotización
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CustomCake;
