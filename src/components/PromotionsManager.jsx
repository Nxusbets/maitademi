import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { promotionService } from '../services/firebaseService';

const PromotionsManager = ({ data, refreshData }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'edit', 'delete', 'send'
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [promotionForm, setPromotionForm] = useState({
    title: '',
    code: '', // <-- Agregado para el código de promoción
    message: '',
    discount: '',
    validUntil: '',
    type: 'discount',
    status: 'active'
  });

  const openModal = (type, promotion = null) => {
    setModalType(type);
    setSelectedPromotion(promotion);
    
    if (type === 'edit' && promotion) {
      setPromotionForm({
        title: promotion.title || '',
        code: promotion.code || '', // <-- Agregado para el código de promoción
        message: promotion.message || '',
        discount: promotion.discount || '',
        validUntil: promotion.validUntil || '',
        type: promotion.type || 'discount',
        status: promotion.status || 'active'
      });
    } else if (type === 'create') {
      resetForm();
    }
    
    setShowModal(true);
    setIsSubmitting(false);
    setSelectedCustomers([]);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedPromotion(null);
    setIsSubmitting(false);
    setSelectedCustomers([]);
    resetForm();
  };

  const resetForm = () => {
    setPromotionForm({
      title: '',
      code: '', // <-- Agregado para el código de promoción
      message: '',
      discount: '',
      validUntil: '',
      type: 'discount',
      status: 'active'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const promotionData = {
        ...promotionForm,
        updatedAt: new Date()
      };

      let result;
      if (modalType === 'edit') {
        result = await promotionService.update(selectedPromotion.id, promotionData);
      } else {
        promotionData.createdAt = new Date();
        result = await promotionService.create(promotionData);
      }
      
      if (result.success) {
        await refreshData();
        closeModal();
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error submitting promotion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPromotion || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const result = await promotionService.delete(selectedPromotion.id);
      if (result.success) {
        await refreshData();
        closeModal();
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para generar mensaje de WhatsApp
  const generateWhatsAppMessage = (promotion, customerName = '') => {
    const greeting = customerName ? `¡Hola ${customerName}!` : '¡Hola!';
    
    let message = `${greeting}\n\n`;
    message += `🎉 *${promotion.title}*\n\n`;
    message += `${promotion.message}\n\n`;
    
    if (promotion.discount) {
      message += `💰 *${promotion.discount}% de descuento*\n\n`;
    }
    
    if (promotion.validUntil) {
      const validDate = new Date(promotion.validUntil).toLocaleDateString('es-MX');
      message += `⏰ Válido hasta: ${validDate}\n\n`;
    }
    
    message += `📞 ¡Contáctanos para más información!\n`;
    message += `🍰 *Pastelería Maitademi*`;
    
    return message;
  };

  // Enviar promoción por WhatsApp
  const sendToWhatsApp = (phoneNumber, message) => {
    // Limpiar número de teléfono
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    // Agregar código de país si no lo tiene
    const fullPhone = cleanPhone.startsWith('52') ? cleanPhone : `52${cleanPhone}`;
    
    const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Enviar a cliente específico
  const sendToCustomer = (customer, promotion) => {
    const message = generateWhatsAppMessage(promotion, customer.name);
    sendToWhatsApp(customer.phone, message);
  };

  // Enviar promoción masiva
  const sendMassivePromotion = () => {
    if (selectedCustomers.length === 0) {
      alert('Selecciona al menos un cliente');
      return;
    }

    const confirmMessage = `¿Enviar promoción a ${selectedCustomers.length} cliente(s)?`;
    if (!window.confirm(confirmMessage)) return;

    selectedCustomers.forEach((customerId, index) => {
      const customer = data.customers.find(c => c.id === customerId);
      if (customer && customer.phone) {
        // Agregar delay entre envíos para no saturar
        setTimeout(() => {
          sendToCustomer(customer, selectedPromotion);
        }, index * 1000); // 1 segundo entre cada envío
      }
    });

    alert(`Enviando promoción a ${selectedCustomers.length} cliente(s)...`);
    closeModal();
  };

  // Manejar selección de clientes
  const handleCustomerSelection = (customerId) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };

  // Seleccionar todos los clientes
  const selectAllCustomers = () => {
    const allCustomerIds = data.customers
      .filter(customer => customer.phone)
      .map(customer => customer.id);
    setSelectedCustomers(allCustomerIds);
  };

  // Deseleccionar todos
  const deselectAllCustomers = () => {
    setSelectedCustomers([]);
  };

  const getPromotionTypeIcon = (type) => {
    const types = {
      discount: '💰',
      offer: '🎁',
      announcement: '📢'
    };
    return types[type] || '🎉';
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { label: 'Activa', class: 'status-active' },
      inactive: { label: 'Inactiva', class: 'status-inactive' }
    };
    
    const statusConfig = config[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${statusConfig.class}`}>{statusConfig.label}</span>;
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">Promociones</h2>
        <button
          onClick={() => openModal('create')}
          className="add-button promotion"
        >
          + Nueva Promoción
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr className="table-header">
              <th className="table-cell">Título</th>
              <th className="table-cell">Tipo</th>
              <th className="table-cell">Descuento</th>
              <th className="table-cell">Válido hasta</th>
              <th className="table-cell">Estado</th>
              <th className="table-cell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.promotions && data.promotions.length > 0 ? (
              data.promotions.map(promotion => (
                <tr key={promotion.id} className="table-row">
                  <td className="table-cell">
                    {getPromotionTypeIcon(promotion.type)} {promotion.title}
                  </td>
                  <td className="table-cell secondary">{promotion.type}</td>
                  <td className="table-cell success">
                    {promotion.discount ? `${promotion.discount}%` : '-'}
                  </td>
                  <td className="table-cell secondary">
                    {promotion.validUntil ? new Date(promotion.validUntil).toLocaleDateString() : '-'}
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(promotion.status)}
                  </td>
                  <td className="table-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => openModal('send', promotion)}
                        className="send-button"
                        title="Enviar por WhatsApp"
                      >
                        📱
                      </button>
                      <button
                        onClick={() => openModal('edit', promotion)}
                        className="edit-button"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => openModal('delete', promotion)}
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
                  No hay promociones registradas
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
              className="modal-content promotion-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {(modalType === 'create' || modalType === 'edit') && (
                <form onSubmit={handleSubmit}>
                  <h3 className="modal-title">
                    {modalType === 'edit' ? 'Editar Promoción' : 'Nueva Promoción'}
                  </h3>
                  
                  <div className="form-group">
                    <label className="form-label">Título</label>
                    <input
                      type="text"
                      value={promotionForm.title}
                      onChange={(e) => setPromotionForm(prev => ({ ...prev, title: e.target.value }))}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                      placeholder="Ej: Descuento de Temporada"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Código</label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={promotionForm.code}
                      onChange={e => setPromotionForm({ ...promotionForm, code: e.target.value })}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                      placeholder="Ej: PRIMAVERA25"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mensaje</label>
                    <textarea
                      value={promotionForm.message}
                      onChange={(e) => setPromotionForm(prev => ({ ...prev, message: e.target.value }))}
                      rows="4"
                      className="form-textarea"
                      required
                      disabled={isSubmitting}
                      placeholder="Describe tu promoción..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Tipo</label>
                      <select
                        value={promotionForm.type}
                        onChange={(e) => setPromotionForm(prev => ({ ...prev, type: e.target.value }))}
                        className="form-input"
                        disabled={isSubmitting}
                      >
                        <option value="discount">Descuento</option>
                        <option value="offer">Oferta especial</option>
                        <option value="announcement">Anuncio</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Descuento (%)</label>
                      <input
                        type="number"
                        value={promotionForm.discount}
                        onChange={(e) => setPromotionForm(prev => ({ ...prev, discount: e.target.value }))}
                        className="form-input"
                        disabled={isSubmitting}
                        placeholder="10"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Válido hasta</label>
                      <input
                        type="date"
                        value={promotionForm.validUntil}
                        onChange={(e) => setPromotionForm(prev => ({ ...prev, validUntil: e.target.value }))}
                        className="form-input"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Estado</label>
                      <select
                        value={promotionForm.status}
                        onChange={(e) => setPromotionForm(prev => ({ ...prev, status: e.target.value }))}
                        className="form-input"
                        disabled={isSubmitting}
                      >
                        <option value="active">Activa</option>
                        <option value="inactive">Inactiva</option>
                      </select>
                    </div>
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
                      className="submit-button promotion"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Guardando...' : modalType === 'edit' ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'send' && (
                <div>
                  <h3 className="modal-title">Enviar Promoción por WhatsApp</h3>
                  
                  <div className="promotion-preview">
                    <h4>Vista previa del mensaje:</h4>
                    <div className="whatsapp-preview">
                      {generateWhatsAppMessage(selectedPromotion, '[Nombre del cliente]')
                        .split('\n')
                        .map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                    </div>
                  </div>

                  <div className="customer-selection">
                    <div className="selection-header">
                      <h4>Seleccionar clientes:</h4>
                      <div className="selection-buttons">
                        <button 
                          type="button"
                          onClick={selectAllCustomers}
                          className="select-all-button"
                        >
                          Seleccionar todos
                        </button>
                        <button 
                          type="button"
                          onClick={deselectAllCustomers}
                          className="deselect-all-button"
                        >
                          Deseleccionar todos
                        </button>
                      </div>
                    </div>

                    <div className="customers-list">
                      {data.customers
                        .filter(customer => customer.phone)
                        .map(customer => (
                          <label key={customer.id} className="customer-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedCustomers.includes(customer.id)}
                              onChange={() => handleCustomerSelection(customer.id)}
                            />
                            <span className="customer-info">
                              <strong>{customer.name}</strong>
                              <br />
                              <small>{customer.phone} - {customer.email}</small>
                            </span>
                          </label>
                        ))}
                    </div>

                    <div className="selection-summary">
                      <p>
                        <strong>{selectedCustomers.length}</strong> cliente(s) seleccionado(s)
                      </p>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button 
                      type="button" 
                      onClick={closeModal} 
                      className="cancel-button"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={sendMassivePromotion}
                      className="submit-button whatsapp"
                      disabled={selectedCustomers.length === 0}
                    >
                      📱 Enviar por WhatsApp
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'delete' && (
                <div>
                  <h3 className="modal-title">Eliminar Promoción</h3>
                  <p>¿Estás seguro de que quieres eliminar esta promoción?</p>
                  <div className="promotion-details">
                    <strong>{selectedPromotion?.title}</strong><br />
                    Tipo: {selectedPromotion?.type}<br />
                    {selectedPromotion?.discount && `Descuento: ${selectedPromotion.discount}%`}
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

export default PromotionsManager;