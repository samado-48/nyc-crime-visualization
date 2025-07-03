import Papa from 'papaparse';

export const loadNYPDData = async () => {
  try {
    console.log('Loading NYPD crime data...');
    
    const response = await fetch('/NYPD_Complaint_Data_Historic.csv');
    const csvText = await response.text();
    
    const { data, errors } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });
    
    if (errors.length > 0) {
      console.warn('CSV parsing warnings:', errors);
    }
    
    console.log(`Loaded ${data.length} crime records from CSV`);
    
    const transformedData = data
      .filter(record => record.CMPLNT_NUM && record.Latitude && record.Longitude)
      .map((record, index) => ({
        id: record.CMPLNT_NUM || `crime-${index}`,
        lat: parseFloat(record.Latitude),
        lng: parseFloat(record.Longitude),
        crimeType: record.OFNS_DESC || 'Unknown',
        date: record.CMPLNT_FR_DT || record.RPT_DT || 'Unknown',
        borough: record.BORO_NM || 'Unknown',
        description: `${record.OFNS_DESC || 'Unknown crime'} - ${record.LOC_OF_OCCUR_DESC || 'Unknown location'}`,
        time: record.CMPLNT_FR_TM,
        dayOfWeek: record.DAY_OF_WEEK,
        month: record.MONTH,
        year: record.YEAR,
        location: record.LOC_OF_OCCUR_DESC,
        jurisdiction: record.JURISDICTION_CODE,
        rawData: record
      }))
      .filter(crime => !isNaN(crime.lat) && !isNaN(crime.lng));
    
    console.log(`Transformed ${transformedData.length} valid crime records`);
    
    return transformedData;
  } catch (error) {
    console.error('Error loading NYPD data:', error);
  }
};

export const getUniqueCrimeTypes = (crimeData) => {
  const types = [...new Set(crimeData.map(crime => crime.crimeType))];
  return types.sort();
};

export const getUniqueBoroughs = (crimeData) => {
  const boroughs = [...new Set(crimeData.map(crime => crime.borough))];
  return boroughs.filter(borough => borough !== 'Unknown').sort();
};

export const getDateRange = (crimeData) => {
  const dates = crimeData
    .map(crime => crime.date)
    .filter(date => date !== 'Unknown')
    .map(date => new Date(date))
    .filter(date => !isNaN(date.getTime()));
  
  if (dates.length === 0) return { min: null, max: null };
  
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  
  return { min: minDate, max: maxDate };
};

export const getCrimeStats = (crimeData) => {
  const totalCrimes = crimeData.length;
  const crimeTypes = getUniqueCrimeTypes(crimeData);
  const boroughs = getUniqueBoroughs(crimeData);
  const dateRange = getDateRange(crimeData);
  
  const crimesByType = {};
  crimeData.forEach(crime => {
    crimesByType[crime.crimeType] = (crimesByType[crime.crimeType] || 0) + 1;
  });
  
  const crimesByBorough = {};
  crimeData.forEach(crime => {
    crimesByBorough[crime.borough] = (crimesByBorough[crime.borough] || 0) + 1;
  });
  
  return {
    totalCrimes,
    uniqueCrimeTypes: crimeTypes.length,
    uniqueBoroughs: boroughs.length,
    dateRange,
    crimesByType,
    crimesByBorough
  };
}; 