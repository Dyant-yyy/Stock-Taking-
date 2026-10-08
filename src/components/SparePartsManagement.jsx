import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  MinusCircle,
  X
} from 'lucide-react';

export const SparePartsManagement = () => {
  const {
    spareParts,
    updateSparePartStock,
    addSparePart
  } = useInventory();

  const [isAddPartOpen, setIsAddPartOpen] = useState(false);
  const [newPartForm, setNewPartForm] = useState({
    partNumber: '',
    name: '',
    category: 'RAM',
    stockQuantity: 10,
    minThreshold: 3,
    unitCost: 500000,
    location: 'IT Server Room Spare Cabinet',
    compatibility: 'Umum Desktop / Server'
  });

  const lowStockCount = spareParts.filter(p => p.stockQuantity <= p.minThreshold).length;

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addSparePart({
      ...newPartForm,
      stockQuantity: Number(newPartForm.stockQuantity),
      minThreshold: Number(newPartForm.minThreshold),
      unitCost: Number(newPartForm.unitCost)
    });
    setIsAddPartOpen(false);
  };

  return (
    <div className="spareparts-view">
      <div className="view-header">
        <div>
          <h2>Stok Consumable & Spare Parts IT</h2>
          <p className="sub-header-text">
            Pengawasan stok suku cadang, ribbon printer barcode, SSD, RAM, dan kabel jaringan pabrik ITS.
          </p>
        </div>
        <div className="view-header-actions">
          <button className="btn-primary" onClick={() => setIsAddPartOpen(true)}>
            <Plus size={16} />
            <span>+ Tambah Spare Part Baru</span>
          </button>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div className="alert-banner-warning">
          <AlertTriangle size={20} className="icon-warning" />
          <div>
            <strong>Peringatan Ambang Batas Stok Menipis!</strong>
            <p>Terdapat {lowStockCount} item spare part yang berada di bawah atau sama dengan ambang batas minimum. Harap segera lakukan restock!</p>
          </div>
        </div>
      )}

      {/* PARTS TABLE */}
      <div className="table-responsive margin-top">
        <table className="device-table">
          <thead>
            <tr>
              <th>Part Number</th>
              <th>Nama Komponen / Sparepart</th>
              <th>Kategori</th>
              <th>Lokasi Gudang IT</th>
              <th>Harga Satuan</th>
              <th>Status Stok</th>
              <th className="text-center">Stok Saat Ini</th>
              <th className="text-right">Penyesuaian Quick</th>
            </tr>
          </thead>
          <tbody>
            {spareParts.map((part) => {
              const isLow = part.stockQuantity <= part.minThreshold;
              return (
                <tr key={part.id}>
                  <td><span className="code-font">{part.partNumber}</span></td>
                  <td>
                    <div>
                      <strong>{part.name}</strong>
                      <div className="text-muted text-sm">Kompatibel: {part.compatibility}</div>
                    </div>
                  </td>
                  <td><span className="cat-pill">{part.category}</span></td>
                  <td>{part.location}</td>
                  <td className="format-idr">{formatIDR(part.unitCost)}</td>
                  <td>
                    {isLow ? (
                      <span className="status-badge status-maintenance">
                        <AlertTriangle size={12} /> Low Stock (Min: {part.minThreshold})
                      </span>
                    ) : (
                      <span className="status-badge status-in-use">
                        <CheckCircle size={12} /> Normal
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    <span className={`stock-number-pill ${isLow ? 'danger' : ''}`}>
                      {part.stockQuantity}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="stock-adjust-actions">
                      <button
                        className="btn-stock-adjust"
                        onClick={() => updateSparePartStock(part.id, -1)}
                        title="Kurangi Stok 1"
                      >
                        <MinusCircle size={18} />
                      </button>
                      <button
                        className="btn-stock-adjust add"
                        onClick={() => updateSparePartStock(part.id, 1)}
                        title="Tambah Stok 1"
                      >
                        <PlusCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL TAMBAH SPAREPART */}
      {isAddPartOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddPartOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Inventaris Spare Part Baru</h3>
              <button className="btn-modal-close" onClick={() => setIsAddPartOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Part Number (Kode Barang) *:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: RAM-DDR4-16GB"
                    value={newPartForm.partNumber}
                    onChange={(e) => setNewPartForm(prev => ({ ...prev, partNumber: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group margin-top">
                  <label>Nama Spare Part / Consumable *:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Samsung 16GB DDR4 ECC RAM"
                    value={newPartForm.name}
                    onChange={(e) => setNewPartForm(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group margin-top">
                  <label>Kategori Komponen *:</label>
                  <select
                    value={newPartForm.category}
                    onChange={(e) => setNewPartForm(prev => ({ ...prev, category: e.target.value }))}
                    className="form-select"
                  >
                    <option value="RAM">RAM / Memori</option>
                    <option value="Storage">Storage (SSD/HDD)</option>
                    <option value="Printer Consumables">Printer Consumables (Ribbon/Toner)</option>
                    <option value="Networking">Networking (Kabel/Patch Cord)</option>
                    <option value="Peripherals">Peripherals (Keyboard/Mouse)</option>
                    <option value="Power">Power (UPS Battery/Adapter)</option>
                  </select>
                </div>

                <div className="form-grid-two margin-top">
                  <div className="form-group">
                    <label>Jumlah Stok Awal *:</label>
                    <input
                      type="number"
                      required
                      value={newPartForm.stockQuantity}
                      onChange={(e) => setNewPartForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Batas Minimum Alert *:</label>
                    <input
                      type="number"
                      required
                      value={newPartForm.minThreshold}
                      onChange={(e) => setNewPartForm(prev => ({ ...prev, minThreshold: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group margin-top">
                  <label>Harga Satuan (IDR):</label>
                  <input
                    type="number"
                    value={newPartForm.unitCost}
                    onChange={(e) => setNewPartForm(prev => ({ ...prev, unitCost: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group margin-top">
                  <label>Lokasi Rak / Penyimpanan:</label>
                  <input
                    type="text"
                    value={newPartForm.location}
                    onChange={(e) => setNewPartForm(prev => ({ ...prev, location: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddPartOpen(false)}>Batal</button>
                <button type="submit" className="btn-primary">Simpan Spare Part</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
