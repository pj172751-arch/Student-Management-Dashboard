import { departments } from '../data/students';
import { SearchIcon, GridIcon, ListIcon, RotateCcwIcon, FilterIcon } from './Icons';

function SearchFilter({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalResults,
  totalStudents
}) {
  const hasActiveFilters = Boolean(
    searchTerm || filters.department || filters.status || filters.gpaMin || filters.gpaMax
  );

  return (
    <section className="search-filter-section" id="search-filter">
      {/* Top Search and Quick Actions Bar */}
      <div className="filter-top-bar">
        <div className="search-input-wrapper">
          <SearchIcon className="search-icon-svg" size={18} />
          <input
            type="text"
            className="search-text-input"
            placeholder="Search students by name, email, or department..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            id="search-input"
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="view-mode-toggle-group">
          <button
            id="view-cards-btn"
            className={`view-mode-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => onViewModeChange('cards')}
            title="Grid Card View"
          >
            <GridIcon size={16} />
            <span>Cards</span>
          </button>
          <button
            id="view-table-btn"
            className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => onViewModeChange('table')}
            title="Table List View"
          >
            <ListIcon size={16} />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="filter-controls-row">
        <div className="filter-select-group">
          <label className="filter-field-label">
            <FilterIcon size={12} />
            <span>Department</span>
          </label>
          <select
            id="filter-department"
            className="filter-dropdown"
            value={filters.department}
            onChange={(e) => onFilterChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-select-group">
          <label className="filter-field-label">Academic Status</label>
          <select
            id="filter-status"
            className="filter-dropdown"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="filter-select-group">
          <label className="filter-field-label">Min GPA</label>
          <input
            type="number"
            id="filter-gpa-min"
            className="filter-number-input"
            placeholder="0.0"
            step="0.1"
            min="0"
            max="4"
            value={filters.gpaMin}
            onChange={(e) => onFilterChange('gpaMin', e.target.value)}
          />
        </div>

        <div className="filter-select-group">
          <label className="filter-field-label">Max GPA</label>
          <input
            type="number"
            id="filter-gpa-max"
            className="filter-number-input"
            placeholder="4.0"
            step="0.1"
            min="0"
            max="4"
            value={filters.gpaMax}
            onChange={(e) => onFilterChange('gpaMax', e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <div className="filter-reset-wrap">
            <button
              id="clear-filters-btn"
              className="filter-reset-btn"
              onClick={() => onFilterChange('clear', '')}
              title="Reset all search queries and active filters"
            >
              <RotateCcwIcon size={13} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Results Status Line */}
      <div className="filter-results-status">
        <span className="results-count-text">
          Showing <strong>{totalResults}</strong> of <strong>{totalStudents}</strong> student records
        </span>
        {hasActiveFilters && (
          <span className="active-filters-pill">Filtered Results Active</span>
        )}
      </div>
    </section>
  );
}

export default SearchFilter;