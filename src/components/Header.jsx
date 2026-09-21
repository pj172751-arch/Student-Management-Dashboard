import { AcademicCap, PlusIcon } from './Icons';

function Header({ onAddStudent, institutionName = 'LJ Polytechnic' }) {
  return (
    <header className="floating-header" id="app-header">
      <div className="header-left">
        <div className="header-brand-badge">
          <AcademicCap className="brand-cap-icon" size={24} />
          <span className="brand-badge-pill">{institutionName}</span>
        </div>
        <div className="header-title-group">
          <h1 className="header-title">Student Directory</h1>
          <p className="header-subtitle">Manage student enrollment, performance records, and academic status</p>
        </div>
      </div>

      <div className="header-right">
        <button
          className="btn-primary"
          onClick={onAddStudent}
          id="add-student-btn"
        >
          <PlusIcon size={16} />
          <span>Add Student</span>
        </button>

        <div className="header-divider"></div>

        <div className="admin-profile" title="Administrator Session">
          <div className="admin-avatar">
            <span>AD</span>
          </div>
          <div className="admin-info">
            <span className="admin-name">Registrar Office</span>
            <span className="admin-role">Academic Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;