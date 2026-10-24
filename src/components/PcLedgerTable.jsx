import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Check,
  Edit2,
  Trash2,
  Printer,
  ShieldCheck,
  FileSpreadsheet,
  Info,
  Barcode
} from 'lucide-react';

export const PcLedgerTable = () => {
  const {
    filteredDevices,
    devices,
    currentMonthRecord,
    currentYear,
    currentMonth,
    monthOptions,
    updateDeviceStockStatus,
    updateDeviceStockRemark,
    openEditModal,
    deleteDevice,
    openBarcodeModal,
    signatures,
    setSignatures
  } = useInventory();

  const [editingRemarkId, setEditingRemarkId] = useState(null);
  const [tempRemark, setTempRemark] = useState('');

  const activeMonthObj = monthOptions.find(m => m.value === currentMonth) || monthOptions[0];

  // Calculate totals for Online vs Offline
  let totalOnline = 0;
  let totalOffline = 0;
  const offlineRemarks = [];

  devices.forEach(dev => {
    const record = currentMonthRecord[dev.id] || {};
    const status = record.status || dev.status || 'Online';
    const isOnline = status === 'Online';
    
    if (isOnline) {
      totalOnline++;
    } else {
      totalOffline++;
      const remark = record.remark || dev.remark || 'Offline';
      if (remark) offlineRemarks.push(remark);
    }
  });

  const handleStartEditRemark = (deviceId, currentRemark) => {
    setEditingRemarkId(deviceId);
    setTempRemark(currentRemark || '');
  };

  const handleSaveRemark = (deviceId) => {
    updateDeviceStockRemark(deviceId, tempRemark);
    setEditingRemarkId(null);
  };

  // Toggle quick between Online and Offline (defaults to Out/Service)
  const handleToggleOnlineOffline = (devId, targetOnline) => {
    if (targetOnline) {
      updateDeviceStockStatus(devId, 'Online');
    } else {
      updateDeviceStockStatus(devId, 'Out');
      updateDeviceStockRemark(devId, 'Service');
    }
  };

  return (
    <div className="table-module-wrapper">
      {/* 1. Official Corporate Header Box (Authentic to Photo 2) */}
      <div className="ledger-corporate-header">
        <div className="corp-header-left">
          <div className="corp-logo-title">
            <h1 className="corp-name">PT INDONESIA TORAY SYNTHETICS</h1>
            <h2 className="corp-dept">INFORMATION SYSTEM</h2>
          </div>
          <div className="corp-tagline">
            IT HARDWARE & PC LEDGER MONITORING • {activeMonthObj.label.toUpperCase()} {currentYear}
          </div>
        </div>

        <div className="corp-header-right">
          <table className="doc-meta-box">
            <tbody>
              <tr>
                <td className="meta-label">Document:</td>
                <td className="meta-val">
                  <input
                    type="text"
                    className="meta-inline-input"
                    value={signatures.docNo}
                    onChange={(e) => setSignatures(prev => ({ ...prev, docNo: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td className="meta-label">Created:</td>
                <td className="meta-val">
                  <input
                    type="text"
                    className="meta-inline-input"
                    value={signatures.createdDate}
                    onChange={(e) => setSignatures(prev => ({ ...prev, createdDate: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td className="meta-label">Revision:</td>
                <td className="meta-val">
                  <input
                    type="text"
                    className="meta-inline-input"
                    value={signatures.revision}
                    onChange={(e) => setSignatures(prev => ({ ...prev, revision: e.target.value }))}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="meta-stamp">
                  INTERNAL PERUSAHAAN
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Key Metrics Circles (Directly Reflecting the Circles in Photo 2) */}
      <div className="ledger-metrics-strip">
        <div className="circle-stat-card online">
          <div className="circle-number">{totalOnline}</div>
          <div className="circle-label">Total Online</div>
          <div className="circle-sub">Unit Terkoneksi Normal</div>
        </div>

        <div className="circle-stat-card offline">
          <div className="circle-number">{totalOffline}</div>
          <div className="circle-label">Total Offline</div>
          <div className="circle-sub">Service / Perbaikan / Out</div>
        </div>

        <div className="circle-stat-card total">
          <div className="circle-number">{devices.length}</div>
          <div className="circle-label">Total Asset Terdaftar</div>
          <div className="circle-sub">Server, Notebook & PC</div>
        </div>
      </div>

      {/* 3. The Authentic PC Ledger Table (Sesuai Gambar 2) */}
      <div className="authentic-table-container">
        <table className="authentic-table ledger-table">
          <thead>
            <tr>
              <th className="col-no">No</th>
              <th className="col-dept">Dept/Section</th>
              <th className="col-name">Computer Name</th>
              <th className="col-type">Type</th>
              <th className="col-user">User</th>
              <th className="col-online-led">Online</th>
              <th className="col-offline-led">Offline</th>
              <th className="col-remark">Remark</th>
              <th className="col-action print-hide">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.length === 0 ? (
              <tr>
                <td colSpan={9} className="empty-table-state">
                  <Info size={18} />
                  <span>Tidak ada data perangkat yang cocok dengan pencarian.</span>
                </td>
              </tr>
            ) : (
              filteredDevices.map((dev, idx) => {
                const record = currentMonthRecord[dev.id] || {};
                const status = record.status || dev.status || 'Online';
                const isOnline = status === 'Online';
                const isOffline = !isOnline;
                const remarkText = record.remark || dev.remark || '';

                return (
                  <tr key={dev.id} className={isOnline ? 'row-online' : 'row-offline'}>
                    {/* 1. No */}
                    <td className="cell-no">{idx + 1}</td>

                    {/* 2. Dept/Section */}
                    <td className="cell-dept">
                      <span className="dept-tag">{dev.department}</span>
                    </td>

                    {/* 3. Computer Name */}
                    <td className="cell-name">
                      <strong className="code-font">{dev.computerName}</strong>
                    </td>

                    {/* 4. Type */}
                    <td className="cell-type">{dev.type}</td>

                    {/* 5. User */}
                    <td className="cell-user">
                      <span className="user-name">{dev.user}</span>
                    </td>

                    {/* 6. Online Column (Shows 1 or Checkmark) */}
                    <td
                      className={`cell-ledger-check ${isOnline ? 'active-online' : ''}`}
                      onClick={() => handleToggleOnlineOffline(dev.id, true)}
                      title="Klik untuk set Online"
                    >
                      <div className="ledger-val-indicator">
                        {isOnline ? (
                          <span className="badge-count-1">1</span>
                        ) : (
                          <span className="cell-dash">-</span>
                        )}
                      </div>
                    </td>

                    {/* 7. Offline Column (Shows 1 or Checkmark) */}
                    <td
                      className={`cell-ledger-check ${isOffline ? 'active-offline' : ''}`}
                      onClick={() => handleToggleOnlineOffline(dev.id, false)}
                      title="Klik untuk set Offline"
                    >
                      <div className="ledger-val-indicator">
                        {isOffline ? (
                          <span className="badge-count-offline">1</span>
                        ) : (
                          <span className="cell-dash">-</span>
                        )}
                      </div>
                    </td>

                    {/* 8. Remark Column */}
                    <td className="cell-remark">
                      {editingRemarkId === dev.id ? (
                        <div className="remark-edit-box">
                          <input
                            type="text"
                            value={tempRemark}
                            autoFocus
                            placeholder="Catatan..."
                            onChange={(e) => setTempRemark(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRemark(dev.id);
                              if (e.key === 'Escape') setEditingRemarkId(null);
                            }}
                            className="remark-input"
                          />
                          <button
                            className="btn-save-sm"
                            onClick={() => handleSaveRemark(dev.id)}
                            title="Simpan"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`remark-display ${remarkText ? 'has-remark' : 'empty'}`}
                          onClick={() => handleStartEditRemark(dev.id, remarkText)}
                          title="Klik untuk ubah keterangan"
                        >
                          {remarkText || (isOffline ? 'Service' : '-')}
                        </span>
                      )}
                    </td>

                    {/* 9. Actions Column */}
                    <td className="cell-actions print-hide">
                      <button
                        className="btn-tbl-action barcode"
                        onClick={() => openBarcodeModal(dev)}
                        title="Lihat & Cetak Barcode Perangkat"
                      >
                        <Barcode size={13} />
                      </button>
                      <button
                        className="btn-tbl-action edit"
                        onClick={() => openEditModal(dev)}
                        title="Edit Perangkat"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="btn-tbl-action delete"
                        onClick={() => deleteDevice(dev.id)}
                        title="Hapus Perangkat"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Table Summary Footer (Matching the circled totals in Photo 2) */}
          <tfoot>
            <tr className="tfoot-ledger-row">
              <td colSpan={5} className="summary-title-cell">
                <strong>TOTAL ({devices.length} Unit)</strong>
              </td>
              <td className="summary-val-circle online">
                <span className="circle-highlight">{totalOnline}</span>
              </td>
              <td className="summary-val-circle offline">
                <span className="circle-highlight">{totalOffline}</span>
              </td>
              <td colSpan={2} className="summary-notes-cell">
                {offlineRemarks.length > 0 ? (
                  <span className="notes-highlight">
                    {offlineRemarks.join(', ')}
                  </span>
                ) : (
                  <span>Semua sistem berjalan normal</span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 4. Toray Physical Signature Boxes (PIC & Manager) */}
      <div className="toray-signature-section">
        <div className="signature-notes">
          <p><strong>Status Ledger IT PT INDONESIA TORAY SYNTHETICS:</strong></p>
          <p>• Rekapitulasi unit komputer online vs offline diperbarui secara berkala.</p>
          <p>• Unit dalam status service diserahkan ke vendor / bengkel resmi dengan tanda terima.</p>
        </div>

        <div className="signature-boxes-container">
          {/* Box PIC */}
          <div className="signature-card">
            <div className="sig-header">PIC</div>
            <div className="sig-space">
              <span className="sig-stamp-mark">VERIFIED</span>
            </div>
            <div className="sig-footer">
              <input
                type="text"
                className="sig-name-input"
                value={signatures.picName}
                onChange={(e) => setSignatures(prev => ({ ...prev, picName: e.target.value }))}
                title="Nama PIC"
              />
              <span className="sig-role-text">{signatures.picTitle}</span>
            </div>
          </div>

          {/* Box Manager */}
          <div className="signature-card">
            <div className="sig-header">Manager</div>
            <div className="sig-space">
              <span className="sig-stamp-mark">APPROVED</span>
            </div>
            <div className="sig-footer">
              <input
                type="text"
                className="sig-name-input"
                value={signatures.managerName}
                onChange={(e) => setSignatures(prev => ({ ...prev, managerName: e.target.value }))}
                title="Nama Manager"
              />
              <span className="sig-role-text">{signatures.managerTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
