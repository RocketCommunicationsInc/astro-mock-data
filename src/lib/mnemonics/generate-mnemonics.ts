import { MnemonicOptions } from '../../types';
import { generateMnemonic } from './generate-mnemonic';

export const generateMnemonics = (
  contactRefId: string,
  length: number = 9,
  options?: MnemonicOptions,
) => Array.from({ length }, () => generateMnemonic(contactRefId, options));
