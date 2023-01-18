# Astro UXDS Mock Data

Generate "contacts" and "alerts" data for testing Astro Web Components and building demo applications.

## Install

```bash
npm install @astrouxds/mock-data
```

## Contacts

Contacts include alerts with a "contact ref" on the alert based on where in the array (the index) a contact is. Meaning not all contacts will have alerts, only a percentage of them will.

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

## API

### generateContacts

Returns an array of contacts.

#### Parameters

| Name                          | Type                             | Default | Description                                                                                                   |
| ----------------------------- | -------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| length                        | number                           | 100     | The total number of contacts to generate.                                                                     |
| options                       | {...}                            | {}      | The options to use to generate the contacts. If no options are set, the defaults are used as described below. |
| options.alertsPercentage      | AlertsPercentage                 | 10      | The percentage of contacts which should have an alert connected to them.                                      |
| options.secondAlertPercentage | AlertsPercentage                 | 2       | The percentage of contacts which should have two alerts connected to them.                                    |
| options.daysRange             | number                           | 1       | The range in days for the span between the start and end timestamps.                                          |
| options.dateRef               | string &#124; number &#124; Date | now     | The date to reference when generating the contacts.                                                           |

### generateContact

Returns a single contact.

#### Parameters

| Name    | Type   | Default  | Description                                                             |
| ------- | ------ | -------- | ----------------------------------------------------------------------- |
| index   | number | required | The index is used to determine if an alert(s) is connected the contact. |
| options | {...}  | {}       | The same options from <b>generateContacts</b>                           |

### generateAlerts

Returns an array of alerts.

#### Parameters

| Name               | Type                             | Default   | Description                                                                                                      |
| ------------------ | -------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| length             | number                           | 40        | The total number of alerts to generate.                                                                          |
| options            | {...}                            | {}        | The options to use to generate the alerts. If no options are set, the defaults are used as described below.      |
| options.refId      | string                           | undefined | A contact reference id. Will be an empty string if not provided.                                                 |
| options.equipment  | string                           | undefined | An equipment config string. Will be generated if not provided.                                                   |
| options.createdRef | string &#124; number &#124; Date | undefined | The date to reference when generating the alerts. If provided, this will override any start and end options set. |
| options.start      | string &#124; number &#124; Date | undefined | The starting timestamp for the alert timestamp boundry.                                                          |
| options.end        | string &#124; number &#124; Date | undefined | The ending timestamp for the alert timestamp boundry.                                                            |

### generateAlert

Returns a single alert.

#### Parameters

| Name    | Type  | Default | Description                                 |
| ------- | ----- | ------- | ------------------------------------------- |
| options | {...} | {}      | The same options from <b>generateAlerts</b> |

### onContactsChange

Publishes a new contact every 5 seconds up to 100 contacts by default.

Returns an unsubscribe function.

#### Parameters

| Name        | Type     | Default  | Description                                               |
| ----------- | -------- | -------- | --------------------------------------------------------- |
| callback    | function | required | The callback function which provides the latest contacts. |
| options     | {...}    | {}       | The options to use to generate the contacts.              |
| options.max | number   | 100      | The total contacts to publish.                            |

## Schema

### Contact

| Property         | Type    | Description |
| ---------------- | ------- | ----------- |
| id               | string  |             |
| status           | Status  |             |
| name             | number  |             |
| ground           | string  |             |
| satellite        | string  |             |
| equipment        | string  |             |
| state            | string  |             |
| step             | string  |             |
| detail           | string  |             |
| beginTimestamp   | number  |             |
| endTimestamp     | number  |             |
| aos              | number  |             |
| los              | number  |             |
| latitude         | number  |             |
| longitude        | number  |             |
| azimuth          | number  |             |
| elevation        | number  |             |
| resolution       | string  |             |
| resolutionStatus | string  |             |
| alerts           | Alert[] |             |

### Alert

| Property     | Type    | Description |
| ------------ | ------- | ----------- |
| id           | string  |             |
| status       | Status  |             |
| category     | string  |             |
| message      | string  |             |
| longMessage  | string  |             |
| timestamp    | number  |             |
| selected     | boolean |             |
| new          | boolean |             |
| expanded     | boolean |             |
| acknowledged | boolean |             |
| refId        | string  |             |

### Status

'caution' | 'critical' | 'normal' | 'off'| 'serious'| 'standby'

### AlertsPercentage

0 | 2 | 3 | 4 | 5 | 10 | 12 | 15 | 20 | 25 | 34 | 50
