import { onContactsChange } from '../src';

const unsubscribe = onContactsChange((data) => {
  console.log(data.length);
});

setTimeout(() => {
  unsubscribe();
}, 1000 * 60 * 60 * 2);
