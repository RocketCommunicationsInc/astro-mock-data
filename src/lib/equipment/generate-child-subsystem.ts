import { ChildSubsystem } from '../../types/equipment';
import dataOption from '../../data/options';
import { shuffle, getMostSevereStatus } from '../../utils';
import { generateAssemblyDevices } from './generate-assembly-devices';

export const generateChildSubsystem = (
  contactRefId: string,
): ChildSubsystem => {
  const assemblyDevices = generateAssemblyDevices(contactRefId);
  const status = getMostSevereStatus(assemblyDevices);

  return {
    name: shuffle(dataOption.childSubSystems),
    status: status,
    assemblyDevices: assemblyDevices,
  };
};
