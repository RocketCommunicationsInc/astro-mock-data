import { faker } from '@faker-js/faker';
import {
  // generateAlert,
  // generateAlerts,
  // generateContact,
  generateContacts,
  // onContactsChange,
} from '../src';

const index = faker.datatype.number(99);

const contacts = generateContacts(100, {
  // alertsPercentage: 5,
  // secondAlertPercentage: 3,
  // daysRange: 2,
  // dateRef: '3/17/2008',
});
// console.log(contacts);

// const contact = generateContact(49);
// console.log(contact);

// const alerts = generateAlerts(3, { createdRef: '9/1/2001' });
// console.log(alerts);

// const alert = generateAlert({ refId: 'asdas' });
// console.log(alert);

// contacts.flatMap(({ alerts }, i) => {
//   if (alerts.length > 0) {
//     console.log(i, alerts.length);
//   }
// });

const ends = contacts.map((c) => c.endTimestamp);
const starts = contacts.map((c) => c.beginTimestamp);
const minStart = new Date(Math.min(...starts));
const maxEnd = new Date(Math.max(...ends));
const diff = minStart.getTime() - maxEnd.getTime();

console.log({
  start: minStart.toUTCString(),
  end: maxEnd.toUTCString(),
  diff: diff / (1000 * 60 * 60),
  begin: new Date(contacts[index].beginTimestamp).toUTCString(),
  aos: new Date(contacts[index].aos).toUTCString(),
  stop: new Date(contacts[index].endTimestamp).toUTCString(),
  los: new Date(contacts[index].los).toUTCString(),
  alerts: contacts.flatMap(({ alerts }) => alerts).length,
  lat: contacts[index].latitude,
  lng: contacts[index].longitude,
  az: contacts[index].azimuth,
});

// const unsubscribe = onContactsChange((data) => {
//   console.log(data.length);
// });

// setTimeout(() => {
//   unsubscribe();
// }, 1000 * 60 * 60 * 2);
