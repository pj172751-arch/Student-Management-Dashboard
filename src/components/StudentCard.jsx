import { EditIcon, TrashIcon, MailIcon, CalendarIcon } from './Icons';

function StudentCard({ student, onEdit, onDelete }) {
  const getGpaTier = (gpa) => {
    if (gpa >= 9.0) return { label: "Dean's List", color: "#FFE600", bg: "rgba(255, 230, 0, 0.2)" };
    if (gpa >= 8.5) return { label: "Honors", color: "#00BFFF", bg: "rgba(0, 191, 255, 0.18)" };
    if (gpa >= 7.5) return { label: "First Class", color: "#00FFAE", bg: "rgba(0, 255, 174, 0.18)" };
    if (gpa >= 6.0) return { label: "Pass Class", color: "#FF9F1C", bg: "rgba(255, 159, 28, 0.18)" };
    return { label: "Remedial Notice", color: "#FF6F61", bg: "rgba(255, 111, 97, 0.18)" };
  };

  const getStatusColor = (status) => {
    if (status === 'Active') return { dot: 'status-emerald', badge: 'badge-emerald' };
    if (status === 'On Leave') return { dot: 'status-amber', badge: 'badge-amber' };
    return { dot: 'status-rose', badge: 'badge-rose' };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const gpaTier = getGpaTier(student.gpa);
  const statusColors = getStatusColor(student.status);
  const studentId = student.studentId || `STU-2026-${String(student.id).padStart(3, '0')}`;
  const initials = student.initials || (student.name ? student.name.slice(0, 2).toUpperCase() : 'ST');

  return (
    <div className="student-profile-card" id={`student-card-${student.id}`}>
      <div className="card-top-header">
        <div className="card-avatar-group">
          <div className="avatar-frame">
            <img
              src={student.avatar}
              alt={student.name}
              className="student-portrait"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'flex';
                }
              }}
            />
            <div className="avatar-fallback" style={{ display: 'none' }}>
              {initials}
            </div>
            <span className={`status-indicator-dot ${statusColors.dot}`} title={`Status: ${student.status}`}></span>
          </div>
          <div>
            <span className="card-student-id">{studentId}</span>
            <span className={`status-badge-chip ${statusColors.badge}`}>{student.status}</span>
          </div>
        </div>

        <div className="card-action-buttons">
          <button
            className="action-icon-btn action-edit"
            onClick={() => onEdit(student)}
            title="Edit student record"
            id={`edit-btn-${student.id}`}
          >
            <EditIcon size={14} />
          </button>
          <button
            className="action-icon-btn action-delete"
            onClick={() => onDelete(student)}
            title="Delete student record"
            id={`delete-btn-${student.id}`}
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>

      <div className="card-profile-content">
        <h3 className="student-full-name">{student.name}</h3>
        
        <div className="student-dept-tag">
          <span>{student.department}</span>
        </div>

        <div className="student-meta-item">
          <MailIcon size={13} className="meta-icon-svg" />
          <span className="meta-email-text" title={student.email}>{student.email}</span>
        </div>

        <div className="student-meta-item">
          <CalendarIcon size={13} className="meta-icon-svg" />
          <span className="meta-date-text">Enrolled {formatDate(student.enrollmentDate)}</span>
        </div>

        {/* Academic Stats: Credits & Attendance from JSON */}
        <div className="card-academic-stats">
          <div className="academic-stat-box">
            <span className="stat-box-label">Credits</span>
            <span className="stat-box-val">{student.credits || 0}</span>
          </div>
          <div className="academic-stat-box">
            <span className="stat-box-label">Attendance</span>
            <span className="stat-box-val">{student.attendance ? `${student.attendance}%` : 'N/A'}</span>
          </div>
        </div>

        {/* Skills from JSON */}
        {student.skills && student.skills.length > 0 && (
          <div className="card-skills-tags">
            {student.skills.map((skill, sIdx) => (
              <span key={sIdx} className="student-skill-chip">{skill}</span>
            ))}
          </div>
        )}
      </div>

      <div className="card-gpa-footer">
        <div className="gpa-details-row">
          <div className="gpa-score-group">
            <span className="gpa-val">{Number(student.gpa).toFixed(2)}</span>
            <span className="gpa-scale">/ 10.0 SPI</span>
          </div>
          <span
            className="gpa-tier-pill"
            style={{ color: gpaTier.color, backgroundColor: gpaTier.bg }}
          >
            {gpaTier.label}
          </span>
        </div>

        <div className="gpa-progress-track">
          <div
            className="gpa-progress-bar"
            style={{
              width: `${(student.gpa / 10.0) * 100}%`,
              backgroundColor: gpaTier.color
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;