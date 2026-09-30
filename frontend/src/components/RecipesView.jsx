import { useState, useEffect } from 'react';
import erpApi from '../api/erpApi';

export default function RecipesView() {
  const [recipes, setRecipes] = useState([]);
  const [baseMaterials, setBaseMaterials] = useState([]);
  const [commercialMaterials, setCommercialMaterials] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [recipeName, setRecipeName] = useState('');
  const [yieldQuantity, setYieldQuantity] = useState('1');
  const [items, setItems] = useState([{ baseMaterialId: '', quantity: '' }]);

  const fetchRecipesData = async () => {
    try {
      const [recRes, baseRes, commRes] = await Promise.all([
        erpApi.get('/recipes'),
        erpApi.get('/inventory/base-materials'),
        erpApi.get('/inventory/commercial-materials'),
      ]);
      setRecipes(recRes.data);
      setBaseMaterials(baseRes.data);
      setCommercialMaterials(commRes.data);
    } catch (err) {
      showError(err);
    }
  };

  useEffect(() => {
    fetchRecipesData();
  }, []);

  const showError = (err) => {
    const msg = err.response?.data?.message || 'Error al procesar la receta';
    setErrorMsg(msg);
    setSuccessMsg(null);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
  };

  const getBrandsForBase = (baseId) => {
    const brands = commercialMaterials
      .filter((c) => c.baseMaterial?.id === baseId)
      .map((c) => c.brand);
    return brands.length > 0 ? `Marcas: ${brands.join(', ')}` : 'Sin marcas registradas';
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { baseMaterialId: '', quantity: '' }]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: recipeName,
        yieldQuantity: Number(yieldQuantity),
        items: items.map((item) => ({
          baseMaterial: { id: Number(item.baseMaterialId) },
          quantity: Number(item.quantity),
        })),
      };

      await erpApi.post('/recipes', payload);
      setRecipeName('');
      setYieldQuantity('1');
      setItems([{ baseMaterialId: '', quantity: '' }]);
      showSuccess('Receta creada correctamente.');
      fetchRecipesData();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="module-container">
      <h2>Gestión de Recetas</h2>

      {errorMsg && <div className="alert alert-error"><strong>Error:</strong> {errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="grid-2-cols">
        <section className="card">
          <h3>1. Definir Nueva Receta</h3>
          <form onSubmit={handleCreateRecipe} className="erp-form">
            <input
              type="text"
              placeholder="Nombre del Producto (ej. Budín de Limón 4/4)"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              required
            />

            <label style={{ fontSize: '0.85rem', color: '#475569' }}>
              Rendimiento por lote base (Unidades producidas):
            </label>
            <input
              type="number"
              step="1"
              min="1"
              placeholder="Rendimiento (ej. 1)"
              value={yieldQuantity}
              onChange={(e) => setYieldQuantity(e.target.value)}
              required
            />

            <div style={{ marginTop: '0.5rem' }}>
              <strong>Composición de Ingredientes:</strong>
            </div>

            {items.map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr auto',
                  gap: '0.4rem',
                  alignItems: 'center',
                }}
              >
                <select
                  value={row.baseMaterialId}
                  onChange={(e) => handleItemChange(idx, 'baseMaterialId', e.target.value)}
                  required
                >
                  <option value="">-- Seleccionar Insumo Base --</option>
                  {baseMaterials.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} [{b.unitOfMeasure}] — ({getBrandsForBase(b.id)})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Cantidad"
                  value={row.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  required
                />

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    style={{ background: '#dc2626', color: 'white', border: 'none' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addItemRow}
              style={{ background: '#fdf2f8', color: '#9d174d', fontWeight: 600 }}
            >
              + Agregar otro ingrediente
            </button>

            <button type="submit" style={{ marginTop: '0.5rem' }}>
              Guardar Receta
            </button>
          </form>
        </section>

        <section className="card">
          <h3>2. Recetas Activas</h3>
          <table className="erp-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto / Receta</th>
                <th>Rendimiento Base</th>
                <th>Ingredientes</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((r) => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td><strong>{r.name}</strong></td>
                  <td><span className="badge">{r.yieldQuantity} unid.</span></td>
                  <td>
                    {r.items?.map((item) => (
                      <div key={item.id}>
                        • <strong>{item.quantity} {item.baseMaterial?.unitOfMeasure}</strong> de{' '}
                        {item.baseMaterial?.name}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}