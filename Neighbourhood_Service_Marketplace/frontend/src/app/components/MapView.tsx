import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons in React Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker icon for a more premium look
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  providers: any[];
}

const cityCoordinates: Record<string, [number, number]> = {
  'Mumbai': [19.0760, 72.8777],
  'Delhi': [28.7041, 77.1025],
  'Bangalore': [12.9716, 77.5946],
  'Hyderabad': [17.3850, 78.4867],
  'Chennai': [13.0827, 80.2707],
  'Pune': [18.5204, 73.8567],
  'Default': [22.9734, 78.6569] // Central India
};

// Fit map to markers component
function MapBounds({ markers }: { markers: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [markers, map]);
  
  return null;
}

export default function MapView({ providers }: MapViewProps) {
  const navigate = useNavigate();
  
  // Mapping locations to actual coordinates
  const providersWithCoords = providers.map((p, i) => {
    let baseCoords = cityCoordinates['Default'];
    if (p.location) {
      for (const [city, coords] of Object.entries(cityCoordinates)) {
        if (p.location.toLowerCase().includes(city.toLowerCase())) {
          baseCoords = coords;
          break;
        }
      }
    }

    return {
      ...p,
      // Random micro-jitter so pins in the same city don't perfectly overlap
      lat: p.lat || (baseCoords[0] + (Math.random() - 0.5) * 0.08),
      lng: p.lng || (baseCoords[1] + (Math.random() - 0.5) * 0.08)
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative z-10"
    >
      <MapContainer 
        center={[22.9734, 78.6569]} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={document.documentElement.classList.contains('dark') 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}
        />

        <MapBounds markers={providersWithCoords} />
        
        {providersWithCoords.map((provider) => (
          <Marker 
            key={provider.id} 
            position={[provider.lat, provider.lng]}
            icon={customIcon}
          >
            <Popup className="premium-popup">
              <div className="p-2 w-48 text-slate-900 dark:text-white">
                <div className="h-24 w-full rounded-lg overflow-hidden mb-2">
                  <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-black text-sm mb-1">{provider.name}</h4>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">{provider.service}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center text-xs font-bold text-amber-500">
                    <Star className="h-3 w-3 fill-amber-500 mr-1" />
                    {provider.rating}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">({provider.reviews} reviews)</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">{provider.price}</span>
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/provider/${provider.providerId || provider.id}`)}
                    className="h-7 px-3 text-[10px] font-black bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 z-[1000] shadow-lg">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <MapPin className="h-3 w-3 text-blue-600" />
          Showing {providers.length} Experts Near You
        </div>
      </div>
    </motion.div>
  );
}
