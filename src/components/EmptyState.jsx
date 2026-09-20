import { SearchIcon, RotateCcwIcon, PlusIcon } from './Icons';

function EmptyState({ searchTerm, hasFilters, onClearFilters, onAddStudent }) {
  return (
    <div className="empty-state-card" id="empty-state">
      <div className="empty-state-icon-wrap">
        <SearchIcon size={32} className="empty-search-icon" />
      </div>

      <h3 className="empty-state-heading">No Student Records Found</h3>

      <p className="empty-state-description">
        {searchTerm ? (
          <>
            No records matched your search query <em>"{searchTerm}"</em>. Check for typos or try broader keywords.
          </>
        ) : hasFilters ? (
          'No students currently match the active filter criteria. Try adjusting the department, status, or GPA range.'
        ) : (
          'No students have been enrolled in the directory yet. Click the button below to add your first student record.'
        )}
      </p>

      <div className="empty-state-actions">
        {hasFilters && (
          <button
            className="btn-secondary"
            onClick={onClearFilters}
            id="empty-clear-filters-btn"
          >
            <RotateCcwIcon size={14} />
            <span>Reset All Filters</span>
          </button>
        )}
        <button
          className="btn-primary"
          onClick={onAddStudent}
          id="empty-add-student-btn"
        >
          <PlusIcon size={16} />
          <span>Add New Student</span>
        </button>
      </div>
    </div>
  );
}

export default EmptyState;