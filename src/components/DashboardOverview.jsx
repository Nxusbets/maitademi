import React from 'react';
import { motion } from 'framer-motion';

const DashboardOverview = ({ stats, data, openModal }) => {
  return (
    <div className="content-section">
      <h2 className="dashboard-title">Panel de Control</h2>
      
      {/* Tarjetas de estadísticas */}
      <div className="stats-grid">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="stat-card sales"
        >
          <h3 className="stat-title">Ventas Totales</h3>
          <p className="stat-value">
            ${stats.totalSales.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="stat-card expenses"
        >
          <h3 className="stat-title">Gastos Totales</h3>
          <p className="stat-value">
            ${stats.totalExpenses.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="stat-card profit"
        >
          <h3 className="stat-title">Ganancia</h3>
          <p className="stat-value">
            ${stats.profit.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="stat-card customers"
        >
          <h3 className="stat-title">Clientes</h3>
          <p className="stat-value">
            {stats.totalCustomers}
          </p>
        </motion.div>
      </div>

      {/* Acciones rápidas */}
      <div className="actions-section">
        <h3 className="actions-title">Acciones Rápidas</h3>
        <div className="actions-grid">
          <button
            onClick={() => openModal('product')}
            className="action-button product"
          >
            + Nuevo Producto
          </button>

          <button
            onClick={() => openModal('customer')}
            className="action-button customer"
          >
            + Nuevo Cliente
          </button>

          <button
            onClick={() => openModal('sale')}
            className="action-button sale"
          >
            + Nueva Venta
          </button>

          <button
            onClick={() => openModal('expense')}
            className="action-button expense"
          >
            + Nuevo Gasto
          </button>
        </div>
      </div>

      {/* Resumen reciente */}
      <div className="summary-grid">
        {/* Ventas recientes */}
        <div className="summary-card">
          <h4 className="summary-title">Ventas Recientes</h4>
          {data.sales.slice(0, 5).map(sale => (
            <div key={sale.id} className="summary-item">
              <span className="summary-customer">
                {sale.customerName || 'Cliente directo'}
              </span>
              <span className="summary-amount">
                ${sale.total}
              </span>
            </div>
          ))}
        </div>

        {/* Productos con poco stock */}
        <div className="summary-card">
          <h4 className="summary-title">Stock Bajo</h4>
          {data.products
            .filter(product => product.stock < 10)
            .slice(0, 5)
            .map(product => (
              <div key={product.id} className="summary-item">
                <span className="summary-product">{product.name}</span>
                <span className={`summary-stock ${product.stock < 5 ? 'low' : 'medium'}`}>
                  {product.stock} unidades
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;