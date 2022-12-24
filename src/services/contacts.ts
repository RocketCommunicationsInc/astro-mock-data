import { Contact } from '../types/contacts';
import contacts from '../data/contacts.json';

const subscribers: { [key: string]: Function[] } = {};
const eventName = 'contacts';
let count = 10;

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
		count++;
		publish(contacts.slice(0, count) as Contact[]);
	}, 5000);

	return () => {
		clearInterval(interval);
		subscribers[eventName].splice(index, 1);
	};
};
