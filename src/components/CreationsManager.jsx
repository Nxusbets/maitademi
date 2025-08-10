import React, { useState } from 'react';
import { creationService } from '../services/creationService'; // Cambia la importación al archivo correcto
import ImageUploader from './ImageUploader';

const CreationsManager = ({ creations, refreshData }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCreation, setSelectedCreation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCreation, setNewCreation] = useState({
    title: '',
    description: '',
    image: ''
  });

  const openModal = (creation = null) => {
    if (creation) {
      setNewCreation({
        title: creation.title || '',
        description: creation.description || '',
        image: creation.image || ''
      });
      setEditMode(true);
      setSelectedCreation(creation);
    } else {
      setNewCreation({ title: '', description: '', image: '' });
      setEditMode(false);
      setSelectedCreation(null);
    }
    setShowModal(true);
    setIsSubmitting(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedCreation(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editMode && selectedCreation) {
        await creationService.update(selectedCreation.id, newCreation);
      } else {
        await creationService.create(newCreation);
      }
      await refreshData();
      closeModal();
    } catch (error) {
      alert('Error al guardar la creación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta creación?')) {
      setIsSubmitting(true);
      try {
        await creationService.delete(id);
        await refreshData();
      } catch (error) {
        alert('Error al eliminar la creación');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">Nuestras Creaciones</h2>
        <button
          onClick={() => openModal()}
          className="add-button"
        >
          + Nueva Creación
        </button>
      </div>
      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ minWidth: 600 }}>
          <thead>
            <tr className="table-header">
              <th className="table-cell">Imagen</th>
              <th className="table-cell">Título</th>
              <th className="table-cell">Descripción</th>
              <th className="table-cell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {creations.map(creation => (
              <tr key={creation.id} className="table-row">
                <td className="table-cell">
                  {creation.image && (
                    <img src={creation.image} alt={creation.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                  )}
                </td>
                <td className="table-cell">{creation.title}</td>
                <td className="table-cell">{creation.description}</td>
                <td className="table-cell">
                  <button
                    className="edit-button"
                    style={{ marginRight: 8 }}
                    onClick={() => openModal(creation)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(creation.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <h3 className="modal-title">{editMode ? 'Editar Creación' : 'Nueva Creación'}</h3>
              <div className="form-group">
                <label className="form-label">Imagen</label>
                <ImageUploader
                  onImageUpload={result => setNewCreation(prev => ({ ...prev, image: result.url }))}
                  currentImage={newCreation.image}
                  category="creations"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  value={newCreation.title}
                  onChange={e => setNewCreation(prev => ({ ...prev, title: e.target.value }))}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  value={newCreation.description}
                  onChange={e => setNewCreation(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="form-textarea"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-button">
                  Cancelar
                </button>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {editMode ? 'Guardar Cambios' : 'Guardar Creación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreationsManager;
