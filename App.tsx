import React, { useState, useEffect } from 'react';
import { Search, Map, List, Navigation } from 'lucide-react';
import { Park, SearchState, ViewMode } from './types';
import { searchParks } from './services/geminiService';
import NeoButton from './components/NeoButton';
import ParkCard from './components/ParkCard';
import MapView from './components/MapView';
import ParkDetails from './pages/ParkDetails';
import NeoCard from './components/NeoCard';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const [searchState, setSearchState] = useState<SearchState>({
    loading: false,
    results: [],
    error: null,
    searchedLocation: ''
  });
  const [inputLocation, setInputLocation] = useState('');

  // Initial load
  useEffect(() => {
    // Optional: Load some default data or user location
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputLocation.trim()) return;

    setSearchState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const results = await searchParks(inputLocation);
      setSearchState({
        loading: false,
        results,
        error: null,
        searchedLocation: inputLocation
      });
    } catch (err) {
      setSearchState(prev => ({
        ...prev,
        loading: false,
        error: "Oops! Couldn't find parks there. Try a different city."
      }));
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setSearchState(prev => ({ ...prev, loading: true }));
    setInputLocation("Finding location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locString = `${latitude},${longitude}`;
        try {
          const results = await searchParks(locString);
          setSearchState({
            loading: false,
            results,
            error: null,
            searchedLocation: "Current Location"
          });
          setInputLocation("Current Location");
        } catch (err) {
           setSearchState(prev => ({ ...prev, loading: false, error: "Failed to search near you." }));
        }
      },
      () => {
         setSearchState(prev => ({ ...prev, loading: false, error: "Location permission denied." }));
         setInputLocation("");
      }
    );
  };

  // Render Park Detail View
  if (selectedPark) {
    return (
      <div className="max-w-md mx-auto h-screen bg-neo-purple p-4 overflow-hidden font-sans">
        <ParkDetails park={selectedPark} onBack={() => setSelectedPark(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen bg-neo-purple flex flex-col font-sans relative">
      
      {/* Top Bar */}
      <div className="p-4 pt-6">
        <div className="flex justify-between items-center mb-6">
           {/* Logo Badge */}
           <div className="bg-neo-black text-neo-white px-4 py-2 rounded-full border-3 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transform -rotate-2">
              <h1 className="font-bold text-xl tracking-tighter">PARKFINDRR</h1>
           </div>
           
           <div className="bg-white px-3 py-1 rounded-lg border-2 border-black text-sm font-bold text-neo-black">
              Beta
           </div>
        </div>

        {/* Search Area */}
        <NeoCard className="mb-4 bg-white p-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input 
              type="text" 
              value={inputLocation}
              onChange={(e) => setInputLocation(e.target.value)}
              placeholder="City, zip, or neighborhood..."
              className="flex-1 bg-gray-100 rounded-lg px-3 py-2 border-2 border-transparent focus:border-neo-black focus:bg-white text-neo-black placeholder-gray-500 transition-colors outline-none font-bold"
            />
            <button 
                type="button"
                onClick={handleUseMyLocation}
                className="p-2 bg-neo-mint border-2 border-black rounded-lg hover:brightness-95 active:scale-95 text-neo-black"
                title="Use my location"
            >
                <Navigation size={20} />
            </button>
          </form>
          <div className="mt-2">
             <NeoButton onClick={handleSearch} fullWidth disabled={searchState.loading}>
                {searchState.loading ? 'Searching...' : 'Find Playgrounds'}
             </NeoButton>
          </div>
        </NeoCard>

        {/* Filter / View Toggles */}
        {searchState.results.length > 0 && (
          <div className="flex gap-2 mb-2">
            <button 
              onClick={() => setViewMode(ViewMode.LIST)}
              className={`flex-1 py-2 font-bold border-2 border-black rounded-lg flex justify-center items-center gap-2 transition-all
                ${viewMode === ViewMode.LIST ? 'bg-neo-black text-white shadow-neo-sm' : 'bg-white text-black'}`}
            >
              <List size={18} /> List
            </button>
            <button 
              onClick={() => setViewMode(ViewMode.MAP)}
              className={`flex-1 py-2 font-bold border-2 border-black rounded-lg flex justify-center items-center gap-2 transition-all
                ${viewMode === ViewMode.MAP ? 'bg-neo-black text-white shadow-neo-sm' : 'bg-white text-black'}`}
            >
              <Map size={18} /> Map
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden rounded-t-3xl bg-white border-t-3 border-neo-black relative">
        <div className="h-full overflow-y-auto p-4 pb-24">
          
          {searchState.error && (
            <div className="text-center p-8 bg-neo-sky rounded-xl border-3 border-black">
              <p className="font-bold text-lg mb-2 text-neo-black">Uh oh!</p>
              <p className="text-neo-black font-medium">{searchState.error}</p>
            </div>
          )}

          {searchState.loading && (
             <div className="flex flex-col items-center justify-center h-64 space-y-6 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-neo-mint border-3 border-black relative">
                    <div className="absolute inset-0 rounded-full border-2 border-black animate-ping opacity-20"></div>
                </div>
                <p className="font-bold text-xl text-neo-black">Scouting locations...</p>
             </div>
          )}

          {!searchState.loading && !searchState.error && searchState.results.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-80">
                <div className="mb-4 transform rotate-12">
                   <div className="w-32 h-48 bg-neo-yellow rounded-xl border-3 border-black shadow-neo flex items-center justify-center">
                        <Map size={48} className="text-neo-black opacity-20" />
                   </div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-neo-black">Ready to play?</h3>
                <p className="text-neo-black font-medium">Enter a location above to find the best playgrounds nearby.</p>
             </div>
          )}

          {!searchState.loading && searchState.results.length > 0 && (
            <>
              {viewMode === ViewMode.LIST ? (
                <div className="space-y-4">
                  {searchState.results.map((park) => (
                    <ParkCard 
                      key={park.id} 
                      park={park} 
                      onClick={() => setSelectedPark(park)} 
                    />
                  ))}
                  <div className="h-8"></div>
                </div>
              ) : (
                <div className="h-[500px]">
                   <MapView parks={searchState.results} onMarkerClick={setSelectedPark} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default App;