import { generateContact } from '../lib/contacts/generate-contact';
import { generateContacts } from '../lib/contacts/generate-contacts';
import type {
  Contact,
  ContactOptions,
  ContactsServiceOptions,
  ModifyContactParams,
  SubscribeOptions,
  Unsubscribe,
} from '../types';

export class ContactsService {
  private _data: Map<string, Contact> = new Map();
  private _eventName = 'contacts';
  private _subscribers: { [key: string]: Set<Function> } = {};
  private _contactOptions: ContactOptions = {};
  private _subscribeOptions: SubscribeOptions = {};

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
  }

  // private _findIndex(id: string): number {
  //   return this._data.findIndex((contact) => contact.id === id);
  // }

  private _publish = (contacts: Map<string, Contact>) => {
    if (!(this._eventName in this._subscribers)) return;

    this._subscribers[this._eventName].forEach((callback) => {
      callback(contacts);
    });
  };

  public subscribe = (
    callback: (contacts: Map<string, Contact>) => void,
  ): Unsubscribe => {
    if (!(this._eventName in this._subscribers)) {
      this._subscribers[this._eventName] = new Set<Function>();
    }

    this._subscribers[this._eventName].add(callback);
    const initial = this._subscribeOptions.initial;
    const contactsArray = generateContacts(initial, this._contactOptions);
    contactsArray.forEach((contact) => this._data.set(contact.id, contact));
    this._publish(this._data);

    const limit = this._subscribeOptions.limit || 200;

    const interval = setInterval(() => {
      if (this._data.size >= limit) return;
      this.addContact();
    }, (this._subscribeOptions.interval || 5) * 1000);

    return () => {
      clearInterval(interval);
      this._subscribers[this._eventName].delete(callback);
    };
  };

  public addContact = (): Contact => {
    const index = this._data.size - 1;
    const addedContact = generateContact(index, this._contactOptions);
    this._data.set(addedContact.id, addedContact);
    this._publish(this._data);
    return addedContact;
  };

  public modifyContact = (params: ModifyContactParams): string => {
    const currentContact = this._data.get(params.id);
    if (!currentContact) return `Contact with id ${params.id} does not exist`;

    const modifiedContact = { ...currentContact, ...params };
    this._data.set(params.id, modifiedContact);

    this._publish(this._data);
    return `Successfully modified contact: ${params.id}`;
  };

  public deleteContact = (id: string): string => {
    this._data.delete(id);
    this._publish(this._data);
    return `Successfully deleted contact: ${id}`;
  };
}
