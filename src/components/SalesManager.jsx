import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { salesService } from '../services/firebaseService';

const SalesManager = ({ data, refreshData }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'edit', 'delete'
  const [selectedSale, setSelectedSale] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saleForm, setSaleForm] = useState({
    customerId: '',
    customerName: '',
    products: [],
    total: '',
    paymentMethod: '',
    notes: ''
  });

  const openModal = (type, sale = null) => {
    setModalType(type);
    setSelectedSale(sale);
    
    if (type === 'edit' && sale) {
      setSaleForm({
        customerId: sale.customerId || '',
        customerName: sale.customerName || '',
        products: sale.products || [],
        total: sale.total || '',
        paymentMethod: sale.paymentMethod || '',
        notes: sale.notes || ''
      });
    } else if (type === 'create') {
      resetForm();
    }
    
    setShowModal(true);
    setIsSubmitting(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedSale(null);
    setIsSubmitting(false);
    resetForm();
  };

  const resetForm = () => {
    setSaleForm({
      customerId: '',
      customerName: '',
      products: [],
      total: '',
      paymentMethod: '',
      notes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const saleData = {
        ...saleForm,
        total: parseFloat(saleForm.total),
        updatedAt: new Date()
      };

      let result;
      if (modalType === 'edit') {
        result = await salesService.update(selectedSale.id, saleData);
      } else {
        saleData.createdAt = new Date();
        result = await salesService.create(saleData);
      }
      
      if (result.success) {
        await refreshData();
        closeModal();
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error submitting sale:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSale || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const result = await salesService.delete(selectedSale.id);
      if (result.success) {
        await refreshData();
        closeModal();
      } else {
        console.error('Error deleting sale:', result.error);
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions for managing products in sale
  const addProduct = () => {
    setSaleForm(prev => ({
      ...prev,
      products: [...prev.products, { name: '', price: '', quantity: 1 }]
    }));
  };

  const updateProduct = (index, field, value) => {
    setSaleForm(prev => ({
      ...prev,
      products: prev.products.map((product, i) => 
        i === index ? { ...product, [field]: value } : product
      )
    }));
  };

  const removeProduct = (index) => {
    setSaleForm(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  // Calculate total automatically
  const calculateTotal = () => {
    const total = saleForm.products.reduce((sum, product) => {
      return sum + ((parseFloat(product.price) || 0) * (parseInt(product.quantity) || 0));
    }, 0);
    setSaleForm(prev => ({ ...prev, total: total.toFixed(2) }));
  };

  React.useEffect(() => {
    calculateTotal();
  }, [saleForm.products]);

  return (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">Ventas</h2>
        <button
          onClick={() => openModal('create')}
          className="add-button sale"
        >
          + Nueva Venta
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr className="table-header">
              <th className="table-cell">Cliente</th>
              <th className="table-cell">Productos</th>
              <th className="table-cell">Total</th>
              <th className="table-cell">Método de Pago</th>
              <th className="table-cell">Fecha</th>
              <th className="table-cell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.sales && data.sales.length > 0 ? (
              data.sales.map(sale => (
                <tr key={sale.id} className="table-row">
                  <td className="table-cell">{sale.customerName || 'Cliente directo'}</td>
                  <td className="table-cell secondary">
                    {sale.products && sale.products.length > 0 
                      ? `${sale.products.length} producto(s)`
                      : 'Sin productos'
                    }
                  </td>
                  <td className="table-cell success">${sale.total}</td>
                  <td className="table-cell secondary">{sale.paymentMethod}</td>
                  <td className="table-cell secondary">
                    {sale.createdAt ? new Date(sale.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="table-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => openModal('edit', sale)}
                        className="edit-button"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => openModal('delete', sale)}
                        className="delete-button"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="table-cell" style={{ textAlign: 'center' }}>
                  No hay ventas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              {(modalType === 'create' || modalType === 'edit') && (
                <form onSubmit={handleSubmit}>
                  <h3 className="modal-title">
                    {modalType === 'edit' ? 'Editar Venta' : 'Nueva Venta'}
                  </h3>
                  
                  <div className="form-group">
                    <label className="form-label">Cliente</label>
                    <select
                      value={saleForm.customerId}
                      onChange={(e) => {
                        const selectedCustomer = data.customers.find(c => c.id === e.target.value);
                        setSaleForm(prev => ({ 
                          ...prev, 
                          customerId: e.target.value,
                          customerName: selectedCustomer ? selectedCustomer.name : ''
                        }));
                      }}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Seleccionar cliente</option>
                      {data.customers && data.customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} - {customer.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Productos</label>
                    <div className="products-container">
                      {saleForm.products.length === 0 && (
                        <span className="products-placeholder">
                          Agregar productos a la venta
                        </span>
                      )}

                      {saleForm.products.map((product, index) => (
                        <div key={index} className="product-row">
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => updateProduct(index, 'name', e.target.value)}
                            placeholder="Nombre del producto"
                            className="product-input"
                            required
                            disabled={isSubmitting}
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={product.price}
                            onChange={(e) => updateProduct(index, 'price', e.target.value)}
                            placeholder="Precio"
                            className="product-input price"
                            required
                            disabled={isSubmitting}
                          />
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                            placeholder="Cantidad"
                            className="product-input quantity"
                            required
                            disabled={isSubmitting}
                          />
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="remove-button"
                            disabled={isSubmitting}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addProduct}
                        className="add-product-button"
                        disabled={isSubmitting}
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
                      value={saleForm.total}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, total: e.target.value }))}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Método de Pago</label>
                    <select
                      value={saleForm.paymentMethod}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="form-input"
                      required
                      disabled={isSubmitting}
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
                      value={saleForm.notes}
                      onChange={(e) => setSaleForm(prev => ({ ...prev, notes: e.target.value }))}
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
                      className="submit-button sale"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Guardando...' : modalType === 'edit' ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'delete' && (
                <div>
                  <h3 className="modal-title">Eliminar Venta</h3>
                  <p>¿Estás seguro de que quieres eliminar esta venta?</p>
                  <div className="expense-details">
                    <strong>Cliente: {selectedSale?.customerName || 'Cliente directo'}</strong><br />
                    Total: ${selectedSale?.total}<br />
                    Método de pago: {selectedSale?.paymentMethod}<br />
                    Productos: {selectedSale?.products?.length || 0} artículo(s)
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
                      onClick={handleDelete}
                      className="delete-confirm-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesManager;