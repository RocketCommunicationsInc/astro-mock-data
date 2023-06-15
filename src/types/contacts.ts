import { Alert } from './alert';
import { Mnemonic } from './mnemonic';
import { AlertsPercentage, Status, SubscribeOptions, DataType } from './util';

export type ContactsMap = Map<string, Contact>;

export type ContactOptions = {
  alertsPercentage?: AlertsPercentage;
  secondAlertPercentage?: AlertsPercentage;
  daysRange?: number;
  dateRef?: string | number | Date;
};

export type ContactsServiceOptions = ContactOptions & SubscribeOptions;
export type OnContactChangeOptions = ContactOptions & SubscribeOptions;

export type Contact = {
  id: string;
  type: DataType;
  status: Status;
  name: number;
  ground: string;
  rev: number;
  satellite: string;
  equipment: string;
  state: string;
  step: string;
  detail: string;
  beginTimestamp: number;
  endTimestamp: number;
  aos: number;
  los: number;
  latitude: number;
  longitude: number;
  azimuth: number;
  elevation: number;
  resolution: string;
  resolutionStatus: string;
  selected: boolean;
  alerts: Alert[];
  mnemonics: Mnemonic[];
};

export type ModifyContactParams = {
  id: string;
  ground?: string;
  satellite?: string;
  equipment?: string;
  state?: string;
  step?: string;
  detail?: string;
  beginTimestamp?: number;
  endTimestamp?: number;
  resolution?: string;
  resolutionStatus?: string;
  selected?: boolean;
  alerts?: Alert[];
  mnemonics?: Mnemonic[];
};

export type UpdateContactParams = {
  ground?: string;
  satellite?: string;
  equipment?: string;
  state?: string;
  step?: string;
  detail?: string;
  beginTimestamp?: number;
  endTimestamp?: number;
  resolution?: string;
  resolutionStatus?: string;
};
