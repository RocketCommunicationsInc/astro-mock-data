import { ChildSubsystem } from '../../types/equipment';
import dataOption from '../../data/options';
import { shuffle, getMostSevereStatus } from '../../utils';
import { generateAssemblyDevices } from './generate-assembly-devices';

export const generateChildSubsystem = (
  contactRefId: string,
  subsystem: string,
): ChildSubsystem => {
  const name = shuffle(dataOption.childSubSystems);
  const assemblyDevices = generateAssemblyDevices(
    contactRefId,
    subsystem,
    name,
  );
  const status = getMostSevereStatus(assemblyDevices);

  return {
    name,
    status: status,
    subsystemParent: subsystem,
    assemblyDevices: assemblyDevices,
  };
};
