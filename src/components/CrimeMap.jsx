import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { useCrimeDataByBounds } from '../hooks/useCrimeDataByBounds';
import { useMapData } from '../hooks/useMapData';
import MapSidebar from './MapSidebar';

const DEFAULT_CENTER = [40.7128, -74.0060];
const DEFAULT_ZOOM = 11;

const DEFAULT_BOUNDS = {
  sw: { lat: 40.4774, lng: -74.2591 },
  ne: { lat: 40.9176, lng: -73.7004 }
};

function getBoundsObj(leafletBounds) {
  const sw = leafletBounds.getSouthWest();
  const ne = leafletBounds.getNorthEast();
  return {
    sw: { lat: sw.lat, lng: sw.lng },
    ne: { lat: ne.lat, lng: ne.lng }
  };
}

const MapInitializer = ({ setBounds }) => {
  const map = useMap();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const bounds = getBoundsObj(map.getBounds()); 
      setBounds(bounds);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [map, setBounds]);
  
  return null;
};

const BoundsListener = ({ setBounds, setIsMoving }) => {
  useMapEvents({
    movestart: () => {
      setIsMoving(true);
    },
    zoomstart: () => {
      setIsMoving(true);
    },
    moveend: (e) => {
      const map = e.target;
      const bounds = getBoundsObj(map.getBounds());
      setBounds(bounds);
      setIsMoving(false);
    },
    zoomend: (e) => {
      const map = e.target;
      const bounds = getBoundsObj(map.getBounds());
      setBounds(bounds);
      setIsMoving(false);
    },
  });
  return null;
};

const CrimeMap = () => {
  const [bounds, setBounds] = useState(DEFAULT_BOUNDS);
  const [isMoving, setIsMoving] = useState(false);
  const [filteredCrimeData, setFilteredCrimeData] = useState([]);

  const { crimeData, loading, error } = useCrimeDataByBounds(bounds);
  
  const { stats } = useMapData(filteredCrimeData);

  useEffect(() => {
    setFilteredCrimeData(crimeData);
  }, [crimeData]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6">
      <MapSidebar 
        stats={stats} 
        loading={loading} 
        error={error} 
        isMoving={isMoving} 
        crimeData={crimeData}
        onFilteredDataChange={setFilteredCrimeData}
      />
      
      <div className="card flex-1 overflow-hidden" style={{ minHeight: '600px', maxHeight: '700px' }}>
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Crime Map</h3>
            <div className="flex items-center space-x-2">
              {isMoving && (
                <div className="flex items-center text-yellow-600 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                  Updating...
                </div>
              )}
              <div className="text-sm text-gray-500">
                {loading ? 'Loading...' : `${filteredCrimeData.length} incident${filteredCrimeData.length !== 1 ? 's' : ''} shown`}
              </div>
            </div>
          </div>
        </div>
        <div className="map-container" style={{ height: '600px' }}>
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            className="leaflet-container"
          >
                      <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
            <MapInitializer setBounds={setBounds} />
            <BoundsListener setBounds={setBounds} setIsMoving={setIsMoving} />
            {filteredCrimeData.map((crime, index) => (
              <Marker key={crime.id || `crime-${index}-${crime.lat}-${crime.lng}`} position={[crime.lat, crime.lng]}>
                <Popup>
                  <div className="p-3 min-w-[220px]">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="font-semibold text-gray-900 text-sm">{crime.crimeType}</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3 leading-relaxed">{crime.description}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full font-medium">
                        {crime.borough}
                      </span>
                      <span className="text-gray-500">{new Date(crime.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        {error && (
          <div className="p-4 text-red-600 text-center">Error: {error}</div>
        )}
      </div>
    </div>
  );
};

export default CrimeMap; 