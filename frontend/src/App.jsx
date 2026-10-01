import { useState, useEffect } from 'react';
import InventoryView from './components/InventoryView';
import PurchasesView from './components/PurchasesView';
import RecipesView from './components/RecipesView';
import ProductionView from './components/ProductionView';
import LoginView from './components/LoginView';
import UsersAdminView from './components/UsersAdminView';
import logo from './assets/entre_migas_logo.jpeg';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');
  
  // NUEVO: Estado para guardar si es el administrador
  const [isAdmin, setIsAdmin] = useState(false); 

  // Función para procesar el token, usada tanto al cargar la app como al hacer login
  const checkTokenAndRole = () => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setIsAuthenticated(true);
      try {
        // Un JWT tiene 3 partes separadas por puntos. La del medio (índice 1) es el payload.
        // atob() decodifica el Base64 y JSON.parse lo convierte en un objeto de JS.
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Verificamos si el nombre de usuario (sub) es el admin
        if (payload.sub === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        handleLogout(); // Si el token es inválido o está corrupto, cerramos sesión
      }
    }
  };

  // Verificar si ya hay un token al cargar la página
  useEffect(() => {
    checkTokenAndRole();
  }, []);

  // Animación de scroll al cambiar de pestaña
  useEffect(() => {
    if (isAuthenticated) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
    setIsAdmin(false); // Limpiamos el rol al salir
    setActiveTab('inventory'); // Reseteamos la pestaña por defecto
  };

  // Si no está autenticado, muestra únicamente la pantalla de login
  // Fíjate que ahora onLoginSuccess llama a checkTokenAndRole para leer el rol inmediatamente
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={checkTokenAndRole} />;
  }

  // Si está autenticado, muestra el sistema completo
  return (
    <div className="erp-layout">
      <header className="erp-header">
        <img src={logo} alt="Entre Migas" className="logo-img" />
        <nav className="erp-nav">
          <button
            className={activeTab === 'inventory' ? 'active' : ''}
            onClick={() => setActiveTab('inventory')}
          >
            Inventario y Mermas
          </button>
          <button
            className={activeTab === 'purchases' ? 'active' : ''}
            onClick={() => setActiveTab('purchases')}
          >
            Compras y Proveedores
          </button>
          <button
            className={activeTab === 'recipes' ? 'active' : ''}
            onClick={() => setActiveTab('recipes')}
          >
            Recetas
          </button>
          <button
            className={activeTab === 'production' ? 'active' : ''}
            onClick={() => setActiveTab('production')}
          >
            Órdenes de Producción
          </button>
          
          {/* MAGIA AQUÍ: Este botón solo se renderiza si isAdmin es true */}
          {isAdmin && (
            <button
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              Usuarios
            </button>
          )}

          <button 
            onClick={handleLogout} 
            style={{ marginLeft: '1rem', background: 'transparent', border: '1px solid #fda4af', color: '#9f1239' }}
          >
            Salir
          </button>
        </nav>
      </header>

      <main className="erp-main">
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'purchases' && <PurchasesView />}
        {activeTab === 'recipes' && <RecipesView />}
        {activeTab === 'production' && <ProductionView />}
        
        {/* También protegemos la vista por si acaso */}
        {activeTab === 'users' && isAdmin && <UsersAdminView />}
      </main>
    </div>
  );
}

export default App;