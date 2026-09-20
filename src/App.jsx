import { useState, useCallback, useMemo } from 'react';
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
  }, []);

  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.department.toLowerCase().includes(term) ||
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
      setStudents(prev => [...prev, { ...formData, id: newId }]);
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
          {/* Real-time KPI Stats Row */}
          <StatsPanel students={students} />

          {/* Academic Honors Spotlight */}
          <TopStudents
            students={students}
            onSelectStudent={handleEditStudent}
          />

          {/* Search, Filter & View Controls */}
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalResults={filteredStudents.length}
            totalStudents={students.length}
          />

          {/* Dynamic Records: Empty State, Cards View, or Table View */}
          {filteredStudents.length === 0 ? (
            <EmptyState
              searchTerm={searchTerm}
              hasFilters={hasActiveFilters}
              onClearFilters={() => handleFilterChange('clear', '')}
              onAddStudent={handleAddStudent}
            />
          ) : viewMode === 'cards' ? (
            <div className="students-cards-grid" id="students-grid">
              {filteredStudents.map((student) => (
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
              students={filteredStudents}
              onEdit={handleEditStudent}
              onDelete={handleDeleteRequest}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
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