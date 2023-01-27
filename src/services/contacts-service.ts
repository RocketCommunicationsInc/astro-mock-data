import { generateContact } from '../lib/contacts/generate-contact';
import { generateContacts } from '../lib/contacts/generate-contacts';
import type {
  Contact,
  ContactOptions,
  ContactsSubscribeOptions,
  ModifyContactParams,
  Unsubscribe,
} from '../types';

export class ContactsService {
  private _data: Contact[] = [];
  private _eventName = 'contacts';
  private _subscribers: { [key: string]: Function[] } = {};

  constructor() {}

  private _findIndex(id: string): number {
    return this._data.findIndex((contact) => contact.id === id);
  }

  private _publish(contacts: Contact[]) {
    if (!Array.isArray(this._subscribers[this._eventName])) return;

    this._subscribers[this._eventName].forEach((callback) => {
      callback(contacts);
    });
  }

  public subscribe(
    callback: (contacts: Contact[]) => void,
    options?: ContactsSubscribeOptions,
  ): Unsubscribe {
    if (!Array.isArray(this._subscribers[this._eventName])) {
      this._subscribers[this._eventName] = [];
    }

    const contactOptions: ContactOptions = {
      alertsPercentage: options?.alertsPercentage,
      dateRef: options?.dateRef,
      daysRange: options?.daysRange,
      secondAlertPercentage: options?.secondAlertPercentage,
    };

    this._subscribers[this._eventName].push(callback);
    this._data = generateContacts(options?.initial, contactOptions);
    this._publish(this._data);

    const limit = options?.limit || 200;
    const index = this._subscribers[this._eventName].length - 1;
    const interval = setInterval(() => {
      if (this._data.length >= limit) return;
      this.addContact();
    }, (options?.interval || 5) * 1000);

    return () => {
      clearInterval(interval);
      this._subscribers[this._eventName].splice(index, 1);
    };
  }

  public addContact(): Contact {
    const addedContact = generateContact(this._data.length - 1);
    this._data = [...this._data, addedContact];
    this._publish(this._data);
    return addedContact;
  }

  public modifyContact(id: string, params: ModifyContactParams): string {
    const index = this._findIndex(id);
    Object.entries(params).forEach(([key, value]) => {
      // @ts-expect-error key will be a contact property
      this.data[index][key] = value;
    });
    this._publish(this._data);
    return `Successfully modified contact: ${id}`;
  }

  public deleteContact(id: string): string {
    const index = this._findIndex(id);
    this._data.splice(index, 1);
    this._publish(this._data);
    return `Successfully deleted contact: ${id}`;
  }
}
