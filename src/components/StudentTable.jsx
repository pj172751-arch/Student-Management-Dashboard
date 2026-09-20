import { EditIcon, TrashIcon, SortAscIcon, SortDescIcon, SortDefaultIcon } from './Icons';

function StudentTable({ students, onEdit, onDelete, sortConfig, onSort }) {
  const getGpaColor = (gpa) => {
    if (gpa >= 3.8) return 'var(--amber)';
    if (gpa >= 3.5) return 'var(--cyan)';
    if (gpa >= 3.0) return 'var(--emerald)';
    return 'var(--rose)';
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') return 'badge-emerald';
    if (status === 'On Leave') return 'badge-amber';
    return 'badge-rose';
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <SortDefaultIcon size={14} />;
    return sortConfig.direction === 'asc' ? <SortAscIcon size={14} /> : <SortDescIcon size={14} />;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="table-responsive-wrapper" id="student-table">
      <table className="enterprise-data-table">
        <thead>
          <tr>
            <th onClick={() => onSort('name')} className="th-sortable">
              <div className="th-content">
                <span>Student</span>
                {renderSortIcon('name')}
              </div>
            </th>
            <th onClick={() => onSort('email')} className="th-sortable">
              <div className="th-content">
                <span>Institutional Email</span>
                {renderSortIcon('email')}
              </div>
            </th>
            <th onClick={() => onSort('department')} className="th-sortable">
              <div className="th-content">
                <span>Department</span>
                {renderSortIcon('department')}
              </div>
            </th>
            <th onClick={() => onSort('gpa')} className="th-sortable">
              <div className="th-content">
                <span>Cumulative GPA</span>
                {renderSortIcon('gpa')}
              </div>
            </th>
            <th onClick={() => onSort('status')} className="th-sortable">
              <div className="th-content">
                <span>Standing</span>
                {renderSortIcon('status')}
              </div>
            </th>
            <th onClick={() => onSort('enrollmentDate')} className="th-sortable">
              <div className="th-content">
                <span>Enrolled Date</span>
                {renderSortIcon('enrollmentDate')}
              </div>
            </th>
            <th className="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const studentId = student.studentId || `STU-2024-${String(student.id).padStart(3, '0')}`;
            return (
              <tr key={student.id} className="table-data-row">
                <td>
                  <div className="table-student-cell">
                    <div className="table-avatar-frame">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="table-avatar-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="avatar-fallback" style={{ display: 'none' }}>
                        {student.initials || student.name.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div className="table-name-group">
                      <span className="table-student-name">{student.name}</span>
                      <span className="table-student-id">{studentId}</span>
                    </div>
                  </div>
                </td>
                <td className="table-email-cell">{student.email}</td>
                <td>
                  <span className="table-dept-pill">{student.department}</span>
                </td>
                <td>
                  <div className="table-gpa-cell">
                    <span className="table-gpa-number" style={{ color: getGpaColor(student.gpa) }}>
                      {student.gpa.toFixed(2)}
                    </span>
                    <div className="table-gpa-mini-track">
                      <div
                        className="table-gpa-mini-fill"
                        style={{
                          width: `${(student.gpa / 4.0) * 100}%`,
                          backgroundColor: getGpaColor(student.gpa)
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`table-status-pill ${getStatusBadge(student.status)}`}>
                    <span className="status-dot-mini"></span>
                    <span>{student.status}</span>
                  </span>
                </td>
                <td className="table-date-cell">{formatDate(student.enrollmentDate)}</td>
                <td className="table-actions-cell">
                  <div className="table-actions-group">
                    <button
                      className="table-action-icon-btn edit-icon-btn"
                      onClick={() => onEdit(student)}
                      title="Edit student"
                      id={`table-edit-${student.id}`}
                    >
                      <EditIcon size={14} />
                    </button>
                    <button
                      className="table-action-icon-btn delete-icon-btn"
                      onClick={() => onDelete(student)}
                      title="Delete student"
                      id={`table-delete-${student.id}`}
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;