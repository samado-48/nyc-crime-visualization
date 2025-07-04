import { useState, useEffect, useCallback, useRef } from 'react';

export const useCrimeDataByBounds = (bounds) => {
  const [crimeData, setCrimeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedBounds, setDebouncedBounds] = useState(null);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    if (!bounds) {
      return;
    }

    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedBounds(bounds);
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [bounds]);

  const fetchCrimeData = useCallback(async () => {
    if (!debouncedBounds) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const url = `http://127.0.0.1:5000/api/crimes?swLat=${debouncedBounds.sw.lat}&swLng=${debouncedBounds.sw.lng}&neLat=${debouncedBounds.ne.lat}&neLng=${debouncedBounds.ne.lng}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch crime data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const transformedData = data
        .filter(crime => {
          const lat = crime.Latitude;
          const lng = crime.Longitude;
          return !isNaN(lat) && !isNaN(lng);
        })
        .map((crime, index) => ({
          id: crime.id || crime.CMPLNT_NUM || `crime-${index}`,
          lat: crime.Latitude,
          lng: crime.Longitude,
          crimeType: crime.OFNS_DESC || 'Unknown',
          date: crime.CMPLNT_FR_DT || crime.RPT_DT || 'Unknown',
          borough: crime.BORO_NM || 'Unknown',
          description: `${crime.OFNS_DESC || 'Unknown crime'} - ${crime.LOC_OF_OCCUR_DESC || 'Unknown location'}`,
          time: crime.CMPLNT_FR_TM,
          location: crime.LOC_OF_OCCUR_DESC,
          jurisdiction: crime.JURISDICTION_CODE,
          rawData: crime
        }));
      
      setCrimeData(transformedData);
    } catch (err) {
      console.error('Error fetching crime data:', err);
      setError(err.message);
      setCrimeData([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedBounds]);

  useEffect(() => {
    fetchCrimeData();
  }, [fetchCrimeData]);

  return { crimeData, loading, error };
}; 