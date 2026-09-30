import { useState, useEffect } from 'react';
import erpApi from '../api/erpApi';

export default function UsersAdminView() {
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await erpApi.get('/users');
        setUsers(res.data);
      } catch (err) {
        setErrorMsg('Error al cargar la lista de usuarios. Verifica tus permisos.');
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="module-container">
      <h2>Panel de Administración</h2>
      
      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
      
      <p style={{ color: '#4a2c35', marginBottom: '1rem' }}>
        Listado de credenciales con acceso al sistema. La creación y edición de usuarios se realiza directamente desde la base de datos por seguridad.
      </p>

      <section className="card" style={{ maxWidth: '500px' }}>
        <table className="erp-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Rol / Permisos</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td><strong>{u.username}</strong></td>
                <td>
                  <span 
                    className="badge" 
                    style={{ 
                      background: u.role === 'ADMIN' ? '#fce7f3' : '#e0f2fe', 
                      color: u.role === 'ADMIN' ? '#9d174d' : '#0369a1' 
                    }}
                  >
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}