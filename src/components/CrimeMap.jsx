import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from '../config/leaflet';

// Component to update map view when filtered crimes change
const MapUpdater = ({ filteredCrimes }) => {
  const map = useMap();
  
  useEffect(() => {
    console.log('MapUpdater: filteredCrimes changed', filteredCrimes.length);
    if (filteredCrimes.length > 0) {
      const bounds = L.latLngBounds(filteredCrimes.map(crime => [crime.lat, crime.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([40.7128, -74.0060], 10);
    }
  }, [filteredCrimes, map]);
  
  return null;
};

const CrimeMap = ({ filteredCrimes }) => {
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    console.log('CrimeMap: Component mounted, filteredCrimes:', filteredCrimes.length);
    setMapKey(prev => prev + 1);
  }, []);

  return (
    <div className="card flex-1 overflow-hidden" style={{ minHeight: '600px' }}>
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Crime Map</h3>
          <div className="text-sm text-gray-500">
            {filteredCrimes.length} incident{filteredCrimes.length !== 1 ? 's' : ''} shown
          </div>
        </div>
      </div>
      
      <div className="map-container" style={{ height: 'calc(100% - 73px)' }}>
        <MapContainer
          key={mapKey}
          center={[40.7128, -74.0060]}
          zoom={10}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          className="leaflet-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater filteredCrimes={filteredCrimes} />
          {filteredCrimes.map(crime => (
            <Marker key={crime.id} position={[crime.lat, crime.lng]}>
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
    </div>
  );
};

export default CrimeMap; 