
import { Country, PassportRules, StoredRules } from '../types';
import { getStoredRules, setStoredRules } from './db';

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch('/data/countries.json');
    if (!response.ok) {
      throw new Error('Failed to fetch countries list');
    }
    const countries: Country[] = await response.json();
    // Sort countries by name
    return countries.sort((a, b) => a.country.localeCompare(b.country));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

export const fetchAndStoreRules = async (countryCode: string): Promise<StoredRules> => {
  try {
    const response = await fetch(`/data/rules/${countryCode}.json`);
    if (!response.ok) {
      console.warn(`No rule file found for ${countryCode}.`);
      return getStoredRules();
    }
    const newRules: PassportRules = await response.json();
    const existingRules = await getStoredRules();
    const updatedRules: StoredRules = {
      ...existingRules,
      [countryCode]: newRules,
    };
    await setStoredRules(updatedRules);
    console.log(`Successfully fetched and stored rules for ${countryCode}`);
    return updatedRules;
  } catch (error) {
    console.error(`Error fetching rules for ${countryCode}:`, error);
    return getStoredRules();
  }
};
