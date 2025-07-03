import { useState } from 'react';
import 'leaflet/dist/leaflet.css';

import { useCrimeFilters } from './hooks/useCrimeFilters';
import { useNYPDData } from './hooks/useNYPDData';

import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import CrimeMap from './components/CrimeMap';
import Footer from './components/Footer';

function App() {
  const { crimeData, loading: dataLoading, error: dataError, stats } = useNYPDData();
  
  const {
    filteredCrimes,
    crimeTypeFilter,
    setCrimeTypeFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    searchQuery,
    setSearchQuery,
    clearFilters,
    uniqueCrimeTypes
  } = useCrimeFilters(crimeData);

  // Show loading state for data
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading NYPD crime data...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  // Show error state for data
  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Loading Error</h2>
          <p className="text-gray-600 mb-4">{dataError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show the main app with crime data
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto w-full">
        <FilterSidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          crimeTypeFilter={crimeTypeFilter}
          setCrimeTypeFilter={setCrimeTypeFilter}
          startDateFilter={startDateFilter}
          setStartDateFilter={setStartDateFilter}
          endDateFilter={endDateFilter}
          setEndDateFilter={setEndDateFilter}
          clearFilters={clearFilters}
          uniqueCrimeTypes={uniqueCrimeTypes}
          stats={stats}
        />
        
        <CrimeMap filteredCrimes={filteredCrimes} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
