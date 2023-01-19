import { Contact, ModifyContactParams, Unsubscribe } from '../types';
import { generateContact } from '../lib/contacts/generate-contact';
import { generateContacts } from '../lib/contacts/generate-contacts';

export class ContactsService {
  public data: Contact[] = [];
  private eventName = 'contacts';
  private subscribers: { [key: string]: Function[] } = {};
  private limit: number = 0;

  constructor() {
    this.data = generateContacts();
    this.limit = 200;
  }

  private _findIndex(id: string): number {
    return this.data.findIndex((contact) => contact.id === id);
  }

  private _publish(contacts: Contact[]) {
    if (!Array.isArray(this.subscribers[this.eventName])) return;

    this.subscribers[this.eventName].forEach((callback) => {
      callback(contacts);
    });
  }

  public onContactsChange(
    callback: (contacts: Contact[]) => void,
    options?: { max?: number },
  ): Unsubscribe {
    if (!Array.isArray(this.subscribers[this.eventName])) {
      this.subscribers[this.eventName] = [];
    }

    this.subscribers[this.eventName].push(callback);
    const index = this.subscribers[this.eventName].length - 1;

    this._publish(this.data);

    const interval = setInterval(() => {
      if (this.data.length >= this.limit) return;
      this.addContact();
    }, 1000 * 10);

    return () => {
      clearInterval(interval);
      this.subscribers[this.eventName].splice(index, 1);
    };
  }

  public addContact() {
    this.data = [...this.data, generateContact(this.data.length - 1)];
    this._publish(this.data);
  }

  public modifyContact(id: string, params: ModifyContactParams) {
    const index = this._findIndex(id);
    Object.entries(params).forEach(([key, value]) => {
      // @ts-ignore key will be a contact property
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
