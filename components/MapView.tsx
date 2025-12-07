import React, { useMemo } from 'react';
import { Park } from '../types';
import { MapPin, TreePine, Building2 } from 'lucide-react';

interface MapViewProps {
  parks: Park[];
  onMarkerClick: (park: Park) => void;
}

const MapView: React.FC<MapViewProps> = ({ parks, onMarkerClick }) => {
  
  // 1. Calculate Bounds & Aspect Ratio to preserve geometry
  const { markers, mapDecorations, viewBox } = useMemo(() => {
    const validParks = parks.filter(p => p.coordinates && p.coordinates.lat !== 0);
    
    if (validParks.length === 0) {
      return { markers: [], mapDecorations: [], viewBox: "0 0 100 100" };
    }

    const lats = validParks.map(p => p.coordinates!.lat);
    const lngs = validParks.map(p => p.coordinates!.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Add 10% padding
    const latBuffer = (maxLat - minLat) * 0.1 || 0.005;
    const lngBuffer = (maxLng - minLng) * 0.1 || 0.005;

    const boundMinLat = minLat - latBuffer;
    const boundMaxLat = maxLat + latBuffer;
    const boundMinLng = minLng - lngBuffer;
    const boundMaxLng = maxLng + lngBuffer;

    const latSpan = boundMaxLat - boundMinLat;
    const lngSpan = boundMaxLng - boundMinLng;

    // We project these into an SVG viewbox of 1000x1000 units roughly
    // BUT we adjust the aspect ratio so it's not stretched.
    // X = Longitude, Y = Latitude (inverted)
    
    const normalize = (lat: number, lng: number) => {
      const x = ((lng - boundMinLng) / lngSpan) * 1000;
      const y = 1000 - ((lat - boundMinLat) / latSpan) * 1000 * (latSpan / lngSpan); // Correct aspect ratio
      return { x, y };
    };

    const finalMarkers = validParks.map(park => ({
      park,
      ...normalize(park.coordinates!.lat, park.coordinates!.lng)
    }));

    // Calculate actual height used to set viewbox correctly
    const mapHeight = 1000 * (latSpan / lngSpan);
    
    // 2. Procedural "Fake" Map Generation
    // We generate random rectangles to look like city blocks based on a pseudo-random seed from park IDs
    // This ensures the map looks consistent for the same search but different for others.
    const decorations = [];
    const seed = validParks.length + (validParks[0]?.name.length || 0);
    
    // Generate "City Blocks"
    for (let i = 0; i < 25; i++) {
        const rX = (Math.sin(seed + i) * 10000) % 900;
        const rY = (Math.cos(seed + i) * 10000) % mapHeight;
        const rW = 50 + (Math.abs(Math.sin(i)) * 150);
        const rH = 50 + (Math.abs(Math.cos(i)) * 150);
        const rotation = Math.sin(i) > 0.5 ? 0 : (Math.sin(i) * 10); // Slight tilt

        decorations.push({
            type: i % 5 === 0 ? 'park' : 'block',
            x: Math.abs(rX),
            y: Math.abs(rY),
            w: rW,
            h: rH,
            rot: rotation
        });
    }

    return { 
      markers: finalMarkers, 
      mapDecorations: decorations,
      viewBox: `0 0 1000 ${mapHeight}`
    };
  }, [parks]);

  if (markers.length === 0) {
    return (
      <div className="w-full h-full bg-neo-mint/30 rounded-neo border-3 border-neo-black flex items-center justify-center p-8 text-center">
        <div>
          <MapPin size={48} className="mx-auto mb-4 text-neo-black opacity-50" />
          <p className="font-bold text-xl text-neo-black">No coordinates found</p>
          <p className="text-neo-black">Switch to List view to see details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#f0f0f0] rounded-neo border-3 border-neo-black relative overflow-hidden flex flex-col">
      
      {/* Map Header */}
      <div className="absolute top-4 left-4 z-20 bg-white/90 border-2 border-black px-3 py-2 rounded shadow-neo-sm">
        <h3 className="font-bold text-neo-black text-sm flex items-center gap-2">
           <MapPin size={16} className="text-neo-sky" /> Area Map
        </h3>
      </div>

      <div className="flex-1 relative overflow-hidden cursor-move touch-pan-x touch-pan-y">
         <svg 
            viewBox={viewBox} 
            className="w-full h-full bg-[#f4f4f5]" 
            preserveAspectRatio="xMidYMid meet"
         >
            {/* 1. Base Grid Pattern */}
            <defs>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#e5e5e5" strokeWidth="2"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* 2. Procedural City Blocks (Decoration) */}
            {mapDecorations.map((d, i) => (
                <g key={i} transform={`rotate(${d.rot}, ${d.x + d.w/2}, ${d.y + d.h/2})`}>
                    <rect
                        x={d.x}
                        y={d.y}
                        width={d.w}
                        height={d.h}
                        fill={d.type === 'park' ? '#C4EAD4' : '#e4e4e7'} // neo-mint or gray
                        stroke="#d4d4d8"
                        strokeWidth="4"
                        rx="10"
                    />
                    {d.type === 'park' && (
                       <text x={d.x + d.w/2} y={d.y + d.h/2} textAnchor="middle" fill="#1a1a1a" fontSize="24" opacity="0.2">PARK</text>
                    )}
                </g>
            ))}

            {/* 3. Connecting Lines (Abstract Roads) */}
            <path 
                d={`M ${markers.map(m => `${m.x},${m.y}`).join(' L ')}`}
                fill="none"
                stroke="#d1fae5" 
                strokeWidth="15"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
            />
             <path 
                d={`M ${markers.map(m => `${m.x},${m.y}`).join(' L ')}`}
                fill="none"
                stroke="#1a1a1a" 
                strokeWidth="4"
                strokeDasharray="10,10"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.2"
            />

            {/* 4. Markers */}
            {markers.map((marker, idx) => (
                <g key={marker.park.id} onClick={() => onMarkerClick(marker.park)} style={{ cursor: 'pointer' }}>
                    
                    {/* Shadow */}
                    <circle cx={marker.x + 10} cy={marker.y + 10} r="25" fill="#1a1a1a" opacity="0.3" />
                    
                    {/* Pin Circle */}
                    <circle 
                        cx={marker.x} 
                        cy={marker.y} 
                        r="25" 
                        fill={idx % 2 === 0 ? '#89CFF0' : '#FAD494'} // neo-sky or neo-yellow
                        stroke="#1a1a1a" 
                        strokeWidth="5"
                    />
                    
                    {/* Icon inside pin */}
                    <text x={marker.x} y={marker.y + 8} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1a1a1a">
                        {idx + 1}
                    </text>

                    {/* Label Box */}
                    <rect 
                        x={marker.x - 60} 
                        y={marker.y - 70} 
                        width="120" 
                        height="35" 
                        rx="8" 
                        fill="white" 
                        stroke="#1a1a1a" 
                        strokeWidth="3"
                    />
                    <text 
                        x={marker.x} 
                        y={marker.y - 48} 
                        textAnchor="middle" 
                        fontSize="18" 
                        fontWeight="bold" 
                        fill="#1a1a1a"
                    >
                        {marker.park.name.length > 10 ? marker.park.name.substring(0,9) + '...' : marker.park.name}
                    </text>
                </g>
            ))}
         </svg>
         
         <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-2 rounded-lg border-2 border-black text-xs font-bold shadow-neo-sm backdrop-blur-sm">
            <span className="block text-neo-black">Generated Schematic Map</span>
            <span className="text-gray-500 font-normal">Not to scale</span>
         </div>
      </div>
    </div>
  );
};

export default MapView;