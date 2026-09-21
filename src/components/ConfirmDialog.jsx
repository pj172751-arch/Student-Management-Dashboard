import { AlertCircleIcon, TrashIcon } from './Icons';

function ConfirmDialog({ student, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-box glass-strong" onClick={(e) => e.stopPropagation()} id="confirm-delete-modal">
        <div className="confirm-icon-badge">
          <AlertCircleIcon size={28} />
        </div>

        <div className="confirm-content-center">
          <h3 className="confirm-title">Remove Student Record</h3>
          <p className="confirm-description">
            Are you sure you want to delete <strong>{student.name}</strong> from the student directory?
          </p>
          <div className="confirm-student-summary">
            <span className="summary-dept">{student.department}</span>
            <span className="summary-bullet">•</span>
            <span className="summary-id">{student.studentId || `STU-2026-${String(student.id).padStart(3, '0')}`}</span>
            <span className="summary-bullet">•</span>
            <span className="summary-gpa">{student.gpa.toFixed(2)} SPI</span>
          </div>
          <p className="confirm-warning-note">
            This operation is permanent and will remove the student’s academic data from the active registry.
          </p>
        </div>

        <div className="confirm-buttons-row">
          <button
            className="btn-secondary"
            onClick={onCancel}
            id="confirm-cancel-btn"
          >
            Cancel
          </button>
          <button
            className="btn-danger"
            onClick={onConfirm}
            id="confirm-delete-btn"
          >
            <TrashIcon size={16} />
            <span>Remove Student</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;