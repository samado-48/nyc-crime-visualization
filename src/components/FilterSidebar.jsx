import { Search, Filter, Calendar, MapPin, XCircle, BarChart3 } from 'lucide-react';

const FilterSidebar = ({
  searchQuery,
  setSearchQuery,
  crimeTypeFilter,
  setCrimeTypeFilter,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter,
  clearFilters,
  uniqueCrimeTypes,
  stats
}) => {
  return (
    <aside className="card p-6 lg:w-80 flex-shrink-0 h-fit">
      <div className="flex items-center mb-6">
        <div className="bg-primary-100 p-2 rounded-lg mr-3">
          <Filter className="text-primary-600" size={20} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Filters & Search</h2>
      </div>

      <div className="space-y-6">
        {/* Search Bar */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="inline-block mr-2 text-gray-400" size={16} />
            Search Location/Description
          </label>
          <input
            type="text"
            id="search"
            placeholder="e.g., Manhattan, assault"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="crimeType" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline-block mr-2 text-gray-400" size={16} />
            Crime Type
          </label>
          <select
            id="crimeType"
            value={crimeTypeFilter}
            onChange={(e) => setCrimeTypeFilter(e.target.value)}
            className="select"
          >
            <option value="">All Crime Types</option>
            {uniqueCrimeTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline-block mr-2 text-gray-400" size={16} />
            Date Range
          </label>
          <div className="space-y-3">
            <div>
              <label htmlFor="startDate" className="block text-xs text-gray-500 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="input"
                min={stats?.dateRange?.min ? stats.dateRange.min.toISOString().split('T')[0] : undefined}
                max={stats?.dateRange?.max ? stats.dateRange.max.toISOString().split('T')[0] : undefined}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-xs text-gray-500 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="input"
                min={stats?.dateRange?.min ? stats.dateRange.min.toISOString().split('T')[0] : undefined}
                max={stats?.dateRange?.max ? stats.dateRange.max.toISOString().split('T')[0] : undefined}
              />
            </div>
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="w-full btn btn-danger"
        >
          <XCircle className="mr-2" size={18} />
          Clear All Filters
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <BarChart3 className="text-blue-600" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Data Statistics</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalCrimes.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Total Crimes</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {stats.uniqueCrimeTypes}
              </div>
              <div className="text-xs text-gray-500">Crime Types</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {stats.uniqueBoroughs}
              </div>
              <div className="text-xs text-gray-500">Boroughs</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-bold text-gray-900">
                {stats.dateRange.min ? stats.dateRange.min.toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">Earliest Date</div>
            </div>
          </div>
          
          {stats.dateRange.max && (
            <div className="mt-3 text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700">
                <span className="font-semibold">Date Range:</span> {stats.dateRange.min.toLocaleDateString()} - {stats.dateRange.max.toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar; 