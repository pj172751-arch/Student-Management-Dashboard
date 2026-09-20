import { TrophyIcon, EditIcon } from './Icons';

function TopStudents({ students, onSelectStudent }) {
  const topStudents = [...students]
    .sort((a, b) => (b.gpa - a.gpa) || (b.attendance - a.attendance) || (b.credits - a.credits))
    .slice(0, 5);

  const honorBadges = [
    { bg: '#FFE600', color: '#1B1B1B', label: '#1 Top Scholar', line: '#FFE600' },
    { bg: '#00FFAE', color: '#1B1B1B', label: '#2 High Honor', line: '#00FFAE' },
    { bg: '#00BFFF', color: '#1B1B1B', label: '#3 Dean\'s Merit', line: '#00BFFF' },
    { bg: '#FF70A6', color: '#1B1B1B', label: '#4 Distinction', line: '#FF70A6' },
    { bg: '#FFD166', color: '#1B1B1B', label: '#5 Honor Roll', line: '#FFD166' }
  ];

  if (topStudents.length === 0) return null;

  return (
    <section className="top-showcase-section" id="top-students-showcase">
      <div className="section-header-banner">
        <div className="section-title-wrap">
          <div className="section-icon-badge">
            <TrophyIcon size={20} />
          </div>
          <div>
            <h2 className="section-heading">Dean's Honor Roll — Top 5 Scholars</h2>
            <p className="section-subtext">Distinguished academic performers across 1,000 enrolled students</p>
          </div>
        </div>
        <div className="showcase-hint-pill">
          <span>Official Dean's List Spotlight</span>
        </div>
      </div>

      <div className="creationsBlocUl">
        {topStudents.map((student, index) => {
          const badge = honorBadges[index] || { bg: '#FFE600', color: '#1B1B1B', label: `#${index + 1} Honor`, line: '#FFE600' };
          const initials = student.initials || (student.name ? student.name.slice(0, 2).toUpperCase() : 'ST');
          return (
            <figure
              key={student.id}
              className="creaBlock creaBlockPrez"
              id={`top-student-${student.id}`}
              onClick={() => onSelectStudent(student)}
              title={`Click to view/edit ${student.name}'s profile`}
            >
              {/* Header Rank & GPA */}
              <div className="card-prez-header">
                <span className="card-rank-badge" style={{ backgroundColor: badge.bg, color: badge.color }}>
                  {badge.label}
                </span>
                <span className="card-gpa-badge">
                  {Number(student.gpa).toFixed(2)} GPA
                </span>
              </div>

              {/* Line separator */}
              <div className="lineSeparator" style={{ backgroundColor: badge.line }}></div>

              {/* Student Avatar Image */}
              <div className="blocImg">
                <img
                  src={student.avatar}
                  alt={student.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'flex';
                    }
                  }}
                />
                <div className="top-avatar-fallback" style={{ display: 'none' }}>
                  {initials}
                </div>
              </div>

              {/* Student Name & Department */}
              <div className="card-prez-body">
                <h2 title={student.name}>{student.name}</h2>
                <div className="card-dept-tag">{student.department}</div>

                {/* Metrics row: Credits & Attendance */}
                <div className="card-metrics-row">
                  <span className="metric-item">Credits: <strong>{student.credits || 0}</strong></span>
                  <span className="metric-item">Attendance: <strong>{student.attendance || 0}%</strong></span>
                </div>

                {/* Skills tags */}
                {student.skills && student.skills.length > 0 && (
                  <div className="card-skills-row">
                    {student.skills.slice(0, 2).map((skill, sIdx) => (
                      <span key={sIdx} className="skill-pill">{skill}</span>
                    ))}
                  </div>
                )}

                {/* Quick Edit Footer */}
                <div className="card-prez-footer">
                  <span className="student-id-sub">{student.studentId || `STU-2024-${student.id}`}</span>
                  <button
                    className="card-quick-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStudent(student);
                    }}
                    id={`edit-top-${student.id}`}
                    title="Edit Record"
                  >
                    <EditIcon size={12} />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

export default TopStudents;
