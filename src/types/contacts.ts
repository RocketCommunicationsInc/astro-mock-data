import { Alert } from './alert';
import { Mnemonic } from './mnemonic';
import {
  AlertsPercentage,
  Status,
  SubscribeOptions,
  DataType,
  Priority,
  Mode,
  AtLeast,
} from './util';

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
  priority: Priority;
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
  dayOfYear: number;
  latitude: number;
  longitude: number;
  azimuth: number;
  elevation: number;
  resolution: string;
  resolutionStatus: string;
  mode: Mode;
  selected: boolean;
  alerts: Alert[];
  mnemonics: Mnemonic[];
};

export type ModifyContactParams = AtLeast<Contact, 'id'>;

// export type ModifyContactParams = {
//   id: string;
//   ground?: string;
//   satellite?: string;
//   equipment?: string;
//   state?: string;
//   step?: string;
//   detail?: string;
//   beginTimestamp?: number;
//   endTimestamp?: number;
//   resolution?: string;
//   resolutionStatus?: string;
//   selected?: boolean;
//   alerts?: Alert[];
//   mnemonics?: Mnemonic[];
//   priority?: Priority;
//   mode?: Mode;
// };

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
  priority?: Priority;
  mode?: Mode;
};
