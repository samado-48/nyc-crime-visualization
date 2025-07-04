import { MapPin, Calendar, AlertTriangle, Search, Filter, XCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

const MapSidebar = ({ stats, loading, error, isMoving, crimeData, onFilteredDataChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [crimeTypeFilter, setCrimeTypeFilter] = useState('');
  const [boroughFilter, setBoroughFilter] = useState('');

  const uniqueCrimeTypes = useMemo(() => {
    if (!crimeData) return [];
    return [...new Set(crimeData.map(crime => crime.crimeType))].sort();
  }, [crimeData]);

  const uniqueBoroughs = useMemo(() => {
    if (!crimeData) return [];
    return [...new Set(crimeData.map(crime => crime.borough))].sort();
  }, [crimeData]);

  const filteredData = useMemo(() => {
    if (!crimeData) return [];
    
    return crimeData.filter(crime => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        crime.crimeType.toLowerCase().includes(searchLower) ||
        crime.borough.toLowerCase().includes(searchLower) ||
        crime.description.toLowerCase().includes(searchLower);

      const matchesCrimeType = !crimeTypeFilter || crime.crimeType === crimeTypeFilter;

      const matchesBorough = !boroughFilter || crime.borough === boroughFilter;

      return matchesSearch && matchesCrimeType && matchesBorough;
    });
  }, [crimeData, searchQuery, crimeTypeFilter, boroughFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setCrimeTypeFilter('');
    setBoroughFilter('');
  };

  useEffect(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(filteredData);
    }
  }, [filteredData, onFilteredDataChange]);

  if (loading) {
    return (
      <aside className="card p-6 lg:w-80 flex-shrink-0 h-fit">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crime data...</p>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="card p-6 lg:w-80 flex-shrink-0 h-fit">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="card p-6 lg:w-80 flex-shrink-0 h-fit">
      {isMoving && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
            <span className="text-sm text-yellow-700">Updating data for new area...</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <Filter className="text-blue-600" size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Search & Filters</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="inline-block mr-2 text-gray-400" size={14} />
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search crime types, boroughs, descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="crimeType" className="block text-sm font-medium text-gray-700 mb-2">
              Crime Type
            </label>
            <select
              id="crimeType"
              value={crimeTypeFilter}
              onChange={(e) => setCrimeTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Crime Types</option>
              {uniqueCrimeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="borough" className="block text-sm font-medium text-gray-700 mb-2">
              Borough
            </label>
            <select
              id="borough"
              value={boroughFilter}
              onChange={(e) => setBoroughFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Boroughs</option>
              {uniqueBoroughs.map(borough => (
                <option key={borough} value={borough}>{borough}</option>
              ))}
            </select>
          </div>

          {(searchQuery || crimeTypeFilter || boroughFilter) && (
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              <XCircle className="mr-2" size={16} />
              Clear All Filters
            </button>
          )}

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{filteredData.length}</span> of <span className="font-medium">{crimeData?.length || 0}</span> crimes shown
            </div>
          </div>
        </div>
      </div>

      {stats ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Map View</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">
                  {stats.totalCrimes.toLocaleString()}
                </div>
                <div className="text-xs text-blue-700">Crimes in View</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">
                  {stats.uniqueCrimeTypes}
                </div>
                <div className="text-xs text-green-700">Crime Types</div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">
                  {stats.uniqueBoroughs}
                </div>
                <div className="text-xs text-purple-700">Boroughs</div>
              </div>
              
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-sm font-bold text-orange-900">
                  {stats.dateRange.min ? stats.dateRange.min.toLocaleDateString() : 'N/A'}
                </div>
                <div className="text-xs text-orange-700">Earliest Date</div>
              </div>
            </div>
          </div>

          {stats.dateRange.max && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="text-gray-500 mr-2" size={16} />
                <span className="text-sm font-medium text-gray-700">Date Range</span>
              </div>
              <div className="text-sm text-gray-600">
                {stats.dateRange.min.toLocaleDateString()} - {stats.dateRange.max.toLocaleDateString()}
              </div>
            </div>
          )}

          {stats.crimesByType && Object.keys(stats.crimesByType).length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Top Crime Types</h4>
              <div className="space-y-2">
                {Object.entries(stats.crimesByType)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700 truncate">{type}</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <MapPin className="text-blue-500 mr-2" size={16} />
              <span className="text-sm font-medium text-blue-700">How to Use</span>
            </div>
            <div className="text-xs text-blue-600 space-y-1">
              <p>• Pan and zoom the map to load crime data for different areas</p>
              <p>• Use search and filters to find specific crimes</p>
              <p>• Data updates automatically when you stop moving (500ms delay)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>No data available for the current map view.</p>
          <p className="text-sm mt-2">Try moving or zooming the map to load crime data.</p>
        </div>
      )}
    </aside>
  );
};

export default MapSidebar; 