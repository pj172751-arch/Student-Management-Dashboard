import { useState } from 'react';
import { SettingsIcon, CheckCircleIcon, RotateCcwIcon, AwardIcon, AcademicCap, UsersIcon, BookOpenIcon } from './Icons';

function SettingsPage({ students, settings: externalSettings, onResetData, onSaveSettings, addToast }) {
  const [activeTab, setActiveTab] = useState('institution'); // 'institution' | 'grading' | 'display' | 'data'

  const [settings, setSettings] = useState(() => externalSettings || {
    institutionName: 'LJ Polytechnic',
    academicYear: '2026–2027 Academic Session',
    registrarEmail: 'registrar@ljpolytechnic.edu',
    emailDomain: 'ljpolytechnic.edu',
    deansListGpa: 9.00,
    honorsGpa: 8.50,
    passingGpa: 5.00,
    defaultView: 'cards',
    defaultPageSize: '24',
    enableAutoSave: true,
    requireEmailVerification: true
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
    setSaved(false);
  };

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onSaveSettings) {
      onSaveSettings(settings);
    }
    setSaved(true);
    if (addToast) {
      addToast('Institutional settings and academic criteria updated successfully.', 'success');
    }
    setTimeout(() => setSaved(false), 3500);
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
      {/* Top Banner */}
      <div className="settings-hero-banner">
        <div className="settings-hero-left">
          <div className="settings-icon-large-badge">
            <SettingsIcon size={28} />
          </div>
          <div>
            <h1 className="settings-hero-title">System & Institutional Preferences</h1>
            <p className="settings-hero-subtitle">
              Manage academic department regulations, grading thresholds, viewing configurations, and full data backups.
            </p>
          </div>
        </div>

        <div className="settings-hero-stats">
          <div className="hero-stat-pill">
            <span className="hero-stat-num">{students.length}</span>
            <span className="hero-stat-text">Active Records</span>
          </div>
          <div className="hero-stat-pill highlight-pill">
            <span className="hero-stat-num">10</span>
            <span className="hero-stat-text">Departments</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="settings-tabs-nav-bar">
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'institution' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('institution')}
        >
          <AcademicCap size={16} />
          <span>Institution Identity</span>
        </button>

        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'grading' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('grading')}
        >
          <AwardIcon size={16} />
          <span>Grading & Honors</span>
        </button>

        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'display' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('display')}
        >
          <BookOpenIcon size={16} />
          <span>Display & UI</span>
        </button>

        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'data' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          <RotateCcwIcon size={16} />
          <span>Data Hub & Backups</span>
        </button>
      </div>

      {/* Settings Form Body */}
      <form onSubmit={handleSave} className="settings-body-form" noValidate>
        {/* TAB 1: INSTITUTION IDENTITY */}
        {activeTab === 'institution' && (
          <div className="settings-tab-pane">
            <div className="settings-spacious-card">
              <div className="spacious-card-header">
                <div>
                  <h2 className="spacious-card-title">University Profile & Institutional Domain</h2>
                  <p className="spacious-card-desc">
                    These credentials appear across student transcripts, official reports, and system communications.
                  </p>
                </div>
                <span className="card-section-tag tag-cyan">Profile</span>
              </div>

              {/* Visual ID Badge Preview */}
              <div className="institution-visual-preview-box">
                <div className="preview-crest-icon">🏛️</div>
                <div className="preview-crest-text">
                  <h3 className="preview-institution-name">{settings.institutionName || 'University Name'}</h3>
                  <div className="preview-meta-row">
                    <span className="preview-badge-term">{settings.academicYear}</span>
                    <span className="preview-badge-domain">@{settings.emailDomain}</span>
                  </div>
                </div>
              </div>

              <div className="settings-input-grid-2">
                <div className="settings-field-group">
                  <label className="settings-input-label" htmlFor="institutionName">
                    University / Institution Legal Name
                  </label>
                  <input
                    type="text"
                    id="institutionName"
                    name="institutionName"
                    value={settings.institutionName}
                    onChange={handleChange}
                    className="settings-text-input"
                    placeholder="e.g., LJ Polytechnic"
                  />
                  <span className="settings-field-helper">Official title on degree certificates and exports</span>
                </div>

                <div className="settings-field-group">
                  <label className="settings-input-label" htmlFor="academicYear">
                    Active Academic Term / Year
                  </label>
                  <input
                    type="text"
                    id="academicYear"
                    name="academicYear"
                    value={settings.academicYear}
                    onChange={handleChange}
                    className="settings-text-input"
                    placeholder="e.g., 2026–2027 Academic Session"
                  />
                  <span className="settings-field-helper">Current enrollment cycle for stats and cards</span>
                </div>

                <div className="settings-field-group">
                  <label className="settings-input-label" htmlFor="registrarEmail">
                    Office of the Registrar Email
                  </label>
                  <input
                    type="email"
                    id="registrarEmail"
                    name="registrarEmail"
                    value={settings.registrarEmail}
                    onChange={handleChange}
                    className="settings-text-input"
                    placeholder="registrar@ljpolytechnic.edu"
                  />
                  <span className="settings-field-helper">Receives registry notifications and status alerts</span>
                </div>

                <div className="settings-field-group">
                  <label className="settings-input-label" htmlFor="emailDomain">
                    Institutional Email Suffix Domain
                  </label>
                  <input
                    type="text"
                    id="emailDomain"
                    name="emailDomain"
                    value={settings.emailDomain}
                    onChange={handleChange}
                    className="settings-text-input"
                    placeholder="ljpolytechnic.edu"
                  />
                  <span className="settings-field-helper">Used to validate enrolled student email addresses</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GRADING & HONORS */}
        {activeTab === 'grading' && (
          <div className="settings-tab-pane">
            <div className="settings-spacious-card">
              <div className="spacious-card-header">
                <div>
                  <h2 className="spacious-card-title">Grading Scale & Distinction Thresholds</h2>
                  <p className="spacious-card-desc">
                    Adjust Semester Performance Index (SPI) criteria for Top Scholars showcase, honors tags, and remedial probation.
                  </p>
                </div>
                <span className="card-section-tag tag-yellow">Scale Rules</span>
              </div>

              {/* Interactive Live SPI Scale Bar */}
              <div className="live-gpa-scale-container">
                <div className="scale-title-row">
                  <span className="scale-title">Live Semester Performance Index (SPI) Spectrum</span>
                  <span className="scale-range-label">Scale: 0.00 – 10.00 Max</span>
                </div>

                <div className="scale-visual-track">
                  <div
                    className="scale-seg seg-notice"
                    style={{ width: `${(settings.passingGpa / 10.0) * 100}%` }}
                    title={`Remedial / Notice (< ${settings.passingGpa})`}
                  >
                    <span>Notice (&lt; {Number(settings.passingGpa).toFixed(1)})</span>
                  </div>
                  <div
                    className="scale-seg seg-good"
                    style={{ width: `${((settings.honorsGpa - settings.passingGpa) / 10.0) * 100}%` }}
                    title={`Good Standing (${settings.passingGpa} - ${settings.honorsGpa})`}
                  >
                    <span>Good Standing</span>
                  </div>
                  <div
                    className="scale-seg seg-honors"
                    style={{ width: `${((settings.deansListGpa - settings.honorsGpa) / 10.0) * 100}%` }}
                    title={`Honors (${settings.honorsGpa} - ${settings.deansListGpa})`}
                  >
                    <span>Honors</span>
                  </div>
                  <div
                    className="scale-seg seg-deans"
                    style={{ width: `${((10.0 - settings.deansListGpa) / 10.0) * 100}%` }}
                    title={`Dean's List (>= ${settings.deansListGpa})`}
                  >
                    <span>Dean's List (≥ {Number(settings.deansListGpa).toFixed(1)})</span>
                  </div>
                </div>
              </div>

              <div className="settings-input-grid-3">
                <div className="settings-field-group highlight-box-amber">
                  <label className="settings-input-label" htmlFor="deansListGpa">
                    Dean's Honor Roll Cutoff (SPI)
                  </label>
                  <input
                    type="number"
                    id="deansListGpa"
                    name="deansListGpa"
                    step="0.1"
                    min="7.0"
                    max="10.0"
                    value={settings.deansListGpa}
                    onChange={handleChange}
                    className="settings-text-input"
                  />
                  <span className="settings-field-helper">Qualifies for Top 5 showcase spotlight</span>
                </div>

                <div className="settings-field-group highlight-box-cyan">
                  <label className="settings-input-label" htmlFor="honorsGpa">
                    First Class Distinction Cutoff (SPI)
                  </label>
                  <input
                    type="number"
                    id="honorsGpa"
                    name="honorsGpa"
                    step="0.1"
                    min="6.0"
                    max="9.5"
                    value={settings.honorsGpa}
                    onChange={handleChange}
                    className="settings-text-input"
                  />
                  <span className="settings-field-helper">High academic recognition badge on card</span>
                </div>

                <div className="settings-field-group highlight-box-rose">
                  <label className="settings-input-label" htmlFor="passingGpa">
                    Minimum Passing SPI Cutoff
                  </label>
                  <input
                    type="number"
                    id="passingGpa"
                    name="passingGpa"
                    step="0.1"
                    min="3.0"
                    max="7.0"
                    value={settings.passingGpa}
                    onChange={handleChange}
                    className="settings-text-input"
                  />
                  <span className="settings-field-helper">Below this triggers Remedial Notice warnings</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DISPLAY & UI PREFERENCES */}
        {activeTab === 'display' && (
          <div className="settings-tab-pane">
            <div className="settings-spacious-card">
              <div className="spacious-card-header">
                <div>
                  <h2 className="spacious-card-title">Default Dashboard View & Table Settings</h2>
                  <p className="spacious-card-desc">
                    Control default page density, cards layout, and registry browser pagination.
                  </p>
                </div>
                <span className="card-section-tag tag-pink">UI Settings</span>
              </div>

              <div className="settings-input-grid-2">
                <div className="settings-field-group">
                  <label className="settings-input-label" htmlFor="defaultView">
                    Initial Directory View Format
                  </label>
                  <select
                    id="defaultView"
                    name="defaultView"
                    value={settings.defaultView}
                    onChange={handleChange}
                    className="settings-select-input"
                  >
                    <option value="cards">Interactive Neobrutalist Grid Cards View</option>
                    <option value="table">Tabular Enterprise Data Table View</option>
                  </select>
                  <span className="settings-field-helper">The default display when launching the student dashboard</span>
                </div>

                <div className="settings-field-group">
                  <label className="settings-input-label" htmlFor="defaultPageSize">
                    Default Records Per Page (Pagination)
                  </label>
                  <select
                    id="defaultPageSize"
                    name="defaultPageSize"
                    value={settings.defaultPageSize}
                    onChange={handleChange}
                    className="settings-select-input"
                  >
                    <option value="12">12 students per page (Compact)</option>
                    <option value="24">24 students per page (Balanced & Recommended)</option>
                    <option value="48">48 students per page (Dense)</option>
                    <option value="96">96 students per page (Maximum)</option>
                  </select>
                  <span className="settings-field-helper">Controls how many cards/rows load simultaneously</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DATA HUB & BACKUPS */}
        {activeTab === 'data' && (
          <div className="settings-tab-pane">
            <div className="settings-spacious-card">
              <div className="spacious-card-header">
                <div>
                  <h2 className="spacious-card-title">Registry Data Hub, Backups & Disaster Recovery</h2>
                  <p className="spacious-card-desc">
                    Export full offline snapshots of your 1,000 students or reset the local database back to default.
                  </p>
                </div>
                <span className="card-section-tag tag-emerald">Data Hub</span>
              </div>

              <div className="data-actions-grid-container">
                {/* Export JSON Card */}
                <div className="data-action-card-box">
                  <div className="action-card-header-row">
                    <div className="action-icon-circle circle-blue">JSON</div>
                    <span className="action-format-tag">Full Data Payload</span>
                  </div>
                  <h3 className="data-card-headline">Export Registry as JSON</h3>
                  <p className="data-card-explanation">
                    Downloads all student objects including IDs, avatars, GPA, skills arrays, credits, and attendance.
                  </p>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="btn-neobrutal-action btn-export-json"
                    id="btn-export-json-action"
                  >
                    <span>Download .JSON Backup</span>
                    <span>↓</span>
                  </button>
                </div>

                {/* Export CSV Card */}
                <div className="data-action-card-box">
                  <div className="action-card-header-row">
                    <div className="action-icon-circle circle-green">CSV</div>
                    <span className="action-format-tag">Spreadsheet Ready</span>
                  </div>
                  <h3 className="data-card-headline">Export Registry as CSV</h3>
                  <p className="data-card-explanation">
                    Generates clean comma-separated values compatible with Excel, Google Sheets, or institutional databases.
                  </p>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="btn-neobrutal-action btn-export-csv"
                    id="btn-export-csv-action"
                  >
                    <span>Download .CSV Spreadsheet</span>
                    <span>↓</span>
                  </button>
                </div>

                {/* Reset Data Card */}
                <div className="data-action-card-box box-danger">
                  <div className="action-card-header-row">
                    <div className="action-icon-circle circle-rose">RESET</div>
                    <span className="action-format-tag tag-danger">Factory State</span>
                  </div>
                  <h3 className="data-card-headline text-danger">Reset to Factory 1,000 Records</h3>
                  <p className="data-card-explanation">
                    Restores the original 1,000 student dataset, clearing all manual additions, edits, and deletions.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reset all records to the original 1,000 students? Any manual additions will be reset.')) {
                        onResetData();
                      }
                    }}
                    className="btn-neobrutal-action btn-danger-action"
                    id="btn-reset-data-action"
                  >
                    <span>Reset All Student Records</span>
                    <span>↺</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Save Button Bar */}
        <div className="settings-sticky-footer-bar">
          <div className="footer-status-text">
            {saved ? (
              <span className="status-saved-pill">✓ All preferences saved</span>
            ) : (
              <span>Review your changes and click save to apply institutional policies</span>
            )}
          </div>

          <button
            type="submit"
            className="settings-save-button-primary"
            id="btn-save-settings"
            onClick={handleSave}
          >
            <CheckCircleIcon size={18} />
            <span>{saved ? 'Saved Successfully!' : 'Save System Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;
