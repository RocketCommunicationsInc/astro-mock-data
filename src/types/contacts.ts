import { Alert } from './alert';
import { AlertsPercentageOptions, Status } from './util';

export type ContactOptions = {
  alertsPercentage?: AlertsPercentageOptions;
  secondAlertPercentage?: AlertsPercentageOptions;
  daysRange?: number;
  dateRef?: string | number | Date;
};

export type Contact = {
  id: string;
  status: Status;
  name: number;
  ground: string;
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
  alerts: Alert[];
};
