import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  MapCameraChangedEvent
} from '@vis.gl/react-google-maps';

export const constituencies: Record<string, {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
}> = {
  pune_ls: {
    id: "pune_ls",
    name: "Pune",
    district: "Pune",
    lat: 18.5204,
    lng: 73.8567
  },
  mumbai_south_ls: {
    id: "mumbai_south_ls",
    name: "Mumbai South",
    district: "Mumbai",
    lat: 18.9388,
    lng: 72.8354
  },
  nagpur_ls: {
    id: "nagpur_ls",
    name: "Nagpur",
    district: "Nagpur",
    lat: 21.1458,
    lng: 79.0882
  },
  nashik_ls: {
    id: "nashik_ls",
    name: "Nashik",
    district: "Nashik",
    lat: 20.0063,
    lng: 73.7889
  },
  chhatrapati_sambhaji_nagar_ls: {
    id: "chhatrapati_sambhaji_nagar_ls",
    name: "Chhatrapati Sambhaji Nagar",
    district: "Aurangabad",
    lat: 19.8762,
    lng: 75.3433
  }
};

interface MaharashtraMapProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Custom Marker Component
function MapMarkers({ selectedId, onSelect }: { selectedId: string | null, onSelect: (id: string) => void }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      {Object.entries(constituencies).map(([key, c]) => {
        const isSelected = key === selectedId;
        const color = isSelected ? '#D97706' : '#5A5A40';
        
        return (
          <div key={key}>
            <AdvancedMarker
              position={{ lat: c.lat, lng: c.lng }}
              onClick={() => onSelect(key)}
              onMouseEnter={() => setHoveredId(key)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Pin 
                background={color} 
                glyphColor={'#FFFFFF'} 
                borderColor={'#FFFFFF'}
                scale={isSelected ? 1.2 : 1.0}
              />
            </AdvancedMarker>
            {isSelected && (
              <InfoWindow
                position={{ lat: c.lat, lng: c.lng }}
                headerDisabled
                pixelOffset={[0, -45]}
              >
                <div className="p-1 text-center min-w-[120px]">
                  <p className="font-bold text-[#1A1A17] text-sm">{c.name}</p>
                  <p className="text-[10px] text-[#706F66]">Selected Constituency</p>
                </div>
              </InfoWindow>
            )}
            {hoveredId === key && !isSelected && (
              <InfoWindow
                position={{ lat: c.lat, lng: c.lng }}
                headerDisabled
                pixelOffset={[0, -45]}
              >
                <div className="px-2 py-1">
                  <p className="font-bold text-xs">{c.name}</p>
                </div>
              </InfoWindow>
            )}
          </div>
        );
      })}
    </>
  );
}

// GeoJSON Component
function MaharashtraGeoJson({ selectedId, onSelect }: { selectedId: string | null, onSelect: (id: string) => void }) {
  const map = useMap();
  const geoJsonLoaded = useRef(false);

  useEffect(() => {
    if (!map || geoJsonLoaded.current) return;

    map.data.loadGeoJson('/maharashtra.geojson');
    geoJsonLoaded.current = true;

    map.data.setStyle((feature) => {
      const districtName = feature.getProperty('district');
      const matchedConstituency = Object.entries(constituencies).find(
        ([, c]) => c.district === districtName
      );
      const isTarget = !!matchedConstituency;
      const isSelected = matchedConstituency && matchedConstituency[0] === selectedId;

      return {
        fillColor: isSelected ? '#D97706' : (isTarget ? '#5A5A40' : '#F5F5F0'),
        fillOpacity: isSelected ? 0.3 : (isTarget ? 0.15 : 0.05),
        strokeColor: isSelected ? '#D97706' : (isTarget ? '#5A5A40' : '#ccc'),
        strokeWeight: isSelected ? 3 : (isTarget ? 2 : 0.5),
      };
    });

    map.data.addListener('click', (event: any) => {
      const districtName = event.feature.getProperty('district');
      const matchedConstituency = Object.entries(constituencies).find(
        ([, c]) => c.district === districtName
      );
      if (matchedConstituency) {
        onSelect(matchedConstituency[0]);
      }
    });

    map.data.addListener('mouseover', (event: any) => {
      map.data.overrideStyle(event.feature, {
        fillColor: '#D97706',
        fillOpacity: 0.3,
        strokeColor: '#D97706',
        strokeWeight: 3,
      });
    });

    map.data.addListener('mouseout', (event: any) => {
      map.data.revertStyle();
    });
  }, [map]);

  useEffect(() => {
    if (!map) return;
    map.data.setStyle((feature) => {
      const districtName = feature.getProperty('district');
      const matchedConstituency = Object.entries(constituencies).find(
        ([, c]) => c.district === districtName
      );
      const isTarget = !!matchedConstituency;
      const isSelected = matchedConstituency && matchedConstituency[0] === selectedId;

      return {
        fillColor: isSelected ? '#D97706' : (isTarget ? '#5A5A40' : '#F5F5F0'),
        fillOpacity: isSelected ? 0.3 : (isTarget ? 0.15 : 0.05),
        strokeColor: isSelected ? '#D97706' : (isTarget ? '#5A5A40' : '#ccc'),
        strokeWeight: isSelected ? 3 : (isTarget ? 2 : 0.5),
      };
    });
  }, [map, selectedId]);

  return null;
}

export function MaharashtraMap({ selectedId, onSelect }: MaharashtraMapProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 19.7515, lng: 75.7139 });
  const [zoom, setZoom] = useState(6.5);

  useEffect(() => {
    if (selectedId && constituencies[selectedId]) {
      const c = constituencies[selectedId];
      setMapCenter({ lat: c.lat, lng: c.lng });
      setZoom(8);
    }
  }, [selectedId]);

  return (
    <div className="relative w-full h-[450px] sm:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-[#E6E4DF] bg-[#F5F5F0]">
      <APIProvider apiKey={API_KEY}>
        <Map
          center={mapCenter}
          zoom={zoom}
          onCameraChanged={(ev: MapCameraChangedEvent) => {
            setMapCenter(ev.detail.center);
            setZoom(ev.detail.zoom);
          }}
          mapId="MAHARASHTRA_ELECTION_MAP" // Required for AdvancedMarker and cloud styling
          disableDefaultUI={false}
          clickableIcons={false}
          gestureHandling={'greedy'}
        >
          <MaharashtraGeoJson selectedId={selectedId} onSelect={onSelect} />
          <MapMarkers selectedId={selectedId} onSelect={onSelect} />
        </Map>
      </APIProvider>

      <style>{`
        .gm-style-iw {
          border-radius: 12px !important;
          padding: 0 !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important;
        }
        .gm-style-iw-d {
          overflow: hidden !important;
        }
        .gm-ui-hover-text {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
