import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  HardDrive,
  QrCode,
  FileSpreadsheet,
  Plus,
  Building2,
  Monitor,
  RotateCcw,
  LayoutList,
  Smartphone,
  User,
  Edit2,
  Trash2,
  Laptop,
  Server,
  Zap,
  Printer
} from 'lucide-react';

export const DevicesCatalogPage = () => {
  const {
    devices = [],
    departments = [],
    statusOptions = [],
    typeOptions = [],
    searchQuery,
    setSearchQuery,
    filterDept,
    setFilterDept,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    openAddModal,
    openEditModal,
    openScannerModal,
    openBarcodePrint,
    updateDeviceStatus,
    deleteDevice
  } = useInventory();

  const [viewMode, setViewMode] = useState('auto'); // 'auto' | 'cards' | 'table'

  // Counts & status metrics
  const totalCount = devices.length;
  const onlineCount = devices.filter(d => d.status === 'Online').length;
  const inCount = devices.filter(d => d.status === 'In').length;
  const outCount = devices.filter(d => d.status === 'Out').length;
  const notUsedCount = devices.filter(d => d.status === 'Not Used').length;
  const brokenCount = devices.filter(d => d.status === 'Broken').length;
  const disposalCount = devices.filter(d => d.status === 'Disposal').length;

  // Filtered devices list
  const filteredDevices = devices.filter((dev) => {
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch =
      query === '' ||
      (dev.computerName || '').toLowerCase().includes(query) ||
      (dev.ipAddress || '').toLowerCase().includes(query) ||
      (dev.user || '').toLowerCase().includes(query) ||
      (dev.department || '').toLowerCase().includes(query) ||
      (dev.type || '').toLowerCase().includes(query) ||
      (dev.remark || '').toLowerCase().includes(query);

    const matchesDept = filterDept === 'All' || dev.department === filterDept;
    const matchesStatus = filterStatus === 'All' || dev.status === filterStatus;
    const matchesType = filterType === 'All' || dev.type === filterType;

    return matchesSearch && matchesDept && matchesStatus && matchesType;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["No", "Departemen / Section", "Computer Name", "IP Address", "Type", "User", "Status", "Remark / Keterangan"];
    const rows = filteredDevices.map((d, index) => [
      index + 1,
      d.department || '',
      d.computerName || '',
      d.ipAddress || '',
      d.type || '',
      `"${(d.user || '').replace(/"/g, '""')}"`,
      d.status || '',
      `"${(d.remark || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ITS_Device_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Online': return 'status-online';
      case 'In': return 'status-in';
      case 'Out': return 'status-out';
      case 'Not Used': return 'status-not-used';
      case 'Broken': return 'status-broken';
      case 'Disposal': return 'status-disposal';
      default: return 'status-default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Laptop': return <Laptop size={14} style={{ color: '#38bdf8' }} />;
      case 'Server': return <Server size={14} style={{ color: '#a78bfa' }} />;
      case 'Industrial PC': return <Zap size={14} style={{ color: '#fbbf24' }} />;
      case 'Printer & Scanner': return <Printer size={14} style={{ color: '#f472b6' }} />;
      default: return <Monitor size={14} style={{ color: '#60a5fa' }} />;
    }
  };

  return (
    <div className="page-fade-in fintech-inventory-section" style={{ marginTop: 0 }}>
      {/* Section Title & Action Buttons */}
      <div className="inventory-section-header">
        <div className="section-title-wrap">
          <h1 className="section-main-title">
            <HardDrive size={24} style={{ color: '#3b82f6' }} />
            <span>Tabel Master Inventaris Komputer & Device IT</span>
          </h1>
          <p className="section-subtitle-text">
            PT. Indonesia Toray Synthetics (ITS) Tangerang Plant • Monitoring Status Perangkat per Departemen
          </p>
        </div>

        <div className="inventory-actions-cluster">
          <button
            className="btn-inventory-action"
            onClick={() => openScannerModal()}
            title="Scan Barcode / QR dengan Kamera HP"
          >
            <QrCode size={16} style={{ color: '#38bdf8' }} />
            <span>Scan Barcode / QR</span>
          </button>
          <button
            className="btn-inventory-action"
            onClick={handleExportCSV}
            title="Export Data ke File CSV"
          >
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>
          <button
            className="btn-inventory-action btn-blue-solid"
            onClick={openAddModal}
            title="Tambah Komputer Baru"
          >
            <Plus size={16} />
            <span>+ Tambah Komputer</span>
          </button>
        </div>
      </div>

      {/* 7 KPI Status Filter Cards */}
      <div className="kpi-cards-grid-7">
        {/* Total Unit */}
        <div
          className={`kpi-card-box ${filterStatus === 'All' ? 'active' : ''}`}
          onClick={() => setFilterStatus('All')}
          title="Tampilkan semua unit"
        >
          <span className="kpi-box-label">TOTAL UNIT</span>
          <span className="kpi-box-num">{totalCount}</span>
        </div>

        {/* 1. Online (Blue Live Pulse Dot!) */}
        <div
          className={`kpi-card-box ${filterStatus === 'Online' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Online' ? 'All' : 'Online')}
          title="Filter status Online"
        >
          <div className="kpi-box-label-row">
            <span className="kpi-blue-dot"></span>
            <span className="kpi-box-label">1. ONLINE</span>
          </div>
          <span className="kpi-box-num" style={{ color: '#3b82f6' }}>{onlineCount}</span>
        </div>

        {/* 2. In */}
        <div
          className={`kpi-card-box ${filterStatus === 'In' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'In' ? 'All' : 'In')}
          title="Filter status In"
        >
          <span className="kpi-box-label">2. IN</span>
          <span className="kpi-box-num" style={{ color: '#38bdf8' }}>{inCount}</span>
        </div>

        {/* 3. Out */}
        <div
          className={`kpi-card-box ${filterStatus === 'Out' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Out' ? 'All' : 'Out')}
          title="Filter status Out"
        >
          <span className="kpi-box-label">3. OUT</span>
          <span className="kpi-box-num" style={{ color: '#fbbf24' }}>{outCount}</span>
        </div>

        {/* 4. Not Used */}
        <div
          className={`kpi-card-box ${filterStatus === 'Not Used' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Not Used' ? 'All' : 'Not Used')}
          title="Filter status Not Used"
        >
          <span className="kpi-box-label">4. NOT USED</span>
          <span className="kpi-box-num" style={{ color: '#848a96' }}>{notUsedCount}</span>
        </div>

        {/* 5. Broken */}
        <div
          className={`kpi-card-box ${filterStatus === 'Broken' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Broken' ? 'All' : 'Broken')}
          title="Filter status Broken"
        >
          <span className="kpi-box-label">5. BROKEN</span>
          <span className="kpi-box-num" style={{ color: '#f87171' }}>{brokenCount}</span>
        </div>

        {/* 6. Disposal */}
        <div
          className={`kpi-card-box ${filterStatus === 'Disposal' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Disposal' ? 'All' : 'Disposal')}
          title="Filter status Disposal"
        >
          <span className="kpi-box-label">6. DISPOSAL</span>
          <span className="kpi-box-num" style={{ color: '#c084fc' }}>{disposalCount}</span>
        </div>
      </div>

      {/* Table Container Card */}
      <div className="fintech-table-card">
        {/* Filter Controls Bar */}
        <div className="table-filter-controls-row">
          <div className="filter-selects-pair">
            {/* Departemen Select */}
            <div className="fintech-select-wrapper">
              <Building2 size={14} style={{ color: '#848a96' }} />
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="fintech-select"
              >
                <option value="All">Semua Departemen ({departments.length})</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.code}>
                    [{d.code}] {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <div className="fintech-select-wrapper">
              <span style={{ fontSize: '12px', color: '#848a96' }}>⚡</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="fintech-select"
              >
                <option value="All">Semua Status ({statusOptions.length})</option>
                {statusOptions.map((st) => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
            </div>

            {/* Type Select */}
            <div className="fintech-select-wrapper">
              <Monitor size={14} style={{ color: '#848a96' }} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="fintech-select"
              >
                <option value="All">Semua Type ({typeOptions.length})</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {(filterDept !== 'All' || filterStatus !== 'All' || filterType !== 'All' || searchQuery !== '') && (
              <button
                className="btn-inventory-action"
                onClick={() => {
                  setFilterDept('All');
                  setFilterStatus('All');
                  setFilterType('All');
                  setSearchQuery('');
                }}
                title="Reset filter"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* View Mode Toggle Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className={`btn-inventory-action ${viewMode === 'table' ? 'btn-blue-solid' : ''}`}
              onClick={() => setViewMode(viewMode === 'table' ? 'auto' : 'table')}
              title="Paksa Tampilan Tabel"
            >
              <LayoutList size={14} />
              <span>Tabel</span>
            </button>
            <button
              type="button"
              className={`btn-inventory-action ${viewMode === 'cards' ? 'btn-blue-solid' : ''}`}
              onClick={() => setViewMode(viewMode === 'cards' ? 'auto' : 'cards')}
              title="Tampilan Kartu Mobile"
            >
              <Smartphone size={14} />
              <span>Mobile Card</span>
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="fintech-data-table">
            <thead>
              <tr>
                <th style={{ width: '45px' }}>NO</th>
                <th style={{ width: '140px' }}>DEPARTEMEN / SECTION</th>
                <th>COMPUTER NAME</th>
                <th style={{ width: '130px' }}>TYPE</th>
                <th>USER</th>
                <th style={{ width: '130px' }}>STATUS</th>
                <th>REMARK / KETERANGAN</th>
                <th style={{ textAlign: 'right', width: '110px' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px 20px', color: '#727885' }}>
                    <Monitor size={34} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.5 }} />
                    <strong style={{ display: 'block', fontSize: '15px', color: '#f1f5f9' }}>
                      Tidak ada komputer yang sesuai filter
                    </strong>
                    <span style={{ fontSize: '12px' }}>Coba ubah kata kunci pencarian atau reset filter di atas</span>
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device, index) => {
                  const deptSlug = (device.department || 'default').toLowerCase().replace(/[^a-z0-9]/g, '');
                  return (
                    <tr key={device.id}>
                      {/* 1. NO */}
                      <td style={{ color: '#727885', fontWeight: 600 }}>{index + 1}</td>

                      {/* 2. DEPARTEMEN */}
                      <td>
                        <span className={`dept-badge-pill dept-${deptSlug}`}>
                          {device.department}
                        </span>
                      </td>

                      {/* 3. COMPUTER NAME & IP */}
                      <td>
                        <div className="table-device-identity">
                          <span className="table-comp-name">{device.computerName}</span>
                          <span className="table-ip-badge">
                            <span style={{ opacity: 0.6 }}>IP</span> {device.ipAddress}
                          </span>
                        </div>
                      </td>

                      {/* 4. TYPE */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#cbd5e1' }}>
                          {getTypeIcon(device.type)}
                          <span>{device.type}</span>
                        </div>
                      </td>

                      {/* 5. USER */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                          <User size={13} style={{ color: '#727885' }} />
                          <strong style={{ color: '#f1f5f9' }}>{device.user}</strong>
                        </div>
                      </td>

                      {/* 6. STATUS */}
                      <td>
                        <select
                          value={device.status}
                          onChange={(e) => updateDeviceStatus(device.id, e.target.value)}
                          className={`status-dropdown-pill ${getStatusBadgeClass(device.status)}`}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 7. REMARK */}
                      <td style={{ color: '#94a3b8', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={device.remark}>
                        {device.remark || '-'}
                      </td>

                      {/* 8. AKSI */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions-group">
                          <button
                            className="btn-table-action-icon"
                            onClick={() => openBarcodePrint(device)}
                            title="Cetak Barcode / QR Label"
                          >
                            <QrCode size={14} />
                          </button>
                          <button
                            className="btn-table-action-icon"
                            onClick={() => openEditModal(device)}
                            title="Edit Komputer"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn-table-action-icon danger"
                            onClick={() => {
                              if (window.confirm(`Hapus komputer [${device.computerName}] dari daftar?`)) {
                                deleteDevice(device.id);
                              }
                            }}
                            title="Hapus Komputer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="fintech-table-footer">
          <span>Menampilkan {filteredDevices.length} dari total {devices.length} komputer terdaftar di sistem ITS.</span>
          <span>PT. Indonesia Toray Synthetics • Device Master Management</span>
        </div>
      </div>
    </div>
  );
};
