import React, { useState, useEffect, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  X,
  Save,
  Monitor,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  HardDrive,
  Network,
  Tag,
  MapPin,
  Laptop,
  Server,
  Sparkles
} from 'lucide-react';

export const DeviceModal = () => {
  const {
    isDeviceModalOpen,
    editingDevice,
    closeModal,
    addDevice,
    updateDevice,
    departments,
    statusColumns,
    typeOptions,
    openScannerModal,
    setScannerNotice,
    getDeviceCurrentStatus,
    getDeviceCurrentRemark,
    currentMonth,
    currentYear,
    monthOptions = []
  } = useInventory();

  const [formData, setFormData] = useState({
    department: 'IS',
    computerName: '',
    type: 'Notebook',
    user: '',
    status: 'Online',
    remark: ''
  });

  const [specData, setSpecData] = useState({
    brand: '',
    model: '',
    cpu: '',
    ram: '',
    storage: '',
    os: '',
    ipAddress: '',
    macAddress: '',
    serialNumber: '',
    assetTag: '',
    location: ''
  });

  const [showAdvancedSpecs, setShowAdvancedSpecs] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const userInputRef = useRef(null);
  const computerNameInputRef = useRef(null);

  const isExistingDevice = Boolean(editingDevice && editingDevice.id);
  const isFromScan = Boolean(editingDevice && (editingDevice._isFromScan || editingDevice._scannedCode));
  const currentMonthLabel = monthOptions.find(m => m.value === currentMonth)?.label || 'Bulan Ini';

  useEffect(() => {
    if (!isDeviceModalOpen) return;
    setErrorMessage('');

    if (editingDevice) {
      const liveStatus = isExistingDevice && getDeviceCurrentStatus
        ? getDeviceCurrentStatus(editingDevice.id)
        : (editingDevice.status || 'Online');

      const liveRemark = isExistingDevice && getDeviceCurrentRemark
        ? getDeviceCurrentRemark(editingDevice.id)
        : (editingDevice.remark || '');

      setFormData({
        department: editingDevice.department || 'IS',
        computerName: editingDevice.computerName || '',
        type: editingDevice.type || 'Notebook',
        user: editingDevice.user || '',
        status: liveStatus || 'Online',
        remark: liveRemark || ''
      });

      const existingSpecs = editingDevice.specs || {};
      setSpecData({
        brand: existingSpecs.brand || (editingDevice.type === 'Server' ? 'Dell' : 'Lenovo'),
        model: existingSpecs.model || (editingDevice.type === 'Server' ? 'PowerEdge R750' : 'ThinkPad T14'),
        cpu: existingSpecs.cpu || (editingDevice.type === 'Server' ? 'Dual Intel Xeon @ 2.4GHz' : 'Intel Core i5-1245U @ 4.4GHz'),
        ram: existingSpecs.ram || (editingDevice.type === 'Server' ? '64 GB ECC DDR4' : '16 GB DDR4'),
        storage: existingSpecs.storage || (editingDevice.type === 'Server' ? '2TB NVMe SSD' : '512 GB SSD'),
        os: existingSpecs.os || (editingDevice.type === 'Server' ? 'VMware ESXi / Windows Server' : 'Windows 11 Pro 64-bit'),
        ipAddress: existingSpecs.ipAddress || editingDevice.ipAddress || '',
        macAddress: existingSpecs.macAddress || '',
        serialNumber: existingSpecs.serialNumber || editingDevice.serialNumber || '',
        assetTag: existingSpecs.assetTag || editingDevice.assetTag || (editingDevice.computerName ? `ITS-${editingDevice.computerName}` : ''),
        location: existingSpecs.location || (editingDevice.department ? `${editingDevice.department} Area` : 'Gedung IS - Lantai 2')
      });

      // Auto-focus logic: if computer name is pre-filled from scan, focus user input
      setTimeout(() => {
        if (editingDevice.computerName && userInputRef.current) {
          userInputRef.current.focus();
        } else if (computerNameInputRef.current) {
          computerNameInputRef.current.focus();
        }
      }, 100);
    } else {
      setFormData({
        department: 'IS',
        computerName: '',
        type: 'Notebook',
        user: '',
        status: 'Online',
        remark: ''
      });

      setSpecData({
        brand: 'Lenovo',
        model: 'ThinkPad T14',
        cpu: 'Intel Core i5-1245U @ 4.4GHz',
        ram: '16 GB DDR4',
        storage: '512 GB SSD',
        os: 'Windows 11 Pro 64-bit',
        ipAddress: '',
        macAddress: '',
        serialNumber: '',
        assetTag: '',
        location: 'Gedung IS - Lantai 2'
      });

      setTimeout(() => {
        if (computerNameInputRef.current) computerNameInputRef.current.focus();
      }, 100);
    }
  }, [editingDevice, isDeviceModalOpen]);

  if (!isDeviceModalOpen) return null;

  const handleSave = (andScanNext = false) => {
    setErrorMessage('');
    const cleanComputerName = (formData.computerName || '').trim().toUpperCase();
    const cleanUser = (formData.user || '').trim();

    if (!cleanComputerName) {
      setErrorMessage('Mohon isi Computer Name perangkat.');
      if (computerNameInputRef.current) computerNameInputRef.current.focus();
      return;
    }
    if (!cleanUser) {
      setErrorMessage('Mohon isi Nama User / PIC pengguna komputer.');
      if (userInputRef.current) userInputRef.current.focus();
      return;
    }

    const finalSpecs = {
      brand: specData.brand || (formData.type === 'Server' ? 'Dell' : 'Lenovo'),
      model: specData.model || (formData.type === 'Server' ? 'PowerEdge R750' : 'ThinkPad T14'),
      cpu: specData.cpu || (formData.type === 'Server' ? 'Dual Intel Xeon @ 2.4GHz' : 'Intel Core i5-1245U @ 4.4GHz'),
      ram: specData.ram || (formData.type === 'Server' ? '64 GB ECC DDR4' : '16 GB DDR4'),
      storage: specData.storage || (formData.type === 'Server' ? '2TB NVMe SSD' : '512 GB SSD'),
      os: specData.os || (formData.type === 'Server' ? 'VMware ESXi / Windows Server' : 'Windows 11 Pro 64-bit'),
      ipAddress: specData.ipAddress || ('192.168.10.' + Math.floor(20 + Math.random() * 200)),
      macAddress: specData.macAddress || ('00:1A:2B:3C:' + Math.floor(10 + Math.random() * 89) + ':' + Math.floor(10 + Math.random() * 89)),
      serialNumber: specData.serialNumber || ('SN' + Math.floor(100000 + Math.random() * 900000)),
      assetTag: specData.assetTag || `ITS-${cleanComputerName}`,
      location: specData.location || (formData.department === 'IS' ? 'Gedung IS - Lantai 2' : `${formData.department} Office`)
    };

    if (isExistingDevice) {
      updateDevice({
        ...editingDevice,
        ...formData,
        computerName: cleanComputerName,
        user: cleanUser,
        specs: {
          ...(editingDevice.specs || {}),
          ...finalSpecs
        }
      });
    } else {
      addDevice({
        ...formData,
        computerName: cleanComputerName,
        user: cleanUser,
        specs: finalSpecs
      });
    }

    if (andScanNext) {
      if (setScannerNotice) {
        setScannerNotice(`✓ Komputer [${cleanComputerName}] berhasil didata! Silakan scan barcode perangkat berikutnya.`);
      }
      setTimeout(() => {
        if (openScannerModal) openScannerModal();
      }, 120);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(true); // Default submit from Enter key is save & scan next
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="modal-container modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '95%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header Modal */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="brand-icon">
              {formData.type === 'Server' ? (
                <Server size={20} className="icon-toray" />
              ) : formData.type === 'Notebook' ? (
                <Laptop size={20} className="icon-toray" />
              ) : (
                <Monitor size={20} className="icon-toray" />
              )}
            </div>
            <div>
              <h3>
                {isExistingDevice
                  ? `Verifikasi & Edit Perangkat: ${formData.computerName || 'Unit'}`
                  : isFromScan
                  ? `Pendaftaran Unit Baru: ${formData.computerName || 'Barcode Terdeteksi'}`
                  : 'Tambah Perangkat Baru'}
              </h3>
              <p className="modal-sub-text">
                PT. Indonesia Toray Synthetics • Stock Taking ({currentMonthLabel} {currentYear})
              </p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={closeModal} title="Tutup">
            <X size={20} />
          </button>
        </div>

        {/* Form Input Perangkat (1 per 1) */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div className="modal-body" style={{ overflowY: 'auto', flex: 1, padding: '16px 20px' }}>
            
            {/* BARCODE SCAN SOURCE BANNER */}
            {isFromScan && (
              <div
                style={{
                  background: 'rgba(0, 163, 224, 0.12)',
                  border: '1px solid rgba(0, 163, 224, 0.4)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div
                  style={{
                    background: 'rgba(0, 163, 224, 0.25)',
                    padding: '8px',
                    borderRadius: '6px',
                    color: '#38bdf8'
                  }}
                >
                  <QrCode size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <strong style={{ color: '#ffffff', fontSize: '0.85rem' }}>Hasil Pindai Barcode:</strong>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#38bdf8',
                        background: 'rgba(15, 23, 42, 0.8)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(56, 189, 248, 0.3)'
                      }}
                    >
                      {editingDevice?._scannedCode || formData.computerName}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: 600,
                        background: isExistingDevice ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: isExistingDevice ? '#34d399' : '#fbbf24',
                        border: isExistingDevice ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                      }}
                    >
                      {isExistingDevice ? '✓ Unit Ditemukan di Database' : '★ Unit Baru Belum Terdaftar'}
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.76rem', margin: '4px 0 0 0' }}>
                    {isExistingDevice
                      ? 'Silakan verifikasi status fisik dan catatan audit komputer ini, lalu klik Simpan.'
                      : 'Lengkapi nama user dan detail unit ini untuk dimasukkan ke database inventaris.'}
                  </p>
                </div>
              </div>
            )}

            {/* ERROR ALERT */}
            {errorMessage && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '14px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* PRIMARY FORM FIELDS */}
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
                  ref={computerNameInputRef}
                  type="text"
                  required
                  placeholder="Contoh: NITSIS2601542"
                  value={formData.computerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, computerName: e.target.value.toUpperCase() }))}
                  className="form-input code-font"
                  style={{ fontWeight: 700 }}
                />
              </div>

              {/* User (Pengguna) */}
              <div className="form-group">
                <label>User (Pengguna / PIC) *:</label>
                <input
                  ref={userInputRef}
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
              {/* Status Checklist Bulan Ini */}
              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Status Audit Fisik ({currentMonthLabel} {currentYear}) *:</span>
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="form-select"
                  style={{
                    fontWeight: 600,
                    color: formData.status === 'Online' ? '#34d399' : formData.status === 'Offline' ? '#f87171' : '#fbbf24'
                  }}
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
                <label>Remark / Catatan Kondisi:</label>
                <input
                  type="text"
                  placeholder="Contoh: Siap pakai, Service, Spare, Layar bergaris..."
                  value={formData.remark}
                  onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
                  className="form-input"
                />
              </div>
            </div>

            {/* EXPANDABLE HARDWARE SPECIFICATIONS SECTION */}
            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setShowAdvancedSpecs(prev => !prev)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={14} style={{ color: '#38bdf8' }} />
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
                    Spesifikasi Hardware & Jaringan (IP, Serial No, RAM, Storage)
                  </span>
                </div>
                {showAdvancedSpecs ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {showAdvancedSpecs && (
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderTop: 'none',
                    borderRadius: '0 0 6px 6px',
                    padding: '12px 14px'
                  }}
                >
                  <div className="form-grid-two">
                    <div className="form-group">
                      <label className="text-xs text-muted">Merk Komputer:</label>
                      <input
                        type="text"
                        placeholder="Lenovo / Dell / HP"
                        value={specData.brand}
                        onChange={(e) => setSpecData(prev => ({ ...prev, brand: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="text-xs text-muted">Model / Seri:</label>
                      <input
                        type="text"
                        placeholder="ThinkPad T14 / PowerEdge R750"
                        value={specData.model}
                        onChange={(e) => setSpecData(prev => ({ ...prev, model: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-two margin-top-xs">
                    <div className="form-group">
                      <label className="text-xs text-muted">Processor (CPU):</label>
                      <input
                        type="text"
                        placeholder="Intel Core i5-1245U"
                        value={specData.cpu}
                        onChange={(e) => setSpecData(prev => ({ ...prev, cpu: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="text-xs text-muted">Memory (RAM):</label>
                      <input
                        type="text"
                        placeholder="16 GB DDR4"
                        value={specData.ram}
                        onChange={(e) => setSpecData(prev => ({ ...prev, ram: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-two margin-top-xs">
                    <div className="form-group">
                      <label className="text-xs text-muted">Penyimpanan (Storage):</label>
                      <input
                        type="text"
                        placeholder="512 GB SSD"
                        value={specData.storage}
                        onChange={(e) => setSpecData(prev => ({ ...prev, storage: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="text-xs text-muted">Operating System (OS):</label>
                      <input
                        type="text"
                        placeholder="Windows 11 Pro 64-bit"
                        value={specData.os}
                        onChange={(e) => setSpecData(prev => ({ ...prev, os: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-two margin-top-xs">
                    <div className="form-group">
                      <label className="text-xs text-muted">IP Address:</label>
                      <input
                        type="text"
                        placeholder="192.168.10.x"
                        value={specData.ipAddress}
                        onChange={(e) => setSpecData(prev => ({ ...prev, ipAddress: e.target.value }))}
                        className="form-input code-font"
                      />
                    </div>
                    <div className="form-group">
                      <label className="text-xs text-muted">Serial Number (SN):</label>
                      <input
                        type="text"
                        placeholder="SNxxxxxx"
                        value={specData.serialNumber}
                        onChange={(e) => setSpecData(prev => ({ ...prev, serialNumber: e.target.value }))}
                        className="form-input code-font"
                      />
                    </div>
                  </div>

                  <div className="form-grid-two margin-top-xs">
                    <div className="form-group">
                      <label className="text-xs text-muted">Asset Tag Resmi:</label>
                      <input
                        type="text"
                        placeholder={`ITS-${formData.computerName || 'XXXX'}`}
                        value={specData.assetTag}
                        onChange={(e) => setSpecData(prev => ({ ...prev, assetTag: e.target.value }))}
                        className="form-input code-font"
                      />
                    </div>
                    <div className="form-group">
                      <label className="text-xs text-muted">Lokasi Fisik Ruangan:</label>
                      <input
                        type="text"
                        placeholder="Gedung IS - Lantai 2"
                        value={specData.location}
                        onChange={(e) => setSpecData(prev => ({ ...prev, location: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MODAL FOOTER WITH 1-PER-1 STOCK TAKING LOOP ACTIONS */}
          <div
            className="modal-footer"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px 20px',
              background: 'rgba(2, 6, 23, 0.8)'
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              onClick={closeModal}
              style={{ padding: '8px 16px' }}
            >
              Batal
            </button>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* SIMPAN & SELESAI */}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleSave(false)}
                title="Simpan perubahan dan kembali ke tampilan tabel Dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  fontSize: '0.85rem'
                }}
              >
                <Check size={15} />
                <span>Simpan & Selesai</span>
              </button>

              {/* SIMPAN & LANJUT SCAN BERIKUTNYA (PRIMARY CTA) */}
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleSave(true)}
                title="Simpan unit ini dan langsung buka Barcode Scanner untuk unit berikutnya"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  background: 'linear-gradient(135deg, #0284c7 0%, #00a3e0 100%)',
                  boxShadow: '0 4px 12px rgba(0, 163, 224, 0.35)',
                  border: 'none'
                }}
              >
                <QrCode size={16} />
                <span>Simpan & Lanjut Scan Berikutnya ➔</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
