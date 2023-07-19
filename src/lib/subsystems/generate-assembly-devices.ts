import dataOption from '../../data/options';
import type { AssemblyDevice } from '../../types/index';
import { generateAssemblyDevice } from './generate-assembly-device';

export const generateAssemblyDevices = (
  contactRefId: string,
  subsystem: string,
  childSubsystem: string,
): AssemblyDevice[] => {
  const assemblyDeviceArray = Array.from(
    { length: dataOption.assemblyDevices.length },
    () => generateAssemblyDevice(contactRefId, subsystem, childSubsystem),
  );

  return assemblyDeviceArray.filter(
    (value, index, self) =>
      self.findIndex((v) => v.name === value.name) === index,
  );
};
