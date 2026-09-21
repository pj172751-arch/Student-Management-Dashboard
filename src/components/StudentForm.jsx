import { useState, useMemo } from 'react';
import { departments, boyAvatars, girlAvatars } from '../data/students';
import { CloseIcon, CheckCircleIcon, AcademicCap, AlertCircleIcon, UsersIcon } from './Icons';

function StudentForm({ student, onSubmit, onClose, existingEmails }) {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    department: student?.department || departments[0],
    gpa: student?.gpa !== undefined ? String(student.gpa) : '8.50',
    status: student?.status || 'Active',
    enrollmentDate: student?.enrollmentDate || new Date().toISOString().split('T')[0],
    studentId: student?.studentId || (student ? `STU-2026-${String(student.id).padStart(3, '0')}` : ''),
    avatar: student?.avatar || boyAvatars[0],
    credits: student?.credits !== undefined ? Number(student.credits) : 60,
    attendance: student?.attendance !== undefined ? Number(student.attendance) : 90,
    skills: student?.skills ? (Array.isArray(student.skills) ? student.skills.join(', ') : student.skills) : 'Fullstack Dev, AI & ML, Algorithms',
    initials: student?.initials || ''
  });

  const [avatarCategory, setAvatarCategory] = useState('all'); // 'all' | 'boys' | 'girls'
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const allAvatars = useMemo(() => {
    return [
      ...boyAvatars.map((url, idx) => ({ url, type: 'boy', label: `Boy #${idx + 1}` })),
      ...girlAvatars.map((url, idx) => ({ url, type: 'girl', label: `Girl #${idx + 1}` }))
    ];
  }, []);

  const visibleAvatars = useMemo(() => {
    if (avatarCategory === 'boys') return allAvatars.filter(a => a.type === 'boy');
    if (avatarCategory === 'girls') return allAvatars.filter(a => a.type === 'girl');
    return allAvatars;
  }, [avatarCategory, allAvatars]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Student full name is required';
        if (value.trim().length < 2) return 'Full name must contain at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Institutional email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid institutional email';
        if (!student && existingEmails && existingEmails.includes(value.trim().toLowerCase())) {
          return 'This email address is already enrolled';
        }
        return '';
      case 'department':
        if (!value) return 'Department selection is required';
        return '';
      case 'gpa':
        if (value === '' || value === undefined) return 'Semester SPI is required';
        const numGpa = parseFloat(value);
        if (isNaN(numGpa) || numGpa < 0 || numGpa > 10.0) return 'SPI must be a valid number between 0.00 and 10.00';
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
      <div
        className="modal-content neobrutal-modal"
        onClick={(e) => e.stopPropagation()}
        id="student-form-modal"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-badge">
              <AcademicCap size={22} />
            </div>
            <div>
              <h2 className="modal-title">{isEditing ? 'Edit Student Record' : 'Enroll New Student'}</h2>
              <p className="modal-subtitle">
                {isEditing
                  ? `Modifying registry for student #${formData.studentId || student?.id}`
                  : 'Complete academic profile credentials and choose student avatar'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            title="Close dialog"
            id="modal-close-btn"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="student-modal-form" noValidate>
          {/* SECTION 1: Personal Credentials & Avatar Preview */}
          <div className="form-section-card">
            <div className="section-card-title-row">
              <span className="section-number-tag">01</span>
              <h3 className="section-card-heading">Student Identity & Illustrated Avatar</h3>
            </div>

            <div className="identity-preview-row">
              {/* Selected Avatar Large Display */}
              <div className="avatar-selected-preview-card">
                <div className="selected-avatar-frame">
                  <img src={formData.avatar} alt="Selected Avatar" />
                </div>
                <div className="selected-avatar-label">
                  <span className="selected-avatar-title">Selected Avatar</span>
                  <span className="selected-avatar-id">{formData.studentId || 'New Student'}</span>
                </div>
              </div>

              {/* Name & Email inputs */}
              <div className="identity-inputs-column">
                <div className="form-input-group">
                  <label className="form-label" htmlFor="input-student-name">
                    Full Legal Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Aarav Sharma"
                    className={`form-input-control ${errors.name && touched.name ? 'input-error' : ''}`}
                    id="input-student-name"
                  />
                  {errors.name && touched.name && (
                    <div className="field-error-text">
                      <AlertCircleIcon size={13} />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div className="form-input-group">
                  <label className="form-label" htmlFor="input-student-email">
                    Institutional Email Address <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., aarav.sharma@university.edu"
                    className={`form-input-control ${errors.email && touched.email ? 'input-error' : ''}`}
                    id="input-student-email"
                  />
                  {errors.email && touched.email && (
                    <div className="field-error-text">
                      <AlertCircleIcon size={13} />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Avatar Gallery with Gender Category Pills */}
            <div className="avatar-picker-wrapper">
              <div className="avatar-picker-controls-header">
                <label className="form-label-inline">Select Avatar Character ({visibleAvatars.length})</label>
                <div className="category-toggle-pills">
                  <button
                    type="button"
                    className={`cat-pill-btn ${avatarCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setAvatarCategory('all')}
                  >
                    All (40)
                  </button>
                  <button
                    type="button"
                    className={`cat-pill-btn ${avatarCategory === 'boys' ? 'active' : ''}`}
                    onClick={() => setAvatarCategory('boys')}
                  >
                    Boys (20)
                  </button>
                  <button
                    type="button"
                    className={`cat-pill-btn ${avatarCategory === 'girls' ? 'active' : ''}`}
                    onClick={() => setAvatarCategory('girls')}
                  >
                    Girls (20)
                  </button>
                </div>
              </div>

              <div className="avatar-selection-grid">
                {visibleAvatars.map((item, idx) => (
                  <button
                    type="button"
                    key={`${item.type}-${idx}`}
                    className={`avatar-grid-item ${formData.avatar === item.url ? 'is-selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, avatar: item.url }))}
                    title={item.label}
                  >
                    <img src={item.url} alt={item.label} />
                    {formData.avatar === item.url && (
                      <div className="avatar-selected-badge">✓</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: Academic Program & Standing */}
          <div className="form-section-card">
            <div className="section-card-title-row">
              <span className="section-number-tag tag-blue">02</span>
              <h3 className="section-card-heading">Academic Department & Performance Standing</h3>
            </div>

            <div className="form-grid-2col">
              <div className="form-input-group">
                <label className="form-label" htmlFor="select-student-dept">
                  Academic Department <span className="required-star">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-select-control"
                  id="select-student-dept"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-input-group">
                <label className="form-label" htmlFor="select-student-status">
                  Enrollment Status <span className="required-star">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select-control"
                  id="select-student-status"
                >
                  <option value="Active">Active (Good Standing)</option>
                  <option value="Inactive">Inactive (Withdrawn / Suspended)</option>
                </select>
              </div>

              <div className="form-input-group">
                <label className="form-label" htmlFor="input-student-gpa">
                  Semester SPI (0.00 – 10.00) <span className="required-star">*</span>
                </label>
                <div className="gpa-input-wrapper">
                  <input
                    type="number"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    step="0.01"
                    min="0"
                    max="10.0"
                    placeholder="8.75"
                    className={`form-input-control ${errors.gpa && touched.gpa ? 'input-error' : ''}`}
                    id="input-student-gpa"
                  />
                  <span className="gpa-scale-addon">/ 10.00 SPI</span>
                </div>
                {errors.gpa && touched.gpa && (
                  <div className="field-error-text">
                    <AlertCircleIcon size={13} />
                    <span>{errors.gpa}</span>
                  </div>
                )}
              </div>

              <div className="form-input-group">
                <label className="form-label" htmlFor="input-student-date">
                  Enrollment Date <span className="required-star">*</span>
                </label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input-control ${errors.enrollmentDate && touched.enrollmentDate ? 'input-error' : ''}`}
                  id="input-student-date"
                />
                {errors.enrollmentDate && touched.enrollmentDate && (
                  <div className="field-error-text">
                    <AlertCircleIcon size={13} />
                    <span>{errors.enrollmentDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: Credits, Attendance & Skills */}
          <div className="form-section-card">
            <div className="section-card-title-row">
              <span className="section-number-tag tag-pink">03</span>
              <h3 className="section-card-heading">Credits, Attendance & Core Skills</h3>
            </div>

            <div className="form-grid-2col">
              <div className="form-input-group">
                <label className="form-label" htmlFor="input-student-credits">
                  Earned Academic Credits
                </label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleChange}
                  min="0"
                  max="200"
                  placeholder="60"
                  className="form-input-control"
                  id="input-student-credits"
                />
              </div>

              <div className="form-input-group">
                <label className="form-label" htmlFor="input-student-attendance">
                  Attendance Rate (%)
                </label>
                <input
                  type="number"
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="92"
                  className="form-input-control"
                  id="input-student-attendance"
                />
              </div>

              <div className="form-input-group full-width-grid">
                <label className="form-label" htmlFor="input-student-skills">
                  Academic Skills & Focus Areas (Comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., Python, Cloud Computing, Neural Networks"
                  className="form-input-control"
                  id="input-student-skills"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="modal-actions-footer">
            <button
              type="button"
              className="modal-btn-cancel"
              onClick={onClose}
              id="form-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn-submit"
              id="form-submit-btn"
            >
              <CheckCircleIcon size={18} />
              <span>{isEditing ? 'Save Changes' : 'Enroll Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;