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

  // Verificar si ya hay un token al cargar la página
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setIsAuthenticated(true);
    }
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
  };

  // Si no está autenticado, muestra únicamente la pantalla de login
  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
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
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Usuarios
          </button>
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
        {activeTab === 'users' && <UsersAdminView />}
      </main>
    </div>
  );
}

export default App;