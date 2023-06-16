import { useSyncExternalStore, useContext } from 'react';
import { DataContext } from './DataProvider';

export const useAlerts = () => {
  const { subscribe, getSnapshot, transformData } = useContext(DataContext);
  const selectedData = useSyncExternalStore(
    subscribe,
    () => getSnapshot().alerts,
  );
  const transformedData = transformData(selectedData);
  if (!transformedData) throw new Error('invalid data type selected');
  return transformedData;
};
