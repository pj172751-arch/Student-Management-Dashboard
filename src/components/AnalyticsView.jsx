import { AnalyticsIcon, AwardIcon, UsersIcon, CheckCircleIcon } from './Icons';
import { departments } from '../data/students';

function AnalyticsView({ students }) {
  const total = students.length;
  
  // GPA Tiers
  const deansList = students.filter(s => s.gpa >= 3.8).length;
  const honors = students.filter(s => s.gpa >= 3.5 && s.gpa < 3.8).length;
  const goodStanding = students.filter(s => s.gpa >= 3.0 && s.gpa < 3.5).length;
  const academicNotice = students.filter(s => s.gpa < 3.0).length;

  // Attendance Tiers
  const highAttendance = students.filter(s => s.attendance >= 90).length;
  const midAttendance = students.filter(s => s.attendance >= 80 && s.attendance < 90).length;
  const lowAttendance = students.filter(s => s.attendance < 80).length;

  // Department Distribution
  const deptDist = departments.map(d => ({
    name: d,
    count: students.filter(s => s.department === d).length,
    pct: total > 0 ? ((students.filter(s => s.department === d).length / total) * 100).toFixed(1) : 0
  }));

  const avgGpa = total > 0 ? (students.reduce((acc, s) => acc + s.gpa, 0) / total).toFixed(2) : '0.00';
  const avgAttendance = total > 0 ? Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / total) : 0;
  const avgCredits = total > 0 ? Math.round(students.reduce((acc, s) => acc + (s.credits || 0), 0) / total) : 0;

  return (
    <div className="analytics-view-wrapper" id="analytics-view">
      {/* Header Banner */}
      <div className="analytics-header-banner">
        <div className="analytics-header-title-group">
          <div className="analytics-icon-badge">
            <AnalyticsIcon size={24} />
          </div>
          <div>
            <h1 className="analytics-main-title">Institutional Academic Analytics</h1>
            <p className="analytics-main-subtitle">
              Cumulative statistical trends, performance tiers, attendance correlation, and department volume.
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="analytics-summary-cards">
        <div className="summary-stat-box accent-cyan">
          <span className="summary-stat-label">Institution Mean GPA</span>
          <span className="summary-stat-val">{avgGpa} / 4.0</span>
          <span className="summary-stat-sub">Across {total} verified records</span>
        </div>
        <div className="summary-stat-box accent-emerald">
          <span className="summary-stat-label">Mean Attendance</span>
          <span className="summary-stat-val">{avgAttendance}%</span>
          <span className="summary-stat-sub">{highAttendance} students above 90%</span>
        </div>
        <div className="summary-stat-box accent-amber">
          <span className="summary-stat-label">Mean Earned Credits</span>
          <span className="summary-stat-val">{avgCredits} Credits</span>
          <span className="summary-stat-sub">{deansList} students on Dean's List</span>
        </div>
      </div>

      <div className="analytics-sections-grid">
        {/* GPA Tiers Distribution */}
        <div className="analytics-card-tile">
          <h2 className="analytics-tile-title">Cumulative GPA Distribution</h2>
          <p className="analytics-tile-desc">Academic standing categorized by university honor tiers</p>

          <div className="dist-bar-list">
            <div className="dist-bar-row">
              <div className="dist-bar-info">
                <span>Dean's List (3.80 – 4.00)</span>
                <strong>{deansList} ({((deansList / total) * 100).toFixed(1)}%)</strong>
              </div>
              <div className="dist-bar-track">
                <div className="dist-bar-fill fill-amber" style={{ width: `${(deansList / total) * 100}%` }}></div>
              </div>
            </div>

            <div className="dist-bar-row">
              <div className="dist-bar-info">
                <span>Honors Standing (3.50 – 3.79)</span>
                <strong>{honors} ({((honors / total) * 100).toFixed(1)}%)</strong>
              </div>
              <div className="dist-bar-track">
                <div className="dist-bar-fill fill-cyan" style={{ width: `${(honors / total) * 100}%` }}></div>
              </div>
            </div>

            <div className="dist-bar-row">
              <div className="dist-bar-info">
                <span>Good Standing (3.00 – 3.49)</span>
                <strong>{goodStanding} ({((goodStanding / total) * 100).toFixed(1)}%)</strong>
              </div>
              <div className="dist-bar-track">
                <div className="dist-bar-fill fill-emerald" style={{ width: `${(goodStanding / total) * 100}%` }}></div>
              </div>
            </div>

            <div className="dist-bar-row">
              <div className="dist-bar-info">
                <span>Academic Notice (&lt; 3.00)</span>
                <strong>{academicNotice} ({((academicNotice / total) * 100).toFixed(1)}%)</strong>
              </div>
              <div className="dist-bar-track">
                <div className="dist-bar-fill fill-rose" style={{ width: `${(academicNotice / total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Rates */}
        <div className="analytics-card-tile">
          <h2 className="analytics-tile-title">Attendance Rate Compliance</h2>
          <p className="analytics-tile-desc">Lecture and lab attendance distribution across student body</p>

          <div className="dist-bar-list">
            <div className="dist-bar-row">
              <div className="dist-bar-info">
                <span>Distinguished (90% – 100%)</span>
                <strong>{highAttendance} ({((highAttendance / total) * 100).toFixed(1)}%)</strong>
              </div>
              <div className="dist-bar-track">
                <div className="dist-bar-fill fill-emerald" style={{ width: `${(highAttendance / total) * 100}%` }}></div>
              </div>
            </div>

            <div className="dist-bar-row">
              <div className="dist-bar-info">
                <span>Standard (80% – 89%)</span>
                <strong>{midAttendance} ({((midAttendance / total) * 100).toFixed(1)}%)</strong>
              </div>
              <div className="dist-bar-track">
                <div className="dist-bar-fill fill-cyan" style={{ width: `${(midAttendance / total) * 100}%` }}></div>
              </div>
            </div>

            <div className="dist-bar-row">
              <div className="dist-bar-info">
                <span>Needs Attention (&lt; 80%)</span>
                <strong>{lowAttendance} ({((lowAttendance / total) * 100).toFixed(1)}%)</strong>
              </div>
              <div className="dist-bar-track">
                <div className="dist-bar-fill fill-rose" style={{ width: `${(lowAttendance / total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Distribution Grid */}
      <div className="analytics-card-tile full-width">
        <h2 className="analytics-tile-title">Departmental Enrollment Balance</h2>
        <p className="analytics-tile-desc">Distribution of 1,000 students across 10 academic faculties</p>

        <div className="dept-dist-grid">
          {deptDist.map((item, idx) => (
            <div key={item.name} className="dept-dist-item">
              <div className="dept-dist-header">
                <span className="dept-dist-name">{item.name}</span>
                <span className="dept-dist-badge">{item.count} students ({item.pct}%)</span>
              </div>
              <div className="dist-bar-track">
                <div
                  className="dist-bar-fill"
                  style={{
                    width: `${Math.min(100, (item.count / 150) * 100)}%`,
                    backgroundColor: idx % 2 === 0 ? '#00BFFF' : '#00FFAE'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsView;
