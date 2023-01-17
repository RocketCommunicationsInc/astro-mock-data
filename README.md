## Moch data for use with Astro UXDS demo apps

Generate "contacts" and "alerts" data for demo apps and testing.

## Install

```bash
npm install @astrouxds/mock-data
```

## Contacts

Contacts include alerts with a "contact ref" on the alert based on where in the array (the index) a contact is. Meaning not all contacts with have alerts, only a percentage of them will.

```ts
import { generateContacts } from '@astrouxds/mock-data';
```

```ts
const contacts = generateContacts(); // returns 100 contacts by default
```

```ts
const contacts = generateContacts(300); // returns 300 contacts
```

```ts
// returns 200 contacts with options provided below
const contacts = generateContacts(200, {
  alertsPercentage: 5, // percentage of the 200 contacts to have an alert @default 10%
  secondAlertPercentage: 3, // percentage of the 200 contacts to have 2 alerts @default 2%
  daysRange: 2, // range of the start and end timestamps @default 1 day
  dateRef: '3/17/2008', // date reference for timestamps @default now
});
```

## Alerts

If you just want alerts without any contact ref you can generate just an array of alerts.

```ts
import { generateAlerts } from '@astrouxds/mock-data';
```

```ts
const alerts = generateAlerts(5); // returns 5 alerts
```

## Contacts Subscriber

The contacts subscriber will publish a new contact every 5 seconds up to 100 contacts by default.

```ts
import { onContactsChange } from '@astrouxds/mock-data';
```

```ts
const unsubscribe = onContactsChange((contacts) => {
  console.log(contacts);
});
```

With options as second argument

```ts
const unsubscribe = onContactsChange(
  (contacts) => console.log(contacts.length),
  { max: 50 }, // options with a max of 50
);
```

Use the unsubscribe function returned from onContactsChange to unsubscribe

```ts
setTimeout(() => {
  unsubscribe();
}, 1000 * 60 * 5); // unsubscribe after 5 mins
```

## Contacts Subscriber Example With React

```ts
import { useEffect, useState } from 'react';
import { onContactsChange, Contact } from '@astrouxds/mock-data';

const App = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const unsubscribe = onContactsChange((contacts) => {
      setContacts(contacts);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ul>
      {contacts.map(({ id, equipment }) => (
        <li key={id}>{equipment}</li>
      ))}
    </ul>
  );
};

export default App;
```
