import { Status } from './util';

export type MnemonicOptions = {
  thresholdMin?: number;
  thresholdMax?: number;
  deviation?: number;
  precision?: number;
};

export type Mnemonic = {
  mnemonicId: string;
  status: Status;
  unit: string;
  threshold: number;
  currentValue: number;
  subsystem: string;
  contactRefId: string;
};
