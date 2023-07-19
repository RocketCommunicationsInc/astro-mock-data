import { Status, DataType, AtLeast } from './util';

export type MnemonicsMap = Map<string, Mnemonic>;

export type MnemonicOptions = {
  contactRefId?: string;
  thresholdMin?: number;
  thresholdMax?: number;
  deviation?: number;
  precision?: number;
  subsystem?: string;
  childSubsystem?: string;
  assemblyDevice?: string;
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
  childSubsystem: string;
  assemblyDevice: string;
  measurement: string;
  contactRefId: string;
};

export type ModifyMnemonicParams = AtLeast<Mnemonic, 'id' | 'contactRefId'>;
