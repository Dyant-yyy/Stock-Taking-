import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  FileSpreadsheet,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Laptop,
  Server,
  Monitor,
  Zap,
  Printer,
  ShieldCheck,
  Check,
  Building2,
  User,
  SlidersHorizontal,
  X,
  FileCheck2,
  ArrowUpDown
} from 'lucide-react';

export const MonthlyAuditPage = () => {
  const {
    devices = [],
    departments = [],
    monthlyInspections = [],
    monthOptions = [],
    physicalConditionOptions = [],
    inspectionResultOptions = [],
    statusOptions = [],
    addMonthlyInspection,
    updateMonthlyInspection,
    deleteMonthlyInspection,
    quickVerifyMonthlyInspection,
    currentUser
  } = useInventory();

  // Active Filters
  const currentMonthNum = new Date().getMonth() + 1; // 1-12
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(10); // default Oktober 2026
  const [filterDept, setFilterDept] = useState('All');
  const [filterResult, setFilterResult] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'matrix'

  // Modal State for Add / Edit Monthly Inspection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState(null);

  const defaultAuditor = currentUser
    ? (currentUser.name?.includes('(') ? currentUser.name : `${currentUser.name} (${currentUser.deptCode || 'IS'})`)
    : 'Ahmad Rizky (IS)';

  // Form State for Inspection Input/Edit
  const [formData, setFormData] = useState({
    deviceId: '',
    year: 2026,
    month: 10,
    inspectionDate: new Date().toISOString().split('T')[0],
    auditorName: defaultAuditor,
    physicalCondition: 'Baik / Normal',
    status: 'Online',
    inspectionResult: 'Verified (Sesuai)',
    notes: ''
  });

  // Filtered Inspections for the selected period
  const filteredInspections = useMemo(() => {
    return (monthlyInspections || []).filter(item => {
      const matchYear = Number(item.year) === Number(selectedYear);
      const matchMonth = selectedMonth === 'All' || Number(item.month) === Number(selectedMonth);
      const matchDept = filterDept === 'All' || item.department === filterDept;
      const matchResult = filterResult === 'All' || item.inspectionResult === filterResult;
      
      const q = (searchQuery || '').toLowerCase();
      const matchSearch =
        q === '' ||
        (item.computerName || '').toLowerCase().includes(q) ||
        (item.user || '').toLowerCase().includes(q) ||
        (item.ipAddress || '').toLowerCase().includes(q) ||
        (item.notes || '').toLowerCase().includes(q);

      return matchYear && matchMonth && matchDept && matchResult && matchSearch;
    });
  }, [monthlyInspections, selectedYear, selectedMonth, filterDept, filterResult, searchQuery]);

  // Devices inspection coverage in the selected month & year
  const activeMonthInspections = useMemo(() => {
    return (monthlyInspections || []).filter(
      item => Number(item.year) === Number(selectedYear) && Number(item.month) === Number(selectedMonth)
    );
  }, [monthlyInspections, selectedYear, selectedMonth]);

  // Key Metrics
  const totalTargetDevices = devices.length;
  const verifiedCount = activeMonthInspections.filter(i => i.inspectionResult === 'Verified (Sesuai)').length;
  const pendingCount = Math.max(0, totalTargetDevices - activeMonthInspections.length);
  const maintenanceCount = activeMonthInspections.filter(i => 
    i.inspectionResult === 'Maintenance Needed' || i.physicalCondition === 'Komponen Rusak' || i.status === 'Broken'
  ).length;
  const goodPhysicalCount = activeMonthInspections.filter(i => i.physicalCondition === 'Baik / Normal').length;
  const progressPercent = totalTargetDevices > 0 ? Math.round((verifiedCount / totalTargetDevices) * 100) : 0;

  // Open Modal for New Inspection
  const handleOpenAdd = (presetDevice = null) => {
    const dev = presetDevice || (devices.length > 0 ? devices[0] : null);
    setEditingInspection(null);
    setFormData({
      deviceId: dev ? dev.id : '',
      year: Number(selectedYear),
      month: selectedMonth === 'All' ? currentMonthNum : Number(selectedMonth),
      inspectionDate: new Date().toISOString().split('T')[0],
      auditorName: defaultAuditor,
      physicalCondition: 'Baik / Normal',
      status: dev ? dev.status : 'Online',
      inspectionResult: 'Verified (Sesuai)',
      notes: ''
    });
    setIsModalOpen(true);
  };

  // Open Modal for Editing Inspection
  const handleOpenEdit = (inspection) => {
    setEditingInspection(inspection);
    setFormData({
      deviceId: inspection.deviceId || '',
      year: inspection.year,
      month: inspection.month,
      inspectionDate: inspection.inspectionDate || new Date().toISOString().split('T')[0],
      auditorName: inspection.auditorName || '',
      physicalCondition: inspection.physicalCondition || 'Baik / Normal',
      status: inspection.status || 'Online',
      inspectionResult: inspection.inspectionResult || 'Verified (Sesuai)',
      notes: inspection.notes || ''
    });
    setIsModalOpen(true);
  };

  // Submit Handler
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const targetDev = devices.find(d => d.id === formData.deviceId) || {};
    const monthObj = monthOptions.find(m => m.value === Number(formData.month));
    const periodLabel = `${monthObj ? monthObj.label : `Bulan ${formData.month}`} ${formData.year}`;

    const payload = {
      ...formData,
      year: Number(formData.year),
      month: Number(formData.month),
      periodName: periodLabel,
      computerName: targetDev.computerName || formData.computerName || 'Device',
      ipAddress: targetDev.ipAddress || formData.ipAddress || '-',
      department: targetDev.department || formData.department || 'IS',
      user: targetDev.user || formData.user || '-',
      type: targetDev.type || formData.type || 'Desktop PC'
    };

    if (editingInspection) {
      updateMonthlyInspection({
        ...editingInspection,
        ...payload
      });
    } else {
      addMonthlyInspection(payload);
    }

    setIsModalOpen(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'No',
      'ID Audit',
      'Tahun',
      'Bulan',
      'Periode',
      'Nama Komputer',
      'IP Address',
      'Departemen',
      'User PIC',
      'Tipe Perangkat',
      'Tanggal Periksa',
      'Petugas Auditor',
      'Kondisi Fisik',
      'Status Operasional',
      'Hasil Pemeriksaan',
      'Catatan Temuan'
    ];

    const rows = filteredInspections.map((item, idx) => [
      idx + 1,
      item.id,
      item.year,
      item.month,
      `"${item.periodName}"`,
      `"${item.computerName}"`,
      item.ipAddress,
      item.department,
      `"${item.user}"`,
      `"${item.type}"`,
      item.inspectionDate,
      `"${item.auditorName}"`,
      `"${item.physicalCondition}"`,
      item.status,
      `"${item.inspectionResult}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    const monthName = selectedMonth === 'All' ? 'Semua_Bulan' : (monthOptions.find(m => m.value === Number(selectedMonth))?.label || selectedMonth);
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ITS_Pemeriksaan_Device_${monthName}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'Laptop': return <Laptop size={14} className="text-cyan" />;
      case 'Server': return <Server size={14} className="text-purple" />;
      case 'Industrial PC': return <Zap size={14} className="text-amber" />;
      case 'Printer & Scanner': return <Printer size={14} className="text-pink" />;
      default: return <Monitor size={14} className="text-blue" />;
    }
  };

  const selectedMonthName = selectedMonth === 'All' ? 'Seluruh Tahun' : (monthOptions.find(m => m.value === Number(selectedMonth))?.label || `Bulan ${selectedMonth}`);

  return (
    <div className="page-fade-in monthly-audit-page">
      {/* ------------------------------------------------------------------
          1. PAGE HEADER & CONTROL ACTIONS
          ------------------------------------------------------------------ */}
      <div className="inventory-section-header">
        <div className="section-title-wrap">
          <div className="section-main-title">
            <CalendarCheck size={24} style={{ color: '#38bdf8' }} />
            <span>Pemeriksaan & Pendataan Perangkat Bulanan</span>
          </div>
          <p className="section-subtitle-text">
            Tabel rekapitulasi audit berkala perbulan untuk kondisi fisik, status operasional, dan stock opname perangkat IT PT. Indonesia Toray Synthetics.
          </p>
        </div>

        <div className="inventory-actions-cluster">
          {/* View Toggle Pill */}
          <div className="three-d-view-toggle">
            <button
              className={`three-d-view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Tampilan Tabel Detail Pemeriksaan"
            >
              Tabel Detail
            </button>
            <button
              className={`three-d-view-btn ${viewMode === 'matrix' ? 'active' : ''}`}
              onClick={() => setViewMode('matrix')}
              title="Tampilan Matriks Checklist 12 Bulan"
            >
              Matriks 12 Bulan
            </button>
          </div>

          <button
            className="btn-inventory-action"
            onClick={handleExportCSV}
            title="Download CSV Laporan Pemeriksaan"
          >
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>

          <button
            className="btn-inventory-action btn-blue-solid"
            onClick={() => handleOpenAdd()}
            title="Input Data Pemeriksaan Bulanan Baru"
          >
            <Plus size={16} />
            <span>+ Input Pemeriksaan</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          2. MONTHLY SUMMARY METRICS STRIP
          ------------------------------------------------------------------ */}
      <div className="overview-kpi-strip" style={{ marginTop: '16px', marginBottom: '22px' }}>
        <div className="analytics-metrics-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {/* 1. Target Devices */}
          <div className="analytics-stat-card">
            <div className="stat-card-header">
              <span className="compact-metric-label">Target Perangkat</span>
              <Calendar size={18} style={{ color: '#60a5fa' }} />
            </div>
            <div className="stat-card-number">{totalTargetDevices} <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>Unit</span></div>
            <div className="stat-card-desc">Periode: {selectedMonthName} {selectedYear}</div>
          </div>

          {/* 2. Verified & Progress */}
          <div className="analytics-stat-card">
            <div className="stat-card-header">
              <span className="compact-metric-label">Sudah Diperiksa</span>
              <CheckCircle2 size={18} style={{ color: '#38bdf8' }} />
            </div>
            <div className="stat-card-number" style={{ color: '#38bdf8' }}>
              {verifiedCount} <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>({progressPercent}%)</span>
            </div>
            <div className="stat-progress-bar" style={{ marginTop: '8px' }}>
              <div className="stat-progress-fill blue" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* 3. Pending Audit */}
          <div className="analytics-stat-card">
            <div className="stat-card-header">
              <span className="compact-metric-label">Belum Diperiksa</span>
              <Clock size={18} style={{ color: '#fbbf24' }} />
            </div>
            <div className="stat-card-number" style={{ color: '#fbbf24' }}>
              {pendingCount} <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>Unit</span>
            </div>
            <div className="stat-card-desc">Perlu verifikasi fisik IT</div>
          </div>

          {/* 4. Good Physical Condition */}
          <div className="analytics-stat-card">
            <div className="stat-card-header">
              <span className="compact-metric-label">Kondisi Normal</span>
              <ShieldCheck size={18} style={{ color: '#34d399' }} />
            </div>
            <div className="stat-card-number" style={{ color: '#34d399' }}>
              {goodPhysicalCount} <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>Unit</span>
            </div>
            <div className="stat-card-desc">Hardware bersih & layak pakai</div>
          </div>

          {/* 5. Issue / Maintenance */}
          <div className="analytics-stat-card">
            <div className="stat-card-header">
              <span className="compact-metric-label">Perlu Tindakan</span>
              <AlertTriangle size={18} style={{ color: '#f87171' }} />
            </div>
            <div className="stat-card-number" style={{ color: '#f87171' }}>
              {maintenanceCount} <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>Unit</span>
            </div>
            <div className="stat-card-desc">Kerusakan / butuh servis</div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          3. INTERACTIVE FILTER CONTROLS BAR
          ------------------------------------------------------------------ */}
      <div className="fintech-table-card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div className="table-filter-controls-row" style={{ margin: 0 }}>
          <div className="filter-selects-pair">
            {/* Year Selector */}
            <div className="fintech-select-wrapper">
              <Calendar size={15} style={{ color: '#94a3b8' }} />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="fintech-select"
                title="Pilih Tahun Pemeriksaan"
              >
                <option value={2026}>Tahun 2026</option>
                <option value={2025}>Tahun 2025</option>
              </select>
            </div>

            {/* Month Selector */}
            <div className="fintech-select-wrapper">
              <CalendarCheck size={15} style={{ color: '#38bdf8' }} />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                className="fintech-select"
                title="Pilih Bulan Pemeriksaan"
              >
                <option value="All">Semua Bulan</option>
                {monthOptions.map(m => (
                  <option key={m.value} value={m.value}>
                    Bulan {m.value}: {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div className="fintech-select-wrapper">
              <Building2 size={15} style={{ color: '#94a3b8' }} />
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="fintech-select"
                title="Filter Departemen"
              >
                <option value="All">Semua Departemen</option>
                {departments.map(d => (
                  <option key={d.code} value={d.code}>
                    Dept: {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Result Status Filter */}
            <div className="fintech-select-wrapper">
              <SlidersHorizontal size={15} style={{ color: '#94a3b8' }} />
              <select
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className="fintech-select"
                title="Filter Hasil Pemeriksaan"
              >
                <option value="All">Semua Hasil Audit</option>
                {inspectionResultOptions.map(res => (
                  <option key={res} value={res}>{res}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="fintech-search-pill" style={{ maxWidth: '300px', height: '40px' }}>
            <Search size={15} className="search-pill-icon" />
            <input
              type="text"
              placeholder="Cari Komputer / PIC / Catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-pill-input"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          VIEW A: TABEL DETAIL PEMERIKSAAN PERBULAN
          ------------------------------------------------------------------ */}
      {viewMode === 'table' && (
        <div className="fintech-table-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCheck2 size={18} style={{ color: '#38bdf8' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                Daftar Rekam Pemeriksaan Bulanan ({filteredInspections.length} Data)
              </h3>
            </div>
            <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
              Periode Aktif: <strong style={{ color: '#60a5fa' }}>{selectedMonthName} {selectedYear}</strong>
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="fintech-data-table">
              <thead>
                <tr>
                  <th style={{ width: '45px' }}>No</th>
                  <th>Kode Audit</th>
                  <th>Komputer & IP</th>
                  <th>Dept</th>
                  <th>User PIC</th>
                  <th>Periode</th>
                  <th>Tgl Periksa</th>
                  <th>Auditor</th>
                  <th>Kondisi Fisik</th>
                  <th>Status Operasional</th>
                  <th>Hasil Pemeriksaan</th>
                  <th>Catatan Temuan</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredInspections.length === 0 ? (
                  <tr>
                    <td colSpan={13} style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8' }}>
                      <Calendar size={36} style={{ color: '#3b82f6', opacity: 0.5, marginBottom: '12px', display: 'block', margin: '0 auto 10px' }} />
                      <strong style={{ display: 'block', fontSize: '15px', color: '#f1f5f9' }}>
                        Belum Ada Data Pemeriksaan untuk Periode {selectedMonthName} {selectedYear}
                      </strong>
                      <p style={{ margin: '6px 0 16px', fontSize: '13px' }}>
                        Silakan klik tombol di bawah untuk mencatat pemeriksaan fisik perangkat IT bulan ini.
                      </p>
                      <button
                        className="btn-solid-white-pill"
                        style={{ padding: '8px 20px', fontSize: '13px', margin: '0 auto' }}
                        onClick={() => handleOpenAdd()}
                      >
                        + Input Pemeriksaan {selectedMonthName}
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredInspections.map((item, idx) => {
                    const isVerified = item.inspectionResult === 'Verified (Sesuai)';
                    const isMaintenance = item.inspectionResult === 'Maintenance Needed';
                    const isPending = item.inspectionResult === 'Pending (Belum Diperiksa)';

                    const isPhysicalGood = item.physicalCondition === 'Baik / Normal';
                    const isPhysicalClean = item.physicalCondition === 'Perlu Pembersihan';

                    return (
                      <tr key={item.id}>
                        {/* No */}
                        <td style={{ color: '#94a3b8', fontWeight: 600 }}>{idx + 1}</td>

                        {/* Audit ID */}
                        <td>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#93c5fd', fontWeight: 600 }}>
                            {item.id}
                          </span>
                        </td>

                        {/* Computer Name & IP */}
                        <td>
                          <div className="table-device-identity">
                            <span className="table-comp-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {getDeviceIcon(item.type)}
                              <span>{item.computerName}</span>
                            </span>
                            <span className="table-ip-badge">
                              {item.ipAddress}
                            </span>
                          </div>
                        </td>

                        {/* Dept */}
                        <td>
                          <span className={`dept-badge-pill dept-${(item.department || 'default').toLowerCase()}`}>
                            {item.department}
                          </span>
                        </td>

                        {/* User PIC */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#cbd5e1' }}>
                            <User size={13} style={{ color: '#94a3b8' }} />
                            <span>{item.user}</span>
                          </div>
                        </td>

                        {/* Period */}
                        <td>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>
                            {item.periodName || `Bulan ${item.month} ${item.year}`}
                          </span>
                        </td>

                        {/* Inspection Date */}
                        <td>
                          <span style={{ fontSize: '12.5px', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
                            {item.inspectionDate}
                          </span>
                        </td>

                        {/* Auditor */}
                        <td>
                          <span style={{ fontSize: '12.5px', color: '#cbd5e1', fontWeight: 500 }}>
                            {item.auditorName}
                          </span>
                        </td>

                        {/* Physical Condition */}
                        <td>
                          <span
                            className="sub-pill"
                            style={{
                              background: isPhysicalGood
                                ? 'rgba(16, 185, 129, 0.18)'
                                : isPhysicalClean
                                ? 'rgba(245, 158, 11, 0.18)'
                                : 'rgba(239, 68, 68, 0.18)',
                              color: isPhysicalGood ? '#34d399' : isPhysicalClean ? '#fbbf24' : '#f87171',
                              border: `1px solid ${isPhysicalGood ? 'rgba(16, 185, 129, 0.35)' : isPhysicalClean ? 'rgba(245, 158, 11, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.physicalCondition}
                          </span>
                        </td>

                        {/* Operating Status */}
                        <td>
                          <span className={`status-dropdown-pill status-${(item.status || 'in').toLowerCase().replace(/\s+/g, '-')}`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Inspection Result */}
                        <td>
                          <span
                            className="sub-pill"
                            style={{
                              background: isVerified
                                ? 'rgba(37, 99, 235, 0.22)'
                                : isMaintenance
                                ? 'rgba(239, 68, 68, 0.22)'
                                : 'rgba(245, 158, 11, 0.22)',
                              color: isVerified ? '#60a5fa' : isMaintenance ? '#f87171' : '#fbbf24',
                              border: `1px solid ${isVerified ? 'rgba(59, 130, 246, 0.4)' : isMaintenance ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                              fontWeight: 700,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {isVerified && '✓ '}
                            {item.inspectionResult}
                          </span>
                        </td>

                        {/* Notes */}
                        <td>
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#94a3b8',
                              maxWidth: '180px',
                              display: 'inline-block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            title={item.notes}
                          >
                            {item.notes || '-'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="table-actions-group" style={{ justifyContent: 'center' }}>
                            <button
                              className="btn-table-action-icon"
                              onClick={() => handleOpenEdit(item)}
                              title="Edit / Update Hasil Pemeriksaan"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              className="btn-table-action-icon danger"
                              onClick={() => deleteMonthlyInspection(item.id)}
                              title="Hapus Rekam Pemeriksaan"
                            >
                              <Trash2 size={13} />
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

          <div className="fintech-table-footer">
            <span>
              Menampilkan <strong>{filteredInspections.length}</strong> rekam audit fisik bulanan
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ color: '#38bdf8' }}>
                ✓ {verifiedCount} Verified Bulan {selectedMonthName}
              </span>
              <span style={{ color: '#fbbf24' }}>
                ⏳ {pendingCount} Pending
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          VIEW B: MATRIKS CHECKLIST 12 BULAN (ANNUAL INSPECTION MATRIX BOARD)
          ------------------------------------------------------------------ */}
      {viewMode === 'matrix' && (
        <div className="fintech-table-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarCheck size={18} style={{ color: '#60a5fa' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                Matriks Checklist Pemeriksaan 12 Bulan Tahun {selectedYear}
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#38bdf8', display: 'inline-block' }}></span>
                Sudah Diperiksa (Verified)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f87171', display: 'inline-block' }}></span>
                Ada Kendala / Servis
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'inline-block' }}></span>
                Belum Diperiksa
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="fintech-data-table" style={{ fontSize: '12.5px' }}>
              <thead>
                <tr>
                  <th style={{ width: '35px' }}>No</th>
                  <th>Perangkat Komputer</th>
                  <th>Dept</th>
                  <th>PIC User</th>
                  {monthOptions.map(m => (
                    <th
                      key={m.value}
                      style={{
                        textAlign: 'center',
                        padding: '10px 6px',
                        background: Number(selectedMonth) === m.value ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
                        color: Number(selectedMonth) === m.value ? '#60a5fa' : '#94a3b8'
                      }}
                    >
                      {m.label.substring(0, 3)}
                    </th>
                  ))}
                  <th style={{ textAlign: 'center' }}>Total Audit</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((dev, idx) => {
                  // Find all inspections for this device in the selected year
                  const deviceYearInspections = (monthlyInspections || []).filter(
                    i => (i.deviceId === dev.id || i.computerName === dev.computerName) && Number(i.year) === Number(selectedYear)
                  );

                  return (
                    <tr key={dev.id}>
                      <td style={{ color: '#94a3b8', fontWeight: 600 }}>{idx + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {getDeviceIcon(dev.type)}
                          <span style={{ fontWeight: 700, color: '#ffffff' }}>{dev.computerName}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>{dev.ipAddress}</span>
                      </td>
                      <td>
                        <span className={`dept-badge-pill dept-${(dev.department || 'default').toLowerCase()}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                          {dev.department}
                        </span>
                      </td>
                      <td style={{ color: '#cbd5e1' }}>{dev.user}</td>

                      {/* 12 Months Cells */}
                      {monthOptions.map(m => {
                        const insp = deviceYearInspections.find(i => Number(i.month) === m.value);
                        const isCurrentActiveCol = Number(selectedMonth) === m.value;

                        return (
                          <td
                            key={m.value}
                            style={{
                              textAlign: 'center',
                              padding: '8px 4px',
                              background: isCurrentActiveCol ? 'rgba(37, 99, 235, 0.08)' : 'transparent'
                            }}
                          >
                            {insp ? (
                              <button
                                onClick={() => handleOpenEdit(insp)}
                                style={{
                                  background: insp.inspectionResult === 'Maintenance Needed' ? 'rgba(239, 68, 68, 0.22)' : 'rgba(37, 99, 235, 0.25)',
                                  border: `1px solid ${insp.inspectionResult === 'Maintenance Needed' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`,
                                  color: insp.inspectionResult === 'Maintenance Needed' ? '#f87171' : '#38bdf8',
                                  borderRadius: '6px',
                                  padding: '3px 7px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'transform 0.15s ease'
                                }}
                                title={`${m.label} ${selectedYear}: ${insp.inspectionResult} (${insp.auditorName})\nKlik untuk melihat/mengubah`}
                              >
                                {insp.inspectionResult === 'Maintenance Needed' ? '⚠️' : '✓'}
                              </button>
                            ) : (
                              <button
                                onClick={() => quickVerifyMonthlyInspection(dev, m.value, selectedYear)}
                                style={{
                                  background: 'transparent',
                                  border: '1px dashed rgba(255, 255, 255, 0.12)',
                                  color: '#64748b',
                                  borderRadius: '6px',
                                  padding: '3px 6px',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                                title={`Klik untuk verifikasi cepat pemeriksaan ${m.label} ${selectedYear}`}
                              >
                                +
                              </button>
                            )}
                          </td>
                        );
                      })}

                      {/* Total Audits in this year */}
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#38bdf8' }}>
                        {deviceYearInspections.length} / 12
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          4. MODAL INPUT / EDIT PEMERIKSAAN BULANAN
          ------------------------------------------------------------------ */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="brand-icon">
                  <CalendarCheck size={20} className="icon-toray" />
                </div>
                <div>
                  <h3>{editingInspection ? 'Edit Pemeriksaan Fisik Bulanan' : 'Input Pemeriksaan Fisik Bulanan Baru'}</h3>
                  <p className="modal-sub-text">PT. Indonesia Toray Synthetics - IT Device Audit</p>
                </div>
              </div>
              <button className="btn-modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className="modal-body">
                {/* 1. Pilih Komputer */}
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>Pilih Perangkat Komputer *:</label>
                  <select
                    required
                    value={formData.deviceId}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const matched = devices.find(d => d.id === selId);
                      setFormData(prev => ({
                        ...prev,
                        deviceId: selId,
                        status: matched ? matched.status : prev.status
                      }));
                    }}
                    className="form-select"
                  >
                    <option value="">-- Pilih Komputer Dari Master Data --</option>
                    {devices.map(d => (
                      <option key={d.id} value={d.id}>
                        [{d.department}] {d.computerName} - {d.user} ({d.ipAddress})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Periode Bulan & Tahun */}
                <div className="form-grid-two" style={{ marginBottom: '14px' }}>
                  <div className="form-group">
                    <label>Bulan Pemeriksaan *:</label>
                    <select
                      required
                      value={formData.month}
                      onChange={(e) => setFormData(prev => ({ ...prev, month: Number(e.target.value) }))}
                      className="form-select"
                    >
                      {monthOptions.map(m => (
                        <option key={m.value} value={m.value}>
                          Bulan {m.value}: {m.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tahun Pemeriksaan *:</label>
                    <select
                      required
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: Number(e.target.value) }))}
                      className="form-select"
                    >
                      <option value={2026}>2026</option>
                      <option value={2025}>2025</option>
                    </select>
                  </div>
                </div>

                {/* 3. Tanggal Pemeriksaan & Auditor */}
                <div className="form-grid-two" style={{ marginBottom: '14px' }}>
                  <div className="form-group">
                    <label>Tanggal Pemeriksaan Fisik *:</label>
                    <input
                      type="date"
                      required
                      value={formData.inspectionDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, inspectionDate: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Petugas Auditor IT *:</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Auditor (Dept)"
                      value={formData.auditorName}
                      onChange={(e) => setFormData(prev => ({ ...prev, auditorName: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* 4. Kondisi Fisik & Status Operasional */}
                <div className="form-grid-two" style={{ marginBottom: '14px' }}>
                  <div className="form-group">
                    <label>Kondisi Fisik Perangkat *:</label>
                    <select
                      value={formData.physicalCondition}
                      onChange={(e) => setFormData(prev => ({ ...prev, physicalCondition: e.target.value }))}
                      className="form-select"
                    >
                      {physicalConditionOptions.map(cond => (
                        <option key={cond} value={cond}>{cond}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status Operasional Perangkat *:</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="form-select"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Hasil Pemeriksaan */}
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label>Hasil Verifikasi Audit *:</label>
                  <select
                    value={formData.inspectionResult}
                    onChange={(e) => setFormData(prev => ({ ...prev, inspectionResult: e.target.value }))}
                    className="form-select"
                  >
                    {inspectionResultOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* 6. Catatan / Temuan */}
                <div className="form-group">
                  <label>Catatan Temuan / Rekomendasi Audit:</label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Suhu CPU stabil, keyboard dan mouse bersih, stiker barcode fisik jelas terbaca..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="form-textarea"
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ background: 'linear-gradient(135deg, #1844d6, #2563eb)', color: '#ffffff' }}
                >
                  {editingInspection ? 'Simpan Perubahan' : 'Catat Pemeriksaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
