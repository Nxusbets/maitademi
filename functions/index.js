const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configura tu cuenta de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tuemail@gmail.com', // tu correo Gmail
    pass: 'tu_app_password'     // usa una App Password de Gmail
  }
});

exports.sendPromotionEmail = functions.firestore
  .document('promotions/{promoId}')
  .onCreate(async (snap, context) => {
    const promo = snap.data();

    // Obtén todos los clientes
    const customersSnap = await admin.firestore().collection('customers').get();
    const emails = customersSnap.docs.map(doc => doc.data().email).filter(Boolean);

    if (emails.length === 0) return null;

    // Configura el correo
    const mailOptions = {
      from: 'tuemail@gmail.com',
      to: emails,
      subject: `¡Nueva promoción: ${promo.title || promo.titulo}!`,
      html: `
        <h2>${promo.title || promo.titulo}</h2>
        <p>${promo.message || promo.descripcion}</p>
        ${promo.code || promo.codigo ? `<p><b>Código:</b> ${promo.code || promo.codigo}</p>` : ''}
        ${promo.discount ? `<p><b>Descuento:</b> ${promo.discount}%</p>` : ''}
        ${promo.validUntil ? `<p><b>Válido hasta:</b> ${new Date(promo.validUntil).toLocaleDateString()}</p>` : ''}
      `
    };

    // Envía el correo
    await transporter.sendMail(mailOptions);
    return null;
  });