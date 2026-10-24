/**
 * Code 128 Subset B SVG Barcode Generator
 * Generates crisp, standard vector barcode lines for any ASCII string.
 */

// Code 128 patterns (widths of alternating bars and spaces, 6 digits each)
const CODE128_PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", // 0-9
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", // 10-19
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", // 20-29
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", // 30-39
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", // 40-49
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111", // 50-59
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", // 60-69
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111", // 70-79
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", // 80-89
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141", // 90-99
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112" // 100-106 (106 is STOP)
];

const START_CODE_B = 104;
const STOP_CODE = 106;

export function generateBarcodeBars(text) {
  if (!text) text = "ITS-DEVICE";
  
  const cleanText = text.trim();
  const codes = [START_CODE_B];
  let checksum = START_CODE_B;

  for (let i = 0; i < cleanText.length; i++) {
    const charCode = cleanText.charCodeAt(i);
    // Code 128 subset B mapping: ASCII 32 to 127 is code 0 to 95
    let val = charCode - 32;
    if (val < 0 || val > 95) val = 0; // fallback for unprintable
    codes.push(val);
    checksum += val * (i + 1);
  }

  const checkCode = checksum % 103;
  codes.push(checkCode);
  codes.push(STOP_CODE);

  // Generate modules string (1 = bar, 0 = space)
  const bars = [];
  let currentX = 0;
  const barWidthUnit = 2; // px per unit

  codes.forEach(code => {
    const pattern = CODE128_PATTERNS[code];
    if (!pattern) return;

    let isBar = true;
    for (let j = 0; j < pattern.length; j++) {
      const width = parseInt(pattern[j], 10) * barWidthUnit;
      if (isBar) {
        bars.push({ x: currentX, width });
      }
      currentX += width;
      isBar = !isBar;
    }
  });

  return {
    bars,
    totalWidth: currentX
  };
}
