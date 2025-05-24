import React from 'react';
import './OrdersKanban.css';

const OrdersKanban = () => {
  return (
    <div className="orders-kanban">
      <div className="kanban-column">
        <h4>Por Hacer</h4>
        {/* Agrega tarjetas de pedidos aquí */}
      </div>
      <div className="kanban-column">
        <h4>En Proceso</h4>
        {/* Agrega tarjetas de pedidos aquí */}
      </div>
      <div className="kanban-column">
        <h4>Completado</h4>
        {/* Agrega tarjetas de pedidos aquí */}
      </div>
    </div>
  );
};

export default OrdersKanban;