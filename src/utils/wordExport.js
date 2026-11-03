/**
 * Word Document (.doc / MSO-HTML) Exporter for PT. Indonesia Toray Synthetics
 * Generates authentic Microsoft Word documents complete with corporate header,
 * metadata table, KPI metrics, master ledger table, and official signature slots (PIC & Manager).
 */

/**
 * Generate Word HTML for Final PC Ledger
 */
export const generatePcLedgerWordHtml = ({
  devices = [],
  currentMonthRecord = {},
  currentYear = 2026,
  currentMonth = 1,
  monthOptions = [],
  signatures = {}
}) => {
  const activeMonthObj = (monthOptions || []).find(m => m.value === currentMonth) || { label: 'Januari', short: 'Jan' };
  const periodLabel = `${activeMonthObj.label.toUpperCase()} ${currentYear}`;

  // Calculate totals
  let totalOnline = 0;
  let totalOffline = 0;
  const offlineRemarks = [];

  devices.forEach(dev => {
    const record = (currentMonthRecord || {})[dev.id] || {};
    const status = record.status || dev.status || 'Online';
    const isOnline = status === 'Online';

    if (isOnline) {
      totalOnline++;
    } else {
      totalOffline++;
      const remark = record.remark || dev.remark || 'Offline';
      if (remark && !offlineRemarks.includes(remark)) {
        offlineRemarks.push(remark);
      }
    }
  });

  const docNo = signatures.docNo || 'IS-FRM-ITS-PC-Ledger-IS';
  const createdDate = signatures.createdDate || '26 Januari 2026';
  const revision = signatures.revision || '0';
  const picName = signatures.picName || 'Anggit Kurniawan';
  const picTitle = signatures.picTitle || 'PIC / IT Staff';
  const managerName = signatures.managerName || 'Matheus Djoko';
  const managerTitle = signatures.managerTitle || 'IT Manager';

  // Build table rows
  const rowsHtml = devices.map((dev, idx) => {
    const record = (currentMonthRecord || {})[dev.id] || {};
    const status = record.status || dev.status || 'Online';
    const isOnline = status === 'Online';
    const isOffline = !isOnline;
    const remarkText = record.remark || dev.remark || (isOffline ? 'Service' : '-');
    const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';

    return `
      <tr style="background-color: ${rowBg};">
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 6pt; text-align: center; font-size: 8.5pt; font-weight: bold; color: #334155;">
          ${idx + 1}
        </td>
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 6pt; text-align: center; font-size: 8.5pt; font-weight: bold; color: #00255b; background-color: #f1f5f9;">
          ${dev.department || 'IS'}
        </td>
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 6pt; font-size: 8.5pt; font-family: 'Consolas', 'Courier New', monospace; font-weight: bold; color: #00255b;">
          ${dev.computerName || '-'}
        </td>
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 6pt; font-size: 8.5pt; color: #1e293b;">
          ${dev.type || '-'}
        </td>
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 6pt; font-size: 8.5pt; color: #0f172a; font-weight: 500;">
          ${dev.user || '-'}
        </td>
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 6pt; text-align: center; font-size: 9pt; font-weight: bold; ${isOnline ? 'background-color: #ecfdf5; color: #047857;' : 'color: #94a3b8;'}">
          ${isOnline ? '1' : '-'}
        </td>
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 6pt; text-align: center; font-size: 9pt; font-weight: bold; ${isOffline ? 'background-color: #fff1f2; color: #be123c;' : 'color: #94a3b8;'}">
          ${isOffline ? '1' : '-'}
        </td>
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 6pt; font-size: 8.5pt; color: ${isOffline ? '#b91c1c' : '#475569'}; font-weight: ${isOffline ? 'bold' : 'normal'};">
          ${remarkText}
        </td>
      </tr>
    `;
  }).join('');

  return `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Final PC Ledger - PT Indonesia Toray Synthetics</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 841.9pt 595.3pt; /* A4 Landscape (29.7cm x 21cm) */
      mso-page-orientation: landscape;
      margin: 28.35pt 28.35pt 28.35pt 28.35pt; /* 1cm margins */
      mso-header-margin: 18pt;
      mso-footer-margin: 18pt;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: 9pt;
      color: #0f172a;
      line-height: 1.35;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      width: 100%;
    }
    th, td {
      font-family: 'Calibri', 'Arial', sans-serif;
      vertical-align: middle;
    }
    .header-table {
      width: 100%;
      margin-bottom: 10pt;
      border-bottom: 2pt solid #00255b;
      padding-bottom: 6pt;
    }
    .meta-box {
      border: 1pt solid #00255b;
      border-collapse: collapse;
      background-color: #f8fafc;
      width: 210pt;
    }
    .meta-box td {
      padding: 3pt 6pt;
      font-size: 8pt;
      border-bottom: 0.5pt solid #cbd5e1;
    }
    .meta-lbl {
      font-weight: bold;
      color: #334155;
      width: 65pt;
    }
    .meta-val {
      color: #0f172a;
      font-weight: bold;
    }
    .meta-stamp {
      background-color: #00255b;
      color: #ffffff;
      text-align: center;
      font-size: 7.5pt;
      font-weight: bold;
      letter-spacing: 0.8pt;
      padding: 2.5pt !important;
    }
    /* Metric Strip */
    .metric-strip-table {
      width: 100%;
      margin-bottom: 10pt;
    }
    .metric-card {
      padding: 6pt 10pt;
      border-radius: 4pt;
      text-align: center;
      border: 1pt solid #cbd5e1;
    }
    .metric-card.online {
      background-color: #f0fdf4;
      border-color: #86efac;
    }
    .metric-card.offline {
      background-color: #fff1f2;
      border-color: #fca5a5;
    }
    .metric-card.total {
      background-color: #eff6ff;
      border-color: #93c5fd;
    }
    /* Master Table */
    .ledger-master-table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5pt solid #00255b;
      margin-bottom: 12pt;
    }
    .ledger-master-table th {
      background-color: #00255b;
      color: #ffffff;
      font-weight: bold;
      font-size: 8.5pt;
      text-align: center;
      padding: 6pt 4pt;
      border: 0.75pt solid #001a40;
    }
    .tfoot-summary-row td {
      background-color: #f1f5f9;
      font-weight: bold;
      border: 1pt solid #00255b;
      padding: 6pt 4pt;
    }
    /* Signature Box Styling */
    .sig-table {
      width: 100%;
      margin-top: 10pt;
      page-break-inside: avoid;
    }
    .sig-card-table {
      width: 190pt;
      border: 1.25pt solid #00255b;
      border-collapse: collapse;
      background-color: #ffffff;
    }
    .sig-card-header {
      background-color: #00255b;
      color: #ffffff;
      font-weight: bold;
      text-align: center;
      font-size: 9pt;
      padding: 4pt;
      letter-spacing: 0.5pt;
    }
    .sig-card-space {
      height: 60pt;
      text-align: center;
      vertical-align: middle;
      background-color: #fafbfc;
      border-bottom: 1pt dashed #94a3b8;
    }
    .sig-stamp-text {
      display: inline-block;
      border: 1.5pt solid #0284c7;
      color: #0284c7;
      font-size: 8pt;
      font-weight: bold;
      padding: 2pt 8pt;
      letter-spacing: 1.5pt;
      border-radius: 2pt;
    }
    .sig-stamp-approved {
      display: inline-block;
      border: 1.5pt solid #059669;
      color: #059669;
      font-size: 8pt;
      font-weight: bold;
      padding: 2pt 8pt;
      letter-spacing: 1.5pt;
      border-radius: 2pt;
    }
    .sig-card-footer {
      padding: 6pt 8pt;
      text-align: center;
      background-color: #f8fafc;
    }
    .sig-name {
      font-weight: bold;
      font-size: 9pt;
      color: #0f172a;
      text-decoration: underline;
    }
    .sig-role {
      font-size: 8pt;
      color: #64748b;
      margin-top: 2pt;
    }
    .notes-box {
      font-size: 8pt;
      color: #334155;
      line-height: 1.4;
      padding: 6pt 10pt;
      background-color: #f8fafc;
      border-left: 3pt solid #00255b;
      border-top: 0.5pt solid #e2e8f0;
      border-right: 0.5pt solid #e2e8f0;
      border-bottom: 0.5pt solid #e2e8f0;
    }
    .doc-footer-bar {
      margin-top: 14pt;
      padding-top: 6pt;
      border-top: 1pt solid #cbd5e1;
      font-size: 7.5pt;
      color: #64748b;
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="Section1">
    
    <!-- 1. CORPORATE HEADER -->
    <table class="header-table">
      <tr>
        <td style="vertical-align: middle; width: 65%;">
          <div style="font-size: 15pt; font-weight: 800; color: #00255b; letter-spacing: 0.5pt; margin-bottom: 2pt;">
            PT INDONESIA TORAY SYNTHETICS
          </div>
          <div style="font-size: 11pt; font-weight: 700; color: #1e3a8a; margin-bottom: 4pt;">
            INFORMATION SYSTEM DEPARTMENT
          </div>
          <div style="font-size: 9pt; font-weight: 600; color: #475569; letter-spacing: 0.3pt;">
            IT HARDWARE & PC LEDGER MONITORING &bull; ${periodLabel}
          </div>
        </td>
        <td style="vertical-align: top; width: 35%; text-align: right;">
          <table class="meta-box" align="right">
            <tr>
              <td class="meta-lbl">Document No</td>
              <td class="meta-val">${docNo}</td>
            </tr>
            <tr>
              <td class="meta-lbl">Created Date</td>
              <td class="meta-val">${createdDate}</td>
            </tr>
            <tr>
              <td class="meta-lbl">Revision</td>
              <td class="meta-val">${revision}</td>
            </tr>
            <tr>
              <td colspan="2" class="meta-stamp">
                INTERNAL PERUSAHAAN &bull; CONFIDENTIAL
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- 2. EXECUTIVE METRICS STRIP -->
    <table class="metric-strip-table">
      <tr>
        <td style="width: 32%; padding-right: 8pt;">
          <div class="metric-card online">
            <div style="font-size: 14pt; font-weight: 800; color: #047857;">${totalOnline} Unit</div>
            <div style="font-size: 8.5pt; font-weight: 700; color: #065f46;">Total Online</div>
            <div style="font-size: 7.5pt; color: #047857;">Unit Operasional Terkoneksi Normal</div>
          </div>
        </td>
        <td style="width: 32%; padding-right: 8pt; padding-left: 4pt;">
          <div class="metric-card offline">
            <div style="font-size: 14pt; font-weight: 800; color: #be123c;">${totalOffline} Unit</div>
            <div style="font-size: 8.5pt; font-weight: 700; color: #9f1239;">Total Offline</div>
            <div style="font-size: 7.5pt; color: #be123c;">Service / Bengkel / Perbaikan / Out</div>
          </div>
        </td>
        <td style="width: 36%; padding-left: 8pt;">
          <div class="metric-card total">
            <div style="font-size: 14pt; font-weight: 800; color: #1d4ed8;">${devices.length} Unit</div>
            <div style="font-size: 8.5pt; font-weight: 700; color: #1e40af;">Total Asset Terdaftar</div>
            <div style="font-size: 7.5pt; color: #1d4ed8;">Server, Notebook, PC & Peripheral</div>
          </div>
        </td>
      </tr>
    </table>

    <!-- 3. MASTER PC LEDGER TABLE -->
    <table class="ledger-master-table">
      <thead>
        <tr>
          <th style="width: 25pt;">No</th>
          <th style="width: 60pt;">Dept/Section</th>
          <th style="width: 130pt;">Computer Name</th>
          <th style="width: 80pt;">Type</th>
          <th style="width: 140pt;">User / PIC</th>
          <th style="width: 45pt;">Online</th>
          <th style="width: 45pt;">Offline</th>
          <th style="width: 130pt;">Remark / Keterangan</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot>
        <tr class="tfoot-summary-row">
          <td colspan="5" style="text-align: right; font-size: 9pt; padding: 6pt 10pt; color: #00255b; font-weight: 800;">
            TOTAL KESELURUHAN (${devices.length} Perangkat Terdata)
          </td>
          <td style="text-align: center; font-size: 10pt; font-weight: 800; color: #047857; background-color: #d1fae5; border: 1pt solid #00255b;">
            ${totalOnline}
          </td>
          <td style="text-align: center; font-size: 10pt; font-weight: 800; color: #be123c; background-color: #ffe4e6; border: 1pt solid #00255b;">
            ${totalOffline}
          </td>
          <td style="font-size: 8pt; color: #334155; padding: 6pt 8pt; border: 1pt solid #00255b;">
            ${offlineRemarks.length > 0 ? 'Catatan Unit Offline: ' + offlineRemarks.join(', ') : 'Semua unit terhubung normal'}
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- 4. SIGNATURE SECTION & COMPLIANCE NOTES -->
    <table class="sig-table">
      <tr>
        <!-- Left: Compliance Notes -->
        <td style="vertical-align: top; width: 45%; padding-right: 15pt;">
          <div class="notes-box">
            <div style="font-weight: 800; color: #00255b; margin-bottom: 4pt; font-size: 8.5pt;">
              STATUS LEDGER IT & KETENTUAN AUDIT FISIK PT INDONESIA TORAY SYNTHETICS:
            </div>
            <div style="margin-bottom: 2pt;">
              &bull; Rekapitulasi status unit online vs offline diperbarui secara berkala sesuai prosedur audit internal IS.
            </div>
            <div style="margin-bottom: 2pt;">
              &bull; Unit PC/Laptop dengan status <strong>Service / Bengkel</strong> diserahkan ke vendor rekanan resmi disertai tanda terima fisik barang.
            </div>
            <div>
              &bull; Dokumen ini adalah dokumen resmi dan sah setelah diverifikasi oleh PIC dan disetujui oleh IT Manager.
            </div>
          </div>
        </td>

        <!-- Right: Official Signature Slots (PIC & Manager) -->
        <td style="vertical-align: top; width: 55%;">
          <table align="right" style="width: 100%; border-collapse: separate; border-spacing: 12pt 0;">
            <tr>
              <!-- PIC Signature Box -->
              <td style="width: 50%; vertical-align: top;">
                <table class="sig-card-table" align="right">
                  <tr>
                    <td class="sig-card-header">PIC / PREPARED BY</td>
                  </tr>
                  <tr>
                    <td class="sig-card-space">
                      <div class="sig-stamp-text">VERIFIED</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="sig-card-footer">
                      <div class="sig-name">${picName}</div>
                      <div class="sig-role">${picTitle}</div>
                      <div style="font-size: 7.5pt; color: #94a3b8; margin-top: 2pt;">Tgl: ${createdDate}</div>
                    </td>
                  </tr>
                </table>
              </td>

              <!-- Manager Signature Box -->
              <td style="width: 50%; vertical-align: top;">
                <table class="sig-card-table" align="right">
                  <tr>
                    <td class="sig-card-header">MANAGER / APPROVED BY</td>
                  </tr>
                  <tr>
                    <td class="sig-card-space">
                      <div class="sig-stamp-approved">APPROVED</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="sig-card-footer">
                      <div class="sig-name">${managerName}</div>
                      <div class="sig-role">${managerTitle}</div>
                      <div style="font-size: 7.5pt; color: #94a3b8; margin-top: 2pt;">Tgl: ${createdDate}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- 5. FOOTER CONFIDENTIALITY -->
    <table class="doc-footer-bar">
      <tr>
        <td style="text-align: left;">
          PT INDONESIA TORAY SYNTHETICS &bull; INFORMATION SYSTEM DEPARTMENT &bull; DOKUMEN INTERNAL PERUSAHAAN
        </td>
        <td style="text-align: right;">
          Dicetak & Diekspor dari IT Asset Stock Taking & Hardware Ledger System
        </td>
      </tr>
    </table>

  </div>
</body>
</html>
  `.trim();
};

/**
 * Generate Word HTML for Stock Taking Table (6 statuses)
 */
export const generateStockTakingWordHtml = ({
  devices = [],
  currentMonthRecord = {},
  currentYear = 2026,
  currentMonth = 1,
  monthOptions = [],
  statusColumns = [],
  signatures = {}
}) => {
  const activeMonthObj = (monthOptions || []).find(m => m.value === currentMonth) || { label: 'Januari', short: 'Jan' };
  const periodLabel = `${activeMonthObj.label.toUpperCase()} ${currentYear}`;

  const docNo = signatures.docNo || 'IS-FRM-ITS-StockTaking-01';
  const createdDate = signatures.createdDate || '26 Januari 2026';
  const revision = signatures.revision || '0';
  const picName = signatures.picName || 'Anggit Kurniawan';
  const picTitle = signatures.picTitle || 'PIC / IT Staff';
  const managerName = signatures.managerName || 'Matheus Djoko';
  const managerTitle = signatures.managerTitle || 'IT Manager';

  const defaultStatusCols = statusColumns.length > 0 ? statusColumns : [
    { key: 'Online', label: 'Online' },
    { key: 'In', label: 'In' },
    { key: 'Out', label: 'Out' },
    { key: 'Not Used', label: 'Not Used' },
    { key: 'Broken', label: 'Broken' },
    { key: 'Disposal', label: 'Disposal' }
  ];

  // Count totals
  const colTotals = {};
  defaultStatusCols.forEach(c => { colTotals[c.key] = 0; });
  const remarksList = [];

  devices.forEach(dev => {
    const record = (currentMonthRecord || {})[dev.id] || {};
    const status = record.status || dev.status || 'Online';
    if (colTotals[status] !== undefined) colTotals[status]++;
    const remark = record.remark || dev.remark;
    if (remark && !remarksList.includes(remark)) remarksList.push(remark);
  });

  const rowsHtml = devices.map((dev, idx) => {
    const record = (currentMonthRecord || {})[dev.id] || {};
    const status = record.status || dev.status || 'Online';
    const remarkText = record.remark || dev.remark || '-';
    const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';

    const statusTds = defaultStatusCols.map(col => {
      const isMatch = status === col.key;
      return `
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 4pt; text-align: center; font-size: 8.5pt; font-weight: bold; ${isMatch ? 'background-color: #e0f2fe; color: #0284c7;' : 'color: #cbd5e1;'}">
          ${isMatch ? '1' : '-'}
        </td>
      `;
    }).join('');

    return `
      <tr style="background-color: ${rowBg};">
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 5pt; text-align: center; font-size: 8.5pt; font-weight: bold; color: #334155;">
          ${idx + 1}
        </td>
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 5pt; text-align: center; font-size: 8.5pt; font-weight: bold; color: #00255b; background-color: #f1f5f9;">
          ${dev.department || 'IS'}
        </td>
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 5pt; font-size: 8.5pt; font-family: 'Consolas', 'Courier New', monospace; font-weight: bold; color: #00255b;">
          ${dev.computerName || '-'}
        </td>
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 5pt; font-size: 8.5pt; color: #1e293b;">
          ${dev.type || '-'}
        </td>
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 5pt; font-size: 8.5pt; color: #0f172a;">
          ${dev.user || '-'}
        </td>
        ${statusTds}
        <td style="border: 0.5pt solid #94a3b8; padding: 4.5pt 5pt; font-size: 8.5pt; color: #475569;">
          ${remarkText}
        </td>
      </tr>
    `;
  }).join('');

  const statusTfootTds = defaultStatusCols.map(col => `
    <td style="border: 1pt solid #00255b; padding: 6pt 4pt; text-align: center; font-size: 9pt; font-weight: 800; background-color: #e2e8f0; color: #00255b;">
      ${colTotals[col.key] || 0}
    </td>
  `).join('');

  return `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Stock Taking - PT Indonesia Toray Synthetics</title>
  <style>
    @page Section1 {
      size: 841.9pt 595.3pt;
      mso-page-orientation: landscape;
      margin: 28.35pt 28.35pt 28.35pt 28.35pt;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: 9pt;
      color: #0f172a;
      line-height: 1.35;
      background: #ffffff;
    }
    table { border-collapse: collapse; width: 100%; }
    th, td { font-family: 'Calibri', 'Arial', sans-serif; }
  </style>
</head>
<body>
  <div class="Section1">
    <table style="width: 100%; border-bottom: 2pt solid #00255b; margin-bottom: 12pt; padding-bottom: 6pt;">
      <tr>
        <td>
          <div style="font-size: 15pt; font-weight: 800; color: #00255b;">PT INDONESIA TORAY SYNTHETICS</div>
          <div style="font-size: 11pt; font-weight: 700; color: #1e3a8a;">INFORMATION SYSTEM DEPARTMENT</div>
          <div style="font-size: 9pt; font-weight: 600; color: #475569;">FORMULIR AUDIT FISIK STOCK TAKING BULANAN &bull; ${periodLabel}</div>
        </td>
        <td style="text-align: right; vertical-align: top;">
          <table style="border: 1pt solid #00255b; border-collapse: collapse; background-color: #f8fafc; width: 200pt;" align="right">
            <tr><td style="padding: 3pt 6pt; font-size: 8pt; font-weight: bold; border-bottom: 0.5pt solid #cbd5e1;">Doc: ${docNo}</td></tr>
            <tr><td style="padding: 3pt 6pt; font-size: 8pt; font-weight: bold; border-bottom: 0.5pt solid #cbd5e1;">Date: ${createdDate}</td></tr>
            <tr><td style="padding: 3pt 6pt; font-size: 8pt; font-weight: bold; background: #00255b; color: #fff; text-align: center;">INTERNAL PERUSAHAAN</td></tr>
          </table>
        </td>
      </tr>
    </table>

    <table style="width: 100%; border-collapse: collapse; border: 1.5pt solid #00255b; margin-bottom: 14pt;">
      <thead>
        <tr style="background-color: #00255b; color: #ffffff;">
          <th style="padding: 6pt 4pt; border: 0.75pt solid #001a40; font-size: 8.5pt;">No</th>
          <th style="padding: 6pt 4pt; border: 0.75pt solid #001a40; font-size: 8.5pt;">Dept</th>
          <th style="padding: 6pt 4pt; border: 0.75pt solid #001a40; font-size: 8.5pt;">Computer Name</th>
          <th style="padding: 6pt 4pt; border: 0.75pt solid #001a40; font-size: 8.5pt;">Type</th>
          <th style="padding: 6pt 4pt; border: 0.75pt solid #001a40; font-size: 8.5pt;">User</th>
          ${defaultStatusCols.map(c => `<th style="padding: 6pt 4pt; border: 0.75pt solid #001a40; font-size: 8.5pt; width: 38pt;">${c.label}</th>`).join('')}
          <th style="padding: 6pt 4pt; border: 0.75pt solid #001a40; font-size: 8.5pt;">Remark</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot>
        <tr style="background-color: #f1f5f9; font-weight: bold;">
          <td colspan="5" style="border: 1pt solid #00255b; padding: 6pt 8pt; text-align: right; color: #00255b; font-size: 9pt;">
            TOTAL (${devices.length} Perangkat)
          </td>
          ${statusTfootTds}
          <td style="border: 1pt solid #00255b; padding: 6pt 6pt; font-size: 8pt; color: #334155;">
            ${remarksList.join(', ') || 'Normal'}
          </td>
        </tr>
      </tfoot>
    </table>

    <table style="width: 100%; margin-top: 10pt; page-break-inside: avoid;">
      <tr>
        <td style="width: 50%;"></td>
        <td style="width: 50%;">
          <table align="right" style="width: 100%; border-collapse: separate; border-spacing: 12pt 0;">
            <tr>
              <td style="width: 50%;">
                <table style="width: 180pt; border: 1.25pt solid #00255b; border-collapse: collapse;" align="right">
                  <tr><td style="background-color: #00255b; color: #ffffff; text-align: center; font-weight: bold; padding: 4pt; font-size: 9pt;">PIC / AUDITOR</td></tr>
                  <tr><td style="height: 55pt; text-align: center; vertical-align: middle; border-bottom: 1pt dashed #94a3b8;"><span style="border: 1.5pt solid #0284c7; color: #0284c7; padding: 2pt 8pt; font-weight: bold; font-size: 8pt;">VERIFIED</span></td></tr>
                  <tr><td style="padding: 6pt; text-align: center; background-color: #f8fafc;"><div style="font-weight: bold; text-decoration: underline;">${picName}</div><div style="font-size: 8pt; color: #64748b;">${picTitle}</div></td></tr>
                </table>
              </td>
              <td style="width: 50%;">
                <table style="width: 180pt; border: 1.25pt solid #00255b; border-collapse: collapse;" align="right">
                  <tr><td style="background-color: #00255b; color: #ffffff; text-align: center; font-weight: bold; padding: 4pt; font-size: 9pt;">MANAGER / APPROVED</td></tr>
                  <tr><td style="height: 55pt; text-align: center; vertical-align: middle; border-bottom: 1pt dashed #94a3b8;"><span style="border: 1.5pt solid #059669; color: #059669; padding: 2pt 8pt; font-weight: bold; font-size: 8pt;">APPROVED</span></td></tr>
                  <tr><td style="padding: 6pt; text-align: center; background-color: #f8fafc;"><div style="font-weight: bold; text-decoration: underline;">${managerName}</div><div style="font-size: 8pt; color: #64748b;">${managerTitle}</div></td></tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `.trim();
};

/**
 * Trigger client-side download of the PC Ledger Word (.doc) document.
 */
export const downloadPcLedgerWordDoc = (data) => {
  const htmlContent = generatePcLedgerWordHtml(data);
  const activeMonthObj = (data.monthOptions || []).find(m => m.value === data.currentMonth) || { label: 'Januari' };
  const filename = data.filename || `Final_PC_Ledger_PT_Toray_${activeMonthObj.label}_${data.currentYear || 2026}.doc`;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};

/**
 * Trigger client-side download of the Stock Taking Word (.doc) document.
 */
export const downloadStockTakingWordDoc = (data) => {
  const htmlContent = generateStockTakingWordHtml(data);
  const activeMonthObj = (data.monthOptions || []).find(m => m.value === data.currentMonth) || { label: 'Januari' };
  const filename = data.filename || `Stock_Taking_PT_Toray_${activeMonthObj.label}_${data.currentYear || 2026}.doc`;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};
