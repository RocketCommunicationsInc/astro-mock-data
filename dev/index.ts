// import { faker } from '@faker-js/faker';
import { between } from '../src/utils';
import {
  Contact,
  ContactsService,
  TTC_GRM_Service,
  // generateAlert,
  // generateAlerts,
  // generateContact,
  // generateContacts,
  // ModifyContactParams,
  // onContactsChange,
} from '../src';

// const index = faker.number.int(99);

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

// const unsubscribe = onContactsChange((data) => {
//   console.log(data[data.length - 1]);
// });

// setTimeout(() => {
//   console.log('unsubscribed...');
//   unsubscribe();
// }, 1000 * 60);

const ttcGrmService = new TTC_GRM_Service({
  initial: 10,
  interval: 1,
  limit: 40,
});

let ttcGrmcontacts: Map<string, Contact> = new Map();
const ttcGrmUnsubscribe = ttcGrmService.subscribe((data) => {
  ttcGrmcontacts = data.contacts;
});

setTimeout(() => {
  console.log('unsubscribed from ttc grm service...');
  ttcGrmUnsubscribe();
}, 1000 * 15);

setTimeout(() => {
  const lastKey = Array.from(ttcGrmcontacts.keys()).pop();
  if (!lastKey) return;
  const id = ttcGrmcontacts.get(lastKey)?.id;
  if (!id) return;
  console.log('[Removed Contact]:', id);
  ttcGrmService.deleteContact(id);
}, 1000 * 5);

setTimeout(() => {
  const lastKey = Array.from(ttcGrmcontacts.keys()).pop();
  if (!lastKey) return;
  const id = ttcGrmcontacts.get(lastKey)?.id;
  if (!id) return;
  console.log('[Modified Contact]:', id);
  ttcGrmService.modifyContact({
    id,
    state: 'new state',
    detail: 'laksjd asjld laksjd alsjkd adjlaskdj',
  });
}, 1000 * 7);

setTimeout(() => {
  const { dataArray, dataById, dataIds } =
    ttcGrmService.transformData(ttcGrmcontacts);
  console.log('all contacts', dataArray);
  const x = dataArray[4];
  ttcGrmService.addContact();
  ttcGrmService.addContact();
  ttcGrmService.addContact();
  ttcGrmService.addContact();
}, 1000 * 10);

const contactsService = new ContactsService({
  initial: 10,
  interval: 2,
  limit: 20,
});

let contacts: Contact[] = [];
const unsubscribe = contactsService.subscribe((data) => {
  console.log(data.length);
  contacts = data;
});

setTimeout(() => {
  console.log('unsubscribed from contact service...');
  unsubscribe();
}, 1000 * 20);

setTimeout(() => {
  const id = contacts[between({ min: 0, max: contacts.length - 1 })].id;
  console.log('[Removed Contact]:', id);
  contactsService.deleteContact(id);
}, 1000 * 5);

setTimeout(() => {
  const id = contacts[between({ min: 0, max: contacts.length - 1 })].id;
  console.log('[Modified Contact]:', id);
  contactsService.updateContact(id, {
    state: 'new state',
    detail: 'laksjd asjld laksjd alsjkd adjlaskdj',
  });
}, 1000 * 7);

setTimeout(() => {
  contactsService.addContact();
  contactsService.addContact();
  contactsService.addContact();
  contactsService.addContact();
}, 1000 * 15);
