import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, ClipboardCheck, QrCode } from 'lucide-react';

export const StockTakingFormModal = () => {
  const {
    isStockTakingModalOpen,
    setIsStockTakingModalOpen,
    devices,
    departments,
    selectedDevice,
    currentUser,
    setIsDeviceFormOpen,
    setEditingDevice,
    addStockTaking
  } = useInventory();

  const safeDevices = Array.isArray(devices) ? devices : [];
  const safeDepts = Array.isArray(departments) ? departments : [];

  const defaultAuditor = currentUser ? `${currentUser.name} (${currentUser.deptCode || 'IS'})` : 'Ahmad Rizky (IS)';

  const [formData, setFormData] = useState({
    stockTakingDate: new Date().toISOString().split('T')[0],
    auditorName: defaultAuditor,
    departmentId: safeDepts.length > 0 ? safeDepts[0].id : 'DEPT-IS',
    deviceId: '',
    assetTag: '',
    deviceName: '',
    expectedLocation: '',
    scannedLocation: '',
    locationStatus: 'Verified',
    physicalCondition: 'Good',
    auditResultStatus: 'Verified',
    notes: 'Perangkat terverifikasi fisik secara lengkap di lokasi.'
  });

  useEffect(() => {
    if (!isStockTakingModalOpen) return;

    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        auditorName: `${currentUser.name} (${currentUser.deptCode || 'IS'})`
      }));
    }

    if (selectedDevice) {
      setFormData(prev => ({
        ...prev,
        deviceId: selectedDevice.id,
        assetTag: selectedDevice.assetTag,
        deviceName: selectedDevice.name,
        departmentId: selectedDevice.departmentId || safeDepts[0]?.id || 'DEPT-IS',
        expectedLocation: selectedDevice.location || '',
        scannedLocation: selectedDevice.location || '',
        physicalCondition: selectedDevice.condition || 'Good'
      }));
    } else if (safeDevices.length > 0) {
      const first = safeDevices[0];
      setFormData(prev => ({
        ...prev,
        deviceId: first.id,
        assetTag: first.assetTag,
        deviceName: first.name,
        departmentId: first.departmentId || safeDepts[0]?.id || 'DEPT-IS',
        expectedLocation: first.location || '',
        scannedLocation: first.location || ''
      }));
    }
  }, [isStockTakingModalOpen, selectedDevice, safeDevices, safeDepts]);

  if (!isStockTakingModalOpen) return null;

  const handleDeviceChange = (devId) => {
    const targetDev = safeDevices.find(d => d.id === devId);
    if (targetDev) {
      setFormData(prev => ({
        ...prev,
        deviceId: targetDev.id,
        assetTag: targetDev.assetTag,
        deviceName: targetDev.name,
        departmentId: targetDev.departmentId || prev.departmentId,
        expectedLocation: targetDev.location || '',
        scannedLocation: targetDev.location || '',
        physicalCondition: targetDev.condition || 'Good'
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const deptObj = safeDepts.find(d => d.id === formData.departmentId);
    addStockTaking({
      ...formData,
      departmentCode: deptObj ? deptObj.code : 'IS'
    });
    setIsStockTakingModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsStockTakingModalOpen(false)}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="brand-icon" style={{ width: '36px', height: '36px', borderRadius: '8px' }}>
              <ClipboardCheck size={20} />
            </div>
            <div>
              <h3>Form Input Stock Taking (Stock Opname Fisik)</h3>
              <p className="modal-sub-text">Pencatatan verifikasi fisik inventaris IT PT. Indonesia Toray Synthetics</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={() => setIsStockTakingModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body scrollable-body">
            <div className="form-section-title">1. Informasi Petugas & Audit</div>
            <div className="form-grid-two">
              <div className="form-group">
                <label>Tanggal Stock Taking *:</label>
                <input
                  type="date"
                  required
                  value={formData.stockTakingDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockTakingDate: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Nama Petugas Auditor / Tim Opname *:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Rizky (IS) / Tim Audit"
                  value={formData.auditorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, auditorName: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Master Departemen Diaudit *:</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                  className="form-select"
                >
                  {safeDepts.map(d => (
                    <option key={d.id} value={d.id}>
                      [{d.code}] - {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <div className="flex justify-between items-center mb-1">
                  <label>Pilih Asset Perangkat Diaudit *:</label>
                  <button
                    type="button"
                    className="btn-link text-xs font-semibold text-cyan cursor-pointer"
                    onClick={() => {
                      setIsStockTakingModalOpen(false);
                      if (setEditingDevice) setEditingDevice(null);
                      if (setIsDeviceFormOpen) setIsDeviceFormOpen(true);
                    }}
                  >
                    + Tambah Asset Device Baru
                  </button>
                </div>
                <select
                  required
                  value={formData.deviceId}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  className="form-select"
                >
                  {safeDevices.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.assetTag} - {d.name} ({d.assignedTo})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section-title margin-top">2. Verifikasi Lokasi & Kondisi Fisik</div>
            <div className="form-grid-two">
              <div className="form-group">
                <label>Lokasi Seharusnya (Di Database):</label>
                <input
                  type="text"
                  disabled
                  value={formData.expectedLocation}
                  className="form-input"
                  style={{ opacity: 0.7 }}
                />
              </div>

              <div className="form-group">
                <label>Lokasi Hasil Pemeriksaan Fisik *:</label>
                <input
                  type="text"
                  required
                  placeholder="Lokasi tempat perangkat ditemukan"
                  value={formData.scannedLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, scannedLocation: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Status Kebenaran Lokasi *:</label>
                <select
                  value={formData.locationStatus}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationStatus: e.target.value }))}
                  className="form-select"
                >
                  <option value="Verified">Verified (Sesuai Lokasi)</option>
                  <option value="Moved">Moved (Berpindah Lokasi Ruang/Pabrik)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Kondisi Fisik Saat Stock Taking *:</label>
                <select
                  value={formData.physicalCondition}
                  onChange={(e) => setFormData(prev => ({ ...prev, physicalCondition: e.target.value }))}
                  className="form-select"
                >
                  <option value="Good">Good (Bagus / Normal Operasional)</option>
                  <option value="Like New">Like New (Sangat Baik)</option>
                  <option value="Fair">Fair (Normal Baret/Cukup)</option>
                  <option value="Under Repair">Under Repair (Perlu Perbaikan/Rusak)</option>
                </select>
              </div>
            </div>

            <div className="form-section-title margin-top">3. Kesimpulan Hasil Stock Opname</div>
            <div className="form-group">
              <label>Status Hasil Audit Stock Opname *:</label>
              <select
                value={formData.auditResultStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, auditResultStatus: e.target.value }))}
                className="form-select"
              >
                <option value="Verified">Verified (Cocok / Sesuai Standar)</option>
                <option value="Discrepancy">Discrepancy (Terdapat Selisih Specs / Catatan)</option>
                <option value="Missing">Missing (Tidak Ditemukan Saat Audit)</option>
              </select>
            </div>

            <div className="form-group margin-top">
              <label>Catatan & Temuan Auditor Stock Opname:</label>
              <textarea
                rows={3}
                placeholder="Catatan kebersihan fisik, serial number, stiker label, atau temuan spesifik..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="form-textarea"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsStockTakingModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              <ClipboardCheck size={16} />
              <span>Simpan Record Stock Taking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
