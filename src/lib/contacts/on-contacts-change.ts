import { Contact, Unsubscribe } from '../../types';
import { between } from '../../utils';
import { generateContacts } from './generate-contacts';

const subscribers: { [key: string]: Function[] } = {};
const eventName = 'contacts';
let count = between({ min: 10, max: 20 });

const publish = (data: Contact[]) => {
  if (!Array.isArray(subscribers[eventName])) return;

  subscribers[eventName].forEach((callback) => {
    callback(data);
  });
};

export const onContactsChange = (
  callback: (contacts: Contact[]) => void,
  options?: { max?: number },
): Unsubscribe => {
  if (!Array.isArray(subscribers[eventName])) {
    subscribers[eventName] = [];
  }

  subscribers[eventName].push(callback);
  const index = subscribers[eventName].length - 1;
  const contacts = generateContacts(options?.max);

  publish(contacts.slice(0, count) as Contact[]);

  const interval = setInterval(() => {
    if (count >= contacts.length) {
      count = between({ min: 20, max: 30 });
      publish(contacts.slice(0, count) as Contact[]);
      return;
    }

    count++;
    publish(contacts.slice(0, count) as Contact[]);
  }, 5000);

  return () => {
    clearInterval(interval);
    subscribers[eventName].splice(index, 1);
  };
};
