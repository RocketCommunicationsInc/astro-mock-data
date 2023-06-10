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
}
