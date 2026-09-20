import { TrophyIcon, EditIcon } from './Icons';

function TopStudents({ students, onSelectStudent }) {
  const topStudents = [...students]
    .sort((a, b) => (b.gpa - a.gpa) || (b.attendance - a.attendance) || (b.credits - a.credits))
    .slice(0, 5);

  const separatorColors = [
    '#FBE4D8',
    '#DFB6B2',
    '#854F6C',
    '#522B5B',
    '#2B124C'
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
          <span>Interactive 3D Neobrutalist Cards</span>
        </div>
      </div>

      <div className="creationsBlocUl">
        {topStudents.map((student, index) => {
          const sepColor = separatorColors[index] || '#854F6C';
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
                <span className="card-rank-badge" style={{ backgroundColor: sepColor, color: '#190019' }}>
                  #{index + 1} Honor
                </span>
                <span className="card-gpa-badge">
                  {Number(student.gpa).toFixed(2)} GPA
                </span>
              </div>

              {/* Line separator */}
              <div className="lineSeparator"></div>

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
