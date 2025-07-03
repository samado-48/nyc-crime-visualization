import { useState, useEffect } from 'react';
import { loadNYPDData, getCrimeStats } from '../utils/dataLoader';

export const useNYPDData = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('useNYPDData: Starting data load...');
        const data = await loadNYPDData();
        
        if (data.length === 0) {
          throw new Error('No crime data loaded. Please check if the CSV file exists.');
        }
        
        setCrimeData(data);
        
        // Calculate statistics
        const crimeStats = getCrimeStats(data);
        setStats(crimeStats);
        
        console.log('useNYPDData: Data loaded successfully', {
          totalCrimes: crimeStats.totalCrimes,
          uniqueTypes: crimeStats.uniqueCrimeTypes,
          uniqueBoroughs: crimeStats.uniqueBoroughs,
          dateRange: crimeStats.dateRange
        });
        
      } catch (err) {
        console.error('useNYPDData: Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    crimeData,
    loading,
    error,
    stats
  };
}; 