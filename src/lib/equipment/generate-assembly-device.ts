import dataOption from '../../data/options';
import { shuffle } from '../../utils';
import type { AssemblyDevice } from '../../types/index';
import { generateMnemonics } from '../mnemonics/generate-mnemonics';
import { getMostSevereStatus } from '../../utils';

export const generateAssemblyDevice = (
  contactRefId: string,
): AssemblyDevice => {
  const mnemonics = generateMnemonics(3, { contactRefId });
  const status = getMostSevereStatus(mnemonics);

  return {
    name: shuffle(dataOption.assemblyDevices),
    status: status,
    mnemonics: mnemonics,
  };
};
