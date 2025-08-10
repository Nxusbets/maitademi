import React, { useState } from 'react';
import { customerService } from '../services/firebaseService';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Aquí deberías agregar lógica para guardar la contraseña de forma segura (ejemplo: Firebase Auth)
      // Por ahora solo se guarda en la colección de clientes
      const result = await customerService.create({ ...form });
      if (result.success) {
        setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setForm({ name: '', email: '', password: '' });
      } else {
        setMessage('Error al registrar: ' + result.error);
      }
    } catch (error) {
      setMessage('Error al registrar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Registro de Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre Completo</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;