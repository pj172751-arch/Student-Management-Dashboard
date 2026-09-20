import { departments } from '../data/students';
import { BookOpenIcon, UsersIcon, AwardIcon } from './Icons';

function DepartmentsView({ students, onSelectDepartment }) {
  const departmentStats = departments.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    const total = deptStudents.length;
    const active = deptStudents.filter(s => s.status === 'Active').length;
    const avgGpa = total > 0 ? (deptStudents.reduce((acc, s) => acc + s.gpa, 0) / total) : 0;
    const deansCount = deptStudents.filter(s => s.gpa >= 3.8).length;

    // Collect top skills in this department
    const skillCounts = {};
    deptStudents.forEach(s => {
      if (s.skills && Array.isArray(s.skills)) {
        s.skills.forEach(sk => {
          skillCounts[sk] = (skillCounts[sk] || 0) + 1;
        });
      }
    });

    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);

    return {
      name: dept,
      total,
      active,
      avgGpa: parseFloat(avgGpa.toFixed(2)),
      deansCount,
      topSkills,
      retentionRate: total > 0 ? Math.round((active / total) * 100) : 0
    };
  });

  return (
    <div className="departments-view-wrapper" id="departments-view">
      {/* Header Banner */}
      <div className="departments-header-banner">
        <div className="departments-header-title-group">
          <div className="departments-icon-badge">
            <BookOpenIcon size={24} />
          </div>
          <div>
            <h1 className="departments-main-title">Academic Departments Directory</h1>
            <p className="departments-main-subtitle">
              Comprehensive breakdown across all 10 specialized degree programs, enrollment distribution, and performance.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="departments-grid-layout">
        {departmentStats.map((dept, index) => (
          <div key={dept.name} className="dept-stat-card" id={`dept-card-${index}`}>
            <div className="dept-card-top">
              <div className="dept-badge-pill">Dept #{index + 1}</div>
              <span className="dept-retention-tag">{dept.retentionRate}% Active</span>
            </div>

            <h3 className="dept-name-heading">{dept.name}</h3>

            <div className="dept-metrics-grid">
              <div className="dept-metric-item">
                <span className="dept-metric-label">Enrolled</span>
                <span className="dept-metric-val">{dept.total}</span>
              </div>
              <div className="dept-metric-item">
                <span className="dept-metric-label">Avg GPA</span>
                <span className="dept-metric-val">{dept.avgGpa.toFixed(2)}</span>
              </div>
              <div className="dept-metric-item">
                <span className="dept-metric-label">Dean's List</span>
                <span className="dept-metric-val">{dept.deansCount}</span>
              </div>
            </div>

            {/* Top Skills in Department */}
            {dept.topSkills.length > 0 && (
              <div className="dept-skills-section">
                <span className="dept-skills-label">Core Competencies:</span>
                <div className="dept-skills-chips">
                  {dept.topSkills.map((sk, skIdx) => (
                    <span key={skIdx} className="dept-skill-pill">{sk}</span>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="dept-filter-link-btn"
              onClick={() => onSelectDepartment(dept.name)}
              id={`filter-dept-${index}`}
            >
              <span>Explore Students</span>
              <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartmentsView;
