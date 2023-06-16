import { useRef, createContext, ReactNode } from 'react';
import { TTC_GRM_Service } from '../services/ttc-grm-service';
import type { ContactsServiceOptions } from '../types';

const initialStore = new TTC_GRM_Service({ initial: 0, limit: 0 });

export const DataContext = createContext<TTC_GRM_Service>(initialStore);

export const DataProvider = ({
  children,
  options,
}: {
  children: ReactNode;
  options: ContactsServiceOptions;
}) => {
  const contactsService = useRef(new TTC_GRM_Service(options));

  return (
    <DataContext.Provider value={contactsService.current}>
      {children}
    </DataContext.Provider>
  );
};
