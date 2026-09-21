import { useState, useCallback, useMemo, useEffect } from 'react';
import './App.css';
import initialStudents from './data/students';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import TopStudents from './components/TopStudents';
import SearchFilter from './components/SearchFilter';
import StudentCard from './components/StudentCard';
import StudentTable from './components/StudentTable';
import StudentForm from './components/StudentForm';
import ConfirmDialog from './components/ConfirmDialog';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import SettingsPage from './components/SettingsPage';
import DepartmentsView from './components/DepartmentsView';
import AnalyticsView from './components/AnalyticsView';
import { PlusIcon, AnalyticsIcon, BookOpenIcon } from './components/Icons';

function App() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    gpaMin: '',
    gpaMax: '',
  });
  const [viewMode, setViewMode] = useState('cards');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    if (key === 'clear') {
      setFilters({ department: '', status: '', gpaMin: '', gpaMax: '' });
      setSearchTerm('');
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleResetData = useCallback(() => {
    setStudents(initialStudents);
    setFilters({ department: '', status: '', gpaMin: '', gpaMax: '' });
    setSearchTerm('');
    setCurrentPage(1);
    addToast('All student records reset to the initial 1,000 dataset.', 'info');
  }, [addToast]);

  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(s =>
        (s.name && s.name.toLowerCase().includes(term)) ||
        (s.email && s.email.toLowerCase().includes(term)) ||
        (s.department && s.department.toLowerCase().includes(term)) ||
        (s.studentId && s.studentId.toLowerCase().includes(term))
      );
    }

    if (filters.department) {
      result = result.filter(s => s.department === filters.department);
    }

    if (filters.status) {
      result = result.filter(s => s.status === filters.status);
    }

    if (filters.gpaMin) {
      result = result.filter(s => s.gpa >= parseFloat(filters.gpaMin));
    }

    if (filters.gpaMax) {
      result = result.filter(s => s.gpa <= parseFloat(filters.gpaMax));
    }

    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, filters, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const gridEl = document.getElementById('search-filter');
      if (gridEl) {
        gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [totalPages]);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleAddStudent = useCallback(() => {
    setEditingStudent(null);
    setShowForm(true);
  }, []);

  const handleEditStudent = useCallback((student) => {
    setEditingStudent(student);
    setShowForm(true);
  }, []);

  const handleDeleteRequest = useCallback((student) => {
    setDeletingStudent(student);
  }, []);

  const handleFormSubmit = useCallback((formData) => {
    if (editingStudent) {
      setStudents(prev =>
        prev.map(s => s.id === editingStudent.id ? { ...s, ...formData, id: s.id } : s)
      );
      addToast(`Student record for ${formData.name} was successfully updated.`, 'success');
    } else {
      const newId = Math.max(...students.map(s => s.id), 0) + 1;
      const newStuId = formData.studentId || `STU-2024-${String(newId).padStart(3, '0')}`;
      setStudents(prev => [{ ...formData, id: newId, studentId: newStuId }, ...prev]);
      addToast(`New student ${formData.name} was successfully enrolled.`, 'success');
    }
    setShowForm(false);
    setEditingStudent(null);
  }, [editingStudent, students, addToast]);

  const handleConfirmDelete = useCallback(() => {
    if (deletingStudent) {
      setStudents(prev => prev.filter(s => s.id !== deletingStudent.id));
      addToast(`Student record for ${deletingStudent.name} has been removed.`, 'info');
      setDeletingStudent(null);
    }
  }, [deletingStudent, addToast]);

  const existingEmails = useMemo(() =>
    students.map(s => s.email.toLowerCase()),
    [students]
  );

  const hasActiveFilters = Boolean(
    filters.department || filters.status || filters.gpaMin || filters.gpaMax || searchTerm
  );

  const startIndex = filteredStudents.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredStudents.length);

  return (
    <div className={`app-root-layout ${mobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      {/* Mobile Menu Toggle Button */}
      <button
        className="mobile-hamburger-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        id="mobile-menu-btn"
        aria-label="Toggle navigation menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Sidebar Navigation */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setMobileMenuOpen(false);
        }}
      />

      {/* Main Content Area */}
      <div className="main-content-scroll">
        <Header onAddStudent={handleAddStudent} />

        <main className="dashboard-body-container">
          {/* SECTION: SETTINGS PAGE */}
          {activeSection === 'settings' && (
            <SettingsPage
              students={students}
              onResetData={handleResetData}
              addToast={addToast}
            />
          )}

          {/* SECTION: DEPARTMENTS BREAKDOWN */}
          {activeSection === 'departments' && (
            <DepartmentsView
              students={students}
              onSelectDepartment={(deptName) => {
                handleFilterChange('department', deptName);
                setActiveSection('students');
              }}
            />
          )}

          {/* SECTION: ACADEMIC ANALYTICS */}
          {activeSection === 'analytics' && (
            <AnalyticsView students={students} />
          )}

          {/* SECTION: DASHBOARD (Overview with Stats, Top 5 & Directory) */}
          {activeSection === 'dashboard' && (
            <>
              {/* Hero Welcome Banner */}
              <div className="dashboard-welcome-banner" id="dashboard-welcome-banner">
                <div className="welcome-text-group">
                  <div className="welcome-badge-tag">Academic Term 2024–2025 • Active Session</div>
                  <h1 className="welcome-heading">Metropolitan University Registry</h1>
                  <p className="welcome-subheading">
                    Real-time scholar tracking, grade performance metrics, and enrollment administration for {students.length} students.
                  </p>
                </div>
                <div className="welcome-actions-row">
                  <button
                    type="button"
                    className="welcome-action-btn btn-primary-enroll"
                    onClick={handleAddStudent}
                    id="welcome-btn-enroll"
                  >
                    <PlusIcon size={16} />
                    <span>Enroll Student</span>
                  </button>
                  <button
                    type="button"
                    className="welcome-action-btn btn-secondary-analytics"
                    onClick={() => setActiveSection('analytics')}
                    id="welcome-btn-analytics"
                  >
                    <AnalyticsIcon size={16} />
                    <span>View Analytics</span>
                  </button>
                  <button
                    type="button"
                    className="welcome-action-btn btn-secondary-backup"
                    onClick={() => setActiveSection('departments')}
                    id="welcome-btn-departments"
                  >
                    <BookOpenIcon size={16} />
                    <span>Departments</span>
                  </button>
                </div>
              </div>

              {/* Real-time KPI Stats Row */}
              <StatsPanel students={students} />

              {/* Academic Honors Spotlight */}
              <TopStudents
                students={students}
                onSelectStudent={handleEditStudent}
              />

              {/* Quick Filter Buttons */}
              <div className="directory-quick-filters">
                <span className="dir-quick-label">Fast Filters:</span>
                <button
                  type="button"
                  className={`dir-filter-pill-btn ${!filters.gpaMin && !filters.status ? 'active' : ''}`}
                  onClick={() => handleFilterChange('clear', '')}
                >
                  All ({students.length})
                </button>
                <button
                  type="button"
                  className={`dir-filter-pill-btn ${filters.gpaMin === '3.8' ? 'active' : ''}`}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, gpaMin: '3.8', gpaMax: '', status: '' }));
                    setCurrentPage(1);
                  }}
                >
                  Dean's List (≥3.8)
                </button>
                <button
                  type="button"
                  className={`dir-filter-pill-btn ${filters.gpaMin === '3.5' && filters.gpaMax === '3.8' ? 'active' : ''}`}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, gpaMin: '3.5', gpaMax: '3.8', status: '' }));
                    setCurrentPage(1);
                  }}
                >
                  Honors (3.5–3.79)
                </button>
                <button
                  type="button"
                  className={`dir-filter-pill-btn ${filters.status === 'Active' ? 'active' : ''}`}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, status: 'Active', gpaMin: '', gpaMax: '' }));
                    setCurrentPage(1);
                  }}
                >
                  Active Standing
                </button>
              </div>

              {/* Search, Filter & View Controls */}
              <SearchFilter
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filters={filters}
                onFilterChange={handleFilterChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalResults={filteredStudents.length}
                totalStudents={students.length}
              />

              {/* Dynamic Records Grid / Table */}
              {filteredStudents.length === 0 ? (
                <EmptyState
                  searchTerm={searchTerm}
                  hasFilters={hasActiveFilters}
                  onClearFilters={() => handleFilterChange('clear', '')}
                  onAddStudent={handleAddStudent}
                />
              ) : (
                <>
                  {viewMode === 'cards' ? (
                    <div className="students-cards-grid" id="students-grid">
                      {paginatedStudents.map((student) => (
                        <StudentCard
                          key={student.id}
                          student={student}
                          onEdit={handleEditStudent}
                          onDelete={handleDeleteRequest}
                        />
                      ))}
                    </div>
                  ) : (
                    <StudentTable
                      students={paginatedStudents}
                      onEdit={handleEditStudent}
                      onDelete={handleDeleteRequest}
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                  )}

                  {/* Pagination Bar */}
                  <div className="pagination-bar" id="pagination-controls">
                    <div className="pagination-summary">
                      Showing <strong>{startIndex}</strong>–<strong>{endIndex}</strong> of <strong>{filteredStudents.length}</strong> students
                    </div>

                    <div className="pagination-buttons">
                      <button
                        className="pagination-btn pagination-nav-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        id="pagination-prev-btn"
                      >
                        ← Prev
                      </button>

                      <div className="pagination-pages-group">
                        {currentPage > 2 && (
                          <>
                            <button
                              className="pagination-page-number"
                              onClick={() => handlePageChange(1)}
                            >
                              1
                            </button>
                            {currentPage > 3 && <span className="pagination-ellipsis">…</span>}
                          </>
                        )}

                        {currentPage > 1 && (
                          <button
                            className="pagination-page-number"
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            {currentPage - 1}
                          </button>
                        )}

                        <button className="pagination-page-number active-page">
                          {currentPage}
                        </button>

                        {currentPage < totalPages && (
                          <button
                            className="pagination-page-number"
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            {currentPage + 1}
                          </button>
                        )}

                        {currentPage < totalPages - 1 && (
                          <>
                            {currentPage < totalPages - 2 && <span className="pagination-ellipsis">…</span>}
                            <button
                              className="pagination-page-number"
                              onClick={() => handlePageChange(totalPages)}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        className="pagination-btn pagination-nav-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        id="pagination-next-btn"
                      >
                        Next →
                      </button>
                    </div>

                    <div className="pagination-per-page">
                      <label htmlFor="per-page-select">Per page:</label>
                      <select
                        id="per-page-select"
                        className="per-page-dropdown"
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                      >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                        <option value={96}>96</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* SECTION: STUDENTS DIRECTORY (Pure Directory View) */}
          {activeSection === 'students' && (
            <>
              <div className="section-header-banner">
                <div className="section-title-wrap">
                  <div>
                    <h2 className="section-heading">Active Student Registry Directory</h2>
                    <p className="section-subtext">Comprehensive listing of all {students.length} enrolled student scholars</p>
                  </div>
                </div>
              </div>

              <SearchFilter
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filters={filters}
                onFilterChange={handleFilterChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalResults={filteredStudents.length}
                totalStudents={students.length}
              />

              {filteredStudents.length === 0 ? (
                <EmptyState
                  searchTerm={searchTerm}
                  hasFilters={hasActiveFilters}
                  onClearFilters={() => handleFilterChange('clear', '')}
                  onAddStudent={handleAddStudent}
                />
              ) : (
                <>
                  {viewMode === 'cards' ? (
                    <div className="students-cards-grid" id="students-grid">
                      {paginatedStudents.map((student) => (
                        <StudentCard
                          key={student.id}
                          student={student}
                          onEdit={handleEditStudent}
                          onDelete={handleDeleteRequest}
                        />
                      ))}
                    </div>
                  ) : (
                    <StudentTable
                      students={paginatedStudents}
                      onEdit={handleEditStudent}
                      onDelete={handleDeleteRequest}
                      sortConfig={sortConfig}
                      onSort={handleSort}
                    />
                  )}

                  {/* Pagination Bar */}
                  <div className="pagination-bar" id="pagination-controls-students">
                    <div className="pagination-summary">
                      Showing <strong>{startIndex}</strong>–<strong>{endIndex}</strong> of <strong>{filteredStudents.length}</strong> students
                    </div>

                    <div className="pagination-buttons">
                      <button
                        className="pagination-btn pagination-nav-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ← Prev
                      </button>

                      <div className="pagination-pages-group">
                        {currentPage > 2 && (
                          <>
                            <button
                              className="pagination-page-number"
                              onClick={() => handlePageChange(1)}
                            >
                              1
                            </button>
                            {currentPage > 3 && <span className="pagination-ellipsis">…</span>}
                          </>
                        )}

                        {currentPage > 1 && (
                          <button
                            className="pagination-page-number"
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            {currentPage - 1}
                          </button>
                        )}

                        <button className="pagination-page-number active-page">
                          {currentPage}
                        </button>

                        {currentPage < totalPages && (
                          <button
                            className="pagination-page-number"
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            {currentPage + 1}
                          </button>
                        )}

                        {currentPage < totalPages - 1 && (
                          <>
                            {currentPage < totalPages - 2 && <span className="pagination-ellipsis">…</span>}
                            <button
                              className="pagination-page-number"
                              onClick={() => handlePageChange(totalPages)}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>

                      <button
                        className="pagination-btn pagination-nav-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </button>
                    </div>

                    <div className="pagination-per-page">
                      <label htmlFor="per-page-select-students">Per page:</label>
                      <select
                        id="per-page-select-students"
                        className="per-page-dropdown"
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                      >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                        <option value={96}>96</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal Dialog for Add / Edit Student */}
      {showForm && (
        <StudentForm
          student={editingStudent}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
          existingEmails={existingEmails}
        />
      )}

      {/* Confirmation Modal for Student Deletion */}
      {deletingStudent && (
        <ConfirmDialog
          student={deletingStudent}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingStudent(null)}
        />
      )}

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;