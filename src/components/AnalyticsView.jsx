import { useState, useMemo } from 'react';
import { AnalyticsIcon, FilterIcon } from './Icons';
import { departments } from '../data/students';

// 10 Distinct, High-Contrast Department Program Colors
export const departmentColors = {
  'Computer Science': '#2563EB',         // Vibrant Blue
  'Information Technology': '#00BFFF',   // Bright Sky Cyan
  'Artificial Intelligence': '#8B5CF6',  // Deep Purple
  'Electronics & Communication': '#F59E0B', // Amber Gold
  'Mechanical Engineering': '#EF4444',   // Bright Red
  'Civil Engineering': '#10B981',        // Emerald Green
  'Electrical Engineering': '#F97316',   // Vivid Orange
  'Data Science': '#EC4899',             // Hot Pink
  'Cybersecurity': '#14B8A6',            // Teal
  'Aerospace Engineering': '#6366F1'     // Indigo
};

function AnalyticsView({ students }) {
  const total = students.length;

  // Selected department filter for scatter chart
  const [scatterDept, setScatterDept] = useState('All');
  const [hoveredBin, setHoveredBin] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Core metrics
  const avgGpa = total > 0 ? (students.reduce((acc, s) => acc + s.gpa, 0) / total).toFixed(2) : '0.00';
  const avgAttendance = total > 0 ? Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / total) : 0;
  const avgCredits = total > 0 ? Math.round(students.reduce((acc, s) => acc + (s.credits || 0), 0) / total) : 0;

  // Grade Honor Tiers
  const deansList = students.filter(s => s.gpa >= 3.8).length;
  const honors = students.filter(s => s.gpa >= 3.4 && s.gpa < 3.8).length;
  const goodStanding = students.filter(s => s.gpa >= 3.0 && s.gpa < 3.4).length;
  const academicNotice = students.filter(s => s.gpa < 3.0).length;

  // 1. ACCURATE HISTOGRAM BINS: Real distribution from 2.60 to 4.00 (No empty bins)
  const histogramBins = useMemo(() => {
    const bins = [
      { label: '2.60–2.79', min: 2.60, max: 2.80, color: '#FF6F61', tier: 'Academic Notice' },
      { label: '2.80–2.99', min: 2.80, max: 3.00, color: '#FFA094', tier: 'Academic Notice' },
      { label: '3.00–3.19', min: 3.00, max: 3.20, color: '#00FFAE', tier: 'Good Standing' },
      { label: '3.20–3.39', min: 3.20, max: 3.40, color: '#00E59D', tier: 'Good Standing' },
      { label: '3.40–3.59', min: 3.40, max: 3.60, color: '#00BFFF', tier: 'Honors Standing' },
      { label: '3.60–3.79', min: 3.60, max: 3.80, color: '#38D39F', tier: 'Honors Standing' },
      { label: '3.80–4.00', min: 3.80, max: 4.01, color: '#FFE600', tier: "Dean's List" }
    ];

    return bins.map(bin => {
      const inBin = students.filter(s => s.gpa >= bin.min && s.gpa < bin.max);
      const count = inBin.length;
      const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
      const binAvgAtt = count > 0 ? Math.round(inBin.reduce((a, b) => a + (b.attendance || 0), 0) / count) : 0;
      return {
        ...bin,
        count,
        pct,
        binAvgAtt
      };
    });
  }, [students, total]);

  const maxHistCount = Math.max(...histogramBins.map(b => b.count), 180);

  // 2. SCATTER PLOT DATA: Sampled across all 10 programs with distinct assigned colors
  const scatterFilteredStudents = useMemo(() => {
    if (scatterDept === 'All') {
      // Pick 10 varied students from each of the 10 departments (100 total) to avoid artificial row stripes
      const sampled = [];
      departments.forEach(dept => {
        const inDept = students.filter(s => s.department === dept);
        for (let i = 0; i < 10; i++) {
          const idx = (i * 9 + 4) % (inDept.length || 1);
          if (inDept[idx]) sampled.push(inDept[idx]);
        }
      });
      return sampled;
    }
    // If a specific department is selected, display all students in that department
    return students.filter(s => s.department === scatterDept);
  }, [students, scatterDept]);

  // Linear Regression Calculation for Scatter Trendline: y = m*x + b
  const trendline = useMemo(() => {
    const pts = scatterFilteredStudents.filter(s => s.attendance && s.gpa);
    const n = pts.length;
    if (n < 2) return null;

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    pts.forEach(p => {
      const x = p.attendance;
      const y = p.gpa;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    const denominator = n * sumXX - sumX * sumX;
    const m = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
    const b = (sumY - m * sumX) / n;

    // Y values at attendance = 70% and attendance = 100%
    const yAt70 = Math.min(4.0, Math.max(2.5, m * 70 + b));
    const yAt100 = Math.min(4.0, Math.max(2.5, m * 100 + b));

    return { m, b, yAt70, yAt100 };
  }, [scatterFilteredStudents]);

  // Coordinates mapper: X from 70% to 100%, Y from 2.50 to 4.00
  // SVG Area: X from 80 to 840 (width 760), Y from 70 to 430 (height 360)
  const mapScatterCoords = (attendance, gpa) => {
    const clampedAtt = Math.max(70, Math.min(100, attendance || 85));
    const clampedGpa = Math.max(2.50, Math.min(4.00, gpa || 3.33));
    const x = 80 + ((clampedAtt - 70) / 30) * 760;
    const y = 430 - ((clampedGpa - 2.50) / 1.50) * 360;
    return { x, y };
  };

  // 3. DEPARTMENT COMPARATIVE STATS
  const deptStats = useMemo(() => {
    return departments.map(d => {
      const deptStudents = students.filter(s => s.department === d);
      const count = deptStudents.length;
      const deptAvgGpa = count > 0 ? (deptStudents.reduce((a, s) => a + s.gpa, 0) / count).toFixed(2) : '0.00';
      const deptAvgAtt = count > 0 ? Math.round(deptStudents.reduce((a, s) => a + (s.attendance || 0), 0) / count) : 0;
      const deansCount = deptStudents.filter(s => s.gpa >= 3.8).length;
      return {
        name: d,
        count,
        avgGpa: deptAvgGpa,
        avgAtt: deptAvgAtt,
        deansCount,
        color: departmentColors[d] || '#2563EB',
        pct: total > 0 ? ((count / total) * 100).toFixed(1) : 0
      };
    }).sort((a, b) => parseFloat(b.avgGpa) - parseFloat(a.avgGpa));
  }, [students, total]);

  // 4. CREDITS PROGRESSION TIERS
  const creditTiers = useMemo(() => {
    const freshman = students.filter(s => (s.credits || 0) < 30).length;
    const sophomore = students.filter(s => (s.credits || 0) >= 30 && (s.credits || 0) < 60).length;
    const junior = students.filter(s => (s.credits || 0) >= 60 && (s.credits || 0) < 90).length;
    const senior = students.filter(s => (s.credits || 0) >= 90).length;
    return [
      { label: 'Freshman Standing (0–29 Credits)', count: freshman, pct: total > 0 ? ((freshman / total) * 100).toFixed(1) : 0, color: '#00BFFF' },
      { label: 'Sophomore Standing (30–59 Credits)', count: sophomore, pct: total > 0 ? ((sophomore / total) * 100).toFixed(1) : 0, color: '#00FFAE' },
      { label: 'Junior Standing (60–89 Credits)', count: junior, pct: total > 0 ? ((junior / total) * 100).toFixed(1) : 0, color: '#FFE600' },
      { label: 'Senior Standing (90+ Credits)', count: senior, pct: total > 0 ? ((senior / total) * 100).toFixed(1) : 0, color: '#FF70A6' }
    ];
  }, [students, total]);

  return (
    <div className="analytics-view-wrapper" id="analytics-view">
      {/* Header Banner */}
      <div className="analytics-header-banner">
        <div className="analytics-header-title-group">
          <div className="analytics-icon-badge">
            <AnalyticsIcon size={26} />
          </div>
          <div>
            <h1 className="analytics-main-title">Institutional Academic Analytics &amp; Statistical Charts</h1>
            <p className="analytics-main-subtitle">
              Cumulative GPA distribution histogram, attendance correlation scatter plot with program color-coding, and department benchmarks.
            </p>
          </div>
        </div>
        <div className="analytics-header-pills">
          <span className="analytics-pill-tag">10 Dedicated Program Colors</span>
          <span className="analytics-pill-tag pill-gold">Live Math Engine</span>
        </div>
      </div>

      {/* Top 4 Summary KPI Cards */}
      <div className="analytics-summary-cards">
        <div className="summary-stat-box accent-cyan">
          <span className="summary-stat-label">Institution Mean GPA</span>
          <span className="summary-stat-val">{avgGpa} / 4.0</span>
          <span className="summary-stat-sub">Across {total} verified scholars</span>
        </div>
        <div className="summary-stat-box accent-emerald">
          <span className="summary-stat-label">Mean Attendance Rate</span>
          <span className="summary-stat-val">{avgAttendance}%</span>
          <span className="summary-stat-sub">{students.filter(s => s.attendance >= 90).length} scholars above 90%</span>
        </div>
        <div className="summary-stat-box accent-amber">
          <span className="summary-stat-label">Dean's List Scholars</span>
          <span className="summary-stat-val">{deansList} Students</span>
          <span className="summary-stat-sub">{((deansList / (total || 1)) * 100).toFixed(1)}% of total enrollment</span>
        </div>
        <div className="summary-stat-box accent-rose">
          <span className="summary-stat-label">Honors Tier Standing</span>
          <span className="summary-stat-val">{honors} Students</span>
          <span className="summary-stat-sub">Cumulative GPA 3.40 – 3.79</span>
        </div>
      </div>

      {/* SECTION 1: SPACIOUS ACCURATE GPA HISTOGRAM */}
      <div className="analytics-card-tile full-width" id="histogram-section">
        <div className="chart-header-row">
          <div>
            <div className="chart-tag-badge tag-amber">Accurate Distribution</div>
            <h2 className="analytics-tile-title">Cumulative GPA Frequency Histogram</h2>
            <p className="analytics-tile-desc">
              Accurate distribution of 1,000 scholars binned in 0.20 GPA increments (2.60 to 4.00). Hover bars to inspect exact metrics.
            </p>
          </div>
          <div className="chart-legend-row">
            <span className="legend-chip"><span className="chip-dot dot-rose"></span> Notice (&lt;3.00)</span>
            <span className="legend-chip"><span className="chip-dot dot-emerald"></span> Good Standing (3.00–3.39)</span>
            <span className="legend-chip"><span className="chip-dot dot-cyan"></span> Honors (3.40–3.79)</span>
            <span className="legend-chip"><span className="chip-dot dot-amber"></span> Dean's List (≥3.80)</span>
          </div>
        </div>

        {/* SVG Histogram Graphic (Spacious 800x320) */}
        <div className="histogram-svg-container">
          <svg viewBox="0 0 800 320" className="interactive-chart-svg" preserveAspectRatio="none">
            {/* Gridlines */}
            {[0, 50, 100, 150, 200].map((val) => {
              const y = 260 - (val / 200) * 200;
              return (
                <g key={val}>
                  <line x1="60" y1={y} x2="770" y2={y} stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="50" y={y + 4} textAnchor="end" fontSize="12" fontWeight="800" fill="#4B5563">{val}</text>
                </g>
              );
            })}

            {/* X-Axis Baseline */}
            <line x1="60" y1="260" x2="770" y2="260" stroke="#1B1B1B" strokeWidth="2.5" />

            {/* Histogram Bars (7 spacious bars) */}
            {histogramBins.map((bin, idx) => {
              const barWidth = 78;
              const gap = 22;
              const x = 75 + idx * (barWidth + gap);
              const barHeight = (bin.count / 200) * 200;
              const y = 260 - barHeight;
              const isHovered = hoveredBin === idx;

              return (
                <g
                  key={idx}
                  className="histogram-bar-group"
                  onMouseEnter={() => setHoveredBin(idx)}
                  onMouseLeave={() => setHoveredBin(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* The Bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={bin.color}
                    stroke="#1B1B1B"
                    strokeWidth={isHovered ? "3.5" : "2.5"}
                    rx="6"
                    style={{
                      filter: isHovered ? 'drop-shadow(4px 4px 0px #1B1B1B)' : 'drop-shadow(2px 2px 0px #1B1B1B)',
                      transition: 'all 0.15s ease'
                    }}
                  />

                  {/* Top Bar Value Count */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="900"
                    fill="#1B1B1B"
                  >
                    {bin.count}
                  </text>

                  {/* X-Axis Label */}
                  <text
                    x={x + barWidth / 2}
                    y="280"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="800"
                    fill="#1B1B1B"
                  >
                    {bin.label}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y="296"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="#6B7280"
                  >
                    ({bin.pct}%)
                  </text>
                </g>
              );
            })}

            {/* Mean Reference Marker */}
            <line x1="435" y1="50" x2="435" y2="260" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="6 4" />
            <rect x="365" y="28" width="140" height="22" rx="5" fill="#2563EB" stroke="#1B1B1B" strokeWidth="1.5" />
            <text x="435" y="43" textAnchor="middle" fontSize="10" fontWeight="900" fill="#FFFFFF">
              Mean GPA: {avgGpa}
            </text>
          </svg>

          {/* Interactive Tooltip Card */}
          {hoveredBin !== null && (
            <div className="histogram-hover-tooltip-card">
              <div className="tooltip-badge-row">
                <span className="tooltip-bin-tag" style={{ background: histogramBins[hoveredBin].color }}>
                  {histogramBins[hoveredBin].tier}
                </span>
                <span className="tooltip-range-text">Range: {histogramBins[hoveredBin].label}</span>
              </div>
              <div className="tooltip-stat-grid">
                <div>
                  <span className="tooltip-lbl">Total Students:</span>
                  <strong className="tooltip-val">{histogramBins[hoveredBin].count}</strong>
                </div>
                <div>
                  <span className="tooltip-lbl">Percent of Registry:</span>
                  <strong className="tooltip-val">{histogramBins[hoveredBin].pct}%</strong>
                </div>
                <div>
                  <span className="tooltip-lbl">Mean Attendance:</span>
                  <strong className="tooltip-val">{histogramBins[hoveredBin].binAvgAtt}%</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: BIGGER, UNCONGESTED SCATTER PLOT WITH PROGRAM COLOR ALLOCATION */}
      <div className="analytics-card-tile full-width" id="scatter-section">
        <div className="chart-header-row">
          <div>
            <div className="chart-tag-badge tag-cyan">Department Program Colors</div>
            <h2 className="analytics-tile-title">Attendance Rate vs. Cumulative GPA Scatter Plot</h2>
            <p className="analytics-tile-desc">
              Each academic program is allocated a designated unique color. High-resolution canvas with prominent quadrant markers and regression trendline.
            </p>
          </div>

          {/* Filter Dropdown for Scatter Plot */}
          <div className="scatter-filter-controls">
            <label htmlFor="scatter-dept-select" className="scatter-select-label">
              <FilterIcon size={14} />
              <span>Program Filter:</span>
            </label>
            <select
              id="scatter-dept-select"
              value={scatterDept}
              onChange={(e) => setScatterDept(e.target.value)}
              className="scatter-dept-dropdown"
            >
              <option value="All">All 10 Programs (Balanced Multi-Color View)</option>
              {departments.map(d => (
                <option key={d} value={d}>{d} Only</option>
              ))}
            </select>
          </div>
        </div>

        {/* 10 Department Color Legend Bar */}
        <div className="program-color-legend-bar">
          <span className="legend-lead-label">Program Allocation:</span>
          <div className="program-legend-pills">
            {departments.map(dept => {
              const color = departmentColors[dept] || '#2563EB';
              const isSelected = scatterDept === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  className={`program-legend-chip ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setScatterDept(isSelected ? 'All' : dept)}
                  title={`Click to filter by ${dept}`}
                  style={{
                    borderColor: isSelected ? '#1B1B1B' : '#D1D5DB',
                    background: isSelected ? '#FFFFFF' : '#F9FAFB'
                  }}
                >
                  <span className="prog-dot" style={{ backgroundColor: color }}></span>
                  <span className="prog-name">{dept}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scatter Plot SVG Container (BIGGER 900x520 CANVAS) */}
        <div className="scatter-svg-wrapper">
          <svg viewBox="0 0 900 520" className="interactive-chart-svg">
            {/* Top-Right Quadrant Background: High Achievers */}
            <rect x="536" y="65" width="304" height="161" fill="#00FFAE" fillOpacity="0.08" rx="10" />

            {/* PROMINENT TOP-RIGHT BADGE: Raised high so it is fully visible and not cut off */}
            <rect x="520" y="16" width="320" height="30" rx="8" fill="#E8FFF5" stroke="#059669" strokeWidth="2" />
            <text x="680" y="36" textAnchor="middle" fontSize="11" fontWeight="900" fill="#059669" letterSpacing="0.4">
              HIGH ACHIEVERS (Att ≥88%, GPA ≥3.35)
            </text>

            {/* Top-Left Quadrant Background: Autonomous Scholars */}
            <rect x="80" y="65" width="456" height="161" fill="#00BFFF" fillOpacity="0.06" rx="10" />

            {/* PROMINENT TOP-LEFT BADGE: Raised high so it is fully visible */}
            <rect x="80" y="16" width="340" height="30" rx="8" fill="#EBF8FF" stroke="#2563EB" strokeWidth="2" />
            <text x="250" y="36" textAnchor="middle" fontSize="11" fontWeight="900" fill="#2563EB" letterSpacing="0.4">
              AUTONOMOUS SCHOLARS (Att &lt;88%, GPA ≥3.35)
            </text>

            {/* Bottom-Left Quadrant Background: Academic Support Zone */}
            <rect x="80" y="226" width="456" height="204" fill="#FF6F61" fillOpacity="0.07" rx="10" />
            <text x="95" y="455" fontSize="11" fontWeight="900" fill="#DC2626" letterSpacing="0.4">
              ACADEMIC SUPPORT ZONE (Att &lt;88%, GPA &lt;3.35)
            </text>

            {/* Bottom-Right Quadrant Background: Dedicated Effort */}
            <rect x="536" y="226" width="304" height="204" fill="#FFE600" fillOpacity="0.06" rx="10" />
            <text x="830" y="455" textAnchor="end" fontSize="11" fontWeight="900" fill="#B45309" letterSpacing="0.4">
              DEDICATED EFFORT (Att ≥88%, GPA &lt;3.35)
            </text>

            {/* Quadrant Dividing Lines (Actual Means: 88% and 3.35) */}
            <line x1="536" y1="55" x2="536" y2="430" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="5 5" />
            <text x="542" y="445" fontSize="10" fontWeight="900" fill="#374151">Mean Att (88%)</text>

            <line x1="80" y1="226" x2="840" y2="226" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="5 5" />
            <text x="40" y="230" fontSize="11" fontWeight="900" fill="#374151">3.35</text>

            {/* Horizontal Gridlines & Y-Axis Ticks (2.50 to 4.00) */}
            {[2.50, 2.75, 3.00, 3.25, 3.50, 3.75, 4.00].map((val) => {
              const y = 430 - ((val - 2.50) / 1.50) * 360;
              return (
                <g key={val}>
                  <line x1="75" y1={y} x2="840" y2={y} stroke="#E5E7EB" strokeWidth="1" />
                  <text x="68" y={y + 4} textAnchor="end" fontSize="11" fontWeight="800" fill="#4B5563">{val.toFixed(2)}</text>
                </g>
              );
            })}

            {/* Vertical Gridlines & X-Axis Ticks (70% to 100%) */}
            {[70, 75, 80, 85, 90, 95, 100].map((val) => {
              const x = 80 + ((val - 70) / 30) * 760;
              return (
                <g key={val}>
                  <line x1={x} y1="55" x2={x} y2="435" stroke="#E5E7EB" strokeWidth="1" />
                  <text x={x} y="452" textAnchor="middle" fontSize="11" fontWeight="800" fill="#4B5563">{val}%</text>
                </g>
              );
            })}

            {/* Axis Labels */}
            <text x="460" y="485" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1B1B1B">
              STUDENT ATTENDANCE RATE (%)
            </text>
            <text
              transform="rotate(-90)"
              x="-245"
              y="22"
              textAnchor="middle"
              fontSize="13"
              fontWeight="900"
              fill="#1B1B1B"
            >
              CUMULATIVE GPA (2.50 – 4.00)
            </text>

            {/* Accurate Linear Regression Trendline */}
            {trendline && (
              <g>
                <line
                  x1="80"
                  y1={430 - ((trendline.yAt70 - 2.50) / 1.50) * 360}
                  x2="840"
                  y2={430 - ((trendline.yAt100 - 2.50) / 1.50) * 360}
                  stroke="#7C3AED"
                  strokeWidth="3.5"
                  strokeDasharray="8 5"
                />
              </g>
            )}

            {/* Scatter Points Colored by Program */}
            {scatterFilteredStudents.map((student) => {
              const { x, y } = mapScatterCoords(student.attendance, student.gpa);
              const isSelected = hoveredPoint && hoveredPoint.id === student.id;

              // Color node based on Allocated Department Color
              const pointColor = departmentColors[student.department] || '#2563EB';

              return (
                <circle
                  key={student.id}
                  cx={x}
                  cy={y}
                  r={isSelected ? "9" : "6"}
                  fill={pointColor}
                  stroke="#1B1B1B"
                  strokeWidth={isSelected ? "3" : "2"}
                  style={{
                    cursor: 'pointer',
                    filter: isSelected ? 'drop-shadow(3px 3px 0px #1B1B1B)' : 'drop-shadow(1px 1px 0px rgba(0,0,0,0.4))',
                    transition: 'r 0.15s ease'
                  }}
                  onMouseEnter={() => setHoveredPoint(student)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })}
          </svg>

          {/* Scatter Hover Detail Card */}
          {hoveredPoint && (
            <div className="scatter-hover-detail-card" id="scatter-hover-card">
              <div className="detail-card-header">
                <img
                  src={hoveredPoint.avatar}
                  alt={hoveredPoint.name}
                  className="detail-avatar-thumb"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="detail-identity-wrap">
                  <h4 className="detail-student-name">{hoveredPoint.name}</h4>
                  <div className="detail-dept-badge-row">
                    <span
                      className="dept-color-indicator-dot"
                      style={{ backgroundColor: departmentColors[hoveredPoint.department] || '#2563EB' }}
                    ></span>
                    <span className="detail-student-id">{hoveredPoint.department}</span>
                  </div>
                </div>
              </div>
              <div className="detail-metrics-row">
                <div className="detail-metric-chip">
                  <span>GPA:</span>
                  <strong>{Number(hoveredPoint.gpa).toFixed(2)}</strong>
                </div>
                <div className="detail-metric-chip">
                  <span>Attendance:</span>
                  <strong>{hoveredPoint.attendance || 0}%</strong>
                </div>
                <div className="detail-metric-chip">
                  <span>ID:</span>
                  <strong>{hoveredPoint.studentId}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: TWO-COLUMN BENCHMARKS (DEPARTMENT MATRIX & CREDITS PROGRESSION) */}
      <div className="analytics-sections-grid">
        {/* Department Comparative Matrix */}
        <div className="analytics-card-tile">
          <div className="chart-header-row">
            <div>
              <div className="chart-tag-badge tag-pink">Program Rankings</div>
              <h2 className="analytics-tile-title">Academic Department Benchmark Matrix</h2>
              <p className="analytics-tile-desc">Enrollment volume &amp; mean GPA ranked across all 10 programs</p>
            </div>
          </div>

          <div className="dept-benchmark-list">
            {deptStats.map((dept, index) => (
              <div key={dept.name} className="dept-benchmark-row">
                <div className="dept-benchmark-info">
                  <div className="dept-info-left">
                    <span className="dept-rank-pill" style={{ backgroundColor: dept.color }}>#{index + 1}</span>
                    <span className="dept-title-text">{dept.name}</span>
                  </div>
                  <div className="dept-info-right">
                    <span className="dept-gpa-stat">{dept.avgGpa} GPA</span>
                    <span className="dept-count-sub">({dept.count} enrolled)</span>
                  </div>
                </div>

                <div className="dept-double-bars">
                  {/* Enrollment Volume Bar */}
                  <div className="dual-track track-vol" title={`Enrollment: ${dept.count} students`}>
                    <div
                      className="dual-fill fill-blue"
                      style={{ width: `${(dept.count / 120) * 100}%` }}
                    ></div>
                  </div>
                  {/* GPA Performance Bar */}
                  <div className="dual-track track-gpa" title={`Mean GPA: ${dept.avgGpa}`}>
                    <div
                      className="dual-fill fill-emerald"
                      style={{ width: `${(parseFloat(dept.avgGpa) / 4.0) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Progression Velocity & Credits Tiers */}
        <div className="analytics-card-tile">
          <div className="chart-header-row">
            <div>
              <div className="chart-tag-badge tag-yellow">Degree Progression</div>
              <h2 className="analytics-tile-title">Credits Progression Velocity</h2>
              <p className="analytics-tile-desc">Academic class standing distribution from Freshman to Senior</p>
            </div>
          </div>

          <div className="credits-progression-cards">
            {creditTiers.map((tier, idx) => (
              <div key={idx} className="credit-tier-card-box">
                <div className="credit-tier-header">
                  <span className="credit-tier-name">{tier.label}</span>
                  <span className="credit-tier-count-badge" style={{ background: tier.color }}>
                    {tier.count} Students ({tier.pct}%)
                  </span>
                </div>
                <div className="credit-bar-track">
                  <div
                    className="credit-bar-fill"
                    style={{ width: `${tier.pct}%`, background: tier.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Academic Standing Retention Breakdown */}
          <div className="standing-status-box">
            <h3 className="standing-status-title">Institutional Standing Distribution</h3>
            <div className="standing-status-pills-row">
              <div className="status-indicator-pill">
                <span className="indicator-dot dot-green"></span>
                <span>Active: <strong>{students.filter(s => s.status === 'Active').length}</strong></span>
              </div>
              <div className="status-indicator-pill">
                <span className="indicator-dot dot-amber"></span>
                <span>On Leave: <strong>{students.filter(s => s.status === 'On Leave').length}</strong></span>
              </div>
              <div className="status-indicator-pill">
                <span className="indicator-dot dot-red"></span>
                <span>Probation: <strong>{students.filter(s => s.status === 'Academic Probation' || s.status === 'Probation').length}</strong></span>
              </div>
              <div className="status-indicator-pill">
                <span className="indicator-dot dot-blue"></span>
                <span>Graduated: <strong>{students.filter(s => s.status === 'Graduated').length}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsView;
