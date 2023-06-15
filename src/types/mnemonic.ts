import { Status, DataType } from './util';

export type MnemonicsMap = Map<string, Mnemonic>;

export type MnemonicOptions = {
  contactRefId?: string;
  thresholdMin?: number;
  thresholdMax?: number;
  deviation?: number;
  precision?: number;
};

export type Mnemonic = {
  id: string;
  type: DataType;
  mnemonicId: string;
  status: Status;
  unit: string;
  thresholdMax: number;
  thresholdMin: number;
  currentValue: number;
  subsystem: string;
  childSubSystem: string;
  measurement: string;
  contactRefId: string;
};

export type ModifyMnemonicParams = {
  id: string;
  mnemonicId?: string;
  status?: Status;
  unit?: string;
  thresholdMax?: number;
  thresholdMin?: number;
  currentValue?: number;
  subsystem?: string;
  childSubSystem?: string;
  measurement?: string;
  contactRefId: string;
};
