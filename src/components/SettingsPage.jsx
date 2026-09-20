import { useState } from 'react';
import { SettingsIcon, CheckCircleIcon, RotateCcwIcon, AwardIcon, AcademicCap } from './Icons';

function SettingsPage({ students, onResetData, onSaveSettings, addToast }) {
  const [settings, setSettings] = useState({
    institutionName: 'Metropolitan University of Technology',
    academicYear: '2024–2025 Academic Term',
    registrarEmail: 'registrar@university.edu',
    emailDomain: 'university.edu',
    deansListGpa: '3.80',
    honorsGpa: '3.50',
    passingGpa: '2.00',
    defaultView: 'cards',
    defaultPageSize: '24',
    enableNotifications: true,
    autoBackup: true
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveSettings) onSaveSettings(settings);
    setSaved(true);
    addToast('Institutional settings and grading criteria saved successfully.', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  // Export current students data as JSON
  const handleExportJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `student_registry_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast(`Exported ${students.length} student records as JSON.`, 'success');
    } catch (err) {
      addToast('Failed to export student data.', 'error');
    }
  };

  // Export current students data as CSV
  const handleExportCSV = () => {
    try {
      const headers = ['ID', 'StudentID', 'Name', 'Email', 'Department', 'GPA', 'Status', 'Credits', 'Attendance', 'EnrollmentDate'];
      const rows = students.map(s => [
        s.id,
        `"${s.studentId || ''}"`,
        `"${s.name || ''}"`,
        `"${s.email || ''}"`,
        `"${s.department || ''}"`,
        s.gpa,
        `"${s.status || ''}"`,
        s.credits || 0,
        s.attendance || 0,
        `"${s.enrollmentDate || ''}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `student_registry_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      addToast(`Exported ${students.length} student records as CSV.`, 'success');
    } catch (err) {
      addToast('Failed to export CSV file.', 'error');
    }
  };

  return (
    <div className="settings-page-wrapper" id="settings-page">
      {/* Header Banner */}
      <div className="settings-header-banner">
        <div className="settings-header-title-group">
          <div className="settings-icon-badge">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h1 className="settings-main-title">System & Institutional Settings</h1>
            <p className="settings-main-subtitle">
              Configure academic regulations, grading scale thresholds, notification policies, and registry data backups.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-form-layout">
        {/* Section 1: Institution Profile */}
        <section className="settings-card-block">
          <div className="settings-card-header">
            <div className="settings-card-badge">
              <AcademicCap size={18} />
            </div>
            <div>
              <h2 className="settings-card-title">Institution Registry Information</h2>
              <p className="settings-card-desc">Academic institution credentials and primary communication domain</p>
            </div>
          </div>

          <div className="settings-grid-2">
            <div className="settings-field">
              <label className="settings-label" htmlFor="institutionName">Institution Name</label>
              <input
                type="text"
                id="institutionName"
                name="institutionName"
                value={settings.institutionName}
                onChange={handleChange}
                className="settings-text-input"
              />
            </div>

            <div className="settings-field">
              <label className="settings-label" htmlFor="academicYear">Active Academic Term</label>
              <input
                type="text"
                id="academicYear"
                name="academicYear"
                value={settings.academicYear}
                onChange={handleChange}
                className="settings-text-input"
              />
            </div>

            <div className="settings-field">
              <label className="settings-label" htmlFor="registrarEmail">Registrar / Admin Email</label>
              <input
                type="email"
                id="registrarEmail"
                name="registrarEmail"
                value={settings.registrarEmail}
                onChange={handleChange}
                className="settings-text-input"
              />
            </div>

            <div className="settings-field">
              <label className="settings-label" htmlFor="emailDomain">Verified Email Domain</label>
              <input
                type="text"
                id="emailDomain"
                name="emailDomain"
                value={settings.emailDomain}
                onChange={handleChange}
                className="settings-text-input"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Grading Scale & Honor Roll Criteria */}
        <section className="settings-card-block">
          <div className="settings-card-header">
            <div className="settings-card-badge badge-amber">
              <AwardIcon size={18} />
            </div>
            <div>
              <h2 className="settings-card-title">Grading Scale & Honor Thresholds</h2>
              <p className="settings-card-desc">Define cumulative GPA criteria for academic distinction and good standing</p>
            </div>
          </div>

          <div className="settings-grid-3">
            <div className="settings-field">
              <label className="settings-label" htmlFor="deansListGpa">Dean's List Cutoff (GPA)</label>
              <input
                type="number"
                id="deansListGpa"
                name="deansListGpa"
                step="0.05"
                min="3.0"
                max="4.0"
                value={settings.deansListGpa}
                onChange={handleChange}
                className="settings-text-input"
              />
              <span className="settings-hint">Students at or above this GPA receive Top Honor status</span>
            </div>

            <div className="settings-field">
              <label className="settings-label" htmlFor="honorsGpa">Honors Cutoff (GPA)</label>
              <input
                type="number"
                id="honorsGpa"
                name="honorsGpa"
                step="0.05"
                min="2.5"
                max="3.8"
                value={settings.honorsGpa}
                onChange={handleChange}
                className="settings-text-input"
              />
              <span className="settings-hint">Upper academic tier recognition</span>
            </div>

            <div className="settings-field">
              <label className="settings-label" htmlFor="passingGpa">Minimum Passing GPA</label>
              <input
                type="number"
                id="passingGpa"
                name="passingGpa"
                step="0.05"
                min="1.0"
                max="3.0"
                value={settings.passingGpa}
                onChange={handleChange}
                className="settings-text-input"
              />
              <span className="settings-hint">Academic Notice triggered below this score</span>
            </div>
          </div>
        </section>

        {/* Section 3: Interface & Display Preferences */}
        <section className="settings-card-block">
          <div className="settings-card-header">
            <div className="settings-card-badge badge-cyan">
              <SettingsIcon size={18} />
            </div>
            <div>
              <h2 className="settings-card-title">Default Dashboard Display Preferences</h2>
              <p className="settings-card-desc">Configure default viewing modes and table pagination size</p>
            </div>
          </div>

          <div className="settings-grid-2">
            <div className="settings-field">
              <label className="settings-label" htmlFor="defaultView">Default View Mode</label>
              <select
                id="defaultView"
                name="defaultView"
                value={settings.defaultView}
                onChange={handleChange}
                className="settings-select-input"
              >
                <option value="cards">Interactive Grid Cards View</option>
                <option value="table">Tabular Enterprise Data Table</option>
              </select>
            </div>

            <div className="settings-field">
              <label className="settings-label" htmlFor="defaultPageSize">Default Students Per Page</label>
              <select
                id="defaultPageSize"
                name="defaultPageSize"
                value={settings.defaultPageSize}
                onChange={handleChange}
                className="settings-select-input"
              >
                <option value="12">12 records</option>
                <option value="24">24 records (Recommended)</option>
                <option value="48">48 records</option>
                <option value="96">96 records</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 4: Data Management & Backup */}
        <section className="settings-card-block">
          <div className="settings-card-header">
            <div className="settings-card-badge badge-emerald">
              <RotateCcwIcon size={18} />
            </div>
            <div>
              <h2 className="settings-card-title">Data Backup & Export Management</h2>
              <p className="settings-card-desc">Download complete student data backups or reset to factory dataset</p>
            </div>
          </div>

          <div className="settings-actions-group">
            <div className="export-action-item">
              <div>
                <h3 className="action-item-title">Export Registry as JSON</h3>
                <p className="action-item-desc">Download all 1,000 student records with skills, credits, and GPA as JSON format.</p>
              </div>
              <button
                type="button"
                onClick={handleExportJSON}
                className="btn-action-neobrutal btn-export-json"
                id="btn-export-json"
              >
                Export JSON
              </button>
            </div>

            <div className="export-action-item">
              <div>
                <h3 className="action-item-title">Export Registry as CSV</h3>
                <p className="action-item-desc">Download tabular student roster compatible with Excel, Google Sheets, or SPSS.</p>
              </div>
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-action-neobrutal btn-export-csv"
                id="btn-export-csv"
              >
                Export CSV
              </button>
            </div>

            <div className="export-action-item danger-border">
              <div>
                <h3 className="action-item-title danger-text">Reset to Factory 1,000 Records</h3>
                <p className="action-item-desc">Revert all edits, additions, and deletions back to the initial 1,000 records dataset.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all records to the original 1,000 students? Any manual additions will be reset.')) {
                    onResetData();
                  }
                }}
                className="btn-action-neobrutal btn-danger-action"
                id="btn-reset-data"
              >
                Reset Dataset
              </button>
            </div>
          </div>
        </section>

        {/* Sticky Save Controls Bar */}
        <div className="settings-footer-actions">
          <button
            type="submit"
            className="btn-primary-action settings-submit-btn"
            id="btn-save-settings"
          >
            <CheckCircleIcon size={18} />
            <span>{saved ? 'Settings Saved!' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;
