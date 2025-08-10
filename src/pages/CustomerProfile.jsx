import React, { useState, useEffect } from 'react';
import { customerService, salesService } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import './CustomerProfile.css';

const CustomerProfile = () => {
  const { user } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [folioInput, setFolioInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [purchases, setPurchases] = useState([]);

  // Cargar datos del cliente
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!user?.id) return;
      const result = await customerService.getById(user.id);
      if (result.success) setCustomer(result.data);
    };
    fetchCustomer();
  }, [user]);

  // Cargar compras del cliente
  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user?.id) return;
      const result = await salesService.getByCustomerId(user.id);
      if (result.success) setPurchases(result.data || []);
    };
    fetchPurchases();
  }, [user]);

  // Redimir folio
  const handleRedeemFolio = async () => {
    setLoading(true);
    setMessage('');
    const saleResult = await salesService.getByFolio(folioInput);
    if (!saleResult.success || !saleResult.data) {
      setMessage('Folio no encontrado.');
      setLoading(false);
      return;
    }
    const sale = saleResult.data;
    if (sale.redeemedBy) {
      setMessage('Este folio ya fue redimido.');
      setLoading(false);
      return;
    }
    // SUMA LOS PUNTOS DE LOS PRODUCTOS Y CREA EL DESGLOSE
    let puntosGanados = 0;
    let desglose = '';
    if (sale.products && sale.products.length > 0) {
      desglose = sale.products
        .map(prod => {
          const puntos = Math.max(0, Number(prod.puntos));
          const cantidad = Math.max(1, Number(prod.quantity));
          const total = puntos * cantidad;
          puntosGanados += total;
          return `• ${prod.name}: ${puntos} x ${cantidad} = ${total} puntos`;
        })
        .join('\n');
    }

    await customerService.updatePoints(customer.id, (customer.points || 0) + puntosGanados);
    await salesService.update(sale.id, { redeemedBy: customer.id });
    setCustomer({ ...customer, points: (customer.points || 0) + puntosGanados });

    setMessage(
      `¡Folio redimido! Ganaste ${puntosGanados} puntos.<br /><br />Desglose:<br />${desglose.replace(/\n/g, '<br />')}`
    );
    setLoading(false);
  };

  if (!customer) return <div>Cargando perfil...</div>;

  return (
    <div className="customer-profile">
      <h2>Mi Perfil</h2>
      <p><strong>Nombre:</strong> {customer.name}</p>
      <p><strong>Correo:</strong> {customer.email}</p>
      <p><strong>Puntos:</strong> {customer.points || 0}</p>
      <div className="motivational-message">
        <span role="img" aria-label="estrella">✨</span> 
        ¡Con tus compras puedes ganar puntos y redimir productos increíbles!
      </div>
      <div>
        <input
          type="text"
          placeholder="Ingresa tu folio de compra"
          value={folioInput}
          onChange={e => setFolioInput(e.target.value)}
        />
        <button onClick={handleRedeemFolio} disabled={loading}>
          {loading ? 'Redimiendo...' : 'Redimir Folio'}
        </button>
      </div>
      {message && <p className="message" dangerouslySetInnerHTML={{ __html: message }} />}
      <div className="purchase-history">
        <h3>Mis Compras</h3>
        {purchases.length === 0 ? (
          <p>No tienes compras registradas aún.</p>
        ) : (
          <ul>
            {purchases.map(purchase => (
              <li key={purchase.id}>
                <strong>Folio:</strong> {purchase.folio} <br />
                <strong>Fecha:</strong> {purchase.date} <br />
                <strong>Total:</strong> ${purchase.total} <br />
                <strong>Redimido:</strong> {purchase.redeemedBy ? 'Sí' : 'No'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;