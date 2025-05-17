import React from 'react';
import { motion } from 'framer-motion';
import './Testimonials.css';

const testimonials = [
  {
    name: 'María López',
    text: '¡El pastel de bodas fue espectacular! Superó todas nuestras expectativas.',
    initials: 'ML',
  },
  {
    name: 'Carlos Pérez',
    text: 'Los cupcakes fueron un éxito en la fiesta. ¡Gracias por la calidad y el sabor!',
    initials: 'CP',
  },
  {
    name: 'Ana García',
    text: 'El diseño y el sabor del pastel personalizado fueron increíbles. ¡Recomendado!',
    initials: 'AG',
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2>Lo que dicen nuestros clientes</h2>
      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="testimonial-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="testimonial-initials">{testimonial.initials}</div>
            <p className="testimonial-text">"{testimonial.text}"</p>
            <p className="testimonial-name">- {testimonial.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
