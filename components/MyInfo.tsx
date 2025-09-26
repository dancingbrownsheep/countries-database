
import React, { useState, useEffect } from 'react';
import { UserInfo, Country } from '../types';
import { UserCircleIcon } from './icons';

interface MyInfoProps {
  userInfo: UserInfo | null;
  countries: Country[];
  onSave: (info: UserInfo) => Promise<void>;
  onReset: () => void;
}

export const MyInfo: React.FC<MyInfoProps> = ({ userInfo, countries, onSave, onReset }) => {
  const [name, setName] = useState('');
  const [selectedCitizenships, setSelectedCitizenships] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setSelectedCitizenships(userInfo.citizenships);
    }
  }, [userInfo]);

  const handleCitizenshipChange = (countryCode: string) => {
    setSelectedCitizenships(prev =>
      prev.includes(countryCode)
        ? prev.filter(c => c !== countryCode)
        : [...prev, countryCode]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({ name, citizenships: selectedCitizenships });
    setIsSaving(false);
  };
  
  const handleReset = () => {
    if(window.confirm("Are you sure you want to reset all application data? This action cannot be undone.")){
        onReset();
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <UserCircleIcon className="w-10 h-10 text-sky-500" />
          <h1 className="text-3xl font-bold text-slate-800">My Info</h1>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Alex Doe"
              className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Your Citizenship(s)</label>
            <div className="max-h-60 overflow-y-auto bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
              {countries.map(country => (
                <label key={country.code} className="flex items-center p-2 rounded-md hover:bg-slate-200 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCitizenships.includes(country.code)}
                    onChange={() => handleCitizenshipChange(country.code)}
                    className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-3 text-slate-700">{country.flag} {country.country}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex justify-center items-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? 'Saving...' : 'Save and Sync Rules'}
          </button>
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-all"
          >
            Reset App Data
          </button>
        </div>
      </div>
    </div>
  );
};
