import { useSyncExternalStore, useContext } from 'react';
import { DataContext } from './DataProvider';

export const useContacts = () => {
  const { subscribe, getSnapshot, transformData } = useContext(DataContext);
  const selectedData = useSyncExternalStore(
    subscribe,
    () => getSnapshot().contacts,
  );
  const transformedData = transformData(selectedData);
  if (!transformedData) throw new Error('invalid data type selected');
  return transformedData;
};
