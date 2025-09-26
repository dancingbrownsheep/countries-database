
import React, { useState, useEffect, useCallback } from 'react';
import { UserInfo, Stay, Country, StoredRules } from './types';
import * as db from './services/db';
import * as dataSync from './services/dataSync';
import { MyInfo } from './components/MyInfo';
import { LogStay } from './components/LogStay';
import { StaysList } from './components/StaysList';
import { GlobeAltIcon, PlusCircleIcon, UserCircleIcon, ArrowPathIcon } from './components/icons';


type View = 'info' | 'log' | 'list';

const App: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [stays, setStays] = useState<Stay[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [rules, setRules] = useState<StoredRules>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    const [fetchedCountries, storedUserInfo, storedStays, storedRules] = await Promise.all([
      dataSync.fetchCountries(),
      db.getUserInfo(),
      db.getStays(),
      db.getStoredRules()
    ]);

    setCountries(fetchedCountries);
    setUserInfo(storedUserInfo);
    setStays(storedStays);
    setRules(storedRules);
    
    if(!storedUserInfo){
        setView('info');
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleSaveInfo = async (info: UserInfo) => {
    setIsSyncing(true);
    await db.setUserInfo(info);
    setUserInfo(info);

    // Determine which rule files need to be fetched
    const newCitizenships = info.citizenships.filter(code => !rules[code]);
    if (newCitizenships.length > 0) {
        let currentRules = await db.getStoredRules();
        for (const code of newCitizenships) {
            currentRules = await dataSync.fetchAndStoreRules(code);
        }
        setRules(currentRules);
    }
    setIsSyncing(false);
    alert('Your information has been saved and visa rules have been synced!');
    setView('list');
  };

  const handleAddStay = async (stay: Stay) => {
    const newStays = await db.addStay(stay);
    setStays(newStays);
    setView('list');
  };

  const handleRemoveStay = async (stayId: string) => {
    if (window.confirm('Are you sure you want to delete this stay?')) {
        const newStays = await db.removeStay(stayId);
        setStays(newStays);
    }
  };
  
  const handleReset = async () => {
    await db.clearAllData();
    setUserInfo(null);
    setStays([]);
    setRules({});
    setView('info');
    window.location.reload();
  }

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <ArrowPathIcon className="w-16 h-16 text-sky-500 animate-spin"/>
          <p className="mt-4 text-lg text-slate-600">Loading your travel data...</p>
        </div>
      );
    }

    switch (view) {
      case 'info':
        return <MyInfo userInfo={userInfo} countries={countries} onSave={handleSaveInfo} onReset={handleReset} />;
      case 'log':
        return <LogStay countries={countries} onAddStay={handleAddStay} />;
      case 'list':
        return <StaysList stays={stays} countries={countries} rules={rules} userInfo={userInfo} onRemoveStay={handleRemoveStay}/>;
      default:
        return <StaysList stays={stays} countries={countries} rules={rules} userInfo={userInfo} onRemoveStay={handleRemoveStay}/>;
    }
  };
  
  const NavItem: React.FC<{
    targetView: View;
    icon: React.ReactNode;
    label: string;
  }> = ({ targetView, icon, label}) => {
    const isActive = view === targetView;
    return (
      <button 
        onClick={() => setView(targetView)} 
        className={`flex-1 flex flex-col items-center justify-center p-2 rounded-md transition-colors ${
            isActive ? 'bg-sky-100 text-sky-600' : 'text-slate-500 hover:bg-slate-100'
        }`}
      >
        {icon}
        <span className="text-xs font-medium mt-1">{label}</span>
      </button>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <GlobeAltIcon className="w-8 h-8 text-sky-500"/>
                    <h1 className="text-xl font-bold text-slate-800">Visa Voyage</h1>
                </div>
            </div>
        </header>
        
        <main className="flex-grow pb-24">
            {isSyncing && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex items-center gap-4">
                        <ArrowPathIcon className="w-8 h-8 text-sky-500 animate-spin"/>
                        <span className="text-lg font-medium">Syncing Rules...</span>
                    </div>
                </div>
            )}
            {renderView()}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 shadow-t-lg">
            <div className="max-w-md mx-auto p-2 flex justify-around items-center gap-2">
                <NavItem targetView="list" icon={<GlobeAltIcon className="w-6 h-6"/>} label="My Stays" />
                <NavItem targetView="log" icon={<PlusCircleIcon className="w-6 h-6"/>} label="Log a Stay" />
                <NavItem targetView="info" icon={<UserCircleIcon className="w-6 h-6"/>} label="My Info" />
            </div>
        </nav>
    </div>
  );
};

export default App;
