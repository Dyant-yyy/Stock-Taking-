// Initial Seed Data for PT. Indonesia Toray Synthetics (ITS)
// Matching Client Specification:
// Columns: No, Departemen/Section, Computer Name, IP Address, Type, User, Status (Online, In, Out, Not Used, Broken, Disposal), Remark

export const initialDepartments = [
  { id: 'IS', code: 'IS', name: 'Information System (IS)' },
  { id: 'RSN', code: 'RSN', name: 'Resin (RSN)' },
  { id: 'QATECH', code: 'QATECH', name: 'QA Tech (QATECH)' },
  { id: 'SIS', code: 'SIS', name: 'System Integration (SIS)' },
  { id: 'NFY', code: 'NFY', name: 'Nylon Filament Yarn (NFY)' },
  { id: 'PFY', code: 'PFY', name: 'Polyester Filament Yarn (PFY)' },
  { id: 'PSF', code: 'PSF', name: 'Polyester Staple Fiber (PSF)' },
  { id: 'HRGA', code: 'HRGA', name: 'Human Resources & GA (HRGA)' },
  { id: 'FIN', code: 'FIN', name: 'Finance & Accounting (FIN)' }
];

export const statusOptions = [
  { value: 'Online', label: 'Online', color: 'status-online' },
  { value: 'In', label: 'In', color: 'status-in' },
  { value: 'Out', label: 'Out', color: 'status-out' },
  { value: 'Not Used', label: 'Not Used', color: 'status-not-used' },
  { value: 'Broken', label: 'Broken', color: 'status-broken' },
  { value: 'Disposal', label: 'Disposal', color: 'status-disposal' }
];

export const typeOptions = [
  'Desktop PC',
  'Laptop',
  'Server',
  'Industrial PC',
  'Printer & Scanner',
  'Other Device'
];

export const initialDevices = [
  {
    id: 'DEV-001',
    department: 'IS',
    computerName: 'ITS-IS-SRV01',
    ipAddress: '192.168.10.15',
    type: 'Server',
    user: 'Ahmad Rizky',
    status: 'Online',
    remark: 'Main ERP Database Server HQ'
  },
  {
    id: 'DEV-002',
    department: 'IS',
    computerName: 'ITS-IS-PC01',
    ipAddress: '192.168.10.22',
    type: 'Desktop PC',
    user: 'Budi Santoso',
    status: 'Online',
    remark: 'Workstation Network & System Admin'
  },
  {
    id: 'DEV-003',
    department: 'IS',
    computerName: 'ITS-IS-NB01',
    ipAddress: '192.168.10.45',
    type: 'Laptop',
    user: 'Ahmad Rizky',
    status: 'In',
    remark: 'ThinkPad X1 Mobilitas IT Support'
  },
  {
    id: 'DEV-004',
    department: 'RSN',
    computerName: 'ITS-RSN-IPC01',
    ipAddress: '192.168.20.101',
    type: 'Industrial PC',
    user: 'Ir. Agus Rahardjo',
    status: 'Online',
    remark: 'Control Room Polimerisasi Resin Plant 1'
  },
  {
    id: 'DEV-005',
    department: 'RSN',
    computerName: 'ITS-RSN-PC02',
    ipAddress: '192.168.20.105',
    type: 'Desktop PC',
    user: 'Operator Shift A',
    status: 'In',
    remark: 'Monitoring Reaktor DCS Resin'
  },
  {
    id: 'DEV-006',
    department: 'RSN',
    computerName: 'ITS-RSN-NB02',
    ipAddress: '192.168.20.140',
    type: 'Laptop',
    user: 'Agus Rahardjo',
    status: 'Out',
    remark: 'Sedang dibawa dinas audit vendor mesin'
  },
  {
    id: 'DEV-007',
    department: 'QATECH',
    computerName: 'ITS-QATECH-PC01',
    ipAddress: '192.168.30.12',
    type: 'Desktop PC',
    user: 'Dr. Retno Astuti',
    status: 'Online',
    remark: 'Laboratorium Analisis Spektrofotometri'
  },
  {
    id: 'DEV-008',
    department: 'QATECH',
    computerName: 'ITS-QATECH-NB01',
    ipAddress: '192.168.30.25',
    type: 'Laptop',
    user: 'Staf Lab QA',
    status: 'In',
    remark: 'Testing Mutu Fisik Serat & Benang'
  },
  {
    id: 'DEV-009',
    department: 'SIS',
    computerName: 'ITS-SIS-PC01',
    ipAddress: '192.168.40.18',
    type: 'Desktop PC',
    user: 'Hendra Wijaya',
    status: 'Online',
    remark: 'Sistem SCADA Utilitas & Power Plant'
  },
  {
    id: 'DEV-010',
    department: 'SIS',
    computerName: 'ITS-SIS-PC02',
    ipAddress: '192.168.40.19',
    type: 'Desktop PC',
    user: 'Teknisi SIS',
    status: 'Broken',
    remark: 'Power supply rusak kena lonjakan voltase'
  },
  {
    id: 'DEV-011',
    department: 'NFY',
    computerName: 'ITS-NFY-IPC01',
    ipAddress: '192.168.50.31',
    type: 'Industrial PC',
    user: 'Bambang Supriadi',
    status: 'Online',
    remark: 'Mesin Pemintalan Spinning Nilon Line 3'
  },
  {
    id: 'DEV-012',
    department: 'NFY',
    computerName: 'ITS-NFY-PC02',
    ipAddress: '192.168.50.32',
    type: 'Desktop PC',
    user: 'Admin Gudang NFY',
    status: 'Not Used',
    remark: 'Unit cadangan siap pakai di ruang IT'
  },
  {
    id: 'DEV-013',
    department: 'PFY',
    computerName: 'ITS-PFY-PC01',
    ipAddress: '192.168.60.20',
    type: 'Desktop PC',
    user: 'Dewi Lestari',
    status: 'Online',
    remark: 'Monitoring Winding Serat Poliester'
  },
  {
    id: 'DEV-014',
    department: 'PFY',
    computerName: 'ITS-PFY-NB01',
    ipAddress: '192.168.60.42',
    type: 'Laptop',
    user: 'Dewi Lestari',
    status: 'Out',
    remark: 'Sedang dipinjam meeting eksternal'
  },
  {
    id: 'DEV-015',
    department: 'PSF',
    computerName: 'ITS-PSF-IPC01',
    ipAddress: '192.168.70.15',
    type: 'Industrial PC',
    user: 'Rian Hidayat',
    status: 'Online',
    remark: 'Stapel Cutting Fiber Automation'
  },
  {
    id: 'DEV-016',
    department: 'HRGA',
    computerName: 'ITS-HRGA-PC01',
    ipAddress: '192.168.80.11',
    type: 'Desktop PC',
    user: 'Siti Rahmawati',
    status: 'In',
    remark: 'Payroll & Absensi Karyawan ITS'
  },
  {
    id: 'DEV-017',
    department: 'FIN',
    computerName: 'ITS-FIN-PC01',
    ipAddress: '192.168.90.14',
    type: 'Desktop PC',
    user: 'Dedi Kurniawan',
    status: 'In',
    remark: 'Workstation SAP Finance & Accounting'
  },
  {
    id: 'DEV-018',
    department: 'IS',
    computerName: 'ITS-IS-OLD01',
    ipAddress: '192.168.10.99',
    type: 'Desktop PC',
    user: 'Ex-Magang',
    status: 'Disposal',
    remark: 'Unit PC lama, proses afkir/penghapusan'
  }
];

export const initialLogs = [
  {
    id: 'LOG-001',
    timestamp: '2026-10-10 09:30:00',
    user: 'Ahmad Rizky (IS)',
    action: 'Status Change',
    details: 'Status ITS-RSN-NB02 diubah menjadi Out (Dibawa dinas)',
    category: 'Status'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-10-10 10:15:00',
    user: 'Ahmad Rizky (IS)',
    action: 'Status Change',
    details: 'Status ITS-SIS-PC02 diubah menjadi Broken (PSU rusak)',
    category: 'Status'
  }
];
