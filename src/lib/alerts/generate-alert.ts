import { faker } from '@faker-js/faker';

import dataOption from '../../data/options';
import { Alert, AlertOptions, Status } from '../../types';
import { between, generateAlphaNumericChuncks, shuffle } from '../../utils';

export const generateAlert = (options?: AlertOptions): Alert => {
  let date = faker.date.recent(1, options?.createdRef);

  if (options?.start && options?.end && !options.createdRef) {
    date = faker.date.between(options.start, options.end);
  }

  let equipments = generateAlphaNumericChuncks({
    count: between({ min: 5, max: 7 }),
    length: { min: 5, max: 10 },
  });

  if (options?.equipments) {
    equipments = options.equipments;
  }

  const equipment = shuffle(equipments).toUpperCase();
  const randomInt = between({ min: 101, max: 299 });
  const errorType = shuffle(dataOption.errorTypes);
  const message = `${equipment} ${randomInt} - ${errorType}`;
  const adverb = faker.word.adverb();
  const hhmmss = date.toTimeString().split(' ')[0];
  const longMessage = `${equipment} ${randomInt} ${adverb} ${errorType.toLowerCase()} at ${hhmmss}`;

  return {
    id: faker.datatype.uuid(),
    refId: options?.refId || '',
    category: shuffle(dataOption.categories),
    expanded: false,
    longMessage,
    message,
    acknowledged: false,
    new: false,
    selected: false,
    timestamp: date.getTime(),
    status: shuffle<Status>(dataOption.statuses),
  };
};
