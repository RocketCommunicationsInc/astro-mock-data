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
  ModifyAlertParams,
  ModifyMnemonicParams,
  ContactsMap,
  AlertsMap,
  MnemonicsMap,
  GenericDataType,
} from '../types';

const initialStore = {
  contacts: new Map(),
  alerts: new Map(),
  mnemonics: new Map(),
};
export class ContactsService {
  private _data: Store = initialStore;
  private _subscribers: Set<Function> = new Set();
  private _contactOptions: ContactOptions = {};
  private _subscribeOptions: SubscribeOptions = {};
  private _intervalId?: NodeJS.Timer = undefined;

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
    // sets interval for adding contacts
    this._intervalId = options?.interval
      ? setInterval(this.addContact.bind(this), 1000 * options.interval)
      : undefined;
  }

  private _generateInitialData = (initial: number) => {
    const contactsArray = generateContacts(initial, this._contactOptions);
    contactsArray.forEach((contact) =>
      this._data.contacts.set(contact.id, contact),
    );
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

  public subscribe = (callback: (data: Store) => void): Unsubscribe => {
    this._subscribers.add(callback);
    this._publish(this._data);

    return () => {
      this._subscribers.delete(callback);
      if (this._subscribers.size <= 1) {
        clearInterval(this._intervalId);
      }
    };
  };

  public getSnapshot = (): Store => {
    return this._data;
  };

  public transformData = <GenericDataType>(
    mappedData: Map<string, GenericDataType>,
  ) => {
    const dataArray = [...mappedData.values()];
    const dataById = { ...mappedData.entries() };
    const dataIds = [...mappedData.keys()];
    return { dataArray, dataById, dataIds };
  };

  public addContact = (): Contact => {
    console.log('adding');
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
    this._data = structuredClone(this._data);
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
    this._data = structuredClone(this._data);
    this._publish(this._data);
    return `Successfully deleted contact: ${id}`;
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

  public deleteAlertsWithProp = (
    property: keyof Alert,
    value: Alert[keyof Alert],
  ): string => {
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
    this._data = structuredClone(this._data);
    this._publish(this._data);
    return `Successfully deleted all alerts with ${property} of ${value}`;
  };

  public allDataHasProp = (
    dataType: keyof Store,
    property: keyof GetDataTypeFromKey<typeof dataType>,
  ): boolean => {
    const dataMap = this._data[dataType];
    const { dataArray } =
      this.transformData<GetDataTypeFromKey<typeof dataType>>(dataMap);
    return dataArray.every((data: any) => data[property]);
  };

  public anyDataHasProp = (
    dataType: keyof Store,
    property: keyof GetDataTypeFromKey<typeof dataType>,
  ): boolean => {
    const dataMap = this._data[dataType];
    const { dataArray } =
      this.transformData<GetDataTypeFromKey<typeof dataType>>(dataMap);
    return dataArray.some((data: any) => data[property]);
  };
}

type GetDataTypeFromKey<T extends keyof Store> = T extends 'contact'
  ? Contact
  : T extends 'alert'
  ? Alert
  : T extends 'mnemonic'
  ? Mnemonic
  : never;

type GetDataTypeFromMap<T extends ContactsMap | AlertsMap | MnemonicsMap> =
  T extends ContactsMap
    ? ContactsMap
    : T extends AlertsMap
    ? AlertsMap
    : T extends MnemonicsMap
    ? MnemonicsMap
    : never;

const isContact = (dataObj: Contact | Alert | Mnemonic): dataObj is Contact => {
  return dataObj.type === 'contact';
};

const isContactsMap = (
  dataMap: ContactsMap | AlertsMap | MnemonicsMap,
): dataMap is ContactsMap => {
  return [...dataMap.values()][0].type === 'contact';
};
const isAlertsMap = (
  dataMap: ContactsMap | AlertsMap | MnemonicsMap,
): dataMap is AlertsMap => {
  return [...dataMap.values()][0].type === 'alert';
};
const isMnemonicsMap = (
  dataMap: ContactsMap | AlertsMap | MnemonicsMap,
): dataMap is MnemonicsMap => {
  return [...dataMap.values()][0].type === 'mnemonic';
};
