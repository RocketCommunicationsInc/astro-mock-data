export type Alert = {
  errorId: string;
  errorSeverity: string;
  errorCategory: string;
  errorMessage: string;
  longMessage: string;
  errorTime: number;
  selected: boolean;
  new: boolean;
  expanded: boolean;
};

export type ContactStatus =
  | "caution"
  | "critical"
  | "normal"
  | "off"
  | "serious"
  | "standby";

export type Contact = {
  _id: string;
  contactId: string;
  contactStatus: ContactStatus;
  contactName: number;
  contactGround: string;
  contactSatellite: string;
  contactEquipment: string;
  contactState: string;
  contactStep: string;
  contactDetail: string;
  contactBeginTimestamp: number;
  contactEndTimestamp: number;
  contactLatitude: number;
  contactLongitude: number;
  contactAzimuth: number;
  contactElevation: number;
  contactResolution: string;
  contactResolutionStatus: string;
  alerts: Alert[];
};
