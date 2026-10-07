import { useState, useEffect } from 'react';
import erpApi from '../api/erpApi';

export default function InventoryView() {
  const [baseMaterials, setBaseMaterials] = useState([]);
  const [commercialMaterials, setCommercialMaterials] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Estados para formulario de Insumo Base
  const [baseName, setBaseName] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('KG');

  // Estados para formulario de Insumo Comercial
  const [commBrand, setCommBrand] = useState('');
  const [selectedBaseId, setSelectedBaseId] = useState('');
  const [initialCost, setInitialCost] = useState('');

  // Estados para formulario de Ajuste / Merma
  const [adjMaterialId, setAdjMaterialId] = useState('');
  const [quantityChange, setQuantityChange] = useState('');
  const [reason, setReason] = useState('WASTE');
  const [notes, setNotes] = useState('');

  const fetchInventoryData = async () => {
    try {
      const [baseRes, commRes, adjRes] = await Promise.all([
        erpApi.get('/inventory/base-materials'),
        erpApi.get('/inventory/commercial-materials'),
        erpApi.get('/inventory/adjustments'),
      ]);
      setBaseMaterials(baseRes.data);
      setCommercialMaterials(commRes.data);
      setAdjustments(adjRes.data);
    } catch (err) {
      showError(err);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const showError = (err) => {
    const backendMessage = err.response?.data?.message || 'Error de conexión con el servidor';
    setErrorMsg(backendMessage);
    setSuccessMsg(null);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
  };

  // 1. Crear Insumo Base
  const handleCreateBase = async (e) => {
    e.preventDefault();
    try {
      await erpApi.post('/inventory/base-materials', {
        name: baseName,
        unitOfMeasure,
      });
      setBaseName('');
      showSuccess('Insumo base creado correctamente.');
      fetchInventoryData();
    } catch (err) {
      showError(err);
    }
  };

  // 2. Crear Insumo Comercial (Usa la propiedad 'brand' que espera el backend)
  const handleCreateCommercial = async (e) => {
    e.preventDefault();
    try {
      await erpApi.post('/inventory/commercial-materials', {
        brand: commBrand,
        baseMaterial: { id: Number(selectedBaseId) },
        currentStock: 0,
        referenceCost: initialCost ? Number(initialCost) : 0,
      });
      setCommBrand('');
      setInitialCost('');
      showSuccess('Marca comercial registrada correctamente.');
      fetchInventoryData();
    } catch (err) {
      showError(err);
    }
  };

  // 3. Registrar Ajuste de Stock / Merma
  const handleCreateAdjustment = async (e) => {
    e.preventDefault();
    try {
      await erpApi.post('/inventory/adjustments', {
        commercialMaterial: { id: Number(adjMaterialId) },
        quantityChange: Number(quantityChange),
        reason,
        notes,
      });
      setQuantityChange('');
      setNotes('');
      showSuccess('Ajuste de inventario aplicado con éxito.');
      fetchInventoryData();
    } catch (err) {
      showError(err);
    }
  };

  // 4. Eliminar (Soft Delete) Insumo Comercial
  const handleDeleteCommercial = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta marca comercial?")) {
      return;
    }
    try {
      await erpApi.delete(`/inventory/commercial-materials/${id}`);
      showSuccess('Marca eliminada correctamente.');
      fetchInventoryData(); // Recarga la tabla automáticamente para que desaparezca
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="module-container">
      <h2>Gestión de Inventario y Catálogo</h2>

      {errorMsg && <div className="alert alert-error"><strong>Error:</strong> {errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="grid-2-cols">
        {/* PANEL 1: INSUMOS BASE */}
        <section className="card">
          <h3>1. Insumos Base (Genéricos)</h3>
          <form onSubmit={handleCreateBase} className="erp-form">
            <input
              type="text"
              placeholder="Nombre (ej. Azúcar Común)"
              value={baseName}
              onChange={(e) => setBaseName(e.target.value)}
              required
            />
            <select value={unitOfMeasure} onChange={(e) => setUnitOfMeasure(e.target.value)}>
              <option value="KG">Kilogramos (KG)</option>
              <option value="L">Litros (L)</option>
              <option value="UNIT">Unidades (UNIT)</option>
            </select>
            <button type="submit">Agregar Insumo</button>
          </form>

          <table className="erp-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Unidad</th>
              </tr>
            </thead>
            <tbody>
              {baseMaterials.map((b) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td><strong>{b.name}</strong></td>
                  <td><span className="badge">{b.unitOfMeasure}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* PANEL 2: INSUMOS COMERCIALES */}
        <section className="card">
          <h3>2. Marcas Comerciales (Stock Físico)</h3>
          <form onSubmit={handleCreateCommercial} className="erp-form">
            <input
              type="text"
              placeholder="Marca / Presentación (ej. Ledesma)"
              value={commBrand}
              onChange={(e) => setCommBrand(e.target.value)}
              required
            />
            <select
              value={selectedBaseId}
              onChange={(e) => setSelectedBaseId(e.target.value)}
              required
            >
              <option value="">-- Asociar a Insumo Base --</option>
              {baseMaterials.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} — [Unidad: {b.unitOfMeasure}]
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Costo Ref. Inicial ($)"
              value={initialCost}
              onChange={(e) => setInitialCost(e.target.value)}
            />
            <button type="submit">Agregar Marca</button>
          </form>

          <table className="erp-table">
            <thead>
              <tr>
                <th>Insumo Base</th>
                <th>Marca Comercial</th>
                <th>Stock Actual</th>
                <th>Costo Ref.</th>
                <th>Acciones</th> {/* NUEVA COLUMNA */}
              </tr>
            </thead>
            <tbody>
              {commercialMaterials.map((c) => (
                <tr key={c.id}>
                  <td>{c.baseMaterial?.name}</td>
                  <td><strong>{c.brand}</strong></td>
                  <td className={c.currentStock <= 0 ? 'text-danger' : 'text-ok'}>
                    <strong>{c.currentStock}</strong> {c.baseMaterial?.unitOfMeasure}
                  </td>
                  <td>${c.referenceCost}</td>
                  <td>
                    {/* NUEVO BOTÓN */}
                    <button 
                      onClick={() => handleDeleteCommercial(c.id)}
                      style={{ 
                        backgroundColor: '#dc2626', 
                        color: 'white', 
                        border: 'none', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                      title="Eliminar marca"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* PANEL 3: AJUSTES DE STOCK Y MERMAS */}
      <section className="card" style={{ marginTop: '1.5rem' }}>
        <h3>3. Ajustes de Stock y Mermas</h3>
        <form onSubmit={handleCreateAdjustment} className="erp-form-inline">
          <select
            value={adjMaterialId}
            onChange={(e) => setAdjMaterialId(e.target.value)}
            required
          >
            <option value="">-- Seleccionar Producto y Marca --</option>
            {commercialMaterials.map((c) => (
              <option key={c.id} value={c.id}>
                {c.baseMaterial?.name} - {c.brand} (Actual: {c.currentStock} {c.baseMaterial?.unitOfMeasure})
              </option>
            ))}
          </select>

          <input
            type="number"
            step="0.01"
            placeholder="Variación (ej: -1.50 o 5.00)"
            value={quantityChange}
            onChange={(e) => setQuantityChange(e.target.value)}
            required
          />

          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="WASTE">Merma / Desperdicio</option>
            <option value="COUNT_CORRECTION">Corrección por Conteo</option>
            <option value="INITIAL_STOCK">Stock Inicial</option>
            <option value="INTERNAL_CONSUMPTION">Consumo Interno</option>
          </select>

          <input
            type="text"
            placeholder="Motivo o nota de auditoría"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />

          <button type="submit" className="btn-warning">Registrar Ajuste</button>
        </form>

        <table className="erp-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto y Marca</th>
              <th>Stock Previo</th>
              <th>Variación</th>
              <th>Nuevo Stock</th>
              <th>Motivo</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {adjustments.map((a) => (
              <tr key={a.id}>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
                <td>
                  <strong>
                    {a.commercialMaterial?.baseMaterial?.name} - {a.commercialMaterial?.brand}
                  </strong>
                </td>
                <td>{a.previousStock}</td>
                <td className={a.quantityChange < 0 ? 'text-danger' : 'text-ok'}>
                  {a.quantityChange > 0 ? `+${a.quantityChange}` : a.quantityChange}
                </td>
                <td><strong>{a.newStock}</strong></td>
                <td><span className="badge">{a.reason}</span></td>
                <td>{a.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}