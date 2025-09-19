import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function StoreLocationsMap() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch('/api/store-locations')
      .then(res => res.json())
      .then(data => setLocations(data));
  }, []);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer center={[29.5, -95.5]} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {locations.map((loc, idx) => (
          <Marker key={idx} position={[loc.lat, loc.lng]}>
            <Popup>
              <strong>{loc.name}</strong><br />
              {loc.address}<br />
              {loc.city}, {loc.state} {loc.zip_code}<br />
              {loc.phone}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
