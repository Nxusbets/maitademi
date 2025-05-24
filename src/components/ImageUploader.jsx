import React, { useState, useCallback } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onImageUpload, currentImage, category = "general" }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // Configuración de Cloudinary
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddi0sl10o/image/upload';
  const UPLOAD_PRESET = 'maitademi_preset';

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    
    // Configuraciones más simples para evitar errores
    if (category && category !== 'general') {
      formData.append('folder', `maitademi/${category}`);
    }

    try {
      console.log('Subiendo a Cloudinary...', {
        url: CLOUDINARY_URL,
        preset: UPLOAD_PRESET,
        fileSize: file.size,
        fileType: file.type
      });

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        // Obtener más detalles del error
        const errorText = await response.text();
        console.error('Cloudinary error response:', errorText);
        
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.message) {
            errorMessage = errorData.error.message;
          }
        } catch (e) {
          // Si no es JSON válido, usar el texto completo
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Upload successful:', data);
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        originalFilename: data.original_filename,
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleUpload = async (file) => {
    // Limpiar errores previos
    setError(null);
    
    // Validaciones
    if (!file || !file.type.startsWith('image/')) {
      const errorMsg = 'Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, WEBP)';
      setError(errorMsg);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // Aumentar a 10MB para dar más margen
      const errorMsg = 'La imagen es demasiado grande. Máximo 10MB';
      setError(errorMsg);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Crear preview local inmediatamente
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setUploadProgress(30);

      // Subir a Cloudinary
      const result = await uploadToCloudinary(file);
      setUploadProgress(80);
      
      // Callback al componente padre con información completa
      onImageUpload(result);
      setUploadProgress(100);
      
      // Limpiar preview local y usar la URL de Cloudinary
      URL.revokeObjectURL(previewUrl);
      setPreview(result.url);
      
      // Mensaje de éxito
      setTimeout(() => {
        setError(null);
        console.log('✅ Imagen subida exitosamente!');
      }, 500);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(`Error al subir imagen: ${error.message}`);
      setPreview(currentImage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setError(null);
    onImageUpload(null);
  };

  const handleRetry = () => {
    const fileInput = document.getElementById(`file-input-${category}`);
    if (fileInput.files[0]) {
      handleUpload(fileInput.files[0]);
    }
  };

  return (
    <div className="image-uploader">
      <div 
        className={`upload-area ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''} ${error ? 'error' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !preview && !uploading && document.getElementById(`file-input-${category}`).click()}
      >
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <div className="image-overlay">
              <div className="image-actions">
                <button 
                  className="change-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById(`file-input-${category}`).click();
                  }}
                  disabled={uploading}
                >
                  {uploading ? '⏳' : '🔄'} Cambiar
                </button>
                <button 
                  className="remove-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  disabled={uploading}
                >
                  🗑️ Quitar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">📸</div>
            <h4>Sube tu creación</h4>
            <p>Arrastra una imagen aquí o <span>haz clic para seleccionar</span></p>
            <div className="format-info">
              <small>📋 Formatos: JPG, PNG, GIF, WEBP</small>
              <small>📏 Tamaño máximo: 10MB</small>
              <small>🎯 Resolución recomendada: 1200x800px</small>
            </div>
          </div>
        )}
        
        <input
          id={`file-input-${category}`}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </div>
      
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p>
            {uploadProgress < 30 && "Preparando imagen..."}
            {uploadProgress >= 30 && uploadProgress < 80 && "Subiendo a Cloudinary..."}
            {uploadProgress >= 80 && uploadProgress < 100 && "Finalizando..."}
            {uploadProgress === 100 && "✅ ¡Completado!"}
          </p>
        </div>
      )}
      
      {error && (
        <div className="upload-error">
          <p>❌ {error}</p>
          <div className="error-actions">
            <button onClick={handleRetry} className="retry-btn">
              🔄 Reintentar
            </button>
            <button onClick={() => setError(null)} className="dismiss-btn">
              ✖️ Cerrar
            </button>
          </div>
        </div>
      )}
      
      {preview && !uploading && !error && (
        <div className="image-info">
          <small>✅ Imagen almacenada en Cloudinary</small>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;