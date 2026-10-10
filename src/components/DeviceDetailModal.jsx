import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  X,
  QrCode,
  Cpu,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Building2,
  Printer,
  ShieldCheck,
  ClipboardCheck
} from 'lucide-react';

export const DeviceDetailModal = () => {
  const {
    selectedDevice,
    isDeviceDetailOpen,
    setIsDeviceDetailOpen,
    departments = [],
    setIsPrintModalOpen,
    openStockTakingModalForDevice
  } = useInventory();

  if (!isDeviceDetailOpen || !selectedDevice) return null;

  const safeDepts = Array.isArray(departments) ? departments : [];
  const dept = safeDepts.find(d => d.id === selectedDevice.departmentId || d.code === selectedDevice.departmentCode);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const statusClass = (selectedDevice.status || 'Verified').toLowerCase().replace(/\s+/g, '-');
  const condClass = (selectedDevice.condition || 'Good').toLowerCase().replace(/\s+/g, '-');

  const handleStartStockTaking = () => {
    setIsDeviceDetailOpen(false);
    if (openStockTakingModalForDevice) {
      openStockTakingModalForDevice(selectedDevice);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsDeviceDetailOpen(false)}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="asset-tag-badge lg">
              <QrCode size={18} />
              <span>{selectedDevice.assetTag}</span>
            </div>
            <div>
              <h3>{selectedDevice.name}</h3>
              <p className="modal-sub-text">{selectedDevice.brand} {selectedDevice.model} • S/N: {selectedDevice.serialNumber}</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={() => setIsDeviceDetailOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="modal-body">
          <div className="specs-tab-content">
            <div className="specs-grid-two">
              {/* Basic Info */}
              <div className="info-block">
                <h4>Informasi Perangkat & Opname</h4>
                <div className="info-row">
                  <span className="lbl"><User size={14} /> Pengguna (PIC):</span>
                  <span className="val highlight">{selectedDevice.assignedTo || 'Unassigned'}</span>
                </div>
                <div className="info-row">
                  <span className="lbl"><Building2 size={14} /> Master Departemen:</span>
                  <span className="val">{dept ? `[${dept.code}] ${dept.name}` : selectedDevice.departmentId}</span>
                </div>
                <div className="info-row">
                  <span className="lbl"><MapPin size={14} /> Lokasi Penempatan:</span>
                  <span className="val">{selectedDevice.location || '-'}</span>
                </div>
                <div className="info-row">
                  <span className="lbl"><ShieldCheck size={14} /> Status Audit Opname:</span>
                  <span className={`status-badge status-${statusClass}`}>
                    {selectedDevice.status || 'Verified'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="lbl">Kondisi Fisik:</span>
                  <span className={`condition-pill cond-${condClass}`}>
                    {selectedDevice.condition || 'Good'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="lbl">Tgl Audit Opname Terakhir:</span>
                  <span className="val code-font">{selectedDevice.lastStockTakingDate || 'Belum Opname'}</span>
                </div>
              </div>

              {/* Technical Specs */}
              <div className="info-block">
                <h4>Spesifikasi Hardware & Sistem</h4>
                <div className="info-row">
                  <span className="lbl">Processor (CPU):</span>
                  <span className="val">{selectedDevice.specs?.cpu || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="lbl">Memori (RAM):</span>
                  <span className="val">{selectedDevice.specs?.ram || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="lbl">Penyimpanan (Disk):</span>
                  <span className="val">{selectedDevice.specs?.storage || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="lbl">Sistem Operasi (OS):</span>
                  <span className="val">{selectedDevice.specs?.os || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="lbl">IP Address:</span>
                  <span className="val code-font">{selectedDevice.specs?.ipAddress || 'DHCP'}</span>
                </div>
                <div className="info-row">
                  <span className="lbl">MAC Address:</span>
                  <span className="val code-font">{selectedDevice.specs?.macAddress || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Purchase & Warranty */}
            <div className="specs-grid-two margin-top">
              <div className="info-block">
                <h4>Pembelian & Garansi (Capex)</h4>
                <div className="info-row">
                  <span className="lbl"><Calendar size={14} /> Tanggal Pembelian:</span>
                  <span className="val">{selectedDevice.purchaseDate || '-'}</span>
                </div>
                <div className="info-row">
                  <span className="lbl"><DollarSign size={14} /> Harga Pembelian:</span>
                  <span className="val format-idr">{formatIDR(selectedDevice.purchaseCost)}</span>
                </div>
                <div className="info-row">
                  <span className="lbl"><ShieldCheck size={14} /> Masa Garansi Berakhir:</span>
                  <span className="val text-amber">{selectedDevice.warrantyExpiry || '-'}</span>
                </div>
              </div>

              <div className="info-block">
                <h4>Catatan Auditor Stock Opname</h4>
                <p className="notes-box">{selectedDevice.notes || 'Tidak ada catatan khusus untuk perangkat ini.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setIsPrintModalOpen(true)}>
            <Printer size={16} /> Cetak Label QR Tag
          </button>
          <button className="btn-primary" onClick={handleStartStockTaking}>
            <ClipboardCheck size={16} /> + Input Stock Opname Asset Ini
          </button>
          <button className="btn-secondary" onClick={() => setIsDeviceDetailOpen(false)}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
