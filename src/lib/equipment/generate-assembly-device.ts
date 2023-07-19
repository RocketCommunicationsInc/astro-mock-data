import dataOption from '../../data/options';
import { shuffle } from '../../utils';
import type { AssemblyDevice } from '../../types/index';
import { generateMnemonics } from '../mnemonics/generate-mnemonics';
import { getMostSevereStatus } from '../../utils';

export const generateAssemblyDevice = (
  contactRefId: string,
  subsystem: string,
  childSubsystem: string,
): AssemblyDevice => {
  const name = shuffle(dataOption.assemblyDevices);
  const mnemonics = generateMnemonics(1, {
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
