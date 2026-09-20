import { useState } from 'react';
import { departments } from '../data/students';
import { CloseIcon, CheckCircleIcon, AcademicCap, AlertCircleIcon } from './Icons';

function StudentForm({ student, onSubmit, onClose, existingEmails }) {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    department: student?.department || departments[0],
    gpa: student?.gpa !== undefined ? String(student.gpa) : '3.50',
    status: student?.status || 'Active',
    enrollmentDate: student?.enrollmentDate || new Date().toISOString().split('T')[0],
    studentId: student?.studentId || (student ? `STU-2024-${String(student.id).padStart(3, '0')}` : ''),
    avatar: student?.avatar || `https://i.pravatar.cc/400?img=${Math.floor(Math.random() * 70) + 1}`,
    credits: student?.credits !== undefined ? Number(student.credits) : 60,
    attendance: student?.attendance !== undefined ? Number(student.attendance) : 90,
    skills: student?.skills ? (Array.isArray(student.skills) ? student.skills.join(', ') : student.skills) : 'General, Engineering',
    initials: student?.initials || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Student full name is required';
        if (value.trim().length < 2) return 'Full name must contain at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Institutional email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid institutional email address';
        if (existingEmails && existingEmails.includes(value.toLowerCase()) && value.toLowerCase() !== student?.email?.toLowerCase()) {
          return 'This email address is already assigned to another student record';
        }
        return '';
      case 'department':
        if (!value) return 'Department selection is required';
        return '';
      case 'gpa':
        if (value === '' || value === undefined) return 'Cumulative GPA is required';
        const numGpa = parseFloat(value);
        if (isNaN(numGpa) || numGpa < 0 || numGpa > 4.0) return 'GPA must be a valid number between 0.00 and 4.00';
        return '';
      case 'enrollmentDate':
        if (!value) return 'Enrollment date is required';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let computedInitials = formData.initials;
    if (name === 'name') {
      const parts = value.trim().split(/\s+/);
      if (parts.length >= 2) {
        computedInitials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      } else if (parts.length === 1 && parts[0].length > 0) {
        computedInitials = parts[0].slice(0, 2).toUpperCase();
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' ? { initials: computedInitials } : {})
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      department: true,
      gpa: true,
      enrollmentDate: true
    });

    if (Object.keys(newErrors).length === 0) {
      const skillsArray = typeof formData.skills === 'string'
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : formData.skills;

      onSubmit({
        ...formData,
        gpa: parseFloat(parseFloat(formData.gpa).toFixed(2)),
        credits: parseInt(formData.credits, 10) || 60,
        attendance: parseInt(formData.attendance, 10) || 90,
        skills: skillsArray
      });
    }
  };

  const isEditing = Boolean(student);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-strong" onClick={(e) => e.stopPropagation()} id="student-form-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-badge">
              <AcademicCap size={20} />
            </div>
            <div>
              <h2 className="modal-title">{isEditing ? 'Edit Student Record' : 'Enroll New Student'}</h2>
              <p className="modal-subtitle">
                {isEditing ? `Updating academic registry for ${student.name}` : 'Enter student credentials and academic enrollment information'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close window" id="modal-close-btn">
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="student-modal-form" noValidate>
          <div className="form-grid-layout">
            {/* Full Name */}
            <div className="form-input-group full-width">
              <label className="form-label">Full Legal Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., Aarav Sharma"
                className={`form-text-input ${errors.name && touched.name ? 'input-error' : ''}`}
                id="input-student-name"
              />
              {errors.name && touched.name && (
                <div className="field-error-text">
                  <AlertCircleIcon size={12} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="form-input-group full-width">
              <label className="form-label">Institutional Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., aarav.sharma@university.edu"
                className={`form-text-input ${errors.email && touched.email ? 'input-error' : ''}`}
                id="input-student-email"
              />
              {errors.email && touched.email && (
                <div className="field-error-text">
                  <AlertCircleIcon size={12} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Department */}
            <div className="form-input-group">
              <label className="form-label">Academic Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-select-input"
                id="select-student-dept"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="form-input-group">
              <label className="form-label">Academic Standing Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select-input"
                id="select-student-status"
              >
                <option value="Active">Active (Good Standing)</option>
                <option value="Inactive">Inactive (Suspended/Withdrawn)</option>
              </select>
            </div>

            {/* GPA */}
            <div className="form-input-group">
              <label className="form-label">Cumulative GPA (Scale: 4.00 Max)</label>
              <input
                type="number"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                onBlur={handleBlur}
                step="0.01"
                min="0"
                max="4.0"
                placeholder="3.75"
                className={`form-text-input ${errors.gpa && touched.gpa ? 'input-error' : ''}`}
                id="input-student-gpa"
              />
              {errors.gpa && touched.gpa && (
                <div className="field-error-text">
                  <AlertCircleIcon size={12} />
                  <span>{errors.gpa}</span>
                </div>
              )}
            </div>

            {/* Enrollment Date */}
            <div className="form-input-group">
              <label className="form-label">Enrollment Date</label>
              <input
                type="date"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-text-input ${errors.enrollmentDate && touched.enrollmentDate ? 'input-error' : ''}`}
                id="input-student-date"
              />
              {errors.enrollmentDate && touched.enrollmentDate && (
                <div className="field-error-text">
                  <AlertCircleIcon size={12} />
                  <span>{errors.enrollmentDate}</span>
                </div>
              )}
            </div>

            {/* Credits */}
            <div className="form-input-group">
              <label className="form-label">Earned Credits</label>
              <input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                min="0"
                max="160"
                placeholder="60"
                className="form-text-input"
                id="input-student-credits"
              />
            </div>

            {/* Attendance */}
            <div className="form-input-group">
              <label className="form-label">Attendance Rate (%)</label>
              <input
                type="number"
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="90"
                className="form-text-input"
                id="input-student-attendance"
              />
            </div>

            {/* Skills */}
            <div className="form-input-group full-width">
              <label className="form-label">Academic Skills (Comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., Fullstack Dev, AI & ML, Algorithms"
                className="form-text-input"
                id="input-student-skills"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              id="form-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              id="form-submit-btn"
            >
              <CheckCircleIcon size={16} />
              <span>{isEditing ? 'Save Changes' : 'Enroll Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;