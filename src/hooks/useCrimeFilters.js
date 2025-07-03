import { useState, useEffect } from 'react';

export const useCrimeFilters = (crimes) => {
  const [filteredCrimes, setFilteredCrimes] = useState(crimes);
  const [crimeTypeFilter, setCrimeTypeFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Apply filters and search
  useEffect(() => {
    let updatedCrimes = crimes;

    // Filter by crime type
    if (crimeTypeFilter) {
      updatedCrimes = updatedCrimes.filter(crime =>
        crime.crimeType.toLowerCase().includes(crimeTypeFilter.toLowerCase())
      );
    }

    // Filter by date range
    if (startDateFilter) {
      updatedCrimes = updatedCrimes.filter(crime =>
        new Date(crime.date) >= new Date(startDateFilter)
      );
    }
    if (endDateFilter) {
      updatedCrimes = updatedCrimes.filter(crime =>
        new Date(crime.date) <= new Date(endDateFilter)
      );
    }

    // Filter by search query (borough or description)
    if (searchQuery) {
      updatedCrimes = updatedCrimes.filter(crime =>
        crime.borough.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crime.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCrimes(updatedCrimes);
  }, [crimeTypeFilter, startDateFilter, endDateFilter, searchQuery, crimes]);

  const clearFilters = () => {
    setCrimeTypeFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setSearchQuery('');
  };

  // Get unique crime types for the filter dropdown
  const uniqueCrimeTypes = [...new Set(crimes.map(crime => crime.crimeType))];

  return {
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
  };
}; 