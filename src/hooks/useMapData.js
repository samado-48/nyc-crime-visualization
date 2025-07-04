import { useState, useEffect } from 'react';

export const useMapData = (crimeData) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!crimeData || crimeData.length === 0) {
      setStats(null);
      return;
    }

    const uniqueCrimeTypes = [...new Set(crimeData.map(crime => crime.crimeType))];
    const uniqueBoroughs = [...new Set(crimeData.map(crime => crime.borough))];
    
    const dates = crimeData
      .map(crime => crime.date)
      .filter(date => date !== 'Unknown')
      .map(date => new Date(date))
      .filter(date => !isNaN(date.getTime()));
    
    const dateRange = dates.length > 0 ? {
      min: new Date(Math.min(...dates)),
      max: new Date(Math.max(...dates))
    } : { min: null, max: null };

    const crimesByType = {};
    crimeData.forEach(crime => {
      crimesByType[crime.crimeType] = (crimesByType[crime.crimeType] || 0) + 1;
    });

    const crimesByBorough = {};
    crimeData.forEach(crime => {
      crimesByBorough[crime.borough] = (crimesByBorough[crime.borough] || 0) + 1;
    });

    setStats({
      totalCrimes: crimeData.length,
      uniqueCrimeTypes: uniqueCrimeTypes.length,
      uniqueBoroughs: uniqueBoroughs.length,
      dateRange,
      crimesByType,
      crimesByBorough,
      uniqueCrimeTypesList: uniqueCrimeTypes.sort()
    });
  }, [crimeData]);

  return { stats };
}; 