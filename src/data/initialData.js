export const companyProfileData = {
  companyName: "PT. Indonesia Toray Synthetics",
  tagline: "Innovating Polymer & Fiber Solutions for a Sustainable Future",
  established: 1971,
  location: "Tangerang, Banten, Indonesia",
  parentGroup: "Toray Industries, Inc. (Japan)",
  description: "PT. Indonesia Toray Synthetics (ITS) adalah produsen serat sintetis terkemuka di Indonesia yang memproduksi Polyester Staple Fiber (PSF), Polyester Filament Yarn (PFY), Nylon Filament Yarn (NFY), dan Resin (RSN) berkualitas dunia. Sistem Stock Taking Device ini digunakan untuk audit verifikasi fisik aset IT di seluruh unit pabrik Tangerang.",
  stats: [
    { label: "Luas Area Pabrik", value: "35 Hektar", icon: "Factory" },
    { label: "Kapasitas Produksi", value: "120,000 Ton/Tahun", icon: "Boxes" },
    { label: "Tenaga Kerja & Staf", value: "1,500+ Karyawan", icon: "Users" },
    { label: "Perangkat IT Terkelola", value: "450+ Asset", icon: "Cpu" },
    { label: "Master Departemen", value: "6 Divisi Utama", icon: "Building2" },
    { label: "Standar Sertifikasi", value: "ISO 9001 / 14001 / 45001", icon: "ShieldCheck" }
  ],
  plants: [
    {
      id: "plant-rsn",
      name: "RSN - Polymerization & Resin Plant",
      description: "Pusat polimerisasi kimia dan produksi Resin (RSN) sintetis berkecepatan tinggi.",
      managedDevices: 124,
      status: "Operational"
    },
    {
      id: "plant-pfy",
      name: "PFY - Polyester Filament Yarn Plant",
      description: "Fasilitas pemintalan dan pembuatan serat filamen poliester (PFY) otomatis.",
      managedDevices: 148,
      status: "Operational"
    },
    {
      id: "plant-nfy",
      name: "NFY - Nylon Filament Yarn Plant",
      description: "Fasilitas pemintalan serat nilon filamen (NFY) kualitas tinggi untuk aplikasi tekstil industri.",
      managedDevices: 95,
      status: "Operational"
    },
    {
      id: "plant-sis",
      name: "SIS - System Integration & Utility Center",
      description: "Pusat utilitas pembangkit listrik, otomasi pabrik, dan sistem pengolahan EHS.",
      managedDevices: 62,
      status: "Operational"
    },
    {
      id: "hq-is",
      name: "IS - Information System & Data Center",
      description: "Pusat komando IT, server room, jaringan enterprise, dan infrastruktur data ITS.",
      managedDevices: 118,
      status: "Operational"
    }
  ]
};

export const initialDepartments = [
  { id: "DEPT-IS", name: "Information System (IS)", head: "Budi Santoso, S.T.", code: "IS", icon: "Monitor", description: "Divisi Teknologi Informasi & Infrastruktur Komputer" },
  { id: "DEPT-RSN", name: "Resin & Polymerization (RSN)", head: "Ir. Agus Rahardjo", code: "RSN", icon: "Flame", description: "Pabrik Polimerisasi & Pengolahan Bahan Resin" },
  { id: "DEPT-QATECH", name: "Quality Assurance & Tech (QATECH)", head: "Dr. Retno Astuti", code: "QATECH", icon: "FlaskConical", description: "Laboratorium Pengujian Kualitas & Teknik Material" },
  { id: "DEPT-SIS", name: "System Integration & Services (SIS)", head: "Hendra Wijaya", code: "SIS", icon: "Wrench", description: "Divisi Integrasi Sistem, Utilitas & Maintenance Pabrik" },
  { id: "DEPT-NFY", name: "Nylon Filament Yarn (NFY)", head: "Bambang Supriadi", code: "NFY", icon: "Boxes", description: "Pabrik Pemintalan & Produksi Serat Filamen Nilon" },
  { id: "DEPT-PFY", name: "Polyester Filament Yarn (PFY)", head: "Dewi Lestari", code: "PFY", icon: "Factory", description: "Pabrik Pemintalan & Produksi Serat Filamen Poliester" },
  { id: "DEPT-PSF", name: "Polyester Staple Fiber (PSF)", head: "Rian Hidayat", code: "PSF", icon: "Boxes", description: "Pabrik Produksi Serat Stapel Poliester" },
  { id: "DEPT-HRGA", name: "Human Resources & GA (HRGA)", head: "Siti Rahmawati", code: "HRGA", icon: "Users", description: "Divisi Sumber Daya Manusia & General Affairs" },
  { id: "DEPT-FIN", name: "Finance & Accounting (FIN)", head: "Dedi Kurniawan, SE", code: "FIN", icon: "Receipt", description: "Divisi Keuangan, Perencanaan & Akuntansi" }
];

export const initialEmployees = [
  { id: "EMP-001", name: "Budi Santoso", deptId: "DEPT-IS", position: "IS Department Manager", email: "budi.santoso@toray.co.id" },
  { id: "EMP-002", name: "Ahmad Rizky", deptId: "DEPT-IS", position: "Network & Systems Specialist", email: "ahmad.rizky@toray.co.id" },
  { id: "EMP-003", name: "Ir. Agus Rahardjo", deptId: "DEPT-RSN", position: "RSN Plant Superintendent", email: "agus.rahardjo@toray.co.id" },
  { id: "EMP-004", name: "Dr. Retno Astuti", deptId: "DEPT-QATECH", position: "QA Technical Lead", email: "retno.astuti@toray.co.id" },
  { id: "EMP-005", name: "Hendra Wijaya", deptId: "DEPT-SIS", position: "SIS Chief Engineer", email: "hendra.wijaya@toray.co.id" },
  { id: "EMP-006", name: "Bambang Supriadi", deptId: "DEPT-NFY", position: "NFY Plant Manager", email: "bambang.supriadi@toray.co.id" },
  { id: "EMP-007", name: "Dewi Lestari", deptId: "DEPT-PFY", position: "PFY Spinning Specialist", email: "dewi.lestari@toray.co.id" },
  { id: "EMP-008", name: "Siti Rahmawati", deptId: "DEPT-HRGA", position: "HRGA Manager", email: "siti.rahmawati@toray.co.id" },
  { id: "EMP-009", name: "Dedi Kurniawan", deptId: "DEPT-FIN", position: "Finance Lead", email: "dedi.kurniawan@toray.co.id" }
];

export const initialDevices = [
  {
    id: "DEV-001",
    assetTag: "ITS-SRV-2025-001",
    name: "Dell PowerEdge R750 Rack Server",
    category: "Server",
    brand: "Dell Enterprise",
    model: "PowerEdge R750",
    serialNumber: "DELL-SRV-98421-ITS",
    departmentId: "DEPT-IS",
    departmentCode: "IS",
    location: "Main HQ - Server Room Rack 02",
    assignedTo: "Ahmad Rizky",
    purchaseDate: "2024-03-15",
    purchaseCost: 85000000,
    warrantyExpiry: "2027-03-15",
    status: "Verified",
    condition: "Good",
    lastStockTakingDate: "2026-10-09",
    specs: {
      cpu: "Dual Intel Xeon Silver 4314 (32 Cores)",
      ram: "128 GB DDR4 ECC",
      storage: "4x 1.92TB NVMe SSD Enterprise RAID 10",
      os: "Windows Server 2022 Datacenter",
      ipAddress: "192.168.10.15",
      macAddress: "00:1A:2B:3C:4D:5E"
    },
    notes: "Main ERP & Production Database Secondary Node. Verified pada Opname."
  },
  {
    id: "DEV-002",
    assetTag: "ITS-IPC-2024-012",
    name: "Advantech Industrial Panel PC 17\"",
    category: "Industrial PC",
    brand: "Advantech",
    model: "TPC-1782H Touch",
    serialNumber: "ADV-IPC-4412-ITS",
    departmentId: "DEPT-RSN",
    departmentCode: "RSN",
    location: "RSN Plant - Control Room Desk A",
    assignedTo: "Ir. Agus Rahardjo",
    purchaseDate: "2024-01-20",
    purchaseCost: 32000000,
    warrantyExpiry: "2026-01-20",
    status: "Verified",
    condition: "Good",
    lastStockTakingDate: "2026-10-08",
    specs: {
      cpu: "Intel Core i5-1145GRE Industrial",
      ram: "16 GB DDR4 Industrial Grade",
      storage: "512 GB SSD M.2 Wide Temp",
      os: "Windows 10 IoT Enterprise",
      ipAddress: "192.168.20.102",
      macAddress: "00:0E:8C:99:AA:11"
    },
    notes: "DCS Resin Polymerization Monitoring Station."
  },
  {
    id: "DEV-003",
    assetTag: "ITS-LPT-2025-045",
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    category: "Laptop",
    brand: "Lenovo",
    model: "ThinkPad X1 Carbon",
    serialNumber: "PF-4421X-ITS",
    departmentId: "DEPT-IS",
    departmentCode: "IS",
    location: "Main Office - IS Management Room",
    assignedTo: "Budi Santoso",
    purchaseDate: "2025-02-10",
    purchaseCost: 28500000,
    warrantyExpiry: "2028-02-10",
    status: "Verified",
    condition: "Good",
    lastStockTakingDate: "2026-10-07",
    specs: {
      cpu: "Intel Core i7-1365U vPro",
      ram: "32 GB LPDDR5",
      storage: "1 TB PCIe NVMe SSD",
      os: "Windows 11 Pro 64-bit",
      ipAddress: "192.168.1.45",
      macAddress: "E4:A8:DF:12:34:56"
    },
    notes: "Mobile Laptop IS Management & Remote Site Access."
  },
  {
    id: "DEV-004",
    assetTag: "ITS-LPT-2025-088",
    name: "Dell Latitude 5440 Corporate",
    category: "Laptop",
    brand: "Dell",
    model: "Latitude 5440",
    serialNumber: "DL-LAT-8812-ITS",
    departmentId: "DEPT-FIN",
    departmentCode: "FIN",
    location: "Main HQ - Finance Office",
    assignedTo: "Dedi Kurniawan",
    purchaseDate: "2024-11-05",
    purchaseCost: 18500000,
    warrantyExpiry: "2027-11-05",
    status: "Pending Audit",
    condition: "Good",
    lastStockTakingDate: null,
    specs: {
      cpu: "Intel Core i5-1335U",
      ram: "16 GB DDR4",
      storage: "512 GB NVMe SSD",
      os: "Windows 11 Pro",
      ipAddress: "192.168.1.88",
      macAddress: "70:B5:E8:44:55:66"
    },
    notes: "Menunggu pelaksanaan Stock Opname jadwal kuartal ini."
  },
  {
    id: "DEV-005",
    assetTag: "ITS-PC-2023-019",
    name: "HP EliteDesk 800 G9 Tower",
    category: "Desktop PC",
    brand: "HP",
    model: "EliteDesk 800 G9",
    serialNumber: "HP-ED-3391-ITS",
    departmentId: "DEPT-QATECH",
    departmentCode: "QATECH",
    location: "QATECH Lab - Spectrometry Unit",
    assignedTo: "Dr. Retno Astuti",
    purchaseDate: "2023-08-12",
    purchaseCost: 16800000,
    warrantyExpiry: "2026-08-12",
    status: "Verified",
    condition: "Good",
    lastStockTakingDate: "2026-10-09",
    specs: {
      cpu: "Intel Core i7-12700",
      ram: "32 GB DDR5",
      storage: "512 GB NVMe + 2TB HDD Data",
      os: "Windows 11 Pro",
      ipAddress: "192.168.30.50",
      macAddress: "B8:27:EB:77:88:99"
    },
    notes: "Terhubung ke instrumen FTIR. Terverifikasi oleh auditor QATECH."
  },
  {
    id: "DEV-006",
    assetTag: "ITS-PRN-2024-004",
    name: "Zebra ZT411 Industrial Barcode Printer",
    category: "Printer & Scanner",
    brand: "Zebra",
    model: "ZT411 300dpi Thermal",
    serialNumber: "ZEB-ZT411-901-ITS",
    departmentId: "DEPT-NFY",
    departmentCode: "NFY",
    location: "NFY Packing & Warehouse Gate B",
    assignedTo: "Bambang Supriadi",
    purchaseDate: "2024-04-18",
    purchaseCost: 24000000,
    warrantyExpiry: "2026-04-18",
    status: "Discrepancy",
    condition: "Under Repair",
    lastStockTakingDate: "2026-10-05",
    specs: {
      cpu: "32-bit ARM Processor",
      ram: "256 MB Flash / 512 MB RAM",
      storage: "Internal Flash",
      os: "Zebra Link-OS",
      ipAddress: "192.168.40.12",
      macAddress: "00:07:4D:11:22:33"
    },
    notes: "Catatan Opname: Thermal printhead aus, sedang perbaikan teknisi SIS."
  },
  {
    id: "DEV-007",
    assetTag: "ITS-SWH-2024-010",
    name: "Cisco Catalyst 9300 48-Port PoE+ Switch",
    category: "Network Equipment",
    brand: "Cisco",
    model: "C9300-48P-A",
    serialNumber: "FOC2411L0XX",
    departmentId: "DEPT-SIS",
    departmentCode: "SIS",
    location: "PFY / SIS - IDF Rack Cabinet 01",
    assignedTo: "Hendra Wijaya",
    purchaseDate: "2024-06-01",
    purchaseCost: 65000000,
    warrantyExpiry: "2029-06-01",
    status: "Verified",
    condition: "Good",
    lastStockTakingDate: "2026-10-08",
    specs: {
      cpu: "x86 1.8GHz",
      ram: "16 GB DRAM",
      storage: "16 GB Flash",
      os: "Cisco IOS-XE 17.9",
      ipAddress: "192.168.10.2",
      macAddress: "00:1C:B0:99:88:77"
    },
    notes: "Core edge switch feeding PFY spinning machines."
  },
  {
    id: "DEV-008",
    assetTag: "ITS-HND-2025-003",
    name: "Zebra TC57x Rugged Mobile Computer",
    category: "Mobile & Handheld",
    brand: "Zebra",
    model: "TC57x Handheld Scanner",
    serialNumber: "ZEB-TC57-4412",
    departmentId: "DEPT-PFY",
    departmentCode: "PFY",
    location: "PFY Finished Goods Storage Area",
    assignedTo: "Dewi Lestari",
    purchaseDate: "2025-01-15",
    purchaseCost: 14500000,
    warrantyExpiry: "2027-01-15",
    status: "Pending Audit",
    condition: "Good",
    lastStockTakingDate: null,
    specs: {
      cpu: "Qualcomm Snapdragon 660 Octa-Core",
      ram: "4 GB RAM",
      storage: "32 GB Flash",
      os: "Android 11 Enterprise GMS",
      ipAddress: "192.168.40.80",
      macAddress: "94:B4:0F:33:22:11"
    },
    notes: "Handheld barcode scanner for pallet dispatch stock."
  }
];

export const initialStockTakings = [
  {
    id: "STK-2026-001",
    stockTakingDate: "2026-10-08",
    auditorName: "Ahmad Rizky (IS)",
    departmentId: "DEPT-RSN",
    departmentCode: "RSN",
    deviceId: "DEV-002",
    assetTag: "ITS-IPC-2024-012",
    deviceName: "Advantech Industrial Panel PC 17\"",
    expectedLocation: "RSN Plant - Control Room Desk A",
    scannedLocation: "RSN Plant - Control Room Desk A",
    locationStatus: "Verified",
    physicalCondition: "Good",
    auditResultStatus: "Verified",
    notes: "Fisik bersih, layar sentuh responsif, IP 192.168.20.102 aktif."
  },
  {
    id: "STK-2026-002",
    stockTakingDate: "2026-10-09",
    auditorName: "Dr. Retno Astuti (QATECH)",
    departmentId: "DEPT-QATECH",
    departmentCode: "QATECH",
    deviceId: "DEV-005",
    assetTag: "ITS-PC-2023-019",
    deviceName: "HP EliteDesk 800 G9 Tower",
    expectedLocation: "QATECH Lab - Spectrometry Unit",
    scannedLocation: "QATECH Lab - Spectrometry Unit",
    locationStatus: "Verified",
    physicalCondition: "Good",
    auditResultStatus: "Verified",
    notes: "Terhubung ke instrumen FTIR, spesifikasi RAM 32GB terverifikasi."
  },
  {
    id: "STK-2026-003",
    stockTakingDate: "2026-10-09",
    auditorName: "Ahmad Rizky (IS)",
    departmentId: "DEPT-IS",
    departmentCode: "IS",
    deviceId: "DEV-001",
    assetTag: "ITS-SRV-2025-001",
    deviceName: "Dell PowerEdge R750 Rack Server",
    expectedLocation: "Main HQ - Server Room Rack 02",
    scannedLocation: "Main HQ - Server Room Rack 02",
    locationStatus: "Verified",
    physicalCondition: "Good",
    auditResultStatus: "Verified",
    notes: "Server room suhu 18°C, RAID 10 NVMe terverifikasi normal."
  }
];

export const initialLogs = [
  {
    id: "LOG-901",
    timestamp: "2026-10-10 15:00:00",
    user: "Budi Santoso (IS)",
    action: "System Focused to Stock Taking",
    details: "Sistem difokuskan secara khusus pada Manajemen & Input Stock Taking Device PT. Indonesia Toray Synthetics.",
    category: "System"
  },
  {
    id: "LOG-902",
    timestamp: "2026-10-09 14:00:00",
    user: "Ahmad Rizky (IS)",
    action: "Input Stock Taking",
    details: "Pelaksanaan Stock Opname fisik perangkat ITS-SRV-2025-001 di Data Center HQ.",
    category: "Stock Taking"
  }
];
