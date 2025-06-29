import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../services/firebaseService';

const ProductsManager = ({ data, refreshData }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'edit', 'delete'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: '', cost: '', stock: ''
  });

  const openModal = (type, product = null) => {
    setModalType(type);
    setSelectedProduct(product);
    if (type === 'edit' && product) {
      setProductForm(product);
    } else {
      setProductForm({ name: '', description: '', price: '', category: '', cost: '', stock: '' });
    }
    setShowModal(true);
    setIsSubmitting(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedProduct(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalType === 'create') {
        await productService.create(productForm);
      } else if (modalType === 'edit') {
        await productService.update(selectedProduct.id, productForm);
      }
      await refreshData();
      closeModal();
    } catch (err) {
      alert('Error al guardar producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await productService.delete(selectedProduct.id);
      await refreshData();
      closeModal();
    } catch (err) {
      alert('Error al eliminar producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="products-manager">
      <div className="section-header">
        <h2 className="section-title">Productos</h2>
        <button onClick={() => openModal('create')} className="add-button product">
          + Nuevo Producto
        </button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.products && data.products.length > 0 ? (
              data.products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button onClick={() => openModal('edit', product)}>Editar</button>
                    <button onClick={() => openModal('delete', product)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No hay productos</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              {(modalType === 'create' || modalType === 'edit') && (
                <form onSubmit={handleSubmit}>
                  <h3>{modalType === 'edit' ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                  <input type="text" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="Nombre" required />
                  <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} placeholder="Descripción" required />
                  <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="Precio" required />
                  <input type="text" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} placeholder="Categoría" required />
                  <input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} placeholder="Stock" required />
                  <div className="modal-actions">
                    <button type="button" onClick={closeModal}>Cancelar</button>
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
                  </div>
                </form>
              )}
              {modalType === 'delete' && (
                <div>
                  <h3>Eliminar Producto</h3>
                  <p>¿Seguro que deseas eliminar <strong>{selectedProduct?.name}</strong>?</p>
                  <div className="modal-actions">
                    <button type="button" onClick={closeModal}>Cancelar</button>
                    <button onClick={handleDelete} disabled={isSubmitting}>{isSubmitting ? 'Eliminando...' : 'Eliminar'}</button>
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

export default ProductsManager;