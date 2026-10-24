import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, Save, Monitor } from 'lucide-react';

export const DeviceModal = () => {
  const {
    isDeviceModalOpen,
    editingDevice,
    closeModal,
    addDevice,
    updateDevice,
    departments,
    statusColumns,
    typeOptions
  } = useInventory();

  const [formData, setFormData] = useState({
    department: 'IS',
    computerName: '',
    type: 'Notebook',
    user: '',
    status: 'Online',
    remark: ''
  });

  useEffect(() => {
    if (editingDevice) {
      setFormData({
        department: editingDevice.department || 'IS',
        computerName: editingDevice.computerName || '',
        type: editingDevice.type || 'Notebook',
        user: editingDevice.user || '',
        status: editingDevice.status || 'Online',
        remark: editingDevice.remark || ''
      });
    } else {
      setFormData({
        department: 'IS',
        computerName: '',
        type: 'Notebook',
        user: '',
        status: 'Online',
        remark: ''
      });
    }
  }, [editingDevice, isDeviceModalOpen]);

  if (!isDeviceModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.computerName.trim() || !formData.user.trim()) {
      alert('Mohon isi Computer Name dan User Pengguna.');
      return;
    }

    if (editingDevice) {
      updateDevice({
        ...editingDevice,
        ...formData
      });
    } else {
      addDevice({
        ...formData,
        specs: {
          brand: formData.type === 'Server' ? 'Dell' : 'Lenovo',
          model: formData.type === 'Server' ? 'PowerEdge R750' : 'ThinkPad T14',
          cpu: formData.type === 'Server' ? 'Dual Intel Xeon @ 2.4GHz' : 'Intel Core i5-1245U @ 4.4GHz',
          ram: formData.type === 'Server' ? '64 GB ECC DDR4' : '16 GB DDR4',
          storage: formData.type === 'Server' ? '2TB NVMe SSD' : '512 GB SSD',
          os: formData.type === 'Server' ? 'VMware ESXi / Windows Server' : 'Windows 11 Pro 64-bit',
          ipAddress: '192.168.10.' + Math.floor(20 + Math.random() * 200),
          macAddress: '00:1A:2B:3C:' + Math.floor(10 + Math.random() * 89) + ':' + Math.floor(10 + Math.random() * 89),
          serialNumber: 'SN' + Math.floor(100000 + Math.random() * 900000),
          assetTag: `ITS-${formData.computerName.trim()}`,
          location: formData.department === 'IS' ? 'Gedung IS - Lantai 2' : `${formData.department} Office`
        }
      });
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="brand-icon">
              <Monitor size={20} className="icon-toray" />
            </div>
            <div>
              <h3>{editingDevice ? 'Edit Data Perangkat' : 'Tambah Perangkat Baru'}</h3>
              <p className="modal-sub-text">PT. Indonesia Toray Synthetics - Stock Taking & Ledger</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={closeModal} title="Tutup">
            <X size={20} />
          </button>
        </div>

        {/* Form Input Perangkat (Bersih, to-the-point) */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid-two">
              {/* Dept / Section */}
              <div className="form-group">
                <label>Dept / Section *:</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="form-select"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.code}>
                      [{d.code}] - {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Komputer */}
              <div className="form-group">
                <label>Type Komputer *:</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="form-select"
                >
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid-two margin-top-sm">
              {/* Computer Name */}
              <div className="form-group">
                <label>Computer Name *:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: NITSIS2601542"
                  value={formData.computerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, computerName: e.target.value }))}
                  className="form-input code-font"
                  autoFocus
                />
              </div>

              {/* User (Pengguna) */}
              <div className="form-group">
                <label>User (Pengguna) *:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: anggit.kurniawan atau Administrator"
                  value={formData.user}
                  onChange={(e) => setFormData(prev => ({ ...prev, user: e.target.value }))}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-grid-two margin-top-sm">
              {/* Status Checklist */}
              <div className="form-group">
                <label>Status Checklist *:</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="form-select"
                >
                  {statusColumns.map((st) => (
                    <option key={st.key} value={st.key}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remark */}
              <div className="form-group">
                <label>Remark / Catatan:</label>
                <input
                  type="text"
                  placeholder="Contoh: Service, Spare, Backup..."
                  value={formData.remark}
                  onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={closeModal}>
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
