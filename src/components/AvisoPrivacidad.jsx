import React from 'react';
import './AvisoPrivacidad.css';

const AvisoPrivacidad = () => {
  return (
    <div className="aviso-privacidad-container">
      <div className="aviso-content">
        <h1>Aviso de Privacidad</h1>
        <div className="aviso-texto">
          <p>
            Sus datos personales serán utilizados de forma responsable y confidencial para fines relacionados 
            con la publicidad de esta página y del proyecto, así como para el envío de promociones especiales.
          </p>
          <p>
            Nos comprometemos a proteger su información y a no compartirla con terceros sin su consentimiento.
            Al proporcionar sus datos, usted acepta estos términos.
          </p>
          
          <h2>Recopilación de Datos</h2>
          <p>
            Recopilamos información personal como nombre, correo electrónico y preferencias cuando usted:
          </p>
          <ul>
            <li>Se registra en nuestra plataforma</li>
            <li>Realiza una compra</li>
            <li>Se suscribe a nuestro boletín</li>
            <li>Completa formularios en nuestro sitio</li>
          </ul>
          
          <h2>Uso de la Información</h2>
          <p>
            Su información será utilizada para:
          </p>
          <ul>
            <li>Personalizar su experiencia en nuestra plataforma</li>
            <li>Mejorar nuestros servicios</li>
            <li>Enviar información relevante sobre productos y promociones</li>
            <li>Procesar transacciones</li>
          </ul>
          
          <h2>Contacto</h2>
          <p>
            Para cualquier pregunta relacionada con este Aviso de Privacidad, puede contactarnos a través de:
            <br />
            Correo electrónico: privacidad@maitademi.com
            <br />
            Teléfono: (123) 456-7890
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvisoPrivacidad;