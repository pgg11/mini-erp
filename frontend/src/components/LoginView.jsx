import { useState } from 'react';
import erpApi from '../api/erpApi';
import logo from '../assets/entre_migas_logo.jpeg';

export default function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await erpApi.post('/auth/login', { username, password });
      const token = res.data.token;
      
      // Guardar el token en el almacenamiento local del navegador
      localStorage.setItem('jwt_token', token);
      
      // Avisar a App.jsx que el login fue exitoso
      onLoginSuccess();
    } catch (err) {
      setErrorMsg('Credenciales incorrectas o servidor no disponible.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fff5f7' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
        <img src={logo} alt="Entre Migas" style={{ width: '180px', mixBlendMode: 'multiply', marginBottom: '1rem' }} />
        <h2 style={{ color: '#831843', marginTop: 0, borderBottom: 'none' }}>Acceso al Sistema</h2>
        
        {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
        
        <form onSubmit={handleLogin} className="erp-form">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ marginBottom: '0.5rem' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '1rem' }}
          />
          <button type="submit" style={{ width: '100%' }}>Ingresar</button>
        </form>
      </div>
    </div>
  );
}