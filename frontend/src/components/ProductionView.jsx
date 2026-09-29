import { useState, useEffect } from 'react';
import erpApi from '../api/erpApi';

export default function ProductionView() {
  const [orders, setOrders] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [batchMultiplier, setBatchMultiplier] = useState('1');

  const fetchProductionData = async () => {
    try {
      const [ordRes, recRes] = await Promise.all([
        erpApi.get('/production-orders'),
        erpApi.get('/recipes'),
      ]);
      setOrders(ordRes.data);
      setRecipes(recRes.data);
    } catch (err) {
      showError(err);
    }
  };

  useEffect(() => {
    fetchProductionData();
  }, []);

  const showError = (err) => {
    const msg = err.response?.data?.message || 'Error en la operación de producción';
    setErrorMsg(msg);
    setSuccessMsg(null);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
  };

  const selectedRecipe = recipes.find((r) => r.id === Number(selectedRecipeId));

  // 1. Planificar Orden (Solo lotes enteros)
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await erpApi.post('/production-orders', {
        recipe: { id: Number(selectedRecipeId) },
        batchMultiplier: parseInt(batchMultiplier, 10),
      });
      setSelectedRecipeId('');
      setBatchMultiplier('1');
      showSuccess('Orden de producción planificada (Estado: PLANNED).');
      fetchProductionData();
    } catch (err) {
      showError(err);
    }
  };

  // 2. Completar Orden
  const handleCompleteOrder = async (orderId) => {
    try {
      const res = await erpApi.post(`/production-orders/${orderId}/complete`);
      showSuccess(
        `¡Orden #${orderId} completada! Stock descontado. Costo total del lote: $${res.data.totalProductionCost}`
      );
      fetchProductionData();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="module-container">
      <h2>Órdenes de Producción</h2>

      {errorMsg && <div className="alert alert-error"><strong>Error:</strong> {errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="grid-2-cols">
        {/* PANEL 1: LANZAR NUEVA ORDEN */}
        <section className="card">
          <h3>1. Planificar Lote de Producción</h3>
          <form onSubmit={handleCreateOrder} className="erp-form">
            <select
              value={selectedRecipeId}
              onChange={(e) => setSelectedRecipeId(e.target.value)}
              required
            >
              <option value="">-- Seleccionar Receta --</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (Rinde: {r.yieldQuantity} unid.)
                </option>
              ))}
            </select>

            <label style={{ fontSize: '0.85rem', color: '#475569' }}>
              Cantidad de Lotes a producir (Números enteros):
            </label>
            <input
              type="number"
              step="1"
              min="1"
              value={batchMultiplier}
              onChange={(e) => setBatchMultiplier(e.target.value.replace(/\D/g, ''))}
              required
            />

            {selectedRecipe && (
              <div
                style={{
                  background: '#f8fafc',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.88rem',
                }}
              >
                <strong>Requerimiento estimado para {batchMultiplier || 0} lote(s):</strong>
                <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.2rem' }}>
                  {selectedRecipe.items?.map((item) => {
                    const totalNeeded = (
                      parseFloat(item.quantity) * (parseInt(batchMultiplier, 10) || 0)
                    ).toFixed(2);
                    return (
                      <li key={item.id}>
                        {item.baseMaterial?.name}: <strong>{totalNeeded} {item.baseMaterial?.unitOfMeasure}</strong>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <button type="submit">Crear Orden Planificada</button>
          </form>
        </section>

        {/* PANEL 2: EXPLICACIÓN OPERATIVA */}
        <section className="card">
          <h3>Flujo Transaccional de Planta</h3>
          <p style={{ fontSize: '0.92rem', lineHeight: '1.5', color: '#334155' }}>
            Al presionar <strong>Completar y Descontar Stock</strong> en una orden planificada:
          </p>
          <ol style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#334155' }}>
            <li>El backend busca todas las marcas comerciales activas asociadas a cada insumo base de la receta.</li>
            <li>Descuenta las cantidades necesarias verificando el bloqueo optimista (<code>@Version</code>).</li>
            <li>Calcula el costo real de fabricación del lote según el precio de las marcas utilizadas.</li>
            <li>Si falta aunque sea una fracción de cualquier ingrediente, la transacción hace <em>rollback</em> completo e informa el faltante exacto.</li>
          </ol>
        </section>
      </div>

      {/* PANEL 3: TABLERO DE ÓRDENES DE PRODUCCIÓN */}
      <section className="card" style={{ marginTop: '1.5rem' }}>
        <h3>2. Tablero de Órdenes de Producción</h3>
        <table className="erp-table">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Receta</th>
              <th>Lotes</th>
              <th>Estado</th>
              <th>Costo Total Lote</th>
              <th>Fecha Finalización</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><strong>#{o.id}</strong></td>
                <td>{o.recipe?.name}</td>
                <td>x{parseInt(o.batchMultiplier, 10)}</td>
                <td>
                  <span
                    className="badge"
                    style={{
                      background: o.status === 'COMPLETED' ? '#dcfce7' : '#fef3c7',
                      color: o.status === 'COMPLETED' ? '#166534' : '#92400e',
                    }}
                  >
                    {o.status}
                  </span>
                </td>
                <td>
                  {o.totalProductionCost != null ? (
                    <strong className="text-ok">${o.totalProductionCost}</strong>
                  ) : (
                    '-'
                  )}
                </td>
                <td>{o.completedAt ? new Date(o.completedAt).toLocaleString() : 'Pendiente'}</td>
                <td>
                  {o.status === 'PLANNED' ? (
                    <button
                      onClick={() => handleCompleteOrder(o.id)}
                      style={{
                        background: '#16a34a',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      ✓ Completar y Descontar Stock
                    </button>
                  ) : (
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Cerrada</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}