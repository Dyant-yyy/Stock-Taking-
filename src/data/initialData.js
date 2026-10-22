// Master Data Configuration for PT. Indonesia Toray Synthetics (ITS)
// Devices, Logs, and Monthly Inspections start completely clean & empty (no dummy data)

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

// Clean empty initial dataset — no dummy devices
export const initialDevices = [];
export const initialLogs = [];
export const initialMonthlyInspections = [];

export const monthOptions = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' }
];

export const physicalConditionOptions = [
  'Baik / Normal',
  'Perlu Pembersihan',
  'Keyboard/Mouse Rusak',
  'Layar Bergaris/Cacat',
  'Komponen Rusak',
  'Kabel Aus / Tidak Standar'
];

export const inspectionResultOptions = [
  'Verified (Sesuai)',
  'Pending (Belum Diperiksa)',
  'Maintenance Needed',
  'Discrepancy (Selisih)'
];
