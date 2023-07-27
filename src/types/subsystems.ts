import { Status, Mnemonic } from './index';

export type Subsystem = {
  name: string;
  status: Status;
  childSubsystems: ChildSubsystem[];
};

export type ChildSubsystem = {
  name: string;
  status: Status;
  subsystemParent: string;
  assemblyDevices: AssemblyDevice[];
};

export type AssemblyDevice = {
  name: string;
  status: Status;
  childSubsystemParent: string;
  mnemonics: Mnemonic[];
};

export type SubsystemOptions = {
  desiredSubsystems?: string[];
  mnemonicsPerAssemblyDevice?: number;
};
