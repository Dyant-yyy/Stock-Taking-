import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, Save, Monitor, Building2, User, HelpCircle, FileText } from 'lucide-react';

export const DeviceModal = () => {
  const {
    isDeviceModalOpen,
    editingDevice,
    closeModal,
    addDevice,
    updateDevice,
    departments,
    statusOptions,
    typeOptions
  } = useInventory();

  const [formData, setFormData] = useState({
    department: 'IS',
    computerName: '',
    ipAddress: '',
    type: 'Desktop PC',
    user: '',
    status: 'In',
    remark: ''
  });

  useEffect(() => {
    if (editingDevice) {
      setFormData({
        department: editingDevice.department || 'IS',
        computerName: editingDevice.computerName || '',
        ipAddress: editingDevice.ipAddress || '',
        type: editingDevice.type || 'Desktop PC',
        user: editingDevice.user || '',
        status: editingDevice.status || 'In',
        remark: editingDevice.remark || ''
      });
    } else {
      setFormData({
        department: 'IS',
        computerName: '',
        ipAddress: '',
        type: 'Desktop PC',
        user: '',
        status: 'In',
        remark: ''
      });
    }
  }, [editingDevice, isDeviceModalOpen]);

  if (!isDeviceModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDevice) {
      updateDevice({
        ...editingDevice,
        ...formData
      });
    } else {
      addDevice(formData);
    }
    closeModal();
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="brand-icon">
              <Monitor size={20} className="icon-toray" />
            </div>
            <div>
              <h3>{editingDevice ? 'Edit Data Komputer' : 'Tambah Data Komputer Baru'}</h3>
              <p className="modal-sub-text">PT. Indonesia Toray Synthetics - Device Inventory</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={closeModal}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid-two">
              {/* Departemen / Section */}
              <div className="form-group">
                <label>Departemen / Section *:</label>
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

              {/* Type */}
              <div className="form-group">
                <label>Type Komputer / Device *:</label>
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
                <label>Computer Name (Hostname) *:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: ITS-IS-PC02"
                  value={formData.computerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, computerName: e.target.value }))}
                  className="form-input code-font"
                />
              </div>

              {/* IP Address */}
              <div className="form-group">
                <label>IP Address (Jaringan):</label>
                <input
                  type="text"
                  placeholder="Contoh: 192.168.10.25 atau DHCP"
                  value={formData.ipAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, ipAddress: e.target.value }))}
                  className="form-input code-font"
                />
              </div>
            </div>

            <div className="form-grid-two margin-top-sm">
              {/* User */}
              <div className="form-group">
                <label>User (Nama Pengguna / Pegawai) *:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Rizky"
                  value={formData.user}
                  onChange={(e) => setFormData(prev => ({ ...prev, user: e.target.value }))}
                  className="form-input"
                />
              </div>

              {/* Status */}
              <div className="form-group">
                <label>Status Operasional *:</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="form-select"
                >
                  {statusOptions.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remark / Keterangan */}
            <div className="form-group margin-top-sm">
              <label>Remark / Keterangan:</label>
              <textarea
                rows={3}
                placeholder="Catatan kondisi, penempatan ruang, nomor meja, atau riwayat penggunaan..."
                value={formData.remark}
                onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
                className="form-textarea"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>{editingDevice ? 'Simpan Perubahan' : 'Tambah Komputer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
