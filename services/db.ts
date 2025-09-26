
import { UserInfo, Stay, StoredRules } from '../types';

declare const localforage: any;

const USER_INFO_KEY = 'visa-voyage-userInfo';
const STAYS_KEY = 'visa-voyage-stays';
const RULES_KEY = 'visa-voyage-rules';

// User Info
export const getUserInfo = async (): Promise<UserInfo | null> => {
  return await localforage.getItem(USER_INFO_KEY);
};

export const setUserInfo = async (userInfo: UserInfo): Promise<UserInfo> => {
  return await localforage.setItem(USER_INFO_KEY, userInfo);
};

// Stays
export const getStays = async (): Promise<Stay[]> => {
  const stays = await localforage.getItem(STAYS_KEY);
  return stays || [];
};

export const addStay = async (stay: Stay): Promise<Stay[]> => {
  const stays = await getStays();
  const newStays = [...stays, stay];
  await localforage.setItem(STAYS_KEY, newStays);
  return newStays;
};

export const removeStay = async (stayId: string): Promise<Stay[]> => {
    const stays = await getStays();
    const newStays = stays.filter(s => s.id !== stayId);
    await localforage.setItem(STAYS_KEY, newStays);
    return newStays;
}

// Rules
export const getStoredRules = async (): Promise<StoredRules> => {
  const rules = await localforage.getItem(RULES_KEY);
  return rules || {};
};

export const setStoredRules = async (rules: StoredRules): Promise<StoredRules> => {
    return await localforage.setItem(RULES_KEY, rules);
}

export const clearAllData = async (): Promise<void> => {
    await localforage.clear();
}
