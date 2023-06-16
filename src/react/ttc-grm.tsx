import {
  useRef,
  createContext,
  ReactNode,
  useContext,
  useSyncExternalStore,
} from 'react';

import type { ContactsServiceOptions } from '../types';
import { TTC_GRM_Service } from '../services/ttc-grm-service';

const TTCGRMContext = createContext(
  new TTC_GRM_Service({ initial: 0, limit: 0 }),
);

export const useTTCGRMActions = () => useContext(TTCGRMContext);

export type TTCGRMProviderProps = {
  children: ReactNode;
  options: ContactsServiceOptions;
};

export const TTCGRMProvider = ({ children, options }: TTCGRMProviderProps) => {
  const contactsService = useRef(new TTC_GRM_Service(options));

  return (
    <TTCGRMContext.Provider value={contactsService.current}>
      {children}
    </TTCGRMContext.Provider>
  );
};

export const useTTCGRMAlerts = () => {
  const { subscribe, getSnapshot, transformData } = useTTCGRMActions();
  const selectedData = useSyncExternalStore(
    subscribe,
    () => getSnapshot().alerts,
  );
  const transformedData = transformData(selectedData);
  if (!transformedData) throw new Error('invalid data type selected');
  return transformedData;
};

export const useTTCGRMContacts = () => {
  const { subscribe, getSnapshot, transformData } = useTTCGRMActions();
  const selectedData = useSyncExternalStore(
    subscribe,
    () => getSnapshot().contacts,
  );
  const transformedData = transformData(selectedData);
  if (!transformedData) throw new Error('invalid data type selected');
  return transformedData;
};

export const useTTCGRMMnemonics = () => {
  const { subscribe, getSnapshot, transformData } = useTTCGRMActions();
  const selectedData = useSyncExternalStore(
    subscribe,
    () => getSnapshot().mnemonics,
  );
  const transformedData = transformData(selectedData);
  if (!transformedData) throw new Error('invalid data type selected');
  return transformedData;
};
