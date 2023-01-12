import { Contact } from '../types/contacts';
import contacts from '../data/contacts.json';
import { randomIntBetween } from '../utils';

const subscribers: { [key: string]: Function[] } = {};
const eventName = 'contacts';
let count = randomIntBetween(10, 20);

const publish = (data: Contact[]) => {
  if (!Array.isArray(subscribers[eventName])) return;

  subscribers[eventName].forEach((callback) => {
    callback(data);
  });
};

type Unsubscribe = () => void;

export const onContactsChange = (
  callback: (contacts: Contact[]) => void,
): Unsubscribe => {
  if (!Array.isArray(subscribers[eventName])) {
    subscribers[eventName] = [];
  }

  subscribers[eventName].push(callback);
  const index = subscribers[eventName].length - 1;

  publish(contacts.slice(0, count) as Contact[]);

  const interval = setInterval(() => {
    if (count >= contacts.length) {
      count = randomIntBetween(20, 30);
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
