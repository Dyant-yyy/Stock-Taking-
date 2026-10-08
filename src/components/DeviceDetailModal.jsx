import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  X,
  QrCode,
  Cpu,
  HardDrive,
  Monitor,
  Wifi,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Building2,
  Wrench,
  Clock,
  Printer,
  ShieldCheck
} from 'lucide-react';

export const DeviceDetailModal = () => {
  const {
    selectedDevice,
    isDeviceDetailOpen,
    setIsDeviceDetailOpen,
    departments,
    checkouts,
    maintenance,
    setIsPrintModalOpen,
    setIsCheckoutModalOpen,
    setIsReportMaintenanceOpen
  } = useInventory();

  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'history' | 'maintenance'

  if (!isDeviceDetailOpen || !selectedDevice) return null;

  const dept = departments.find(d => d.id === selectedDevice.departmentId);
  const deviceCheckouts = checkouts.filter(c => c.deviceId === selectedDevice.id);
  const deviceMaintenance = maintenance.filter(m => m.deviceId === selectedDevice.id);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
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

        {/* MODAL TABS */}
        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            <Cpu size={16} /> Spesifikasi & Detail Asset
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Clock size={16} /> Histori Peminjaman ({deviceCheckouts.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
          >
            <Wrench size={16} /> Record Maintenance ({deviceMaintenance.length})
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="modal-body">
          {activeTab === 'specs' ? (
            <div className="specs-tab-content">
              <div className="specs-grid-two">
                {/* Basic Info */}
                <div className="info-block">
                  <h4>Informasi Penggunaan & Lokasi</h4>
                  <div className="info-row">
                    <span className="lbl"><User size={14} /> Pengguna (PIC):</span>
                    <span className="val highlight">{selectedDevice.assignedTo}</span>
                  </div>
                  <div className="info-row">
                    <span className="lbl"><Building2 size={14} /> Departemen:</span>
                    <span className="val">{dept ? dept.name : selectedDevice.departmentId}</span>
                  </div>
                  <div className="info-row">
                    <span className="lbl"><MapPin size={14} /> Lokasi Penempatan:</span>
                    <span className="val">{selectedDevice.location}</span>
                  </div>
                  <div className="info-row">
                    <span className="lbl"><ShieldCheck size={14} /> Status Operational:</span>
                    <span className={`status-badge status-${selectedDevice.status.toLowerCase().replace(' ', '-')}`}>
                      {selectedDevice.status}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="lbl">Kondisi Perangkat:</span>
                    <span className={`condition-pill cond-${selectedDevice.condition.toLowerCase().replace(' ', '-')}`}>
                      {selectedDevice.condition}
                    </span>
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
                    <span className="val">{selectedDevice.purchaseDate}</span>
                  </div>
                  <div className="info-row">
                    <span className="lbl"><DollarSign size={14} /> Harga Pembelian:</span>
                    <span className="val format-idr">{formatIDR(selectedDevice.purchaseCost)}</span>
                  </div>
                  <div className="info-row">
                    <span className="lbl"><ShieldCheck size={14} /> Masa Garansi Berakhir:</span>
                    <span className="val text-amber">{selectedDevice.warrantyExpiry}</span>
                  </div>
                </div>

                <div className="info-block">
                  <h4>Catatan Tambahan</h4>
                  <p className="notes-box">{selectedDevice.notes || 'Tidak ada catatan tambahan untuk perangkat ini.'}</p>
                </div>
              </div>
            </div>
          ) : activeTab === 'history' ? (
            <div className="history-tab-content">
              {deviceCheckouts.length === 0 ? (
                <div className="empty-state-sm">
                  <Clock size={32} className="text-muted" />
                  <p>Belum ada riwayat peminjaman untuk perangkat ini.</p>
                </div>
              ) : (
                <table className="mini-table">
                  <thead>
                    <tr>
                      <th>Peminjam</th>
                      <th>Departemen</th>
                      <th>Tujuan</th>
                      <th>Tgl Pinjam</th>
                      <th>Rencana Kembali</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviceCheckouts.map((chk) => (
                      <tr key={chk.id}>
                        <td><strong>{chk.borrowerName}</strong></td>
                        <td>{chk.department}</td>
                        <td>{chk.purpose}</td>
                        <td>{chk.checkoutDate}</td>
                        <td>{chk.expectedReturnDate}</td>
                        <td>
                          <span className={`status-badge ${chk.status === 'Active' ? 'status-in-use' : 'status-available'}`}>
                            {chk.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="maintenance-tab-content">
              {deviceMaintenance.length === 0 ? (
                <div className="empty-state-sm">
                  <Wrench size={32} className="text-muted" />
                  <p>Perangkat ini belum pernah mengalami perbaikan.</p>
                </div>
              ) : (
                <div className="maintenance-timeline">
                  {deviceMaintenance.map((m) => (
                    <div key={m.id} className="timeline-item">
                      <div className="timeline-date">{m.reportDate}</div>
                      <div className="timeline-card">
                        <div className="timeline-title">
                          <strong>{m.issueCategory}</strong>
                          <span className={`status-badge status-${m.status.toLowerCase().replace(' ', '-')}`}>{m.status}</span>
                        </div>
                        <p>{m.description}</p>
                        <div className="timeline-meta">
                          <span>Teknisi: {m.technician}</span>
                          <span>Biaya: {formatIDR(m.costEstimate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setIsPrintModalOpen(true)}>
            <Printer size={16} /> Cetak Label QR
          </button>
          <button className="btn-primary" onClick={() => setIsDeviceDetailOpen(false)}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
