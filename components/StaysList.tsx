
import React from 'react';
import { Stay, Country, StoredRules, UserInfo, Rule } from '../types';
import { GlobeAltIcon, TrashIcon } from './icons';

interface StaysListProps {
  stays: Stay[];
  countries: Country[];
  rules: StoredRules;
  userInfo: UserInfo | null;
  onRemoveStay: (stayId: string) => void;
}

const getCountry = (code: string, countries: Country[]) => countries.find(c => c.code === code);

const getRuleForStay = (stay: Stay, citizenship: string, rules: StoredRules): Rule | undefined => {
  const passportRules = rules[citizenship];
  if (!passportRules) return undefined;
  return passportRules.rules.find(r => r.applicability.entry_country_code === stay.countryCode);
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-CA');

const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of start day
    return diffDays;
};

const VisaStatusBadge: React.FC<{ rule?: Rule }> = ({ rule }) => {
    if (!rule) {
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-200 text-slate-600">Rule Unknown</span>;
    }

    const isVisaFree = !rule.mapping.visa_required;
    const badgeClass = isVisaFree 
        ? "bg-green-100 text-green-800"
        : "bg-amber-100 text-amber-800";
    
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClass}`}>{rule.entryRule.visa_type}</span>;
}

export const StaysList: React.FC<StaysListProps> = ({ stays, countries, rules, userInfo, onRemoveStay }) => {
    const sortedStays = [...stays].sort((a,b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());

    if (stays.length === 0) {
        return (
            <div className="text-center py-16 px-6">
                <GlobeAltIcon className="mx-auto w-16 h-16 text-slate-300"/>
                <h2 className="mt-4 text-2xl font-bold text-slate-700">No Stays Logged Yet</h2>
                <p className="mt-2 text-slate-500">Use the "Log a Stay" page to add your first trip.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6 px-2">My Travel History</h1>
            <div className="space-y-4">
                {sortedStays.map(stay => {
                    const country = getCountry(stay.countryCode, countries);
                    const duration = calculateDuration(stay.entryDate, stay.exitDate);

                    return (
                        <div key={stay.id} className="bg-white rounded-xl shadow-md p-5 transition-shadow hover:shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                        <span className="text-3xl">{country?.flag}</span>
                                        {country?.country}
                                    </h2>
                                    <div className="mt-2 text-slate-500 text-sm flex items-center gap-4">
                                        <span>🗓️ {formatDate(stay.entryDate)} → {formatDate(stay.exitDate)}</span>
                                        <span className="font-semibold">{duration} days</span>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0 sm:text-right">
                                    <button onClick={() => onRemoveStay(stay.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                            
                            {userInfo && userInfo.citizenships.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <h4 className="text-sm font-semibold text-slate-600 mb-2">Visa Status:</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {userInfo.citizenships.map(code => {
                                            const citizenshipCountry = getCountry(code, countries);
                                            const rule = getRuleForStay(stay, code, rules);
                                            return (
                                                <div key={code} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                                    <span className="text-lg">{citizenshipCountry?.flag}</span>
                                                    <VisaStatusBadge rule={rule} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
