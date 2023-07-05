import { generateContact } from '../lib/contacts/generate-contact';
import { generateContacts } from '../lib/contacts/generate-contacts';
import { generateAlert } from '../lib/alerts/generate-alert';
import { generateMnemonic } from '../lib/mnemonics/generate-mnemonic';
import type {
  Contact,
  ContactOptions,
  ContactsServiceOptions,
  ModifyContactParams,
  Unsubscribe,
  Alert,
  Mnemonic,
  Store,
  ModifyAlertParams,
  ModifyMnemonicParams,
  ContactsMap,
  AlertsMap,
  MnemonicsMap,
  AlertOptions,
  MnemonicOptions,
  StructuredData,
} from '../types';

const initialStore = {
  contacts: new Map(),
  alerts: new Map(),
  mnemonics: new Map(),
};
export class TTC_GRM_Service {
  private _data: Store = initialStore;
  private _subscribers: Set<Function> = new Set();
  private _contactOptions: ContactOptions = {};
  private _interval: number = 0;
  private _intervalId?: NodeJS.Timer = undefined;
  private _limit: number;

  constructor(options?: ContactsServiceOptions) {
    this.transformData = this.transformData.bind(this);
    this._contactOptions = {
      alertsPercentage: options?.alertsPercentage,
      dateRef: options?.dateRef,
      daysRange: options?.daysRange,
      secondAlertPercentage: options?.secondAlertPercentage,
    };
    this._interval = options?.interval || 0;
    this._limit = options?.limit || 200;

    if (options?.initial && this._data.contacts.size === 0) {
      this._generateInitialData(options.initial);
    }
  }

  private _generateInitialData = (initial: number) => {
    const contactsArray = generateContacts(initial, this._contactOptions);
    contactsArray.forEach((contact) =>
      this._data.contacts.set(contact.id, contact),
    );
    this._publish();
  };

  private _publish = () => {
    const newAlerts = new Map();
    const newMnemonics = new Map();

    const allContacts = Array.from(this._data.contacts.values());

    const alertsArray = allContacts.flatMap((contact) => contact.alerts);
    alertsArray.forEach((alert) => newAlerts.set(alert.id, alert));
    const mnemonicsArray = allContacts.flatMap((contact) => contact.mnemonics);
    mnemonicsArray.forEach((mnemonic) =>
      newMnemonics.set(mnemonic.id, mnemonic),
    );

    this._data.contacts = structuredClone(this._data.contacts);
    this._data.alerts = newAlerts;
    this._data.mnemonics = newMnemonics;
    this._subscribers.forEach((callback) => {
      callback(this._data);
    });
  };
  public subscribe = (callback: (data: Store) => void): Unsubscribe => {
    // sets interval for adding contacts on first subscribe
    if (this._subscribers.size === 0) {
      this._intervalId = this._interval
        ? setInterval(this.addContact.bind(this), 1000 * this._interval)
        : undefined;
    }

    this._subscribers.add(callback);
    this._publish();

    return () => {
      this._subscribers.delete(callback);
      if (this._subscribers.size < 1) {
        clearInterval(this._intervalId);
      }
    };
  };
  public getSnapshot = (): Store => {
    return this._data;
  };

  public transformData(mappedData: ContactsMap): StructuredData<Contact>;
  public transformData(mappedData: AlertsMap): StructuredData<Alert>;
  public transformData(mappedData: MnemonicsMap): StructuredData<Mnemonic>;
  public transformData(mappedData: ContactsMap | AlertsMap | MnemonicsMap) {
    const firstValue: Contact | Alert | Mnemonic = [...mappedData.values()][0];
    if (!firstValue) {
      return {
        dataArray: [],
        dataById: {},
        dataIds: [],
      };
    }
    if (firstValue.type === 'contact') {
      return this._buildStructuredData<Contact>(mappedData);
    } else if (firstValue.type === 'alert') {
      return this._buildStructuredData<Alert>(mappedData);
    } else if (firstValue.type === 'mnemonic') {
      return this._buildStructuredData<Mnemonic>(mappedData);
    }
  }

  public addContact = (
    options: ContactOptions = this._contactOptions,
  ): Contact | void => {
    if (this._data.contacts.size >= this._limit) {
      console.info('contact limit reached');
      clearInterval(this._intervalId);
      return;
    }

    const index = this._data.contacts.size - 1;
    const addedContact = generateContact(index, options);
    this._data.contacts.set(addedContact.id, addedContact);
    this._publish();
    return addedContact;
  };
  public addAlert = (contactId: string, options?: AlertOptions): Alert => {
    const newAlert = generateAlert({ contactRefId: contactId, ...options });
    const currentContact = this._data.contacts.get(contactId);
    if (!currentContact)
      throw new Error(`Contact with id ${contactId} does not exist`);
    this.modifyContact({
      id: contactId,
      alerts: [...currentContact.alerts, newAlert],
    });
    return newAlert;
  };
  public addMnemonic = (
    contactId: string,
    options?: MnemonicOptions,
  ): Mnemonic => {
    const newMnemonic = generateMnemonic({
      contactRefId: contactId,
      ...options,
    });
    const currentContact = this._data.contacts.get(contactId);
    if (!currentContact)
      throw new Error(`Contact with id ${contactId} does not exist`);
    this.modifyContact({
      id: contactId,
      mnemonics: [...currentContact.mnemonics, newMnemonic],
    });
    return newMnemonic;
  };

  public modifyContact = (params: ModifyContactParams): Contact => {
    const currentContact = this._data.contacts.get(params.id);
    if (!currentContact)
      throw new Error(`Contact with id ${params.id} does not exist`);
    const modifiedContact = { ...currentContact, ...params };
    this._data.contacts.set(params.id, modifiedContact);
    this._publish();
    return modifiedContact;
  };
  public modifyAlert = (params: ModifyAlertParams): Alert => {
    const currentContact = this._data.contacts.get(params.contactRefId);
    if (!currentContact)
      throw new Error(`Contact with id ${params.contactRefId} does not exist`);

    const currentAlert = currentContact?.alerts.find(
      (alert) => alert.id === params.id,
    );
    if (!currentAlert)
      throw new Error(`Alert with id ${params.id} does not exist`);

    const alertIndex = currentContact?.alerts.indexOf(currentAlert);
    const modifiedAlert = { ...currentAlert, ...params };
    currentContact.alerts.splice(alertIndex, 1, modifiedAlert);
    this._publish();
    return modifiedAlert;
  };
  public modifyMnemonic = (params: ModifyMnemonicParams): Mnemonic => {
    const currentContact = this._data.contacts.get(params.contactRefId);
    if (!currentContact)
      throw new Error(`Contact with id ${params.contactRefId} does not exist`);

    const currentMnemonic = currentContact?.mnemonics.find(
      (mnemonic) => mnemonic.id === params.id,
    );
    if (!currentMnemonic)
      throw new Error(`Alert with id ${params.id} does not exist`);

    const mnemonicIndex = currentContact?.mnemonics.indexOf(currentMnemonic);
    const modifiedMnemonic = { ...currentMnemonic, ...params };
    const modifiedMnemonics = currentContact.mnemonics.splice(
      mnemonicIndex,
      1,
      modifiedMnemonic,
    );

    this.modifyContact({ id: currentContact.id, mnemonics: modifiedMnemonics });

    return modifiedMnemonic;
  };

  public modifyAllContacts = (
    params: Omit<ModifyContactParams, 'id'>,
  ): string => {
    this._data.contacts.forEach((contact: Contact, contactId: string) => {
      this._data.contacts.set(contactId, { ...contact, ...params });
    });
    this._publish();
    return `Successfully modified all contacts`;
  };
  public modifyAllAlerts = (
    params: Omit<ModifyAlertParams, 'id' | 'contactRefId'>,
  ): string => {
    this._data.contacts.forEach((contact: Contact, contactId: string) => {
      const mappedAlerts = contact.alerts.map((alert) => {
        return { ...alert, ...params };
      });
      this._data.contacts.set(contactId, { ...contact, alerts: mappedAlerts });
    });
    this._publish();
    return `Successfully modified all alerts`;
  };
  public modifyAllMnemonics = (
    params: Omit<ModifyMnemonicParams, 'id' | 'contactRefId'>,
  ): string => {
    this._data.contacts.forEach((contact: Contact, contactId: string) => {
      const mappedMnemonics = contact.mnemonics.map((mnemonic) => {
        return { ...mnemonic, ...params };
      });
      this._data.contacts.set(contactId, {
        ...contact,
        mnemonics: mappedMnemonics,
      });
    });
    this._publish();
    return `Successfully modified all mnemonics`;
  };

  public deleteContact = (id: string): string => {
    this._data.contacts.delete(id);
    this._publish();
    return `Successfully deleted contact: ${id}`;
  };
  public deleteAlert = (contactRefId: string, alertId: string): string => {
    const currentContact = this._data.contacts.get(contactRefId);
    if (!currentContact)
      return `Contact with id ${contactRefId} does not exist`;
    const modifiedAlerts = currentContact.alerts.filter(
      (alert) => alert.id !== alertId,
    );

    this.modifyContact({ id: currentContact.id, alerts: modifiedAlerts });

    return `Successfully deleted alert: ${alertId}`;
  };
  public deleteMnemonic = (
    contactRefId: string,
    mnemonicId: string,
  ): string => {
    const currentContact = this._data.contacts.get(contactRefId);
    if (!currentContact)
      return `Contact with id ${contactRefId} does not exist`;
    const modifiedMnemonics = currentContact.mnemonics.filter(
      (mnemonic) => mnemonic.id !== mnemonicId,
    );

    this.modifyContact({ id: currentContact.id, mnemonics: modifiedMnemonics });

    return `Successfully deleted mnemonic: ${mnemonicId}`;
  };

  public deleteContactsWithProp = (
    property: keyof Contact,
    value: Contact[keyof Contact],
  ): string => {
    this._data.contacts.forEach((contact: Contact, contactId: string) => {
      if (contact[property] === value) this._data.contacts.delete(contactId);
    });
    this._publish();
    return `Successfully deleted all contacts with ${property} of ${value}`;
  };
  public deleteAlertsWithProp = (
    property: keyof Alert,
    value: Alert[keyof Alert],
  ): string => {
    const contacts = this._data.contacts;
    contacts.forEach((contact: Contact, contactId: string) => {
      const filteredAlerts = contact.alerts.filter(
        (alert) => alert[property] !== value,
      );
      contacts.set(contactId, {
        ...contact,
        alerts: filteredAlerts,
      });
    });
    this._publish();
    return `Successfully deleted all alerts with ${property} of ${value}`;
  };
  public deleteMnemonicsWithProp = (
    property: keyof Mnemonic,
    value: Mnemonic[keyof Mnemonic],
  ): string => {
    this._data.contacts.forEach((contact: Contact, contactId: string) => {
      const filteredMnemonics = contact.mnemonics.filter(
        (mnemonic) => mnemonic[property] !== value,
      );
      this._data.contacts.set(contactId, {
        ...contact,
        mnemonics: filteredMnemonics,
      });
    });
    this._publish();
    return `Successfully deleted all mnemonics with ${property} of ${value}`;
  };

  public allContactsHaveProp = (
    property: keyof Contact,
    value: Contact[keyof Contact],
  ): boolean => {
    const { dataArray } = this.transformData(this._data.contacts);
    return dataArray.every((data) => data[property] === value);
  };
  public allAlertsHaveProp = (
    property: keyof Alert,
    value: Alert[keyof Alert],
  ): boolean => {
    const { dataArray } = this.transformData(this._data.alerts);
    return dataArray.every((data) => data[property] === value);
  };
  public allMnemonicsHaveProp = (
    property: keyof Mnemonic,
    value: Mnemonic[keyof Mnemonic],
  ): boolean => {
    const { dataArray } = this.transformData(this._data.mnemonics);
    return dataArray.every((data) => data[property] === value);
  };

  public anyContactsHaveProp = (
    property: keyof Contact,
    value: Contact[keyof Contact],
  ): boolean => {
    const { dataArray } = this.transformData(this._data.contacts);
    return dataArray.some((data) => data[property] === value);
  };
  public anyAlertsHaveProp = (
    property: keyof Alert,
    value: Alert[keyof Alert],
  ): boolean => {
    const { dataArray } = this.transformData(this._data.alerts);
    return dataArray.some((data) => data[property] === value);
  };
  public anyMnemonicsHaveProp = (
    property: keyof Mnemonic,
    value: Mnemonic[keyof Mnemonic],
  ): boolean => {
    const { dataArray } = this.transformData(this._data.mnemonics);
    return dataArray.some((data) => data[property] === value);
  };

  private _buildStructuredData = <T>(
    mappedData: ContactsMap | AlertsMap | MnemonicsMap,
  ) => {
    const dataArray = [...mappedData.values()] as T[];
    const dataById = Object.fromEntries(mappedData.entries()) as {
      [key: string]: T;
    };
    const dataIds = [...mappedData.keys()] as string[];
    return { dataArray, dataById, dataIds };
  };
}
