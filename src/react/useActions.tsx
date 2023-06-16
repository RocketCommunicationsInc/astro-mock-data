import { useContext } from 'react';
import { DataContext } from './DataProvider';

export const useActions = () => useContext(DataContext);
