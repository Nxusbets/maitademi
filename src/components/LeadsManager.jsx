import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { leadService, customerService } from '../services/firebaseService';
import MobileCard from './MobileCard';

const LeadsManager = ({ data, refreshData }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'convert', 'delete', 'status'
  const [selectedLead, setSelectedLead] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (type, lead = null) => {
    setModalType(type);
    setSelectedLead(lead);
    setShowModal(true);
    setIsSubmitting(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedLead(null);
    setIsSubmitting(false);
  };

  // Convertir lead a cliente
  const convertToCustomer = async () => {
    if (!selectedLead || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const customerData = {
        name: selectedLead.name,
        email: selectedLead.email,
        phone: selectedLead.phone,
        address: selectedLead.address || '',
        birthDate: '',
        preferences: `Interés inicial: ${selectedLead.eventType || 'No especificado'}. Fecha del evento: ${selectedLead.eventDate || 'No especificada'}. Detalles: ${selectedLead.message || 'Ninguno'}`,
        source: 'Cotización web',
        convertedFromLead: true,
        originalLeadId: selectedLead.id
      };

      const customerResult = await customerService.create(customerData);
      
      if (customerResult.success) {
        await leadService.update(selectedLead.id, { 
          status: 'converted',
          convertedAt: new Date(),
          customerId: customerResult.data.id
        });
        
        await refreshData();
        closeModal();
      }
    } catch (error) {
      console.error('Error converting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar lead
  const deleteLead = async () => {
    if (!selectedLead || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const result = await leadService.delete(selectedLead.id);
      if (result.success) {
        await refreshData();
        closeModal();
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Marcar como contactado
  const markAsContacted = async (leadId) => {
    try {
      await leadService.update(leadId, { 
        status: 'contacted',
        contactedAt: new Date()
      });
      await refreshData();
    } catch (error) {
      console.error('Error marking as contacted:', error);
    }
  };

  // Actualizar estado del lead
  const updateLeadStatus = async (status) => {
    if (!selectedLead || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const updateData = { 
        status: status,
        updatedAt: new Date()
      };

      // Agregar campos específicos según el estado
      if (status === 'preparing') {
        updateData.preparingStartedAt = new Date();
      } else if (status === 'completed') {
        updateData.completedAt = new Date();
      } else if (status === 'cancelled') {
        updateData.cancelledAt = new Date();
      }

      const result = await leadService.update(selectedLead.id, updateData);
      
      if (result.success) {
        await refreshData();
        closeModal();
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contactar por WhatsApp
  const contactViaWhatsApp = (lead) => {
    const message = `¡Hola ${lead.name}! 

Hemos recibido tu solicitud de cotización para ${lead.eventType || 'tu evento'}.

📅 Fecha del evento: ${lead.eventDate ? new Date(lead.eventDate).toLocaleDateString('es-MX') : 'No especificada'}
${lead.budget ? `💰 Presupuesto: $${parseInt(lead.budget).toLocaleString()} MXN` : ''}
${lead.cakeDetails?.servings ? `🍰 Porciones: ${lead.cakeDetails.servings}` : ''}

Te contactaremos pronto con más detalles y una cotización personalizada.

¡Gracias por elegir Pastelería Maitademi! 🍰`;

    const cleanPhone = lead.phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('52') ? cleanPhone : `52${cleanPhone}`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { label: 'Nuevo', class: 'status-new' },
      contacted: { label: 'Contactado', class: 'status-contacted' },
      preparing: { label: 'Preparando', class: 'status-preparing' },
      completed: { label: 'Terminado', class: 'status-completed' },
      cancelled: { label: 'Cancelado', class: 'status-cancelled' },
      converted: { label: 'Convertido', class: 'status-converted' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getCakeDetails = (lead) => {
    if (lead.type === 'custom_cake_quote' && lead.cakeDetails) {
      return (
        <div className="cake-details">
          <h5>Detalles del Pastel:</h5>
          <ul>
            <li><strong>Porciones:</strong> {lead.cakeDetails.servings}</li>
            <li><strong>Sabor:</strong> {lead.cakeDetails.flavor}</li>
            <li><strong>Relleno:</strong> {lead.cakeDetails.filling}</li>
            {lead.cakeDetails.specialInstructions && (
              <li><strong>Instrucciones:</strong> {lead.cakeDetails.specialInstructions}</li>
            )}
          </ul>
          {lead.budget && <p><strong>Presupuesto:</strong> ${lead.budget} MXN</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">Leads - Solicitudes de Cotización</h2>
        <div className="leads-stats">
          <span className="leads-count">
            {data.leads ? data.leads.filter(lead => lead.status === 'new' || !lead.status).length : 0} nuevos
          </span>
        </div>
      </div>

      {/* Vista de tabla para desktop */}
      <div className="table-container">
        <table className="data-table leads-table">
          <thead>
            <tr className="table-header">
              <th className="table-cell">Nombre</th>
              <th className="table-cell hide-mobile">Email</th>
              <th className="table-cell">Tipo</th>
              <th className="table-cell hide-mobile">Fecha del Evento</th>
              <th className="table-cell">Estado</th>
              <th className="table-cell hide-mobile">Fecha de Solicitud</th>
              <th className="table-cell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.leads && data.leads.length > 0 ? (
              data.leads.map(lead => (
                <tr key={lead.id} className="table-row">
                  <td className="table-cell">
                    <div className="customer-name">
                      {lead.name}
                      {/* Mostrar tipo de solicitud como badge */}
                      {lead.type === 'custom_cake_quote' && (
                        <span className="lead-type-badge cake">🍰</span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell secondary hide-mobile">
                    <a href={`mailto:${lead.email}`} className="email-link">
                      {lead.email}
                    </a>
                  </td>
                  <td className="table-cell">
                    <div className="event-type">
                      {lead.eventType || 'Cotización general'}
                      {/* Mostrar porciones si es pastel personalizado */}
                      {lead.cakeDetails?.servings && (
                        <small className="servings-info">
                          {lead.cakeDetails.servings} porciones
                        </small>
                      )}
                    </div>
                  </td>
                  <td className="table-cell secondary hide-mobile">
                    {lead.eventDate ? (
                      <span className="event-date">
                        {new Date(lead.eventDate).toLocaleDateString('es-MX')}
                      </span>
                    ) : (
                      <span className="no-date">No especificada</span>
                    )}
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(lead.status || 'new')}
                  </td>
                  <td className="table-cell secondary hide-mobile">
                    {lead.createdAt ? (
                      <span className="creation-date">
                        {lead.createdAt.seconds 
                          ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString('es-MX')
                          : new Date(lead.createdAt).toLocaleDateString('es-MX')}
                      </span>
                    ) : (
                      <span className="no-date">N/A</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="action-buttons">
                      {/* Ver detalles */}
                      <button
                        onClick={() => openModal('view', lead)}
                        className="view-button"
                        title="Ver detalles"
                      >
                        👁️
                      </button>
                      
                      {/* WhatsApp */}
                      <button
                        onClick={() => contactViaWhatsApp(lead)}
                        className="whatsapp-button"
                        title="Contactar por WhatsApp"
                      >
                        📱
                      </button>

                      {/* Marcar como contactado - solo para leads nuevos */}
                      {(lead.status === 'new' || !lead.status) && (
                        <button
                          onClick={() => markAsContacted(lead.id)}
                          className="contact-button"
                          title="Marcar como contactado"
                        >
                          📞
                        </button>
                      )}

                      {/* Cambiar estado - no para cancelados o completados */}
                      {lead.status !== 'cancelled' && lead.status !== 'completed' && (
                        <button
                          onClick={() => openModal('status', lead)}
                          className="status-button"
                          title="Cambiar estado"
                        >
                          🔄
                        </button>
                      )}
                      
                      {/* Convertir a cliente - no para convertidos o cancelados */}
                      {lead.status !== 'converted' && lead.status !== 'cancelled' && (
                        <button
                          onClick={() => openModal('convert', lead)}
                          className="convert-button"
                          title="Convertir a cliente"
                        >
                          👤
                        </button>
                      )}
                      
                      {/* Eliminar */}
                      <button
                        onClick={() => openModal('delete', lead)}
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
                <td colSpan="7" className="table-cell empty-state">
                  <div className="empty-message">
                    <span className="empty-icon">📝</span>
                    <p>No hay solicitudes de cotización</p>
                    <small>Las solicitudes aparecerán aquí cuando los clientes llenen el formulario</small>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de cards para móvil */}
      <div className="mobile-cards">
        {data.leads && data.leads.length > 0 ? (
          data.leads.map(lead => (
            <MobileCard
              key={lead.id}
              title={lead.name}
              subtitle={lead.eventType || 'Cotización general'}
              badge={getStatusBadge(lead.status || 'new')}
              borderColor="#9b59b6"
              fields={[
                { label: 'Email', value: lead.email },
                { label: 'Teléfono', value: lead.phone },
                { label: 'Fecha del evento', value: lead.eventDate ? new Date(lead.eventDate).toLocaleDateString('es-MX') : 'No especificada' },
                { label: 'Presupuesto', value: lead.budget ? `$${parseInt(lead.budget).toLocaleString()} MXN` : 'No especificado' },
                { label: 'Solicitud', value: lead.createdAt ? (lead.createdAt.seconds ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString('es-MX') : new Date(lead.createdAt).toLocaleDateString('es-MX')) : 'N/A' }
              ]}
              actions={[
                {
                  icon: '👁️',
                  label: 'Ver',
                  onClick: () => openModal('view', lead),
                  className: 'view-button',
                  title: 'Ver detalles'
                },
                {
                  icon: '📱',
                  label: 'WhatsApp',
                  onClick: () => contactViaWhatsApp(lead),
                  className: 'whatsapp-button',
                  title: 'WhatsApp'
                },
                ...(lead.status !== 'cancelled' && lead.status !== 'completed' ? [{
                  icon: '🔄',
                  label: 'Estado',
                  onClick: () => openModal('status', lead),
                  className: 'status-button',
                  title: 'Cambiar estado'
                }] : []),
                ...(lead.status !== 'converted' && lead.status !== 'cancelled' ? [{
                  icon: '👤',
                  label: 'Convertir',
                  onClick: () => openModal('convert', lead),
                  className: 'convert-button',
                  title: 'Convertir'
                }] : []),
                {
                  icon: '🗑️',
                  label: 'Eliminar',
                  onClick: () => openModal('delete', lead),
                  className: 'delete-button',
                  title: 'Eliminar'
                }
              ]}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-message">
              <span className="empty-icon">📝</span>
              <p>No hay solicitudes de cotización</p>
              <small>Las solicitudes aparecerán aquí cuando los clientes llenen el formulario</small>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="leads-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-number">{data.leads ? data.leads.length : 0}</span>
            <span className="stat-label">Total de solicitudes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {data.leads ? data.leads.filter(lead => lead.status === 'new' || !lead.status).length : 0}
            </span>
            <span className="stat-label">Nuevas</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {data.leads ? data.leads.filter(lead => lead.status === 'preparing').length : 0}
            </span>
            <span className="stat-label">Preparando</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {data.leads ? data.leads.filter(lead => lead.status === 'completed').length : 0}
            </span>
            <span className="stat-label">Terminados</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {data.leads ? data.leads.filter(lead => lead.status === 'converted').length : 0}
            </span>
            <span className="stat-label">Convertidas</span>
          </div>
        </div>
      </div>

      {/* Modales */}
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
              {modalType === 'view' && (
                <div>
                  <h3 className="modal-title">Detalles de la Solicitud</h3>
                  
                  <div className="lead-details">
                    <div className="detail-group">
                      <h4>Información del Cliente</h4>
                      <p><strong>Nombre:</strong> {selectedLead?.name}</p>
                      <p><strong>Email:</strong> {selectedLead?.email}</p>
                      <p><strong>Teléfono:</strong> {selectedLead?.phone}</p>
                      <p><strong>Dirección:</strong> {selectedLead?.address || 'No proporcionada'}</p>
                    </div>

                    <div className="detail-group">
                      <h4>Detalles del Evento</h4>
                      <p><strong>Tipo de evento:</strong> {selectedLead?.eventType || 'No especificado'}</p>
                      <p><strong>Fecha del evento:</strong> {selectedLead?.eventDate || 'No especificada'}</p>
                      <p><strong>Número de invitados:</strong> {selectedLead?.guestCount || 'No especificado'}</p>
                      {selectedLead?.budget && (
                        <p><strong>Presupuesto:</strong> ${parseInt(selectedLead.budget).toLocaleString()} MXN</p>
                      )}
                    </div>

                    <div className="detail-group">
                      <h4>Mensaje del Cliente</h4>
                      <p>{selectedLead?.message || 'Sin mensaje adicional'}</p>
                    </div>

                    <div className="detail-group">
                      <h4>Estado</h4>
                      <p>{getStatusBadge(selectedLead?.status || 'new')}</p>
                    </div>

                    {getCakeDetails(selectedLead)}
                  </div>

                  <div className="modal-actions">
                    <button 
                      onClick={closeModal} 
                      className="cancel-button"
                    >
                      Cerrar
                    </button>
                    <button 
                      onClick={() => contactViaWhatsApp(selectedLead)}
                      className="submit-button whatsapp"
                    >
                      📱 Contactar por WhatsApp
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'status' && (
                <div>
                  <h3 className="modal-title">Cambiar Estado</h3>
                  <p>Selecciona el nuevo estado para esta solicitud:</p>
                  
                  <div className="lead-summary">
                    <p><strong>Cliente:</strong> {selectedLead?.name}</p>
                    <p><strong>Evento:</strong> {selectedLead?.eventType}</p>
                    <p><strong>Estado actual:</strong> {getStatusBadge(selectedLead?.status || 'new')}</p>
                  </div>

                  <div className="status-options">
                    {selectedLead?.status !== 'preparing' && (
                      <button 
                        onClick={() => updateLeadStatus('preparing')}
                        className="status-option-button preparing"
                        disabled={isSubmitting}
                      >
                        🔄 Marcar como Preparando
                      </button>
                    )}
                    
                    {(selectedLead?.status === 'preparing' || selectedLead?.status === 'contacted') && (
                      <button 
                        onClick={() => updateLeadStatus('completed')}
                        className="status-option-button completed"
                        disabled={isSubmitting}
                      >
                        ✅ Marcar como Terminado
                      </button>
                    )}
                    
                    {selectedLead?.status !== 'cancelled' && selectedLead?.status !== 'completed' && (
                      <button 
                        onClick={() => updateLeadStatus('cancelled')}
                        className="status-option-button cancelled"
                        disabled={isSubmitting}
                      >
                        ❌ Marcar como Cancelado
                      </button>
                    )}
                  </div>

                  <div className="modal-actions">
                    <button 
                      onClick={closeModal} 
                      className="cancel-button"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'convert' && (
                <div>
                  <h3 className="modal-title">Convertir a Cliente</h3>
                  <p>¿Deseas convertir este lead en un cliente registrado?</p>
                  
                  <div className="lead-summary">
                    <p><strong>Nombre:</strong> {selectedLead?.name}</p>
                    <p><strong>Email:</strong> {selectedLead?.email}</p>
                    <p><strong>Teléfono:</strong> {selectedLead?.phone}</p>
                  </div>

                  <div className="modal-actions">
                    <button 
                      onClick={closeModal} 
                      className="cancel-button"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={convertToCustomer}
                      className="submit-button customer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Convirtiendo...' : 'Convertir a Cliente'}
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'delete' && (
                <div>
                  <h3 className="modal-title">Eliminar Lead</h3>
                  <p>¿Estás seguro de que quieres eliminar esta solicitud de cotización?</p>
                  
                  <div className="lead-summary">
                    <p><strong>Cliente:</strong> {selectedLead?.name}</p>
                    <p><strong>Email:</strong> {selectedLead?.email}</p>
                    <p><strong>Evento:</strong> {selectedLead?.eventType}</p>
                  </div>

                  <div className="modal-actions">
                    <button 
                      onClick={closeModal} 
                      className="cancel-button"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={deleteLead}
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

export default LeadsManager;