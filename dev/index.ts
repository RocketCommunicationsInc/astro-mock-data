import { faker } from '@faker-js/faker';
import {
  Contact,
  ContactsService,
  // generateAlert,
  // generateAlerts,
  generateContact,
  generateContacts,
  ModifyContactParams,
  // onContactsChange,
} from '../src';
import { between } from '../src/utils';

// const index = faker.datatype.number(99);

// const contacts = generateContacts(100, {
//   // alertsPercentage: 5,
//   // secondAlertPercentage: 3,
//   // daysRange: 2,
//   // dateRef: '3/17/2008',
// });
// console.log(contacts);

// const contact = generateContact(9);
// console.log(contact);

// const alerts = generateAlerts(3, { createdRef: '9/1/2001' });
// console.log(alerts);

// const alert = generateAlert({ refId: 'asdas' });
// console.log(alert);

// const ends = contacts.map((c) => c.endTimestamp);
// const starts = contacts.map((c) => c.beginTimestamp);
// const minStart = new Date(Math.min(...starts));
// const maxEnd = new Date(Math.max(...ends));
// const diff = minStart.getTime() - maxEnd.getTime();
// const ends = contacts.map((c) => c.endTimestamp);
// const starts = contacts.map((c) => c.beginTimestamp);
// const minStart = new Date(Math.min(...starts));
// const maxEnd = new Date(Math.max(...ends));
// const diff = minStart.getTime() - maxEnd.getTime();

// console.log({
//   start: minStart.toUTCString(),
//   end: maxEnd.toUTCString(),
//   diff: diff / (1000 * 60 * 60),
//   begin: new Date(contacts[index].beginTimestamp).toUTCString(),
//   aos: new Date(contacts[index].aos).toUTCString(),
//   stop: new Date(contacts[index].endTimestamp).toUTCString(),
//   los: new Date(contacts[index].los).toUTCString(),
//   alerts: contacts.flatMap(({ alerts }) => alerts).length,
//   lat: contacts[index].latitude,
//   lng: contacts[index].longitude,
//   az: contacts[index].azimuth,
// });
// console.log({
//   start: minStart.toUTCString(),
//   end: maxEnd.toUTCString(),
//   diff: diff / (1000 * 60 * 60),
//   begin: new Date(contacts[index].beginTimestamp).toUTCString(),
//   aos: new Date(contacts[index].aos).toUTCString(),
//   stop: new Date(contacts[index].endTimestamp).toUTCString(),
//   los: new Date(contacts[index].los).toUTCString(),
//   alerts: contacts.flatMap(({ alerts }) => alerts).length,
//   lat: contacts[index].latitude,
//   lng: contacts[index].longitude,
//   az: contacts[index].azimuth,
// });

// const unsubscribe = onContactsChange((data) => {
//   console.log(data.length);
// });

// setTimeout(() => {
//   unsubscribe();
// }, 1000 * 60 * 60 * 2);

const contactsService = new ContactsService();

let contacts: Contact[] = [];
const unsubscribe = contactsService.subscribe(
  (data) => {
    console.log(data.length);
    contacts = data;
  },
  { initial: 10, interval: 2, limit: 20 },
);

setTimeout(() => {
  console.log('unsubscribed...');
  unsubscribe();
}, 1000 * 60 * 5);

setTimeout(() => {
  const id = contacts[between({ min: 0, max: contacts.length - 1 })].id;
  console.log('[Removed Contact]:', id);
  contactsService.deleteContact(id);
}, 1000 * 5);

// setTimeout(() => {
//   contacts.modifyContact(contacts.data[between({ min: 10, max: 80 })].id, {
//     state: 'new state',
//     detail: 'laksjd asjld laksjd alsjkd adjlaskdj',
//   });
// }, 1000 * 7);

// setTimeout(() => {
//   contacts.addContact();
//   contacts.addContact();
//   contacts.addContact();
//   contacts.addContact();
// }, 1000 * 15);
