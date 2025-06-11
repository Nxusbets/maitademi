import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { expenseService } from '../services/firebaseService';

const ExpenseManager = ({ data, refreshData }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'edit', 'delete'
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const openModal = (type, expense = null) => {
    setModalType(type);
    setSelectedExpense(expense);
    
    if (type === 'edit' && expense) {
      setExpenseForm({
        description: expense.description || '',
        amount: expense.amount || '',
        category: expense.category || '',
        date: expense.date || '',
        notes: expense.notes || ''
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
    setSelectedExpense(null);
    setIsSubmitting(false);
    resetForm();
  };

  const resetForm = () => {
    setExpenseForm({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const expenseData = {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        updatedAt: new Date()
      };

      let result;
      if (modalType === 'edit') {
        result = await expenseService.update(selectedExpense.id, expenseData);
      } else {
        expenseData.createdAt = new Date();
        result = await expenseService.create(expenseData);
      }
      
      if (result.success) {
        await refreshData();
        closeModal();
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedExpense || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const result = await expenseService.delete(selectedExpense.id);
      if (result.success) {
        await refreshData();
        closeModal();
      } else {
        console.error('Error deleting expense:', result.error);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">Gastos</h2>
        <button
          onClick={() => openModal('create')}
          className="add-button expense"
        >
          + Nuevo Gasto
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr className="table-header">
              <th className="table-cell">Descripción</th>
              <th className="table-cell">Categoría</th>
              <th className="table-cell">Monto</th>
              <th className="table-cell">Fecha</th>
              <th className="table-cell">Notas</th>
              <th className="table-cell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.expenses && data.expenses.length > 0 ? (
              data.expenses.map(expense => (
                <tr key={expense.id} className="table-row">
                  <td className="table-cell">{expense.description}</td>
                  <td className="table-cell secondary">{expense.category}</td>
                  <td className="table-cell danger">${expense.amount}</td>
                  <td className="table-cell secondary">{expense.date}</td>
                  <td className="table-cell secondary">{expense.notes || '-'}</td>
                  <td className="table-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => openModal('edit', expense)}
                        className="edit-button"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => openModal('delete', expense)}
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
                  No hay gastos registrados
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
                    {modalType === 'edit' ? 'Editar Gasto' : 'Nuevo Gasto'}
                  </h3>
                  
                  <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <input
                      type="text"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
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
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <input
                      type="text"
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fecha</label>
                    <input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                      className="form-input"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notas</label>
                    <textarea
                      value={expenseForm.notes}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, notes: e.target.value }))}
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
                      {isSubmitting ? 'Guardando...' : modalType === 'edit' ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'delete' && (
                <div>
                  <h3 className="modal-title">Eliminar Gasto</h3>
                  <p>¿Estás seguro de que quieres eliminar este gasto?</p>
                  <div className="expense-details">
                    <strong>{selectedExpense?.description}</strong><br />
                    Monto: ${selectedExpense?.amount}<br />
                    Categoría: {selectedExpense?.category}
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

export default ExpenseManager;