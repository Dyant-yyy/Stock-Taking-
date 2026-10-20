import React, { useState } from 'react';

/**
 * 3D Isometric Exploded Pie Chart Component
 * Styled 1:1 to Image 2 with:
 * - 3D elliptical isometric perspective
 * - Extruded cylinder side depth with realistic lighting
 * - Exploded slices separation
 * - Direct labels on large slices & callout leader lines for smaller slices
 * - Interactive slice hover & detailed tooltip
 */
export const ThreeDPieChart = ({ data = [], title = '', subtitle = '', height = 340 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) return null;

  const totalValue = data.reduce((acc, curr) => acc + (curr.value || 0), 0);
  if (totalValue <= 0) return null;

  // Pie geometry
  const width = 760;
  const svgHeight = 360;
  const cx = width / 2;
  const cy = 165;
  const rx = 190; // horizontal radius
  const ry = 88;  // vertical radius (gives 3D perspective tilt)
  const depth = 34; // 3D extrusion thickness

  // Compute angles for each slice
  let currentAngle = -Math.PI / 2; // start from top (12 o'clock)
  const slices = data.map((item, idx) => {
    const val = item.value || 0;
    const fraction = val / totalValue;
    const angleSpan = fraction * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSpan;
    const midAngle = (startAngle + endAngle) / 2;
    currentAngle = endAngle;

    const percentage = Number((fraction * 100).toFixed(1));

    // Explode major slices more, minor slices slightly
    const isMajor = fraction >= 0.2;
    const explodeDist = isMajor ? 14 : 6;
    const ox = cx + explodeDist * Math.cos(midAngle);
    const oy = cy + explodeDist * Math.sin(midAngle);

    return {
      ...item,
      idx,
      fraction,
      percentage,
      startAngle,
      endAngle,
      midAngle,
      ox,
      oy,
      isMajor
    };
  });

  // Sort slices for Painter's Algorithm:
  // Slices further back in Y (where sin(midAngle) < 0) are drawn first,
  // slices in front (where sin(midAngle) > 0) are drawn last so overlapping looks authentic.
  const sortedSlices = [...slices].sort((a, b) => {
    const ya = Math.sin(a.midAngle);
    const yb = Math.sin(b.midAngle);
    return ya - yb;
  });

  // Helper to calculate darker shade for 3D extrusion side walls
  const getDarkerShade = (hex, factor = 0.65) => {
    if (!hex || !hex.startsWith('#')) return '#1e293b';
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.floor(r * factor);
    g = Math.floor(g * factor);
    b = Math.floor(b * factor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Helper to create discrete arc points along ellipse
  const getPoint = (ox, oy, radiusX, radiusY, angle, d = 0) => ({
    x: ox + radiusX * Math.cos(angle),
    y: oy + radiusY * Math.sin(angle) + d
  });

  return (
    <div className="three-d-pie-container">
      <svg
        viewBox={`0 0 ${width} ${svgHeight}`}
        className="three-d-pie-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000000" floodOpacity="0.45" />
          </filter>
          <filter id="sliceGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ffffff" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Shadow base ellipse under the whole pie */}
        <ellipse
          cx={cx}
          cy={cy + depth + 10}
          rx={rx * 0.95}
          ry={ry * 0.9}
          fill="rgba(0, 0, 0, 0.4)"
          filter="url(#pieShadow)"
        />

        {/* ------------------------------------------------------------------
            1. RENDER 3D SLICES (PAINTER'S ALGORITHM ORDER)
            ------------------------------------------------------------------ */}
        {sortedSlices.map((slice) => {
          const { ox, oy, startAngle, endAngle, midAngle, color, isMajor, idx } = slice;
          const isHovered = hoveredIdx === idx;
          const darkColor = getDarkerShade(color, 0.62);
          const sideColor = getDarkerShade(color, 0.78);

          // Top Face vertices
          const pStart = getPoint(ox, oy, rx, ry, startAngle);
          const pEnd = getPoint(ox, oy, rx, ry, endAngle);
          const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;

          // Top face path
          const topPath = `
            M ${ox} ${oy}
            L ${pStart.x} ${pStart.y}
            A ${rx} ${ry} 0 ${largeArc} 1 ${pEnd.x} ${pEnd.y}
            Z
          `;

          // Start radial cut wall (visible if facing viewer)
          const pStartDepth = getPoint(ox, oy, rx, ry, startAngle, depth);
          const centerDepth = { x: ox, y: oy + depth };
          const startCutPath = `
            M ${ox} ${oy}
            L ${pStart.x} ${pStart.y}
            L ${pStartDepth.x} ${pStartDepth.y}
            L ${centerDepth.x} ${centerDepth.y}
            Z
          `;
          const isStartCutVisible = Math.sin(startAngle) > 0 || Math.cos(startAngle) < 0;

          // End radial cut wall (visible if facing viewer)
          const pEndDepth = getPoint(ox, oy, rx, ry, endAngle, depth);
          const endCutPath = `
            M ${ox} ${oy}
            L ${pEnd.x} ${pEnd.y}
            L ${pEndDepth.x} ${pEndDepth.y}
            L ${centerDepth.x} ${centerDepth.y}
            Z
          `;
          const isEndCutVisible = Math.sin(endAngle) > 0 || Math.cos(endAngle) > 0;

          // Curved outer wall for the front half of the arc (where angle is in [0, PI])
          // We sample points along the arc to build a smooth 3D extruded wall
          const numSamples = 16;
          const arcPoints = [];
          for (let i = 0; i <= numSamples; i++) {
            const a = startAngle + (endAngle - startAngle) * (i / numSamples);
            // Normalise angle to [-PI, PI] to check if in front semicircle
            const normA = Math.atan2(Math.sin(a), Math.cos(a));
            if (normA >= -0.05 && normA <= Math.PI + 0.05) {
              arcPoints.push({ angle: a, top: getPoint(ox, oy, rx, ry, a), bot: getPoint(ox, oy, rx, ry, a, depth) });
            }
          }

          let outerWallPath = '';
          if (arcPoints.length >= 2) {
            const topStr = arcPoints.map((pt, i) => (i === 0 ? `M ${pt.top.x} ${pt.top.y}` : `L ${pt.top.x} ${pt.top.y}`)).join(' ');
            const botStr = [...arcPoints].reverse().map(pt => `L ${pt.bot.x} ${pt.bot.y}`).join(' ');
            outerWallPath = `${topStr} ${botStr} Z`;
          }

          return (
            <g
              key={slice.id || idx}
              className={`three-d-slice-group ${isHovered ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
            >
              {/* Radial cut walls */}
              {isStartCutVisible && (
                <path
                  d={startCutPath}
                  fill={darkColor}
                  stroke={darkColor}
                  strokeWidth="0.5"
                />
              )}
              {isEndCutVisible && (
                <path
                  d={endCutPath}
                  fill={darkColor}
                  stroke={darkColor}
                  strokeWidth="0.5"
                />
              )}

              {/* Curved outer cylinder wall */}
              {outerWallPath && (
                <path
                  d={outerWallPath}
                  fill={sideColor}
                  stroke={sideColor}
                  strokeWidth="0.5"
                />
              )}

              {/* Top Face */}
              <path
                d={topPath}
                fill={color}
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinejoin="round"
                filter={isHovered ? 'url(#sliceGlow)' : undefined}
                style={{ opacity: isHovered ? 1 : 0.96 }}
              />
            </g>
          );
        })}

        {/* ------------------------------------------------------------------
            2. LEADER LINES AND LABELS (STYLE OF IMAGE 2)
            ------------------------------------------------------------------ */}
        {slices.map((slice) => {
          const { ox, oy, midAngle, isMajor, label, percentage, idx, color } = slice;
          const isHovered = hoveredIdx === idx;

          // Case A: Large slices (like Facebook 39.14, YouTube 25.12 in Image 2)
          // Label is positioned directly ON the slice face!
          if (isMajor) {
            const textDistX = rx * 0.52;
            const textDistY = ry * 0.52;
            const tx = ox + textDistX * Math.cos(midAngle);
            const ty = oy + textDistY * Math.sin(midAngle) + 4;

            return (
              <g key={`label-direct-${idx}`} pointerEvents="none">
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  className="pie-direct-label"
                  fill="#ffffff"
                >
                  <tspan x={tx} dy="0" fontWeight="800" fontSize="13px">
                    {label}, {percentage}%
                  </tspan>
                </text>
              </g>
            );
          }

          // Case B: Minor slices with angled callout leader lines (like Twitter, Reddit, Yelp in Image 2)
          const edgeDistX = rx * 1.02;
          const edgeDistY = ry * 1.02;
          const ax = ox + edgeDistX * Math.cos(midAngle);
          const ay = oy + (edgeDistY + depth * 0.5) * Math.sin(midAngle);

          const isRightSide = Math.cos(midAngle) >= 0;
          const isBottom = Math.sin(midAngle) >= 0;

          // Elbow bend point
          const elbowDistX = isRightSide ? 38 : -38;
          const elbowDistY = isBottom ? 28 : -22;
          const bx = ax + elbowDistX;
          const by = ay + elbowDistY;

          // Horizontal tip point
          const tipX = bx + (isRightSide ? 24 : -24);
          const tipY = by;

          const leaderPath = `M ${ax} ${ay} L ${bx} ${by} L ${tipX} ${tipY}`;

          return (
            <g
              key={`label-callout-${idx}`}
              className={`pie-callout-group ${isHovered ? 'active' : ''}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Anchor dot on slice */}
              <circle cx={ax} cy={ay} r="2.5" fill="#cbd5e1" />

              {/* Angled leader line */}
              <path
                d={leaderPath}
                fill="none"
                stroke={isHovered ? color : '#94a3b8'}
                strokeWidth={isHovered ? '2' : '1.3'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Text label at tip */}
              <text
                x={tipX + (isRightSide ? 6 : -6)}
                y={tipY + 4}
                textAnchor={isRightSide ? 'start' : 'end'}
                className="pie-callout-text"
                fill={isHovered ? '#ffffff' : '#e2e8f0'}
                fontSize="12px"
                fontWeight={isHovered ? '800' : '700'}
              >
                {label}, {percentage}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating active slice badge (Interactive hover detail) */}
      <div className="three-d-pie-legend-strip">
        {data.map((item, i) => {
          const isHovered = hoveredIdx === i;
          const pct = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0;
          return (
            <div
              key={item.id || i}
              className={`pie-legend-chip ${isHovered ? 'active' : ''}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span className="legend-chip-dot" style={{ backgroundColor: item.color }}></span>
              <span className="legend-chip-name">{item.label}</span>
              <strong className="legend-chip-val">{item.value} unit ({pct}%)</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
};
