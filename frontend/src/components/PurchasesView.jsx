import { useState, useEffect } from 'react';
import erpApi from '../api/erpApi';

export default function PurchasesView() {
  const [suppliers, setSuppliers] = useState([]);
  const [commercialMaterials, setCommercialMaterials] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [supplierName, setSupplierName] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [details, setDetails] = useState([
    { commercialMaterialId: '', quantity: '', unitPrice: '' },
  ]);

  const fetchPurchasesData = async () => {
    try {
      const [supRes, commRes, purRes] = await Promise.all([
        erpApi.get('/suppliers'),
        erpApi.get('/inventory/commercial-materials'),
        erpApi.get('/purchases'),
      ]);
      setSuppliers(supRes.data);
      setCommercialMaterials(commRes.data);
      setPurchases(purRes.data);
    } catch (err) {
      showError(err);
    }
  };

  useEffect(() => {
    fetchPurchasesData();
  }, []);

  const showError = (err) => {
    const msg = err.response?.data?.message || 'Error al procesar la solicitud';
    setErrorMsg(msg);
    setSuccessMsg(null);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
  };

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      await erpApi.post('/suppliers', { name: supplierName });
      setSupplierName('');
      showSuccess('Proveedor registrado correctamente.');
      fetchPurchasesData();
    } catch (err) {
      showError(err);
    }
  };

  const handleDetailChange = (index, field, value) => {
    const updated = [...details];
    updated[index][field] = value;
    setDetails(updated);
  };

  const addDetailRow = () => {
    setDetails([...details, { commercialMaterialId: '', quantity: '', unitPrice: '' }]);
  };

  const removeDetailRow = (index) => {
    if (details.length === 1) return;
    setDetails(details.filter((_, i) => i !== index));
  };

  const calculatePreviewTotal = () => {
    return details.reduce((acc, row) => {
      const q = parseFloat(row.quantity) || 0;
      const p = parseFloat(row.unitPrice) || 0;
      return acc + q * p;
    }, 0);
  };

  const handleCreatePurchase = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        supplier: { id: Number(selectedSupplierId) },
        details: details.map((d) => ({
          commercialMaterial: { id: Number(d.commercialMaterialId) },
          quantity: Number(d.quantity),
          unitPrice: Number(d.unitPrice),
        })),
      };

      await erpApi.post('/purchases', payload);
      setSelectedSupplierId('');
      setDetails([{ commercialMaterialId: '', quantity: '', unitPrice: '' }]);
      showSuccess('Compra registrada: stock y costos actualizados automáticamente.');
      fetchPurchasesData();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="module-container">
      <h2>Abastecimiento: Proveedores y Compras</h2>

      {errorMsg && <div className="alert alert-error"><strong>Error:</strong> {errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="grid-2-cols">
        {/* PANEL 1: PROVEEDORES */}
        <section className="card">
          <h3>1. Directorio de Proveedores</h3>
          <form onSubmit={handleCreateSupplier} className="erp-form">
            <input
              type="text"
              placeholder="Razón Social / Nombre (ej. Distribuidora Cuyo)"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              required
            />
            <button type="submit">Agregar Proveedor</button>
          </form>

          <table className="erp-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td>#{s.id}</td>
                  <td><strong>{s.name}</strong></td>
                  <td><span className="badge">ACTIVO</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* PANEL 2: CARGAR FACTURA / COMPRA */}
        <section className="card">
          <h3>2. Registrar Ingreso de Mercadería (Compra)</h3>
          <form onSubmit={handleCreatePurchase} className="erp-form">
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              required
            >
              <option value="">-- Seleccionar Proveedor --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <div style={{ marginTop: '0.5rem' }}>
              <strong>Renglones de la Factura:</strong>
            </div>

            {details.map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr auto',
                  gap: '0.4rem',
                  alignItems: 'center',
                }}
              >
                <select
                  value={row.commercialMaterialId}
                  onChange={(e) => handleDetailChange(idx, 'commercialMaterialId', e.target.value)}
                  required
                >
                  <option value="">-- Producto y Marca --</option>
                  {commercialMaterials.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.baseMaterial?.name} - {c.brand} ({c.baseMaterial?.unitOfMeasure})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Cant."
                  value={row.quantity}
                  onChange={(e) => handleDetailChange(idx, 'quantity', e.target.value)}
                  required
                />

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Costo Unit. ($)"
                  value={row.unitPrice}
                  onChange={(e) => handleDetailChange(idx, 'unitPrice', e.target.value)}
                  required
                />

                {details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDetailRow(idx)}
                    style={{ background: '#dc2626', color: 'white', border: 'none' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addDetailRow}
              style={{ background: '#f1f5f9', color: '#0f172a', fontWeight: 600 }}
            >
              + Agregar otro insumo al ticket
            </button>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderTop: '1px solid #e2e8f0',
                marginTop: '0.5rem',
              }}
            >
              <span>Total estimado:</span>
              <strong style={{ fontSize: '1.15rem' }}>
                ${calculatePreviewTotal().toFixed(2)}
              </strong>
            </div>

            <button type="submit">Confirmar Compra y Sumar Stock</button>
          </form>
        </section>
      </div>

      {/* PANEL 3: HISTORIAL DE COMPRAS */}
      <section className="card" style={{ marginTop: '1.5rem' }}>
        <h3>3. Historial de Compras Registradas</h3>
        <table className="erp-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Detalle de Insumos</th>
              <th>Total Pagado</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td>{new Date(p.purchaseDate).toLocaleString()}</td>
                <td><strong>{p.supplier?.name}</strong></td>
                <td>
                  {p.details?.map((d) => (
                    <div key={d.id}>
                      • {d.quantity} {d.commercialMaterial?.baseMaterial?.unitOfMeasure} de{' '}
                      <strong>
                        {d.commercialMaterial?.baseMaterial?.name} ({d.commercialMaterial?.brand})
                      </strong>{' '}
                      a ${d.unitPrice} c/u
                    </div>
                  ))}
                </td>
                <td><strong className="text-ok">${p.totalAmount}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}