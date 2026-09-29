import { useState } from 'react';
import InventoryView from './components/InventoryView';
import PurchasesView from './components/PurchasesView';
import RecipesView from './components/RecipesView';
import ProductionView from './components/ProductionView';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="erp-layout">
      <header className="erp-header">
        <h1>Mini-ERP</h1>
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
            Recetas (BOM)
          </button>
          <button
            className={activeTab === 'production' ? 'active' : ''}
            onClick={() => setActiveTab('production')}
          >
            Órdenes de Producción
          </button>
        </nav>
      </header>

      <main className="erp-main">
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'purchases' && <PurchasesView />}
        {activeTab === 'recipes' && <RecipesView />}
        {activeTab === 'production' && <ProductionView />}
      </main>
    </div>
  );
}

export default App;