
import React, { useState } from 'react';
import { Country, Stay } from '../types';
import { PlusCircleIcon } from './icons';

interface LogStayProps {
  countries: Country[];
  onAddStay: (stay: Stay) => void;
}

export const LogStay: React.FC<LogStayProps> = ({ countries, onAddStay }) => {
  const [countryCode, setCountryCode] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [exitDate, setExitDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!countryCode || !entryDate || !exitDate) {
      setError('All fields are required.');
      return;
    }
    if (new Date(entryDate) > new Date(exitDate)) {
        setError('Exit date must be after entry date.');
        return;
    }

    const newStay: Stay = {
      id: new Date().toISOString(),
      countryCode,
      entryDate,
      exitDate,
    };
    onAddStay(newStay);
    
    // Reset form
    setCountryCode('');
    setEntryDate('');
    setExitDate('');
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <PlusCircleIcon className="w-10 h-10 text-emerald-500" />
          <h1 className="text-3xl font-bold text-slate-800">Log a New Stay</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-slate-600 mb-1">Destination</label>
            <select
              id="country"
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            >
              <option value="">Select a country</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.country}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="entryDate" className="block text-sm font-medium text-slate-600 mb-1">Entry Date</label>
              <input
                type="date"
                id="entryDate"
                value={entryDate}
                onChange={e => setEntryDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label htmlFor="exitDate" className="block text-sm font-medium text-slate-600 mb-1">Exit Date</label>
              <input
                type="date"
                id="exitDate"
                value={exitDate}
                onChange={e => setExitDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
            >
              Add Stay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
