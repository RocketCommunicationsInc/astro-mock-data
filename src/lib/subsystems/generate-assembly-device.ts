import dataOption from '../../data/options';
import { shuffle } from '../../utils';
import type { AssemblyDevice, SubsystemOptions } from '../../types/index';
import { generateMnemonics } from '../mnemonics/generate-mnemonics';
import { getMostSevereStatus } from '../../utils';

export const generateAssemblyDevice = (
  contactRefId: string,
  subsystem: string,
  childSubsystem: string,
  subsystemOptions?: SubsystemOptions,
): AssemblyDevice => {
  const name = shuffle(dataOption.assemblyDevices);
  const numOfMnemonics = subsystemOptions?.mnemonicsPerAssemblyDevice || 1;
  const mnemonics = generateMnemonics(numOfMnemonics, {
    contactRefId,
    subsystem,
    childSubsystem,
    assemblyDevice: name,
  });
  const status = getMostSevereStatus(mnemonics);

  return {
    name,
    status: status,
    childSubsystemParent: childSubsystem,
    mnemonics: mnemonics,
  };
};
