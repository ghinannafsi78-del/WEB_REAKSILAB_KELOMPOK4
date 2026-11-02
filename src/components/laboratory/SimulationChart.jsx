import './SimulationChart.css';

/**
 * SimulationChart.jsx
 * Grafik Real-Time Kurva Perubahan Reaktan [A], [B], dan Produk [AB] terhadap Waktu
 * Sesuai spesifikasi PRD Bab 8.7, 9.3 & AGENT.md Bab 5.6
 */
export default function SimulationChart({
  timeSeries = [],
  maxDuration = 30,
}) {
  // Jika belum ada data series
  const data =
    timeSeries && timeSeries.length > 0
      ? timeSeries
      : [{ time: 0, countA: 0, countB: 0, productCount: 0, rate: 0 }];

  // Dimensi visual SVG responsif
  const svgWidth = 560;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Nilai maksimum untuk skala sumbu Y (partikel)
  const maxParticles = Math.max(
    10,
    ...data.map((d) => Math.max(d.countA || 0, d.countB || 0, d.productCount || 0, 15))
  );

  // Waktu maksimum pada sumbu X
  const maxX = Math.max(maxDuration, ...data.map((d) => d.time || 0), 10);

  // Koordinat pemetaan fungsi
  const getX = (t) => padding.left + (t / maxX) * plotWidth;
  const getY = (val) => padding.top + plotHeight - (val / maxParticles) * plotHeight;

  // Path string untuk Partikel A (Cyan)
  const pathA = data.reduce((acc, pt, idx) => {
    const x = getX(pt.time || 0);
    const y = getY(pt.countA || 0);
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }, '');

  // Path string untuk Partikel B (Amber)
  const pathB = data.reduce((acc, pt, idx) => {
    const x = getX(pt.time || 0);
    const y = getY(pt.countB || 0);
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }, '');

  // Path string untuk Partikel Produk [AB] (Emerald)
  const pathProduct = data.reduce((acc, pt, idx) => {
    const x = getX(pt.time || 0);
    const y = getY(pt.productCount || 0);
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }, '');

  // Grid baris horizontal (4 tingkat)
  const yTicks = [0, 0.33, 0.66, 1].map((ratio) => {
    const val = Math.round(maxParticles * ratio);
    const y = getY(val);
    return { val, y };
  });

  // Grid kolom vertikal (waktu)
  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const t = Math.round(maxX * ratio);
    const x = getX(t);
    return { t, x };
  });

  const latest = data[data.length - 1];

  return (
    <div className="simulation-chart-wrapper" aria-label="Grafik Real-Time Perubahan Partikel Terhadap Waktu">
      <div className="chart-header">
        <div className="chart-title-group">
          <h4 className="chart-main-title">Grafik Kinetika Reaksi Model: Partikel vs Waktu</h4>
          <span className="chart-subtitle">
            Memetakan laju berkurangnya reaktan [A], [B] dan pembentukan produk [AB] secara real-time
          </span>
        </div>
        <div className="chart-legend-badge">
          <div className="legend-chip legend-a">
            <span className="legend-line line-a" />
            <span>[A]: <strong>{latest.countA || 0}</strong></span>
          </div>
          <div className="legend-chip legend-b">
            <span className="legend-line line-b" />
            <span>[B]: <strong>{latest.countB || 0}</strong></span>
          </div>
          <div className="legend-chip legend-product">
            <span className="legend-line line-product" />
            <span>[AB]: <strong>{latest.productCount || 0}</strong></span>
          </div>
        </div>
      </div>

      <div className="svg-container">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="kinetic-svg"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Grafik kinetika laju reaksi: ${data.length} titik sampel data tercatat.`}
        >
          {/* Grid Horizontal & Label Sumbu Y */}
          {yTicks.map((tick, i) => (
            <g key={`y-${i}`}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={svgWidth - padding.right}
                y2={tick.y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray={i === 0 ? 'none' : '3,3'}
              />
              <text
                x={padding.left - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="axis-label"
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* Grid Vertikal & Label Sumbu X */}
          {xTicks.map((tick, i) => (
            <g key={`x-${i}`}>
              <line
                x1={tick.x}
                y1={padding.top}
                x2={tick.x}
                y2={svgHeight - padding.bottom}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray={i === 0 ? 'none' : '3,3'}
              />
              <text
                x={tick.x}
                y={svgHeight - padding.bottom + 18}
                textAnchor="middle"
                className="axis-label"
              >
                {tick.t}s
              </text>
            </g>
          ))}

          {/* Sumbu X & Y Utama */}
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={svgWidth - padding.right}
            y2={padding.top + plotHeight}
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + plotHeight}
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
          />

          {/* Label Sumbu Vertikal (Y) */}
          <text
            x={-svgHeight / 2}
            y={14}
            transform="rotate(-90)"
            textAnchor="middle"
            className="axis-title"
          >
            Jumlah Partikel (Model)
          </text>

          {/* Label Sumbu Horizontal (X) */}
          <text
            x={padding.left + plotWidth / 2}
            y={svgHeight - 6}
            textAnchor="middle"
            className="axis-title"
          >
            Waktu Simulasi (detik)
          </text>

          {/* Kurva Reaktan A (Cyan) */}
          {pathA && (
            <path
              d={pathA}
              fill="none"
              stroke="#00e5ff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="line-a-path"
            />
          )}

          {/* Kurva Reaktan B (Amber) */}
          {pathB && (
            <path
              d={pathB}
              fill="none"
              stroke="#ff9100"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="line-b-path"
            />
          )}

          {/* Kurva Produk AB (Emerald) */}
          {pathProduct && (
            <path
              d={pathProduct}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="line-products-path"
            />
          )}

          {/* Titik Akhir Terkini */}
          {latest && (
            <>
              <circle
                cx={getX(latest.time || 0)}
                cy={getY(latest.countA || 0)}
                r="4"
                fill="#00e5ff"
                stroke="#fff"
                strokeWidth="1.5"
              />
              <circle
                cx={getX(latest.time || 0)}
                cy={getY(latest.countB || 0)}
                r="4"
                fill="#ff9100"
                stroke="#fff"
                strokeWidth="1.5"
              />
              <circle
                cx={getX(latest.time || 0)}
                cy={getY(latest.productCount || 0)}
                r="4.5"
                fill="#10b981"
                stroke="#fff"
                strokeWidth="1.5"
              />
            </>
          )}
        </svg>
      </div>

      <div className="chart-accessibility-note">
        <span className="note-dot" />
        <span className="note-desc">
          Kurva menunjukkan penurunan partikel reaktan [A] & [B] seiring waktu yang dikonversi menjadi partikel produk [AB] melalui tumbukan efektif.
        </span>
      </div>
    </div>
  );
}
