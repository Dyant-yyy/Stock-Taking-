export const companyProfileData = {
  companyName: "PT. Indonesia Toray Synthetics",
  tagline: "Innovating Polymer & Fiber Solutions for a Sustainable Future",
  established: 1971,
  location: "Tangerang, Banten, Indonesia",
  parentGroup: "Toray Industries, Inc. (Japan)",
  description: "PT. Indonesia Toray Synthetics (ITS) adalah produsen serat sintetis terkemuka di Indonesia yang memproduksi Polyester Staple Fiber, Polyester Filament Yarn, dan Nylon Filament Yarn berkualitas dunia dengan standar teknologi Jepang. Terletak di kawasan industri Tangerang, ITS didukung oleh infrastruktur IT dan otomatisasi industri mutakhir.",
  stats: [
    { label: "Luas Area Pabrik", value: "35 Hektar", icon: "Factory" },
    { label: "Kapasitas Produksi", value: "120,000 Ton/Tahun", icon: "Boxes" },
    { label: "Tenaga Kerja & Staf", value: "1,500+ Karyawan", icon: "Users" },
    { label: "Perangkat IT Terkelola", value: "450+ Asset", icon: "Cpu" },
    { label: "Unit Operasional", value: "4 Plant Utama", icon: "Building2" },
    { label: "Standar Sertifikasi", value: "ISO 9001 / 14001 / 45001", icon: "ShieldCheck" }
  ],
  plants: [
    {
      id: "plant-1",
      name: "Plant 1 - Polymerization & Polyester Staple Fiber",
      description: "Pusat polimerisasi kimia dan pembuatan serat stapel poliester berkecepatan tinggi.",
      managedDevices: 124,
      status: "Operational"
    },
    {
      id: "plant-2",
      name: "Plant 2 - Filament Yarn & Spinning",
      description: "Fasilitas pemintalan serat filamen poliester dan nilon berteknologi otomatis.",
      managedDevices: 148,
      status: "Operational"
    },
    {
      id: "utility",
      name: "Power Plant & Utility Center",
      description: "Pusat pembangkit listrik mandiri, pemeliharaan utilitas, dan pengolahan limbah (EHS).",
      managedDevices: 62,
      status: "Operational"
    },
    {
      id: "hq-server",
      name: "Main Office & Data Center HQ",
      description: "Pusat komando IT, server room, administrasi utama, dan divisi HR/Finance/Logistik.",
      managedDevices: 118,
      status: "Operational"
    }
  ]
};

export const initialDepartments = [
  { id: "DEPT-IT", name: "IT & System Automation", head: "Budi Santoso, S.T.", code: "IT", icon: "Monitor" },
  { id: "DEPT-PRD", name: "Production & Manufacturing", head: "Hendra Wijaya", code: "PRD", icon: "Factory" },
  { id: "DEPT-MNT", name: "Plant Maintenance & Utility", head: "Ir. Agus Rahardjo", code: "MNT", icon: "Wrench" },
  { id: "DEPT-QC", name: "Quality Assurance & Lab", head: "Dr. Retno Astuti", code: "QC", icon: "FlaskConical" },
  { id: "DEPT-HR", name: "Human Resources & GA", head: "Siti Rahmawati", code: "HR", icon: "Users" },
  { id: "DEPT-FIN", name: "Finance & Accounting", head: "Dedi Kurniawan, SE", code: "FIN", icon: "Receipt" },
  { id: "DEPT-LOG", name: "Logistics & Warehouse", head: "Bambang Supriadi", code: "LOG", icon: "Truck" },
  { id: "DEPT-EHS", name: "EHS & Sustainability", head: "Rian Hidayat", code: "EHS", icon: "ShieldAlert" }
];

export const initialEmployees = [
  { id: "EMP-001", name: "Budi Santoso", deptId: "DEPT-IT", position: "IT Infrastructure Manager", email: "budi.santoso@toray.co.id" },
  { id: "EMP-002", name: "Ahmad Rizky", deptId: "DEPT-IT", position: "Network & Systems Specialist", email: "ahmad.rizky@toray.co.id" },
  { id: "EMP-003", name: "Hendra Wijaya", deptId: "DEPT-PRD", position: "Production Superintendent", email: "hendra.wijaya@toray.co.id" },
  { id: "EMP-004", name: "Dewi Lestari", deptId: "DEPT-PRD", position: "Control Room Operator", email: "dewi.lestari@toray.co.id" },
  { id: "EMP-005", name: "Ir. Agus Rahardjo", deptId: "DEPT-MNT", position: "Chief Maintenance Engineer", email: "agus.rahardjo@toray.co.id" },
  { id: "EMP-006", name: "Dr. Retno Astuti", deptId: "DEPT-QC", position: "QA Laboratory Lead", email: "retno.astuti@toray.co.id" },
  { id: "EMP-007", name: "Siti Rahmawati", deptId: "DEPT-HR", position: "HR Manager", email: "siti.rahmawati@toray.co.id" },
  { id: "EMP-008", name: "Dedi Kurniawan", deptId: "DEPT-FIN", position: "Accounting Lead", email: "dedi.kurniawan@toray.co.id" }
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
    departmentId: "DEPT-IT",
    location: "Main HQ - Server Room Rack 02",
    assignedTo: "Ahmad Rizky",
    purchaseDate: "2024-03-15",
    purchaseCost: 85000000,
    warrantyExpiry: "2027-03-15",
    status: "In Use",
    condition: "Good",
    specs: {
      cpu: "Dual Intel Xeon Silver 4314 (32 Cores)",
      ram: "128 GB DDR4 ECC",
      storage: "4x 1.92TB NVMe SSD Enterprise RAID 10",
      os: "Windows Server 2022 Datacenter",
      ipAddress: "192.168.10.15",
      macAddress: "00:1A:2B:3C:4D:5E"
    },
    notes: "Main ERP & Production Database Secondary Node."
  },
  {
    id: "DEV-002",
    assetTag: "ITS-IPC-2024-012",
    name: "Advantech Industrial Panel PC 17\"",
    category: "Industrial PC",
    brand: "Advantech",
    model: "TPC-1782H Touch",
    serialNumber: "ADV-IPC-4412-ITS",
    departmentId: "DEPT-PRD",
    location: "Plant 1 - Polymerization Control Desk A",
    assignedTo: "Dewi Lestari",
    purchaseDate: "2024-01-20",
    purchaseCost: 32000000,
    warrantyExpiry: "2026-01-20",
    status: "In Use",
    condition: "Good",
    specs: {
      cpu: "Intel Core i5-1145GRE Industrial",
      ram: "16 GB DDR4 Industrial Grade",
      storage: "512 GB SSD M.2 Wide Temp",
      os: "Windows 10 IoT Enterprise",
      ipAddress: "192.168.20.102",
      macAddress: "00:0E:8C:99:AA:11"
    },
    notes: "DCS Polymerization Plant Monitoring Station."
  },
  {
    id: "DEV-003",
    assetTag: "ITS-LPT-2025-045",
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    category: "Laptop",
    brand: "Lenovo",
    model: "ThinkPad X1 Carbon",
    serialNumber: "PF-4421X-ITS",
    departmentId: "DEPT-IT",
    location: "Main Office - IT Management Room",
    assignedTo: "Budi Santoso",
    purchaseDate: "2025-02-10",
    purchaseCost: 28500000,
    warrantyExpiry: "2028-02-10",
    status: "In Use",
    condition: "Good",
    specs: {
      cpu: "Intel Core i7-1365U vPro",
      ram: "32 GB LPDDR5",
      storage: "1 TB PCIe NVMe SSD",
      os: "Windows 11 Pro 64-bit",
      ipAddress: "192.168.1.45",
      macAddress: "E4:A8:DF:12:34:56"
    },
    notes: "Mobile Laptop IT Management & Remote Site Access."
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
    location: "Main HQ - Finance Office",
    assignedTo: "Dedi Kurniawan",
    purchaseDate: "2024-11-05",
    purchaseCost: 18500000,
    warrantyExpiry: "2027-11-05",
    status: "Available",
    condition: "Good",
    specs: {
      cpu: "Intel Core i5-1335U",
      ram: "16 GB DDR4",
      storage: "512 GB NVMe SSD",
      os: "Windows 11 Pro",
      ipAddress: "192.168.1.88",
      macAddress: "70:B5:E8:44:55:66"
    },
    notes: "Backup laptop ready for business trips or finance audit."
  },
  {
    id: "DEV-005",
    assetTag: "ITS-PC-2023-019",
    name: "HP EliteDesk 800 G9 Tower",
    category: "Desktop PC",
    brand: "HP",
    model: "EliteDesk 800 G9",
    serialNumber: "HP-ED-3391-ITS",
    departmentId: "DEPT-QC",
    location: "Plant 2 - QA Spectrometry Lab",
    assignedTo: "Dr. Retno Astuti",
    purchaseDate: "2023-08-12",
    purchaseCost: 16800000,
    warrantyExpiry: "2026-08-12",
    status: "In Use",
    condition: "Fair",
    specs: {
      cpu: "Intel Core i7-12700",
      ram: "16 GB DDR5",
      storage: "512 GB NVMe + 2TB HDD Data",
      os: "Windows 11 Pro",
      ipAddress: "192.168.30.50",
      macAddress: "B8:27:EB:77:88:99"
    },
    notes: "Connected to Fourier-Transform Infrared Spectrometer."
  },
  {
    id: "DEV-006",
    assetTag: "ITS-PRN-2024-004",
    name: "Zebra ZT411 Industrial Barcode Printer",
    category: "Printer & Scanner",
    brand: "Zebra",
    model: "ZT411 300dpi Thermal",
    serialNumber: "ZEB-ZT411-901-ITS",
    departmentId: "DEPT-LOG",
    location: "Logistics Warehouse Gate B",
    assignedTo: "Bambang Supriadi",
    purchaseDate: "2024-04-18",
    purchaseCost: 24000000,
    warrantyExpiry: "2026-04-18",
    status: "Maintenance",
    condition: "Under Repair",
    specs: {
      cpu: "32-bit ARM Processor",
      ram: "256 MB Flash / 512 MB RAM",
      storage: "Internal Flash",
      os: "Zebra Link-OS",
      ipAddress: "192.168.40.12",
      macAddress: "00:07:4D:11:22:33"
    },
    notes: "Printhead thermal ribbon feeder replacement ongoing."
  },
  {
    id: "DEV-007",
    assetTag: "ITS-SWH-2024-010",
    name: "Cisco Catalyst 9300 48-Port PoE+ Switch",
    category: "Network Equipment",
    brand: "Cisco",
    model: "C9300-48P-A",
    serialNumber: "FOC2411L0XX",
    departmentId: "DEPT-IT",
    location: "Plant 2 - IDF Rack Cabinet 01",
    assignedTo: "Ahmad Rizky",
    purchaseDate: "2024-06-01",
    purchaseCost: 65000000,
    warrantyExpiry: "2029-06-01",
    status: "In Use",
    condition: "Good",
    specs: {
      cpu: "x86 1.8GHz",
      ram: "16 GB DRAM",
      storage: "16 GB Flash",
      os: "Cisco IOS-XE 17.9",
      ipAddress: "192.168.10.2",
      macAddress: "00:1C:B0:99:88:77"
    },
    notes: "Core edge switch feeding Plant 2 spinning machines."
  },
  {
    id: "DEV-008",
    assetTag: "ITS-HND-2025-003",
    name: "Zebra TC57x Rugged Mobile Computer",
    category: "Mobile & Handheld",
    brand: "Zebra",
    model: "TC57x Handheld Scanner",
    serialNumber: "ZEB-TC57-4412",
    departmentId: "DEPT-LOG",
    location: "Finished Goods Storage Area",
    assignedTo: "Bambang Supriadi",
    purchaseDate: "2025-01-15",
    purchaseCost: 14500000,
    warrantyExpiry: "2027-01-15",
    status: "In Use",
    condition: "Good",
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

export const initialCheckouts = [
  {
    id: "CHK-101",
    deviceId: "DEV-004",
    assetTag: "ITS-LPT-2025-088",
    deviceName: "Dell Latitude 5440 Corporate",
    borrowerName: "Dedi Kurniawan",
    department: "Finance & Accounting",
    purpose: "Business Audit Trip to Toray HQ Jakarta",
    checkoutDate: "2026-10-01",
    expectedReturnDate: "2026-10-15",
    actualReturnDate: null,
    status: "Active",
    conditionOnCheckout: "Good",
    notes: "Handed over with power adapter and laptop bag."
  },
  {
    id: "CHK-100",
    deviceId: "DEV-008",
    assetTag: "ITS-HND-2025-003",
    deviceName: "Zebra TC57x Rugged Mobile Computer",
    borrowerName: "Bambang Supriadi",
    department: "Logistics & Warehouse",
    purpose: "Quarterly Physical Stock Opname Count",
    checkoutDate: "2026-09-20",
    expectedReturnDate: "2026-09-25",
    actualReturnDate: "2026-09-24",
    status: "Returned",
    conditionOnCheckout: "Good",
    notes: "Returned in clean condition with charging dock."
  }
];

export const initialMaintenance = [
  {
    id: "MNT-501",
    deviceId: "DEV-006",
    assetTag: "ITS-PRN-2024-004",
    deviceName: "Zebra ZT411 Industrial Barcode Printer",
    reportedBy: "Bambang Supriadi",
    issueCategory: "Hardware Malfunction",
    description: "Thermal printhead wearing out causing faint barcode scans on pallet labels.",
    reportDate: "2026-10-05",
    technician: "Agus Rahardjo (Plant Maintenance)",
    status: "In Progress",
    costEstimate: 3500000,
    partsReplaced: "Zebra ZT411 Printhead 300dpi Kit",
    notes: "Replacement printhead ordered from vendor Zebra Indonesia."
  },
  {
    id: "MNT-500",
    deviceId: "DEV-005",
    assetTag: "ITS-PC-2023-019",
    deviceName: "HP EliteDesk 800 G9 Tower",
    reportedBy: "Dr. Retno Astuti",
    issueCategory: "Preventive Cleaning & RAM Upgrade",
    description: "Scheduled preventive maintenance & dust cleaning for QC lab workstation.",
    reportDate: "2026-09-10",
    completionDate: "2026-09-11",
    technician: "Ahmad Rizky (IT Dept)",
    status: "Completed",
    costEstimate: 850000,
    partsReplaced: "Kingston 16GB DDR5 RAM",
    notes: "Upgraded RAM to 32GB total for high-res spectral analysis."
  }
];

export const initialSpareParts = [
  {
    id: "SPR-001",
    partNumber: "RAM-DDR4-16GB-ECC",
    name: "Samsung 16GB DDR4 3200MHz ECC Server Memory",
    category: "RAM",
    stockQuantity: 8,
    minThreshold: 3,
    unitCost: 1400000,
    location: "IT Server Room Spare Cabinet A2",
    compatibility: "Dell PowerEdge R750 / HP ProLiant"
  },
  {
    id: "SPR-002",
    partNumber: "SSD-NVME-1TB-ENT",
    name: "Samsung PM9A1 1TB NVMe Enterprise SSD",
    category: "Storage",
    stockQuantity: 2,
    minThreshold: 4,
    unitCost: 2200000,
    location: "IT Spare Shelf B1",
    compatibility: "Desktops, Laptops & Workstations"
  },
  {
    id: "SPR-003",
    partNumber: "TNR-ZEB-ZT411",
    name: "Zebra Thermal Ribbon Wax/Resin 110mm x 450m",
    category: "Printer Consumables",
    stockQuantity: 15,
    minThreshold: 5,
    unitCost: 320000,
    location: "Warehouse Logistics Office Desk",
    compatibility: "Zebra ZT411 / ZT421 Industrial Printers"
  },
  {
    id: "SPR-004",
    partNumber: "CBL-CAT6A-305M",
    name: "Belden Cat6A SFTP Industrial Ethernet Cable Reel (305m)",
    category: "Networking",
    stockQuantity: 4,
    minThreshold: 2,
    unitCost: 3800000,
    location: "Maintenance Store Room C",
    compatibility: "Plant 1 & Plant 2 Network Backbone"
  }
];

export const initialLogs = [
  {
    id: "LOG-901",
    timestamp: "2026-10-09 00:10:00",
    user: "Budi Santoso",
    action: "System Initialization",
    details: "PT. Indonesia Toray Synthetics IT Device Inventory Portal initialized with mock seed database.",
    category: "System"
  },
  {
    id: "LOG-902",
    timestamp: "2026-10-05 14:30:22",
    user: "Bambang Supriadi",
    action: "Report Maintenance Ticket",
    details: "Reported hardware fault for ITS-PRN-2024-004 Zebra Barcode Printer.",
    category: "Maintenance"
  },
  {
    id: "LOG-903",
    timestamp: "2026-10-01 09:15:10",
    user: "Dedi Kurniawan",
    action: "Device Checkout",
    details: "Checked out ITS-LPT-2025-088 for Finance Audit Trip.",
    category: "Checkout"
  }
];
