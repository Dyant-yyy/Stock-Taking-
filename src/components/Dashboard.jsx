import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Monitor,
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  RotateCcw,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Cpu,
  Building2,
  User,
  ArrowUpDown,
  Laptop,
  Server,
  Zap,
  Activity
} from 'lucide-react';

export const Dashboard = () => {
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
    updateDeviceStatus,
    deleteDevice,
    resetToSeedData
  } = useInventory();

  // Status Metrics Counting
  const totalCount = devices.length;
  const onlineCount = devices.filter(d => d.status === 'Online').length;
  const inCount = devices.filter(d => d.status === 'In').length;
  const outCount = devices.filter(d => d.status === 'Out').length;
  const notUsedCount = devices.filter(d => d.status === 'Not Used').length;
  const brokenCount = devices.filter(d => d.status === 'Broken').length;
  const disposalCount = devices.filter(d => d.status === 'Disposal').length;

  // Filter Logic
  const filteredDevices = devices.filter((dev) => {
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch =
      query === '' ||
      (dev.computerName || '').toLowerCase().includes(query) ||
      (dev.user || '').toLowerCase().includes(query) ||
      (dev.department || '').toLowerCase().includes(query) ||
      (dev.type || '').toLowerCase().includes(query) ||
      (dev.remark || '').toLowerCase().includes(query);

    const matchesDept = filterDept === 'All' || dev.department === filterDept;
    const matchesStatus = filterStatus === 'All' || dev.status === filterStatus;
    const matchesType = filterType === 'All' || dev.type === filterType;

    return matchesSearch && matchesDept && matchesStatus && matchesType;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["No", "Departemen / Section", "Computer Name", "Type", "User", "Status", "Remark / Keterangan"];
    const rows = filteredDevices.map((d, index) => [
      index + 1,
      d.department || '',
      d.computerName || '',
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
      case 'Online': return 'badge-online';
      case 'In': return 'badge-in';
      case 'Out': return 'badge-out';
      case 'Not Used': return 'badge-not-used';
      case 'Broken': return 'badge-broken';
      case 'Disposal': return 'badge-disposal';
      default: return 'badge-default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Laptop': return <Laptop size={14} className="text-cyan" />;
      case 'Server': return <Server size={14} className="text-purple" />;
      case 'Industrial PC': return <Zap size={14} className="text-amber" />;
      default: return <Monitor size={14} className="text-blue" />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* TOP HEADER TITLE */}
      <div className="dashboard-title-bar">
        <div>
          <h2>Tabel Inventaris Komputer & Device IT</h2>
          <p className="sub-title-text">
            PT. Indonesia Toray Synthetics (ITS) Tangerang Plant • Monitoring Status Perangkat per Departemen
          </p>
        </div>

        <div className="title-actions">
          <button className="btn-secondary" onClick={handleExportCSV}>
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={16} />
            <span>+ Tambah Komputer</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS BAR: ONLINE, IN, OUT, NOT USED, BROKEN, DISPOSAL */}
      <div className="kpi-status-bar">
        <div
          className={`kpi-status-item total ${filterStatus === 'All' ? 'active' : ''}`}
          onClick={() => setFilterStatus('All')}
          title="Klik untuk tampilkan semua status"
        >
          <span className="kpi-label">Total Unit</span>
          <span className="kpi-num">{totalCount}</span>
        </div>

        <div
          className={`kpi-status-item online ${filterStatus === 'Online' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Online' ? 'All' : 'Online')}
          title="Klik untuk filter Online"
        >
          <div className="kpi-label-row">
            <span className="live-pulse"></span>
            <span className="kpi-label">1. Online</span>
          </div>
          <span className="kpi-num text-emerald">{onlineCount}</span>
        </div>

        <div
          className={`kpi-status-item in ${filterStatus === 'In' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'In' ? 'All' : 'In')}
          title="Klik untuk filter In"
        >
          <span className="kpi-label">2. In</span>
          <span className="kpi-num text-cyan">{inCount}</span>
        </div>

        <div
          className={`kpi-status-item out ${filterStatus === 'Out' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Out' ? 'All' : 'Out')}
          title="Klik untuk filter Out"
        >
          <span className="kpi-label">3. Out</span>
          <span className="kpi-num text-amber">{outCount}</span>
        </div>

        <div
          className={`kpi-status-item not-used ${filterStatus === 'Not Used' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Not Used' ? 'All' : 'Not Used')}
          title="Klik untuk filter Not Used"
        >
          <span className="kpi-label">4. Not Used</span>
          <span className="kpi-num text-muted">{notUsedCount}</span>
        </div>

        <div
          className={`kpi-status-item broken ${filterStatus === 'Broken' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Broken' ? 'All' : 'Broken')}
          title="Klik untuk filter Broken"
        >
          <span className="kpi-label">5. Broken</span>
          <span className="kpi-num text-rose">{brokenCount}</span>
        </div>

        <div
          className={`kpi-status-item disposal ${filterStatus === 'Disposal' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Disposal' ? 'All' : 'Disposal')}
          title="Klik untuk filter Disposal"
        >
          <span className="kpi-label">6. Disposal</span>
          <span className="kpi-num text-purple">{disposalCount}</span>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="table-controls-bar">
        <div className="search-box-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Cari Computer Name, User, Departemen, atau Remark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-field"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        <div className="filter-selects-group">
          <div className="select-wrapper">
            <Building2 size={14} className="select-icon" />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="control-select"
            >
              <option value="All">Semua Departemen ({departments.length})</option>
              {departments.map((d) => (
                <option key={d.id} value={d.code}>
                  [{d.code}] {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <Activity size={14} className="select-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="control-select"
            >
              <option value="All">Semua Status (6)</option>
              {statusOptions.map((st) => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <Monitor size={14} className="select-icon" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="control-select"
            >
              <option value="All">Semua Type</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {(filterDept !== 'All' || filterStatus !== 'All' || filterType !== 'All' || searchQuery !== '') && (
            <button
              className="btn-reset-filters"
              onClick={() => {
                setFilterDept('All');
                setFilterStatus('All');
                setFilterType('All');
                setSearchQuery('');
              }}
              title="Reset semua filter ke default"
            >
              Reset
            </button>
          )}

          <button
            className="btn-icon-secondary"
            onClick={() => {
              if (window.confirm('Reset data tabel kembali ke data awal bawaan ITS?')) {
                resetToSeedData();
              }
            }}
            title="Reset ke data awal"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* MAIN CLIENT INVENTORY TABLE */}
      <div className="table-wrapper-card">
        <div className="table-responsive">
          <table className="client-inventory-table">
            <thead>
              <tr>
                <th className="col-no">No</th>
                <th className="col-dept">Departemen / Section</th>
                <th className="col-comp">Computer Name</th>
                <th className="col-type">Type</th>
                <th className="col-user">User</th>
                <th className="col-status">Status</th>
                <th className="col-remark">Remark / Keterangan</th>
                <th className="col-action text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-cell">
                    <Monitor size={36} className="text-muted mb-2" />
                    <p className="font-semibold">Tidak ada komputer yang sesuai dengan filter.</p>
                    <button
                      className="btn-secondary-sm margin-top-sm"
                      onClick={() => {
                        setFilterDept('All');
                        setFilterStatus('All');
                        setFilterType('All');
                        setSearchQuery('');
                      }}
                    >
                      Reset Semua Filter
                    </button>
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device, index) => {
                  return (
                    <tr key={device.id} className="table-data-row">
                      {/* 1. No */}
                      <td className="col-no text-muted font-mono">{index + 1}</td>

                      {/* 2. Departemen / Section */}
                      <td className="col-dept">
                        <span className={`dept-pill-badge dept-${device.department.toLowerCase()}`}>
                          {device.department}
                        </span>
                      </td>

                      {/* 3. Computer Name */}
                      <td className="col-comp">
                        <div className="comp-name-wrapper">
                          <span className="comp-name-text">{device.computerName}</span>
                        </div>
                      </td>

                      {/* 4. Type */}
                      <td className="col-type">
                        <div className="type-badge-row">
                          {getTypeIcon(device.type)}
                          <span>{device.type}</span>
                        </div>
                      </td>

                      {/* 5. User */}
                      <td className="col-user">
                        <div className="user-text-row">
                          <User size={13} className="text-muted" />
                          <strong>{device.user}</strong>
                        </div>
                      </td>

                      {/* 6. Status (Online, In, Out, Not Used, Broken, Disposal) */}
                      <td className="col-status">
                        <div className="status-select-container">
                          <select
                            value={device.status}
                            onChange={(e) => updateDeviceStatus(device.id, e.target.value)}
                            className={`status-inline-select ${getStatusBadgeClass(device.status)}`}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* 7. Remark / Keterangan */}
                      <td className="col-remark">
                        <span className="remark-text" title={device.remark}>
                          {device.remark || '-'}
                        </span>
                      </td>

                      {/* 8. Aksi */}
                      <td className="col-action text-right">
                        <div className="action-btns-row">
                          <button
                            className="btn-row-action edit"
                            onClick={() => openEditModal(device)}
                            title="Edit data komputer ini"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn-row-action delete"
                            onClick={() => {
                              if (window.confirm(`Hapus komputer [${device.computerName}] dari daftar?`)) {
                                deleteDevice(device.id);
                              }
                            }}
                            title="Hapus komputer ini"
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

        {/* TABLE FOOTER SUMMARY */}
        <div className="table-footer-bar">
          <div className="text-muted text-sm">
            Menampilkan <strong>{filteredDevices.length}</strong> dari total <strong>{devices.length}</strong> komputer terdaftar di sistem.
          </div>
          <div className="text-muted text-xs">
            PT. Indonesia Toray Synthetics • Device Master Management
          </div>
        </div>
      </div>
    </div>
  );
};
