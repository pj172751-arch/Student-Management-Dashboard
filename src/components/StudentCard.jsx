import { EditIcon, TrashIcon, MailIcon, CalendarIcon } from './Icons';

function StudentCard({ student, onEdit, onDelete }) {
  const getGpaTier = (gpa) => {
    if (gpa >= 3.8) return { label: "Dean's List", color: "var(--amber)", bg: "rgba(245, 158, 11, 0.12)" };
    if (gpa >= 3.5) return { label: "Honors", color: "var(--cyan)", bg: "rgba(6, 182, 212, 0.12)" };
    if (gpa >= 3.0) return { label: "Good Standing", color: "var(--emerald)", bg: "rgba(16, 185, 129, 0.12)" };
    return { label: "Academic Notice", color: "var(--rose)", bg: "rgba(244, 63, 94, 0.12)" };
  };

  const getStatusColor = (status) => {
    if (status === 'Active') return { dot: 'status-emerald', badge: 'badge-emerald' };
    if (status === 'On Leave') return { dot: 'status-amber', badge: 'badge-amber' };
    return { dot: 'status-rose', badge: 'badge-rose' };
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const gpaTier = getGpaTier(student.gpa);
  const statusColors = getStatusColor(student.status);
  const studentId = student.studentId || `STU-2024-${String(student.id).padStart(3, '0')}`;

  return (
    <div className="student-profile-card" id={`student-card-${student.id}`}>
      <div className="card-top-header">
        <div className="card-avatar-group">
          <div className="avatar-frame">
            <img
              src={student.avatar}
              alt={student.name}
              className="student-portrait"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="avatar-fallback" style={{ display: 'none' }}>
              {student.initials || student.name.slice(0, 2).toUpperCase()}
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
      </div>

      <div className="card-gpa-footer">
        <div className="gpa-details-row">
          <div className="gpa-score-group">
            <span className="gpa-val">{student.gpa.toFixed(2)}</span>
            <span className="gpa-scale">/ 4.0</span>
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
              width: `${(student.gpa / 4.0) * 100}%`,
              backgroundColor: gpaTier.color
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;