import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, Save, Cpu } from 'lucide-react';

export const DeviceFormModal = () => {
  const {
    isDeviceFormOpen,
    setIsDeviceFormOpen,
    editingDevice,
    addDevice,
    updateDevice,
    departments,
    employees
  } = useInventory();

  const initialForm = {
    assetTag: '',
    name: '',
    category: 'Laptop',
    brand: '',
    model: '',
    serialNumber: '',
    departmentId: 'DEPT-IT',
    location: 'Main HQ Office',
    assignedTo: 'Unassigned',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseCost: 15000000,
    warrantyExpiry: '2028-12-31',
    status: 'Available',
    condition: 'Good',
    specs: {
      cpu: 'Intel Core i5',
      ram: '16 GB',
      storage: '512 GB SSD',
      os: 'Windows 11 Pro',
      ipAddress: '192.168.1.100',
      macAddress: '00:11:22:33:44:55'
    },
    notes: ''
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (editingDevice) {
      setFormData({
        ...editingDevice,
        specs: {
          cpu: editingDevice.specs?.cpu || '',
          ram: editingDevice.specs?.ram || '',
          storage: editingDevice.specs?.storage || '',
          os: editingDevice.specs?.os || '',
          ipAddress: editingDevice.specs?.ipAddress || '',
          macAddress: editingDevice.specs?.macAddress || ''
        }
      });
    } else {
      setFormData(initialForm);
    }
  }, [editingDevice, isDeviceFormOpen]);

  if (!isDeviceFormOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [field]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDevice) {
      updateDevice(formData);
    } else {
      addDevice(formData);
    }
    setIsDeviceFormOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsDeviceFormOpen(false)}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingDevice ? 'Edit Data Perangkat IT' : 'Tambah Perangkat IT Baru'}</h3>
          <button className="btn-modal-close" onClick={() => setIsDeviceFormOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body scrollable-body">
            <div className="form-section-title">1. Identitas Utama Asset</div>
            <div className="form-grid-two">
              <div className="form-group">
                <label>Asset Tag ID (Nomor Label ITS):</label>
                <input
                  type="text"
                  placeholder="Kosongkan untuk auto-generate (ITS-PC-2026-xxx)"
                  value={formData.assetTag}
                  onChange={(e) => handleChange('assetTag', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Nama Perangkat *:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dell PowerEdge R750 / Lenovo ThinkPad"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Kategori Perangkat *:</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="form-select"
                >
                  <option value="Server">Server</option>
                  <option value="Industrial PC">Industrial PC (IPC)</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop PC">Desktop PC</option>
                  <option value="Printer & Scanner">Printer & Scanner Barcode</option>
                  <option value="Network Equipment">Network Equipment (Switch/Router)</option>
                  <option value="Mobile & Handheld">Mobile & Handheld Scanner</option>
                </select>
              </div>

              <div className="form-group">
                <label>Merk / Brand *:</label>
                <input
                  type="text"
                  required
                  placeholder="Dell / Lenovo / Advantech / Zebra"
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Model / Type *:</label>
                <input
                  type="text"
                  required
                  placeholder="ThinkPad X1 / PowerEdge R750"
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Serial Number (S/N) *:</label>
                <input
                  type="text"
                  required
                  placeholder="Nomor Seri Pabrikan"
                  value={formData.serialNumber}
                  onChange={(e) => handleChange('serialNumber', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-section-title margin-top">2. Penempatan & Status Operasional</div>
            <div className="form-grid-two">
              <div className="form-group">
                <label>Departemen Pengelola *:</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => handleChange('departmentId', e.target.value)}
                  className="form-select"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Lokasi Penempatan Spesifik *:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Plant 1 Polymerization / Server Room Rack 2"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Pengguna (PIC / Employee):</label>
                <input
                  type="text"
                  placeholder="Nama Pegawai / Unassigned"
                  value={formData.assignedTo}
                  onChange={(e) => handleChange('assignedTo', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Status Penggunaan *:</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="form-select"
                >
                  <option value="In Use">In Use (Sedang Digunakan)</option>
                  <option value="Available">Available (Tersedia / Stok)</option>
                  <option value="Maintenance">Maintenance (Dalam Perbaikan)</option>
                  <option value="Decommissioned">Decommissioned (Di-afkir)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Kondisi Perangkat *:</label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleChange('condition', e.target.value)}
                  className="form-select"
                >
                  <option value="Like New">Like New (Sangat Baik)</option>
                  <option value="Good">Good (Bagus / Layak)</option>
                  <option value="Fair">Fair (Cukup)</option>
                  <option value="Poor">Poor (Kurang Baik)</option>
                  <option value="Under Repair">Under Repair (Perlu Servis)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Harga Pembelian (IDR):</label>
                <input
                  type="number"
                  placeholder="Nominal Rupiah"
                  value={formData.purchaseCost}
                  onChange={(e) => handleChange('purchaseCost', Number(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Tanggal Pembelian:</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleChange('purchaseDate', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Masa Garansi Berakhir:</label>
                <input
                  type="date"
                  value={formData.warrantyExpiry}
                  onChange={(e) => handleChange('warrantyExpiry', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-section-title margin-top">3. Spesifikasi Hardware & Jaringan</div>
            <div className="form-grid-two">
              <div className="form-group">
                <label>Processor (CPU):</label>
                <input
                  type="text"
                  placeholder="Intel Core i7 / Xeon"
                  value={formData.specs.cpu}
                  onChange={(e) => handleSpecChange('cpu', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Kapasitas RAM:</label>
                <input
                  type="text"
                  placeholder="16 GB / 32 GB DDR4"
                  value={formData.specs.ram}
                  onChange={(e) => handleSpecChange('ram', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Storage (Disk):</label>
                <input
                  type="text"
                  placeholder="512 GB NVMe SSD"
                  value={formData.specs.storage}
                  onChange={(e) => handleSpecChange('storage', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Sistem Operasi (OS):</label>
                <input
                  type="text"
                  placeholder="Windows 11 Pro / Server 2022"
                  value={formData.specs.os}
                  onChange={(e) => handleSpecChange('os', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Alamat IP (Static / DHCP):</label>
                <input
                  type="text"
                  placeholder="192.168.x.x"
                  value={formData.specs.ipAddress}
                  onChange={(e) => handleSpecChange('ipAddress', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>MAC Address:</label>
                <input
                  type="text"
                  placeholder="00:11:22:33:44:55"
                  value={formData.specs.macAddress}
                  onChange={(e) => handleSpecChange('macAddress', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group margin-top">
              <label>Catatan Tambahan:</label>
              <textarea
                rows={3}
                placeholder="Spesifikasi tambahan, kebutuhan khusus, atau riwayat garansi..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="form-textarea"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsDeviceFormOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>{editingDevice ? 'Simpan Perubahan' : 'Tambah Perangkat'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
