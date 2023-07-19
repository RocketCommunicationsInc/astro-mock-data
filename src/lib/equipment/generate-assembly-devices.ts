import dataOption from '../../data/options';
import type { AssemblyDevice } from '../../types/index';
import { generateAssemblyDevice } from './generate-assembly-device';

export const generateAssemblyDevices = (
  contactRefId: string,
): AssemblyDevice[] => {
  const assemblyDeviceArray = Array.from(
    { length: dataOption.assemblyDevices.length },
    () => generateAssemblyDevice(contactRefId),
  );

  return assemblyDeviceArray.filter(
    (value, index, self) =>
      self.findIndex((v) => v.name === value.name) === index,
  );
};
