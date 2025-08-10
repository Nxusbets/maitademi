import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { 
  productService, 
  customerService, 
  salesService,
  leadService
} from '../services/firebaseService';
import PromotionsManager from '../components/PromotionsManager';
import ExpenseManager from '../components/ExpenseManager';
import SalesManager from '../components/SalesManager';
import LeadsManager from '../components/LeadsManager';
import ProductsManager from '../components/ProductsManager';
import ImageUploader from '../components/ImageUploader';
import CreationsManager from '../components/CreationsManager';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { data, loading, refreshData, stats } = useFirebaseData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Estados para formularios
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: '', cost: '', stock: ''
  });

  const [newCustomer, setNewCustomer] = useState({
    name: '', email: '', phone: '', address: '', birthDate: '', preferences: ''
  });

  const [newSale, setNewSale] = useState({
    customerId: '', customerName: '', products: [], total: '', paymentMethod: '', notes: ''
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [productImage, setProductImage] = useState('');
  const [selectedLead, setSelectedLead] = useState(null); // Nuevo estado para el lead seleccionado
  const [showSaleModal, setShowSaleModal] = useState(false); // Nuevo estado para mostrar el modal de venta
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Nuevo estado para el cliente seleccionado

  // CATEGORÍAS EXISTENTES
  const existingCategories = Array.from(
    new Set((data.products || []).map(p => p.category).filter(Boolean))
  );

  // Handlers para formularios
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      console.log('Ya se está enviando un formulario...');
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        cost: parseFloat(newProduct.cost),
        stock: parseInt(newProduct.stock),
        image: productImage
      };

      if (editMode && selectedProduct) {
        // Editar producto existente
        await productService.update(selectedProduct.id, productData);
      } else {
        // Crear producto nuevo
        await productService.create(productData);
      }
      await refreshData();
      closeModal();
      resetProductForm();
      setProductImage('');
      setEditMode(false);
      setSelectedProduct(null);
    } catch (error) {
      alert('Error al guardar producto');
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
      if (editMode && selectedCustomer) {
        await customerService.update(selectedCustomer.id, newCustomer);
      } else {
        const result = await customerService.create(newCustomer);
        if (result.success) {
          resetCustomerForm();
        }
      }
      await refreshData();
      closeModal();
    } catch (error) {
      console.error('Error creating/updating customer:', error);
    } finally {
      setIsSubmitting(false);
      setSelectedCustomer(null);
      setEditMode(false);
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
      const result = await salesService.create(newSale);
      if (result.success) {
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
    setIsSubmitting(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setIsSubmitting(false);
    setEditMode(false);
    setSelectedProduct(null);
    setSelectedLead(null); // Reiniciar estado del lead seleccionado
    setShowSaleModal(false); // Ocultar modal de venta si estaba abierto
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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setShowMobileMenu(false);
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      cost: product.cost || '',
      stock: product.stock || '',
    });
    setProductImage(product.image || '');
    setSelectedProduct(product);
    setEditMode(true);
    setModalType('product');
    setShowModal(true);
    setIsSubmitting(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      setIsSubmitting(true);
      try {
        await productService.delete(productId);
        await refreshData();
      } catch (error) {
        alert('Error al eliminar producto');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Eliminar solicitud (lead)
  const handleDeleteLead = async (leadId) => {
    if (window.confirm('¿Seguro que deseas eliminar esta solicitud?')) {
      setIsSubmitting(true);
      try {
        await leadService.delete(leadId);
        await refreshData();
      } catch (error) {
        alert('Error al eliminar la solicitud');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    setIsSubmitting(true);
    try {
      await customerService.updateLeadStatus(leadId, newStatus);
      await refreshData();
    } catch (error) {
      alert('Error al actualizar el estado');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guardar cliente automáticamente si es pastel personalizado
  const autoCreateCustomerFromLead = async (lead) => {
    if (lead.type === 'custom_cake_quote' && lead.email) {
      const exists = data.customers.some(c => c.email === lead.email);
      if (!exists) {
        const customerData = {
          name: lead.name,
          email: lead.email,
          phone: lead.phone || '',
          address: lead.address || '',
          birthDate: '',
          preferences: `Pastel personalizado: ${lead.cakeDetails?.flavor || ''}, ${lead.cakeDetails?.servings || ''} porciones.`,
          source: 'Solicitud pastel personalizado',
          originalLeadId: lead.id
        };
        await customerService.create(customerData);
        await refreshData();
      }
    }
  };

  React.useEffect(() => {
    if (data.leads && data.customers) {
      // Ejecuta para cada lead
      data.leads.forEach(lead => {
        autoCreateCustomerFromLead(lead);
      });
    }
    // eslint-disable-next-line
  }, [data.leads, data.customers]);

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
                  .slice(0, 5)
                  .map(lead => (
                    <div key={lead.id} className="summary-item">
                      <span className="summary-customer">{lead.name}</span>
                      <span className="summary-event">{lead.eventType || 'Cotización'}</span>
                      <span className={`summary-status status-${lead.status || 'new'}`}>
                        {lead.status === 'new' && 'Nueva'}
                        {lead.status === 'in_progress' && 'En Proceso'}
                        {lead.status === 'completed' && 'Completada'}
                        {lead.status === 'cancelled' && 'Cancelada'}
                        {!lead.status && 'Nueva'}
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

      case 'products':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Productos</h2>
              <button
                onClick={() => {
                  resetProductForm();
                  setEditMode(false);
                  setSelectedProduct(null);
                  openModal('product');
                }}
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
                    <th className="table-cell">Acciones</th>
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
                      <td className="table-cell">
                        <button
                          className="edit-button"
                          onClick={() => handleEditProduct(product)}
                        >
                          Editar
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Eliminar
                        </button>
                      </td>
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

            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ minWidth: 700 }}>
                <thead>
                  <tr className="table-header">
                    <th className="table-cell">Nombre</th>
                    <th className="table-cell">Email</th>
                    <th className="table-cell">Teléfono</th>
                    <th className="table-cell">Dirección</th>
                    <th className="table-cell">Fecha de Nacimiento</th>
                    <th className="table-cell" style={{ minWidth: 120 }}>Acciones</th>
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
                      <td className="table-cell" style={{ minWidth: 120 }}>
                        <button
                          className="edit-button"
                          style={{
                            padding: '6px 10px',
                            marginRight: 8,
                            color: '#3498db',
                            border: '1px solid #ccc',
                            background: '#f9f9f9',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: '1rem'
                          }}
                          onClick={() => {
                            setNewCustomer({
                              name: customer.name || '',
                              email: customer.email || '',
                              phone: customer.phone || '',
                              address: customer.address || '',
                              birthDate: customer.birthDate || '',
                              preferences: customer.preferences || ''
                            });
                            setEditMode(true);
                            setSelectedCustomer(customer); // <-- Asegúrate de guardar el cliente editado
                            setModalType('customer');
                            setShowModal(true);
                            setIsSubmitting(false);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="delete-button"
                          style={{
                            padding: '6px 10px',
                            color: '#e74c3c',
                            border: '1px solid #ccc',
                            background: '#f9f9f9',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: '1rem'
                          }}
                          onClick={async (e) => {
                            e.preventDefault();
                            if (isSubmitting) return;
                            if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
                              setIsSubmitting(true);
                              try {
                                await customerService.delete(customer.id);
                                await refreshData();
                              } catch (error) {
                                alert('Error al eliminar el cliente');
                              } finally {
                                setIsSubmitting(false);
                              }
                            }
                          }}
                          disabled={isSubmitting}
                        >
                          Eliminar
                        </button>
                      </td>
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
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Solicitudes</h2>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr className="table-header">
                    <th className="table-cell">Nombre</th>
                    <th className="table-cell">Teléfono</th>
                    <th className="table-cell">¿Qué solicitó?</th>
                    <th className="table-cell">Estado</th>
                    <th className="table-cell">Eliminar</th> {/* Nueva columna */}
                  </tr>
                </thead>
                <tbody>
                  {data.leads.map(lead => (
                    <tr key={lead.id} className="table-row">
                      <td className="table-cell">{lead.name}</td>
                      <td className="table-cell">{lead.phone}</td>
                      <td className="table-cell">
                        {lead.message 
                          ? lead.message 
                          : lead.cakeDetails 
                            ? `Pastel: ${lead.cakeDetails.flavor || ''} ${lead.cakeDetails.servings ? `(${lead.cakeDetails.servings} porciones)` : ''}` 
                            : 'Sin detalles'}
                      </td>
                      <td className="table-cell">
                        <select
                          value={lead.status || 'new'}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            if (newStatus === 'completed') {
                              setSelectedLead(lead);
                              setShowSaleModal(true);
                            } else {
                              await updateLeadStatus(lead.id, newStatus);
                            }
                          }}
                          className="form-input status-select"
                          disabled={isSubmitting}
                          style={{ minWidth: 140, padding: '8px' }}
                        >
                          <option value="new">Nueva</option>
                          <option value="in_progress">En Proceso</option>
                          <option value="completed">Completada</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                      </td>
                      <td className="table-cell">
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteLead(lead.id)}
                          disabled={isSubmitting}
                          style={{ padding: '6px 12px', color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'creations':
        return (
          <CreationsManager
            creations={data.creations || []}
            refreshData={refreshData}
          />
        );

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
            { id: 'promotions', label: 'Promociones', icon: '📧' },
            { id: 'creations', label: 'Nuestras Creaciones', icon: '🖼️' } // <-- Nueva opción
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
                  <h3 className="modal-title">
                    {editMode ? 'Editar Producto' : 'Nuevo Producto'}
                  </h3>
                  
                  {/* NUEVO: Subida de imagen */}
                  <div className="form-group">
                    <label className="form-label">Imagen del Producto</label>
                    <ImageUploader
                      onImageUpload={result => setProductImage(result.url)}
                      currentImage={productImage}
                      category="products"
                    />
                  </div>

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
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                      className="form-input"
                      required
                    >
                      <option value="">Selecciona o escribe una categoría</option>
                      {existingCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__new__">+ Nueva categoría...</option>
                    </select>
                    {newProduct.category === "__new__" && (
                      <input
                        type="text"
                        placeholder="Nueva categoría"
                        className="form-input"
                        autoFocus
                        onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                      />
                    )}
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
                      {editMode ? 'Guardar Cambios' : 'Guardar Producto'}
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
                          <select
                            value={product.productId || ''}
                            onChange={e => {
                              const selectedId = e.target.value;
                              if (selectedId === 'custom') {
                                updateProductInSale(index, 'productId', 'custom');
                                updateProductInSale(index, 'name', '');
                                updateProductInSale(index, 'price', '');
                              } else {
                                const prod = data.products.find(p => p.id === selectedId);
                                updateProductInSale(index, 'productId', prod.id);
                                updateProductInSale(index, 'name', prod.name);
                                updateProductInSale(index, 'price', prod.price);
                              }
                            }}
                            className="product-input"
                            required
                          >
                            <option value="">Selecciona producto</option>
                            {data.products.map(prod => (
                              <option key={prod.id} value={prod.id}>{prod.name}</option>
                            ))}
                            <option value="custom">Pastel personalizado</option>
                          </select>
                          {/* Si es personalizado, deja escribir el nombre */}
                          {product.productId === 'custom' && (
                            <input
                              type="text"
                              value={product.name}
                              onChange={e => updateProductInSale(index, 'name', e.target.value)}
                              placeholder="Nombre personalizado"
                              className="product-input"
                              required
                            />
                          )}
                          <input
                            type="number"
                            step="0.01"
                            value={product.price}
                            onChange={e => updateProductInSale(index, 'price', e.target.value)}
                            placeholder="Precio"
                            className="product-input price"
                            required
                          />
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={e => updateProductInSale(index, 'quantity', e.target.value)}
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

        {showSaleModal && (
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
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  try {
                    await salesService.create({
                      customerName: selectedLead.name,
                      customerEmail: selectedLead.email,
                      products: newSale.products,
                      total: newSale.total,
                      paymentMethod: newSale.paymentMethod,
                      notes: newSale.notes,
                    });

                    // Descontar stock de productos registrados
                    for (const product of newSale.products) {
                      if (product.productId && product.productId !== 'custom') {
                        const prod = data.products.find(p => p.id === product.productId);
                        if (prod) {
                          const newStock = (parseInt(prod.stock, 10) || 0) - (parseInt(product.quantity, 10) || 0);
                          await productService.update(prod.id, { stock: newStock });
                        }
                      }
                    }

                    await updateLeadStatus(selectedLead.id, 'completed');
                    setShowSaleModal(false);
                    setSelectedLead(null);
                    resetSaleForm();
                    await refreshData();
                  } catch (error) {
                    alert('Error al registrar la venta');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <h3 className="modal-title">Registrar Venta de Solicitud</h3>
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
                        <select
                          value={product.productId || ''}
                          onChange={e => {
                            const selectedId = e.target.value;
                            if (selectedId === 'custom') {
                              updateProductInSale(index, 'productId', 'custom');
                              updateProductInSale(index, 'name', '');
                              updateProductInSale(index, 'price', '');
                            } else {
                              const prod = data.products.find(p => p.id === selectedId);
                              updateProductInSale(index, 'productId', prod.id);
                              updateProductInSale(index, 'name', prod.name);
                              updateProductInSale(index, 'price', prod.price);
                            }
                          }}
                          className="product-input"
                          required
                        >
                          <option value="">Selecciona producto</option>
                          {data.products.map(prod => (
                            <option key={prod.id} value={prod.id}>{prod.name}</option>
                          ))}
                          <option value="custom">Pastel personalizado</option>
                        </select>
                        {/* Si es personalizado, deja escribir el nombre */}
                        {product.productId === 'custom' && (
                          <input
                            type="text"
                            value={product.name}
                            onChange={e => updateProductInSale(index, 'name', e.target.value)}
                            placeholder="Nombre personalizado"
                            className="product-input"
                            required
                          />
                        )}
                        <input
                          type="number"
                          step="0.01"
                          value={product.price}
                          onChange={e => updateProductInSale(index, 'price', e.target.value)}
                          placeholder="Precio"
                          className="product-input price"
                          required
                        />
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={e => updateProductInSale(index, 'quantity', e.target.value)}
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
                  <label className="form-label">Total</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSale.total}
                    onChange={(e) => setNewSale(prev => ({ ...prev, total: e.target.value }))}
                    className="form-input"
                    required
                  />
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
                  <button type="button" onClick={() => setShowSaleModal(false)} className="cancel-button">
                    Cancelar
                  </button>
                  <button type="submit" className="submit-button sale" disabled={isSubmitting}>
                    Registrar Venta
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;