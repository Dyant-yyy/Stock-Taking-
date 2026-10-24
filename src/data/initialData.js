// Master Data Configuration for PT. Indonesia Toray Synthetics (ITS)
// Sesuai dengan Dokumen Stock Taking & PC Ledger Fisik PT Indonesia Toray Synthetics

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

export const statusColumns = [
  { key: 'Online', label: 'Online', color: '#10b981', badgeClass: 'status-online' },
  { key: 'In', label: 'In', color: '#3b82f6', badgeClass: 'status-in' },
  { key: 'Out', label: 'Out', color: '#f59e0b', badgeClass: 'status-out' },
  { key: 'Not Used', label: 'Not Used', color: '#64748b', badgeClass: 'status-not-used' },
  { key: 'Broken', label: 'Broken', color: '#ef4444', badgeClass: 'status-broken' },
  { key: 'Disposal', label: 'Disposal', color: '#dc2626', badgeClass: 'status-disposal' }
];

export const typeOptions = [
  'Server',
  'Notebook',
  'PC',
  'Desktop PC',
  'Industrial PC',
  'Printer & Scanner',
  'Other Device'
];

export const monthOptions = [
  { value: 1, label: 'Januari', short: 'Jan' },
  { value: 2, label: 'Februari', short: 'Feb' },
  { value: 3, label: 'Maret', short: 'Mar' },
  { value: 4, label: 'April', short: 'Apr' },
  { value: 5, label: 'Mei', short: 'Mei' },
  { value: 6, label: 'Juni', short: 'Jun' },
  { value: 7, label: 'Juli', short: 'Jul' },
  { value: 8, label: 'Agustus', short: 'Agu' },
  { value: 9, label: 'September', short: 'Sep' },
  { value: 10, label: 'Oktober', short: 'Okt' },
  { value: 11, label: 'November', short: 'Nov' },
  { value: 12, label: 'Desember', short: 'Des' }
];

// Helper to create realistic device specifications
const createSpecs = ({ brand, model, cpu, ram, storage, os, ip, sn, tag, location }) => ({
  brand: brand || 'Lenovo',
  model: model || 'ThinkPad T14',
  cpu: cpu || 'Intel Core i5-1245U @ 4.4GHz',
  ram: ram || '16 GB DDR4',
  storage: storage || '512 GB NVMe SSD',
  os: os || 'Windows 11 Pro 64-bit',
  ipAddress: ip || '192.168.10.50',
  macAddress: '00:1A:2B:3C:4D:' + Math.floor(10 + Math.random() * 89),
  serialNumber: sn || 'SN' + Math.floor(100000 + Math.random() * 900000),
  assetTag: tag || 'ITS-ASSET-' + Math.floor(1000 + Math.random() * 9000),
  location: location || 'Gedung IS - Lantai 2'
});

// 27 Perangkat Otentik Persis Dari Lembar Fisik PT. Indonesia Toray Synthetics Lengkap dengan Spesifikasi
export const initialDevices = [
  { id: 'dev-1', no: 1, department: 'IS', computerName: 'ITS_ESXi01', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'Dell', model: 'PowerEdge R750', cpu: 'Dual Intel Xeon Silver 4314 @ 2.4GHz', ram: '64 GB ECC DDR4', storage: '4x 1.92TB NVMe SSD RAID-10', os: 'VMware ESXi 7.0u3', ip: '192.168.10.11', sn: 'DL-750-ESX01', tag: 'ITS-SRV-2026-001', location: 'Server Room Rack 01' }) },
  { id: 'dev-2', no: 2, department: 'IS', computerName: 'ITS_ESXi02', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'Dell', model: 'PowerEdge R750', cpu: 'Dual Intel Xeon Silver 4314 @ 2.4GHz', ram: '64 GB ECC DDR4', storage: '4x 1.92TB NVMe SSD RAID-10', os: 'VMware ESXi 7.0u3', ip: '192.168.10.12', sn: 'DL-750-ESX02', tag: 'ITS-SRV-2026-002', location: 'Server Room Rack 01' }) },
  { id: 'dev-3', no: 3, department: 'IS', computerName: 'ITS_STRG01', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'HPE', model: 'MSA 2060 Storage', cpu: 'Storage Controller Dual Active', ram: '32 GB Cache', storage: '24 TB SAS 10K RPM', os: 'Storage SAN OS', ip: '192.168.10.15', sn: 'HP-MSA-STRG01', tag: 'ITS-SAN-2026-003', location: 'Server Room SAN Rack' }) },
  { id: 'dev-4', no: 4, department: 'IS', computerName: 'TIN_ESXi01', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'Dell', model: 'PowerEdge R640', cpu: 'Intel Xeon Gold 5218 @ 2.3GHz', ram: '64 GB DDR4', storage: '2x 960GB SSD', os: 'VMware ESXi 7.0', ip: '192.168.10.21', sn: 'DL-640-TIN01', tag: 'ITS-SRV-2026-004', location: 'Server Room Rack 02' }) },
  { id: 'dev-5', no: 5, department: 'IS', computerName: 'TIN_ESXi02', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'Dell', model: 'PowerEdge R640', cpu: 'Intel Xeon Gold 5218 @ 2.3GHz', ram: '64 GB DDR4', storage: '2x 960GB SSD', os: 'VMware ESXi 7.0', ip: '192.168.10.22', sn: 'DL-640-TIN02', tag: 'ITS-SRV-2026-005', location: 'Server Room Rack 02' }) },
  { id: 'dev-6', no: 6, department: 'IS', computerName: 'TIN_ESXi03', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'Dell', model: 'PowerEdge R640', cpu: 'Intel Xeon Gold 5218 @ 2.3GHz', ram: '64 GB DDR4', storage: '2x 960GB SSD', os: 'VMware ESXi 7.0', ip: '192.168.10.23', sn: 'DL-640-TIN03', tag: 'ITS-SRV-2026-006', location: 'Server Room Rack 02' }) },
  { id: 'dev-7', no: 7, department: 'IS', computerName: 'TIN_ESXi04', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'Dell', model: 'PowerEdge R640', cpu: 'Intel Xeon Gold 5218 @ 2.3GHz', ram: '64 GB DDR4', storage: '2x 960GB SSD', os: 'VMware ESXi 7.0', ip: '192.168.10.24', sn: 'DL-640-TIN04', tag: 'ITS-SRV-2026-007', location: 'Server Room Rack 02' }) },
  { id: 'dev-8', no: 8, department: 'IS', computerName: 'TIN_STRG01', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'HPE', model: 'MSA 2050', cpu: 'Dual Controller SAN', ram: '16 GB Cache', storage: '16 TB SAS HDD', os: 'Storage SAN OS', ip: '192.168.10.25', sn: 'HP-MSA-TIN01', tag: 'ITS-SAN-2026-008', location: 'Server Room SAN Rack' }) },
  { id: 'dev-9', no: 9, department: 'IS', computerName: 'TIN_STRG02', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'HPE', model: 'MSA 2050', cpu: 'Dual Controller SAN', ram: '16 GB Cache', storage: '16 TB SAS HDD', os: 'Storage SAN OS', ip: '192.168.10.26', sn: 'HP-MSA-TIN02', tag: 'ITS-SAN-2026-009', location: 'Server Room SAN Rack' }) },
  { id: 'dev-10', no: 10, department: 'IS', computerName: 'ITS_QNAP01', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'QNAP', model: 'TVS-h1688X', cpu: 'Intel Xeon W-1250 @ 3.3GHz', ram: '32 GB ECC DDR4', storage: '8x 4TB Enterprise NAS HDD', os: 'QTS Hero ZFS', ip: '192.168.10.31', sn: 'QNAP-1688-01', tag: 'ITS-NAS-2026-010', location: 'Server Room NAS Rack' }) },
  { id: 'dev-11', no: 11, department: 'IS', computerName: 'ITS_QNAP02', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'QNAP', model: 'TVS-h1688X', cpu: 'Intel Xeon W-1250 @ 3.3GHz', ram: '32 GB ECC DDR4', storage: '8x 4TB Enterprise NAS HDD', os: 'QTS Hero ZFS', ip: '192.168.10.32', sn: 'QNAP-1688-02', tag: 'ITS-NAS-2026-011', location: 'Server Room NAS Rack' }) },
  { id: 'dev-12', no: 12, department: 'IS', computerName: 'ITS_QNAP03', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'QNAP', model: 'TS-873AU-RP', cpu: 'AMD Ryzen V1500B @ 2.2GHz', ram: '16 GB DDR4', storage: '8x 2TB Enterprise NAS HDD', os: 'QTS 5.1', ip: '192.168.10.33', sn: 'QNAP-873-03', tag: 'ITS-NAS-2026-012', location: 'Server Room NAS Rack' }) },
  { id: 'dev-13', no: 13, department: 'IS', computerName: 'TIN_QNAP01', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'QNAP', model: 'TS-873AU-RP', cpu: 'AMD Ryzen V1500B @ 2.2GHz', ram: '16 GB DDR4', storage: '8x 2TB Enterprise NAS HDD', os: 'QTS 5.1', ip: '192.168.10.34', sn: 'QNAP-TIN-01', tag: 'ITS-NAS-2026-013', location: 'Server Room NAS Rack' }) },
  { id: 'dev-14', no: 14, department: 'IS', computerName: 'ITSEXAQ', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'Dell', model: 'PowerEdge T440', cpu: 'Intel Xeon Silver 4210R', ram: '32 GB DDR4', storage: '2x 2TB SATA HDD', os: 'Windows Server 2019', ip: '192.168.10.41', sn: 'DL-T440-EXAQ', tag: 'ITS-SRV-2026-014', location: 'Server Room Database Rack' }) },
  { id: 'dev-15', no: 15, department: 'IS', computerName: 'PNR_SAP', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'Dell', model: 'PowerEdge R740xd', cpu: 'Dual Intel Xeon Gold 6230', ram: '128 GB DDR4', storage: '8x 960GB SSD RAID-10', os: 'SUSE Linux Enterprise Server 15 (SLES)', ip: '192.168.10.45', sn: 'DL-R740-SAP', tag: 'ITS-SAP-2026-015', location: 'Server Room Production ERP' }) },
  { id: 'dev-16', no: 16, department: 'IS', computerName: 'PNR_ATTENDANCE', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'HP', model: 'ProLiant DL380 Gen10', cpu: 'Intel Xeon Silver 4214', ram: '32 GB DDR4', storage: '2x 1TB SAS HDD', os: 'Windows Server 2022', ip: '192.168.10.48', sn: 'HP-DL380-ATT', tag: 'ITS-SRV-2026-016', location: 'Server Room Rack 03' }) },
  { id: 'dev-17', no: 17, department: 'IS', computerName: 'ZABBIX', type: 'Server', user: 'Administrator', specs: createSpecs({ brand: 'Supermicro', model: 'SYS-5019D-FN8TP', cpu: 'Intel Xeon D-2146NT @ 2.3GHz', ram: '32 GB DDR4', storage: '2x 500GB NVMe M.2 SSD', os: 'Ubuntu Server 22.04 LTS (Zabbix 6.4)', ip: '192.168.10.5', sn: 'SM-5019-ZBX', tag: 'ITS-NMS-2026-017', location: 'Server Room Network Monitoring' }) },
  { id: 'dev-18', no: 18, department: 'IS', computerName: 'NITSIS2307352', type: 'Notebook', user: 'anggit.kurniawan', specs: createSpecs({ brand: 'Lenovo', model: 'ThinkPad T14 Gen 3', cpu: 'Intel Core i7-1260P @ 4.7GHz', ram: '16 GB DDR4', storage: '512 GB PCIe NVMe SSD', os: 'Windows 11 Pro 64-bit', ip: '192.168.20.52', sn: 'PF3Z8001', tag: 'ITS-NB-2026-018', location: 'IS Office - Meja IT Staff' }) },
  { id: 'dev-19', no: 19, department: 'IS', computerName: 'NITSIS2307353', type: 'Notebook', user: 'muhamad.ripastian', specs: createSpecs({ brand: 'Lenovo', model: 'ThinkPad T14 Gen 3', cpu: 'Intel Core i7-1260P @ 4.7GHz', ram: '16 GB DDR4', storage: '512 GB PCIe NVMe SSD', os: 'Windows 11 Pro 64-bit', ip: '192.168.20.53', sn: 'PF3Z8002', tag: 'ITS-NB-2026-019', location: 'IS Office - Meja IT Staff' }) },
  { id: 'dev-20', no: 20, department: 'IS', computerName: 'NITSIS2307354', type: 'Notebook', user: 'matheus.djoko', specs: createSpecs({ brand: 'Lenovo', model: 'ThinkPad X1 Carbon Gen 10', cpu: 'Intel Core i7-1270P @ 4.8GHz', ram: '32 GB LPDDR5', storage: '1 TB PCIe Gen4 SSD', os: 'Windows 11 Pro 64-bit', ip: '192.168.20.10', sn: 'PF4A9901', tag: 'ITS-NB-2026-020', location: 'IS Office - Ruang Manager IS' }) },
  { id: 'dev-21', no: 21, department: 'IS', computerName: 'PITSIS2512470', type: 'PC', user: 'matheus.djoko(Team viewer PC)', specs: createSpecs({ brand: 'Lenovo', model: 'ThinkCentre M70q Gen 3 Tiny', cpu: 'Intel Core i5-12500T @ 4.4GHz', ram: '16 GB DDR4', storage: '512 GB SSD', os: 'Windows 11 Pro 64-bit', ip: '192.168.20.11', sn: 'MJ09X2L8', tag: 'ITS-PC-2026-021', location: 'IS Workshop / Remote Station' }) },
  { id: 'dev-22', no: 22, department: 'IS', computerName: 'NITSIS2601542', type: 'Notebook', user: 'mario.riandita', specs: createSpecs({ brand: 'Lenovo', model: 'ThinkPad L14 Gen 4', cpu: 'Intel Core i5-1335U @ 4.6GHz', ram: '16 GB DDR4', storage: '512 GB PCIe SSD', os: 'Windows 11 Pro 64-bit', ip: '192.168.20.54', sn: 'PF5B1001', tag: 'ITS-NB-2026-022', location: 'IS Office - Meja IT Support' }) },
  { id: 'dev-23', no: 23, department: 'IS', computerName: 'NITSIS2601543', type: 'Notebook', user: 'akbar.azis', specs: createSpecs({ brand: 'Lenovo', model: 'ThinkPad L14 Gen 4', cpu: 'Intel Core i5-1335U @ 4.6GHz', ram: '16 GB DDR4', storage: '512 GB PCIe SSD', os: 'Windows 11 Pro 64-bit', ip: '192.168.20.55', sn: 'PF5B1002', tag: 'ITS-NB-2026-023', location: 'IS Office - Meja Programmer' }) },
  { id: 'dev-24', no: 24, department: 'IS', computerName: 'NITSIS2601544', type: 'Notebook', user: 'eko.rusdyanto', specs: createSpecs({ brand: 'Lenovo', model: 'ThinkPad L14 Gen 4', cpu: 'Intel Core i5-1335U @ 4.6GHz', ram: '16 GB DDR4', storage: '512 GB PCIe SSD', os: 'Windows 11 Pro 64-bit', ip: '192.168.20.56', sn: 'PF5B1003', tag: 'ITS-NB-2026-024', location: 'IS Office - Meja Network Admin' }) },
  { id: 'dev-25', no: 25, department: 'RSN', computerName: 'NITSRSN2210331', type: 'Notebook', user: 'Spare', specs: createSpecs({ brand: 'Dell', model: 'Latitude 3420', cpu: 'Intel Core i5-1135G7 @ 4.2GHz', ram: '16 GB DDR4', storage: '256 GB NVMe SSD', os: 'Windows 10 Pro 64-bit', ip: '192.168.30.12', sn: 'DL-LAT-3420-RSN', tag: 'ITS-NB-2026-025', location: 'Resin Plant Office - Meja Spare' }) },
  { id: 'dev-26', no: 26, department: 'QATECH', computerName: 'NITSQT2207325', type: 'Notebook', user: 'Ryan', remark: 'Service', specs: createSpecs({ brand: 'Dell', model: 'Latitude 5430', cpu: 'Intel Core i5-1235U @ 4.4GHz', ram: '16 GB DDR4', storage: '512 GB PCIe SSD', os: 'Windows 11 Pro 64-bit', ip: '192.168.40.18', sn: 'DL-LAT-5430-RY', tag: 'ITS-NB-2026-026', location: 'QA Tech Lab - IT Service Bay' }) },
  { id: 'dev-27', no: 27, department: 'QATECH', computerName: 'NITSQT2203322', type: 'Notebook', user: 'Morioka', remark: 'Service', specs: createSpecs({ brand: 'Panasonic', model: 'Toughbook CF-SV8', cpu: 'Intel Core i5-8365U vPro', ram: '16 GB LPDDR3', storage: '256 GB SSD', os: 'Windows 10 Pro 64-bit Japanese/EN', ip: '192.168.40.19', sn: 'PAN-SV8-MRK', tag: 'ITS-NB-2026-027', location: 'QA Tech Expat Room - IT Service Bay' }) }
];

// Initial Stock Taking Status untuk Januari 2026 (25 Online, 2 Out / Service)
export const initialStockTakingRecords = {
  '2026_1': {
    'dev-1': { status: 'Online', remark: '' },
    'dev-2': { status: 'Online', remark: '' },
    'dev-3': { status: 'Online', remark: '' },
    'dev-4': { status: 'Online', remark: '' },
    'dev-5': { status: 'Online', remark: '' },
    'dev-6': { status: 'Online', remark: '' },
    'dev-7': { status: 'Online', remark: '' },
    'dev-8': { status: 'Online', remark: '' },
    'dev-9': { status: 'Online', remark: '' },
    'dev-10': { status: 'Online', remark: '' },
    'dev-11': { status: 'Online', remark: '' },
    'dev-12': { status: 'Online', remark: '' },
    'dev-13': { status: 'Online', remark: '' },
    'dev-14': { status: 'Online', remark: '' },
    'dev-15': { status: 'Online', remark: '' },
    'dev-16': { status: 'Online', remark: '' },
    'dev-17': { status: 'Online', remark: '' },
    'dev-18': { status: 'Online', remark: '' },
    'dev-19': { status: 'Online', remark: '' },
    'dev-20': { status: 'Online', remark: '' },
    'dev-21': { status: 'Online', remark: '' },
    'dev-22': { status: 'Online', remark: '' },
    'dev-23': { status: 'Online', remark: '' },
    'dev-24': { status: 'Online', remark: '' },
    'dev-25': { status: 'Online', remark: '' },
    'dev-26': { status: 'Out', remark: 'Service' },
    'dev-27': { status: 'Out', remark: 'Service' }
  }
};
