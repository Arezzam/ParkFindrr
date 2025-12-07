import React from 'react';
import { Park } from '../types';
import NeoCard from './NeoCard';
import { TreePine, Armchair, Dog, Star, MapPin } from 'lucide-react';

interface ParkCardProps {
  park: Park;
  onClick: () => void;
}

const ParkCard: React.FC<ParkCardProps> = ({ park, onClick }) => {
  return (
    <NeoCard onClick={onClick} hoverEffect className="h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold leading-tight text-neo-black">{park.name}</h3>
          <div className="flex items-center gap-1 bg-neo-black text-neo-white px-2 py-1 rounded-md text-sm font-bold border border-neo-black">
            <Star size={14} fill="currentColor" />
            <span>{park.rating}</span>
          </div>
        </div>
        
        <div className="flex items-start gap-1 text-gray-800 mb-4 text-sm font-medium">
          <MapPin size={16} className="shrink-0 mt-0.5" />
          <p className="line-clamp-1">{park.address}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {park.hasShade && (
            <span className="flex items-center gap-1 text-xs font-bold bg-neo-mint px-2 py-1 rounded-full border-2 border-neo-black text-neo-black">
              <TreePine size={12} /> Shaded
            </span>
          )}
          {park.hasBenches && (
            <span className="flex items-center gap-1 text-xs font-bold bg-neo-yellow px-2 py-1 rounded-full border-2 border-neo-black text-neo-black">
              <Armchair size={12} /> Seating
            </span>
          )}
          {park.hasDogPark && (
            <span className="flex items-center gap-1 text-xs font-bold bg-neo-sky px-2 py-1 rounded-full border-2 border-neo-black text-neo-black">
              <Dog size={12} /> Dog Park
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t-2 border-gray-200">
        <p className="text-sm text-gray-900 font-medium line-clamp-2">
          {park.equipment.length > 0 ? (
            <span className="font-bold">Features: {park.equipment.join(', ')}</span>
          ) : park.description}
        </p>
      </div>
    </NeoCard>
  );
};

export default ParkCard;