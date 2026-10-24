import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Check,
  CheckCheck,
  RotateCcw,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  Info,
  Barcode
} from 'lucide-react';

export const StockTakingTable = () => {
  const {
    filteredDevices,
    devices,
    currentMonthRecord,
    currentYear,
    currentMonth,
    setCurrentMonth,
    monthOptions,
    statusColumns,
    updateDeviceStockStatus,
    updateDeviceStockRemark,
    checkAllOnline,
    resetMonthStock,
    openEditModal,
    deleteDevice,
    openBarcodeModal,
    signatures,
    setSignatures
  } = useInventory();

  const [editingRemarkId, setEditingRemarkId] = useState(null);
  const [tempRemark, setTempRemark] = useState('');

  const activeMonthObj = monthOptions.find(m => m.value === currentMonth) || monthOptions[0];

  // Calculate totals for each status
  const totals = {
    totalDevices: devices.length,
    Online: 0,
    In: 0,
    Out: 0,
    'Not Used': 0,
    Broken: 0,
    Disposal: 0
  };

  devices.forEach(dev => {
    const record = currentMonthRecord[dev.id];
    if (record && record.status && totals[record.status] !== undefined) {
      totals[record.status]++;
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

  return (
    <div className="table-module-wrapper">
      {/* 1. Header Sheet Banner (Authentic to Toray Physical Form in Photo 1) */}
      <div className="sheet-top-header">
        <div className="sheet-title-area">
          <div className="official-stamp">TORAY IS FORM</div>
          <h2 className="sheet-main-title">
            STOCK TAKING {activeMonthObj.label.toUpperCase()} {currentYear}
          </h2>
          <p className="sheet-subtitle">
            PT Indonesia Toray Synthetics • Information System Department
          </p>
        </div>

        {/* Quick Batch Checklist Actions */}
        <div className="sheet-actions-group">
          <button
            className="btn-quick-action success"
            onClick={checkAllOnline}
            title="Tandai semua perangkat sebagai Online untuk bulan ini"
          >
            <CheckCheck size={16} />
            <span>Centang Semua Online</span>
          </button>

          <button
            className="btn-quick-action outline"
            onClick={resetMonthStock}
            title="Reset status checklist bulan ini"
          >
            <RotateCcw size={15} />
            <span>Reset Bulan Ini</span>
          </button>
        </div>
      </div>

      {/* 2. Month Selector Tabs (Januari - Desember) */}
      <div className="month-ribbon-bar">
        <div className="month-ribbon-label">
          <Calendar size={15} />
          <span>Bulan:</span>
        </div>
        <div className="month-tabs-scroll">
          {monthOptions.map((m) => {
            const isActive = m.value === currentMonth;
            return (
              <button
                key={m.value}
                className={`month-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentMonth(m.value)}
              >
                <span className="month-name">{m.label}</span>
                <span className="month-indicator-dot" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Status Summary Metrics Strip */}
      <div className="stock-summary-strip">
        <div className="metric-pill total">
          <span className="metric-label">Total Unit:</span>
          <span className="metric-val">{totals.totalDevices}</span>
        </div>

        {statusColumns.map(sc => (
          <div
            key={sc.key}
            className={`metric-pill status-${sc.key.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span className="metric-dot" style={{ backgroundColor: sc.color }} />
            <span className="metric-label">{sc.label}:</span>
            <span className="metric-val">{totals[sc.key]}</span>
          </div>
        ))}
      </div>

      {/* 4. The Authentic Stock Taking Table (Sesuai Gambar 1) */}
      <div className="authentic-table-container">
        <table className="authentic-table stock-taking-table">
          <thead>
            <tr>
              <th className="col-no">No</th>
              <th className="col-dept">Dept/Section</th>
              <th className="col-name">Computer Name</th>
              <th className="col-type">Type</th>
              <th className="col-user">User</th>
              
              {/* Status Columns: Online, In, Out, Not Used, Broken, Disposal */}
              {statusColumns.map(sc => (
                <th key={sc.key} className={`col-status col-${sc.key.toLowerCase().replace(/\s+/g, '-')}`}>
                  {sc.label}
                </th>
              ))}

              <th className="col-remark">Remark</th>
              <th className="col-action print-hide">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.length === 0 ? (
              <tr>
                <td colSpan={13} className="empty-table-state">
                  <Info size={18} />
                  <span>Tidak ada data perangkat yang cocok dengan pencarian / filter.</span>
                </td>
              </tr>
            ) : (
              filteredDevices.map((dev, idx) => {
                const record = currentMonthRecord[dev.id] || {};
                const currentStatus = record.status || '';
                const remarkText = record.remark || dev.remark || '';

                return (
                  <tr key={dev.id} className={currentStatus ? `row-${currentStatus.toLowerCase().replace(/\s+/g, '-')}` : ''}>
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

                    {/* 6. Interactive Checklist Columns */}
                    {statusColumns.map(sc => {
                      const isChecked = currentStatus === sc.key;
                      return (
                        <td
                          key={sc.key}
                          className={`cell-check ${isChecked ? 'checked' : ''}`}
                          onClick={() => updateDeviceStockStatus(dev.id, sc.key)}
                          title={`Klik untuk ubah status ke ${sc.label}`}
                        >
                          <div className={`check-box-visual ${isChecked ? 'active' : ''}`}>
                            {isChecked ? (
                              <Check size={16} strokeWidth={3} className="check-icon" />
                            ) : (
                              <span className="check-placeholder" />
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* 7. Remark Column */}
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
                          {remarkText || '-'}
                        </span>
                      )}
                    </td>

                    {/* 8. Action Column */}
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

          {/* Table Summary Footer */}
          <tfoot>
            <tr className="tfoot-summary-row">
              <td colSpan={5} className="summary-title-cell">
                <strong>TOTAL UNIT ({totals.totalDevices} Devices)</strong>
              </td>
              {statusColumns.map(sc => (
                <td key={sc.key} className="summary-val-cell">
                  <strong>{totals[sc.key]}</strong>
                </td>
              ))}
              <td colSpan={2} className="summary-empty-cell">
                {totals.Out > 0 && <span className="badge-alert-sm">{totals.Out} Perangkat Out/Service</span>}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 5. Toray Physical Signature Boxes (PIC & Manager) */}
      <div className="toray-signature-section">
        <div className="signature-notes">
          <p><strong>Catatan Pemeriksaan:</strong></p>
          <p>• Data di atas telah diverifikasi secara fisik di area kerja masing-masing section.</p>
          <p>• Perangkat berstatus Out / Service wajib dilengkapi nomor tiket perbaikan IT.</p>
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
