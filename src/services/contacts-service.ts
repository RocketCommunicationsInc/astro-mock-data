import { generateContact } from '../lib/contacts/generate-contact';
import { generateContacts } from '../lib/contacts/generate-contacts';
import type {
  Contact,
  ContactOptions,
  ContactsServiceOptions,
  ModifyContactParams,
  SubscribeOptions,
  Unsubscribe,
  Alert,
  Mnemonic,
  Store,
} from '../types';

const initialStore = {
  contacts: new Map(),
  alerts: new Map(),
  mnemonics: new Map(),
};

type ContactsMap = Map<string, Contact>;
export class ContactsService {
  private _data: Store = initialStore;
  private _subscribers: Set<Function> = new Set();
  private _contactOptions: ContactOptions = {};
  private _subscribeOptions: SubscribeOptions = {};
  //TODO Fix interval clearing
  private _intervalId: NodeJS.Timer = '' as any;

  constructor(options?: ContactsServiceOptions) {
    this._contactOptions = {
      alertsPercentage: options?.alertsPercentage,
      dateRef: options?.dateRef,
      daysRange: options?.daysRange,
      secondAlertPercentage: options?.secondAlertPercentage,
    };

    this._subscribeOptions = {
      initial: options?.initial,
      interval: options?.interval,
      limit: options?.limit,
    };

    if (options?.initial) this._generateInitialData(options.initial);
    if (options?.interval) this._generateIntervalData(options.interval);
  }

  private _generateInitialData = (initial: number) => {
    const contactsArray = generateContacts(initial, this._contactOptions);
    contactsArray.forEach((contact) =>
      this._data.contacts.set(contact.id, contact),
    );
  };

  private _generateIntervalData = (interval: number = 5) => {
    setInterval(() => {
      this.addContact();
    }, interval * 1000);
    // TODO figure out how to store intervalID in class state
  };

  private _publish = (data: Store) => {
    const alertsArray = Array.from(data.contacts.values()).flatMap(
      (contact) => contact.alerts,
    );
    alertsArray.forEach((alert) => this._data.alerts.set(alert.id, alert));

    const mnemonicsArray = Array.from(data.contacts.values()).flatMap(
      (contact) => contact.mnemonics,
    );
    mnemonicsArray.forEach((mnemonic) =>
      this._data.mnemonics.set(mnemonic.id, mnemonic),
    );

    this._subscribers.forEach((callback) => {
      callback(data);
    });
  };

  public subscribe = (
    callback: (contacts: ContactsMap) => void,
  ): Unsubscribe => {
    this._subscribers.add(callback);
    this._publish(this._data);

    return () => {
      this._subscribers.delete(callback);
      //TODO fix interval clearing
      if (this._subscribers.size <= 1) clearInterval(this._intervalId);
    };
  };

  public getSnapshot = (): Store => {
    return this._data;
  };

  public addContact = (): Contact => {
    const index = this._data.contacts.size - 1;
    const addedContact = generateContact(index, this._contactOptions);
    this._data.contacts.set(addedContact.id, addedContact);
    this._data = structuredClone(this._data);
    this._publish(this._data);
    return addedContact;
  };

  public modifyContact = (params: ModifyContactParams): string => {
    const currentContact = this._data.contacts.get(params.id);
    if (!currentContact) return `Contact with id ${params.id} does not exist`;
    const modifiedContact = { ...currentContact, ...params };
    this._data.contacts.set(params.id, modifiedContact);
    this._publish(this._data);
    return `Successfully modified contact: ${params.id}`;
  };

  public modifyAllContacts = (
    params: Omit<ModifyContactParams, 'id'>,
  ): string => {
    this._data.contacts.forEach((contact: Contact, contactId: string) => {
      this._data.contacts.set(contactId, { ...contact, ...params });
    });
    this._data = structuredClone(this._data);
    this._publish(this._data);
    return `Successfully modified all contacts`;
  };

  public deleteContact = (id: string): string => {
    this._data.contacts.delete(id);
    this._publish(this._data);
    return `Successfully deleted contact: ${id}`;
  };

  public selectContacts = (contactsData: ContactsMap) => {
    const contacts = Array.from(contactsData.values());
    const contactsById = Object.fromEntries(contactsData);
    const contactIds = Array.from(contactsData.keys());
    return { contacts, contactsById, contactIds };
  };

  public transformData = (mappedData: any) => {
    const dataArray = Array.from(mappedData.values());
    const dataById = Object.fromEntries(mappedData);
    const dataIds = Array.from(mappedData.keys());
    return { dataArray, dataById, dataIds };
  };

  public modifyAlert = (params: ModifyAlertParams): string => {
    const currentContact = this._data.contacts.get(params.contactRefId);
    if (!currentContact)
      return `Contact with id ${params.contactRefId} does not exist`;

    const currentAlert = currentContact?.alerts.find(
      (alert) => alert.id === params.id,
    );
    if (!currentAlert) return `Alert with id ${params.id} does not exist`;

    const alertIndex = currentContact?.alerts.indexOf(currentAlert);
    const modifiedAlert = { ...currentAlert, ...params };
    const modifiedAlerts = currentContact.alerts.splice(
      alertIndex,
      1,
      modifiedAlert,
    );

    this.modifyContact({ id: currentContact.id, alerts: modifiedAlerts });

    return `Successfully modified alert: ${params.id}`;
  };

  public modifyMnemonic = (params: ModifyMnemonicParams): string => {
    const currentContact = this._data.contacts.get(params.contactRefId);
    if (!currentContact)
      return `Contact with id ${params.contactRefId} does not exist`;

    const currentMnemonic = currentContact?.mnemonics.find(
      (mnemonic) => mnemonic.id === params.id,
    );
    if (!currentMnemonic) return `Alert with id ${params.id} does not exist`;

    const mnemonicIndex = currentContact?.mnemonics.indexOf(currentMnemonic);
    const modifiedMnemonic = { ...currentMnemonic, ...params };
    const modifiedMnemonics = currentContact.mnemonics.splice(
      mnemonicIndex,
      1,
      modifiedMnemonic,
    );

    this.modifyContact({ id: currentContact.id, mnemonics: modifiedMnemonics });

    return `Successfully modified alert: ${params.id}`;
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
    this._data = structuredClone(this._data);
    this._publish(this._data);
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
    this._data = structuredClone(this._data);
    this._publish(this._data);
    return `Successfully modified all alerts`;
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

    return `Successfully deleted alert: ${mnemonicId}`;
  };

  public deleteAlertsWithProp = (property: keyof Alert, value: any): string => {
    this._data.contacts.forEach((contact: Contact, contactId: string) => {
      const filteredAlerts = contact.alerts.filter(
        (alert) => alert[property] !== value,
      );
      this._data.contacts.set(contactId, {
        ...contact,
        alerts: filteredAlerts,
      });
    });
    this._data = structuredClone(this._data);
    this._publish(this._data);
    return `Successfully deleted all alerts with ${property} of ${value}`;
  };

  public deleteMnemonicsWithProp = (
    property: keyof Mnemonic,
    value: any,
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
    this._data = structuredClone(this._data);
    this._publish(this._data);
    return `Successfully deleted all alerts with ${property} of ${value}`;
  };

  public allDataHasProp = (dataType: keyof Store, property: keyof any) =>
    this.transformData(this._data[dataType]).dataArray.every(
      (data: any) => data[property],
    );
  public anyDataHasProp = (dataType: keyof Store, property: keyof any) =>
    this.transformData(this._data[dataType]).dataArray.some(
      (data: any) => data[property],
    );
}
