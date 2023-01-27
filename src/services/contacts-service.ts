import { generateContact } from '../lib/contacts/generate-contact';
import { generateContacts } from '../lib/contacts/generate-contacts';
import type {
  Contact,
  ContactOptions,
  ModifyContactParams,
  Unsubscribe,
} from '../types';

export class ContactsService {
  public data: Contact[] = [];
  private _eventName = 'contacts';
  private _limit: number = 0;
  private _subscribers: { [key: string]: Function[] } = {};

  constructor(length?: number, options?: ContactOptions) {
    this.data = generateContacts(length, options);
  }

  private _findIndex(id: string): number {
    return this.data.findIndex((contact) => contact.id === id);
  }

  private _publish(contacts: Contact[]) {
    if (!Array.isArray(this._subscribers[this._eventName])) return;

    this._subscribers[this._eventName].forEach((callback) => {
      callback(contacts);
    });
  }

  public onContactsChange(
    callback: (contacts: Contact[]) => void,
    options?: { max?: number; interval?: number },
  ): Unsubscribe {
    if (!Array.isArray(this._subscribers[this._eventName])) {
      this._subscribers[this._eventName] = [];
    }

    this._limit = options?.max || 200;
    this._subscribers[this._eventName].push(callback);
    const index = this._subscribers[this._eventName].length - 1;

    this._publish(this.data);

    const interval = setInterval(() => {
      if (this.data.length >= this._limit) return;
      this.addContact();
    }, (options?.interval || 5) * 1000);

    return () => {
      clearInterval(interval);
      this._subscribers[this._eventName].splice(index, 1);
    };
  }

  public addContact() {
    this.data = [...this.data, generateContact(this.data.length - 1)];
    this._publish(this.data);
  }

  public modifyContact(id: string, params: ModifyContactParams) {
    const index = this._findIndex(id);
    Object.entries(params).forEach(([key, value]) => {
      // @ts-expect-error key will be a contact property
      this.data[index][key] = value;
    });
    this._publish(this.data);
  }

  public removeContact(id: string) {
    const index = this._findIndex(id);
    this.data.splice(index, 1);
    this._publish(this.data);
  }
}
