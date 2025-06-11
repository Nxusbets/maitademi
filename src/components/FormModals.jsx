import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FormModals = ({ 
  showModal, 
  modalType, 
  closeModal,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  data,
  productHelpers,
  customerHelpers,
  saleHelpers
}) => {
  return (
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
              <ProductForm 
                formData={formData.product}
                setFormData={setFormData.setProduct}
                onSubmit={onSubmit.product}
                closeModal={closeModal}
                isSubmitting={isSubmitting}
              />
            )}

            {modalType === 'customer' && (
              <CustomerForm 
                formData={formData.customer}
                setFormData={setFormData.setCustomer}
                onSubmit={onSubmit.customer}
                closeModal={closeModal}
                isSubmitting={isSubmitting}
              />
            )}

            {modalType === 'sale' && (
              <SaleForm 
                formData={formData.sale}
                setFormData={setFormData.setSale}
                onSubmit={onSubmit.sale}
                closeModal={closeModal}
                isSubmitting={isSubmitting}
                customers={data.customers}
                saleHelpers={saleHelpers}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Sub-componentes de formularios
const ProductForm = ({ formData, setFormData, onSubmit, closeModal, isSubmitting }) => (
  <form onSubmit={onSubmit}>
    <h3 className="modal-title">Nuevo Producto</h3>
    
    <div className="form-group">
      <label className="form-label">Nombre del Producto</label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        className="form-input"
        required
        disabled={isSubmitting}
      />
    </div>

    <div className="form-group">
      <label className="form-label">Descripción</label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        rows="3"
        className="form-textarea"
        required
        disabled={isSubmitting}
      />
    </div>

    <div className="form-grid">
      <div className="form-group">
        <label className="form-label">Precio de Venta</label>
        <input
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
          className="form-input"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Costo</label>
        <input
          type="number"
          step="0.01"
          value={formData.cost}
          onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
          className="form-input"
          required
          disabled={isSubmitting}
        />
      </div>
    </div>

    <div className="form-group">
      <label className="form-label">Categoría</label>
      <input
        type="text"
        value={formData.category}
        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
        className="form-input"
        required
        disabled={isSubmitting}
      />
    </div>

    <div className="form-group">
      <label className="form-label">Stock</label>
      <input
        type="number"
        value={formData.stock}
        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
        className="form-input"
        required
        disabled={isSubmitting}
      />
    </div>

    <div className="modal-actions">
      <button type="button" onClick={closeModal} className="cancel-button" disabled={isSubmitting}>
        Cancelar
      </button>
      <button type="submit" className="submit-button product" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
      </button>
    </div>
  </form>
);

const CustomerForm = ({ formData, setFormData, onSubmit, closeModal, isSubmitting }) => (
  <form onSubmit={onSubmit}>
    <h3 className="modal-title">Nuevo Cliente</h3>
    
    <div className="form-group">
      <label className="form-label">Nombre</label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        className="form-input"
        required
        disabled={isSubmitting}
      />
    </div>

    <div className="form-group">
      <label className="form-label">Correo Electrónico</label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        className="form-input"
        required
        disabled={isSubmitting}
      />
    </div>

    <div className="form-group">
      <label className="form-label">Teléfono</label>
      <input
        type="text"
        value={formData.phone}
        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        className="form-input"
        required
        disabled={isSubmitting}
      />
    </div>

    <div className="form-group">
      <label className="form-label">Dirección</label>
      <input
        type="text"
        value={formData.address}
        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
        className="form-input"
        required
        disabled={isSubmitting}
      />
    </div>

    <div className="form-group">
      <label className="form-label">Fecha de Nacimiento</label>
      <input
        type="date"
        value={formData.birthDate}
        onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
        className="form-input"
        disabled={isSubmitting}
      />
    </div>

    <div className="form-group">
      <label className="form-label">Preferencias</label>
      <textarea
        value={formData.preferences}
        onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
        rows="3"
        className="form-textarea"
        disabled={isSubmitting}
      />
    </div>

    <div className="modal-actions">
      <button type="button" onClick={closeModal} className="cancel-button" disabled={isSubmitting}>
        Cancelar
      </button>
      <button type="submit" className="submit-button customer" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
      </button>
    </div>
  </form>
);

const SaleForm = ({ formData, setFormData, onSubmit, closeModal, isSubmitting, customers, saleHelpers }) => (
  <form onSubmit={onSubmit}>
    <h3 className="modal-title">Nueva Venta</h3>
    
    <div className="form-group">
      <label className="form-label">Cliente</label>
      <select
        value={formData.customerId}
        onChange={(e) => {
          const selectedCustomer = customers.find(c => c.id === e.target.value);
          setFormData(prev => ({ 
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
        {customers.map(customer => (
          <option key={customer.id} value={customer.id}>
            {customer.name} - {customer.email}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label className="form-label">Productos</label>
      <div className="products-container">
        {formData.products.length === 0 && (
          <span className="products-placeholder">
            Agregar productos a la venta
          </span>
        )}

        {formData.products.map((product, index) => (
          <div key={index} className="product-row">
            <input
              type="text"
              value={product.name}
              onChange={(e) => saleHelpers.updateProduct(index, 'name', e.target.value)}
              placeholder="Nombre del producto"
              className="product-input"
              required
              disabled={isSubmitting}
            />
            <input
              type="number"
              step="0.01"
              value={product.price}
              onChange={(e) => saleHelpers.updateProduct(index, 'price', e.target.value)}
              placeholder="Precio"
              className="product-input price"
              required
              disabled={isSubmitting}
            />
            <input
              type="number"
              value={product.quantity}
              onChange={(e) => saleHelpers.updateProduct(index, 'quantity', e.target.value)}
              placeholder="Cantidad"
              className="product-input quantity"
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => saleHelpers.removeProduct(index)}
              className="remove-button"
              disabled={isSubmitting}
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={saleHelpers.addProduct}
          className="add-product-button"
          disabled={isSubmitting}
        >
          + Agregar Producto
        </button>
      </div>
    </div>

    <div className="form-group">
      <label className="form-label">Método de Pago</label>
      <select
        value={formData.paymentMethod}
        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
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
        value={formData.notes}
        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        rows="3"
        className="form-textarea"
        disabled={isSubmitting}
      />
    </div>

    <div className="modal-actions">
      <button type="button" onClick={closeModal} className="cancel-button" disabled={isSubmitting}>
        Cancelar
      </button>
      <button type="submit" className="submit-button sale" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar Venta'}
      </button>
    </div>
  </form>
);

export default FormModals;