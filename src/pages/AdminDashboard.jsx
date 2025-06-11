import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { 
  productService, 
  customerService, 
  salesService 
} from '../services/firebaseService';
import PromotionsManager from '../components/PromotionsManager';
import ExpenseManager from '../components/ExpenseManager'; // Importar el nuevo componente
import SalesManager from '../components/SalesManager'; // Agregar esta importación
import LeadsManager from '../components/LeadsManager'; // Agregar esta importación
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { data, loading, refreshData, stats } = useFirebaseData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // Nuevo estado

  // Estados para formularios (mantener solo los necesarios)
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: '', cost: '', stock: ''
  });

  const [newCustomer, setNewCustomer] = useState({
    name: '', email: '', phone: '', address: '', birthDate: '', preferences: ''
  });

  const [newSale, setNewSale] = useState({
    customerId: '', customerName: '', products: [], total: '', paymentMethod: '', notes: ''
  });

  // Handlers para formularios
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Ya se está enviando un formulario...');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Creando producto:', newProduct);
      const result = await productService.create({
        ...newProduct,
        price: parseFloat(newProduct.price),
        cost: parseFloat(newProduct.cost),
        stock: parseInt(newProduct.stock)
      });
      
      if (result.success) {
        console.log('Producto creado exitosamente');
        await refreshData();
        closeModal();
        resetProductForm();
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Ya se está enviando un formulario...');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Creando cliente:', newCustomer);
      const result = await customerService.create(newCustomer);
      if (result.success) {
        console.log('Cliente creado exitosamente');
        await refreshData();
        closeModal();
        resetCustomerForm();
      }
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Ya se está enviando un formulario...');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Creando venta:', newSale);
      const result = await salesService.create(newSale);
      if (result.success) {
        console.log('Venta creada exitosamente');
        await refreshData();
        closeModal();
        resetSaleForm();
      }
    } catch (error) {
      console.error('Error creating sale:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funciones auxiliares
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setIsSubmitting(false); // Reset del estado de envío
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setIsSubmitting(false); // Reset del estado de envío
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      cost: '',
      stock: ''
    });
  };

  const resetCustomerForm = () => {
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
      birthDate: '',
      preferences: ''
    });
  };

  const resetSaleForm = () => {
    setNewSale({
      customerId: '',
      customerName: '',
      products: [],
      total: '',
      paymentMethod: '',
      notes: ''
    });
  };

  // Funciones para manejar productos en venta
  const addProductToSale = () => {
    setNewSale(prev => ({
      ...prev,
      products: [...prev.products, { name: '', price: '', quantity: 1 }]
    }));
  };

  const updateProductInSale = (index, field, value) => {
    setNewSale(prev => ({
      ...prev,
      products: prev.products.map((product, i) => 
        i === index ? { ...product, [field]: value } : product
      )
    }));
  };

  const removeProductFromSale = (index) => {
    setNewSale(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  // Nuevo: función para cerrar menú móvil al seleccionar tab
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setShowMobileMenu(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
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

              {/* Nueva tarjeta para leads */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="stat-card leads"
              >
                <h3 className="stat-title">Solicitudes</h3>
                <p className="stat-value">
                  {stats.totalLeads}
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
                  onClick={() => setActiveTab('expenses')}
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

              {/* Nuevas solicitudes de cotización */}
              <div className="summary-card">
                <h4 className="summary-title">Solicitudes Recientes</h4>
                {data.leads
                  .filter(lead => lead.status === 'new' || !lead.status)
                  .slice(0, 5)
                  .map(lead => (
                    <div key={lead.id} className="summary-item">
                      <span className="summary-customer">{lead.name}</span>
                      <span className="summary-event">{lead.eventType || 'Cotización'}</span>
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

      case 'products':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Productos</h2>
              <button
                onClick={() => openModal('product')}
                className="add-button product"
              >
                + Nuevo Producto
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr className="table-header">
                    <th className="table-cell">Nombre</th>
                    <th className="table-cell">Descripción</th>
                    <th className="table-cell">Precio</th>
                    <th className="table-cell">Costo</th>
                    <th className="table-cell">Stock</th>
                    <th className="table-cell">Categoría</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map(product => (
                    <tr key={product.id} className="table-row">
                      <td className="table-cell">{product.name}</td>
                      <td className="table-cell secondary">{product.description}</td>
                      <td className="table-cell success">${product.price}</td>
                      <td className="table-cell warning">${product.cost}</td>
                      <td className={`table-cell ${product.stock < 10 ? 'danger' : 'secondary'}`}>
                        {product.stock}
                      </td>
                      <td className="table-cell secondary">{product.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Clientes</h2>
              <button
                onClick={() => openModal('customer')}
                className="add-button customer"
              >
                + Nuevo Cliente
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr className="table-header">
                    <th className="table-cell">Nombre</th>
                    <th className="table-cell">Email</th>
                    <th className="table-cell">Teléfono</th>
                    <th className="table-cell">Dirección</th>
                    <th className="table-cell">Fecha de Nacimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.customers.map(customer => (
                    <tr key={customer.id} className="table-row">
                      <td className="table-cell">{customer.name}</td>
                      <td className="table-cell secondary">{customer.email}</td>
                      <td className="table-cell secondary">{customer.phone}</td>
                      <td className="table-cell secondary">{customer.address}</td>
                      <td className="table-cell secondary">{customer.birthDate || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'sales':
        return <SalesManager data={data} refreshData={refreshData} />;

      case 'expenses':
        return <ExpenseManager data={data} refreshData={refreshData} />;

      case 'promotions':
        return <PromotionsManager data={data} refreshData={refreshData} />;

      case 'leads':
        return <LeadsManager data={data} refreshData={refreshData} />;

      default:
        return <div>Selecciona una opción del menú</div>;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h3 className="loading-text">Cargando dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Overlay para cerrar menú móvil */}
      {showMobileMenu && (
        <div 
          className="mobile-overlay"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <div className={`sidebar ${showMobileMenu ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Maitademi</h2>
          <p className="sidebar-subtitle">Panel de Administración</p>
          
          {/* Botón hamburguesa para móvil */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${showMobileMenu ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        <nav className={`sidebar-nav ${showMobileMenu ? 'mobile-open' : ''}`}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'leads', label: 'Solicitudes', icon: '📝', badge: data.leads ? data.leads.filter(lead => lead.status === 'new' || !lead.status).length : 0 },
            { id: 'products', label: 'Productos', icon: '🍰' },
            { id: 'customers', label: 'Clientes', icon: '👥' },
            { id: 'sales', label: 'Ventas', icon: '💰' },
            { id: 'expenses', label: 'Gastos', icon: '📉' },
            { id: 'promotions', label: 'Promociones', icon: '📧' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
              {tab.badge > 0 && (
                <span className="nav-badge">{tab.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="logout-container">
          <button onClick={logout} className="logout-button">
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        {loading && (
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p className="loading-text">Cargando datos...</p>
            </div>
          </div>
        )}
        
        {!loading && renderTabContent()}
      </div>

      {/* Modales */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="modal-content"
            >
              {modalType === 'product' && (
                <form onSubmit={handleProductSubmit}>
                  <h3 className="modal-title">Nuevo Producto</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Nombre del Producto</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      className="form-textarea"
                      required
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Precio de Venta</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Costo</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProduct.cost}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, cost: e.target.value }))}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="modal-actions">
                    <button type="button" onClick={closeModal} className="cancel-button">
                      Cancelar
                    </button>
                    <button type="submit" className="submit-button product">
                      Guardar Producto
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'customer' && (
                <form onSubmit={handleCustomerSubmit}>
                  <h3 className="modal-title">Nuevo Cliente</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="text"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dirección</label>
                    <input
                      type="text"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={newCustomer.birthDate}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferencias</label>
                    <textarea
                      value={newCustomer.preferences}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, preferences: e.target.value }))}
                      rows="3"
                      className="form-textarea"
                    />
                  </div>

                  <div className="modal-actions">
                    <button type="button" onClick={closeModal} className="cancel-button">
                      Cancelar
                    </button>
                    <button type="submit" className="submit-button customer">
                      Guardar Cliente
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'sale' && (
                <form onSubmit={handleSaleSubmit}>
                  <h3 className="modal-title">Nueva Venta</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Cliente</label>
                    <select
                      value={newSale.customerId}
                      onChange={(e) => {
                        const selectedCustomer = data.customers.find(c => c.id === e.target.value);
                        setNewSale(prev => ({ 
                          ...prev, 
                          customerId: e.target.value,
                          customerName: selectedCustomer ? selectedCustomer.name : ''
                        }));
                      }}
                      className="form-input"
                      required
                    >
                      <option value="">Seleccionar cliente</option>
                      {data.customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} - {customer.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Productos</label>
                    <div className="products-container">
                      {newSale.products.length === 0 && (
                        <span className="products-placeholder">
                          Agregar productos a la venta
                        </span>
                      )}

                      {newSale.products.map((product, index) => (
                        <div key={index} className="product-row">
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => updateProductInSale(index, 'name', e.target.value)}
                            placeholder="Nombre del producto"
                            className="product-input"
                            required
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={product.price}
                            onChange={(e) => updateProductInSale(index, 'price', e.target.value)}
                            placeholder="Precio"
                            className="product-input price"
                            required
                          />
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => updateProductInSale(index, 'quantity', e.target.value)}
                            placeholder="Cantidad"
                            className="product-input quantity"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeProductFromSale(index)}
                            className="remove-button"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addProductToSale}
                        className="add-product-button"
                      >
                        + Agregar Producto
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Método de Pago</label>
                    <select
                      value={newSale.paymentMethod}
                      onChange={(e) => setNewSale(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="form-input"
                      required
                    >
                      <option value="">Seleccionar método de pago</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="transferencia">Transferencia</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notas</label>
                    <textarea
                      value={newSale.notes}
                      onChange={(e) => setNewSale(prev => ({ ...prev, notes: e.target.value }))}
                      rows="3"
                      className="form-textarea"
                    />
                  </div>

                  <div className="modal-actions">
                    <button type="button" onClick={closeModal} className="cancel-button">
                      Cancelar
                    </button>
                    <button type="submit" className="submit-button sale">
                      Guardar Venta
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'expense' && (
                <form onSubmit={handleExpenseSubmit}>
                  <h3 className="modal-title">Nuevo Gasto</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <input
                      type="text"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Monto</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <input
                      type="text"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fecha</label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notas</label>
                    <textarea
                      value={newExpense.notes}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, notes: e.target.value }))}
                      rows="3"
                      className="form-textarea"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="modal-actions">
                    <button 
                      type="button" 
                      onClick={closeModal} 
                      className="cancel-button"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="submit-button expense"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar Gasto'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;