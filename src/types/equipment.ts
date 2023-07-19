import { Status, Mnemonic } from './index';

export type Subsystem = {
  name: string;
  status: Status;
  childSubsystems: ChildSubsystem[];
};

export type ChildSubsystem = {
  name: string;
  status: Status;
  assemblyDevices: AssemblyDevice[];
};

export type AssemblyDevice = {
  name: string;
  status: Status;
  mnemonics: Mnemonic[];
};
