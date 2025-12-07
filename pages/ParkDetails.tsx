import React from 'react';
import { Park } from '../types';
import NeoButton from '../components/NeoButton';
import { ArrowLeft, TreePine, Armchair, Dog, Sun, CheckCircle, Info, MapPin, Camera, ExternalLink, Bath, Car, CircleHelp, Lightbulb } from 'lucide-react';
import NeoCard from '../components/NeoCard';

interface ParkDetailsProps {
  park: Park;
  onBack: () => void;
}

const ParkDetails: React.FC<ParkDetailsProps> = ({ park, onBack }) => {
  
  const openGallery = () => {
    // Opens a Google Image search for the park as a gallery fallback
    const query = encodeURIComponent(`${park.name} ${park.address} playground photos`);
    window.open(`https://www.google.com/search?tbm=isch&q=${query}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full animate-fade-in text-neo-black">
      {/* Header */}
      <div className="flex items-center mb-6">
        <NeoButton onClick={onBack} className="!p-2 mr-4" variant="secondary">
          <ArrowLeft size={24} />
        </NeoButton>
        <h1 className="text-2xl font-bold truncate text-neo-black">{park.name}</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 space-y-6">
        
        {/* Gallery / Photos Section */}
        <div onClick={openGallery} className="cursor-pointer group">
          <NeoCard className="bg-neo-black text-white relative overflow-hidden h-48 flex items-center justify-center border-3 border-black group-hover:shadow-neo-lg transition-all" color="bg-neo-black">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="z-10 text-center">
              <Camera size={48} className="mx-auto mb-2 text-neo-yellow" />
              <h3 className="text-xl font-bold text-white">View Photo Gallery</h3>
              <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-300">
                <span>See user photos</span>
                <ExternalLink size={14} />
              </div>
            </div>
          </NeoCard>
        </div>

        {/* Quick Tip Section */}
        {park.quickTip && (
          <div className="transform -rotate-1 mx-2">
             <NeoCard className="bg-neo-yellow border-3 border-black p-4 relative" color="bg-neo-yellow">
                <div className="absolute -top-3 -left-2 bg-neo-black text-white px-3 py-1 text-sm font-bold rounded-sm transform -rotate-2 border border-white flex items-center gap-1">
                   <Lightbulb size={14} className="text-neo-yellow" /> PRO TIP
                </div>
                <p className="text-neo-black font-bold text-lg mt-2 italic">
                   "{park.quickTip}"
                </p>
             </NeoCard>
          </div>
        )}

        {/* Main Info Card */}
        <NeoCard className="bg-white" color="bg-white">
            <div className="flex items-start gap-2 text-neo-black mb-4">
                <MapPin className="shrink-0 mt-1" size={20}/>
                <span className="text-lg font-bold">{park.address}</span>
            </div>
            <p className="text-neo-black leading-relaxed font-medium text-lg">
                {park.description}
            </p>
        </NeoCard>

        {/* Facilities Section (Restroom/Parking) */}
        <div className="grid grid-cols-2 gap-4">
             <NeoCard className="flex flex-col items-center justify-center p-4 text-center" color={park.hasRestrooms ? 'bg-neo-mint' : 'bg-gray-200'}>
                <Bath size={28} className="mb-2 text-neo-black" />
                <span className="font-bold text-neo-black">Restrooms</span>
                <span className="text-sm font-semibold mt-1 text-neo-black">{park.hasRestrooms ? 'Available' : 'Not Listed'}</span>
             </NeoCard>
             
             <NeoCard className="flex flex-col items-center justify-center p-4 text-center" color={park.hasParking ? 'bg-neo-purple' : 'bg-gray-200'}>
                <Car size={28} className="mb-2 text-neo-black" />
                <span className="font-bold text-neo-black">Parking</span>
                <span className="text-sm font-semibold mt-1 text-neo-black">{park.hasParking ? 'Lot/Street' : 'Limited'}</span>
             </NeoCard>
        </div>

        {/* Vital Stats */}
        <div className="grid grid-cols-2 gap-4">
             <NeoCard className="flex flex-col items-center justify-center p-4 text-center" color={park.hasShade ? 'bg-neo-mint' : 'bg-gray-100'}>
                <TreePine size={28} className="mb-2 text-neo-black" />
                <span className="font-bold text-neo-black">Shade</span>
                <span className="text-xs font-bold mt-1 text-neo-black">{park.hasShade ? 'Yes, Available' : 'Little to None'}</span>
             </NeoCard>
             
             <NeoCard className="flex flex-col items-center justify-center p-4 text-center" color={park.hasBenches ? 'bg-neo-yellow' : 'bg-gray-100'}>
                <Armchair size={28} className="mb-2 text-neo-black" />
                <span className="font-bold text-neo-black">Seating</span>
                <span className="text-xs font-bold mt-1 text-neo-black">{park.hasBenches ? 'Benches Available' : 'Limited'}</span>
             </NeoCard>

             <NeoCard className="flex flex-col items-center justify-center p-4 text-center" color={park.hasDogPark ? 'bg-neo-sky' : 'bg-gray-100'}>
                <Dog size={28} className="mb-2 text-neo-black" />
                <span className="font-bold text-neo-black">Dog Park</span>
                <span className="text-xs font-bold mt-1 text-neo-black">{park.hasDogPark ? 'Nearby/Attached' : 'No'}</span>
             </NeoCard>

             <NeoCard className="flex flex-col items-center justify-center p-4 text-center" color="bg-white">
                <Sun size={28} className="mb-2 text-neo-black" />
                <span className="font-bold text-neo-black">Rating</span>
                <span className="text-xs font-bold mt-1 text-neo-black">{park.rating} / 5.0</span>
             </NeoCard>
        </div>

        {/* Equipment List */}
        <NeoCard>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-neo-black">
                <Info size={24} /> Play Equipment
            </h3>
            {park.equipment.length > 0 ? (
                <ul className="space-y-3">
                    {park.equipment.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-black">
                            <CheckCircle size={20} className="text-neo-mint fill-black" />
                            <span className="font-bold capitalize text-neo-black">{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-neo-black font-medium italic">Specific equipment details not listed.</p>
            )}
        </NeoCard>
        
        {/* Amenities List */}
         <NeoCard>
            <h3 className="text-xl font-bold mb-4 text-neo-black">More Amenities</h3>
             <div className="flex flex-wrap gap-2">
                {park.amenities.map((item, idx) => (
                    <span key={idx} className="bg-neo-black text-neo-white px-3 py-1 rounded-full text-sm font-bold border border-black">
                        {item}
                    </span>
                ))}
                {park.amenities.length === 0 && <p className="text-neo-black font-medium italic">No other amenities listed.</p>}
             </div>
        </NeoCard>
      </div>
    </div>
  );
};

export default ParkDetails;