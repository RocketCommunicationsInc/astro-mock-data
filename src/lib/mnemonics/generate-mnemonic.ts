import { faker } from '@faker-js/faker';

import dataOption from '../../data/options';
import { shuffle } from '../../utils';
import type { MnemonicOptions, Mnemonic, Status } from '../../types/index';

export const generateMnemonic = (
  contactRefId: string,
  options?: MnemonicOptions,
): Mnemonic => {
  const max = options?.thresholdMax || 110;
  const min = options?.thresholdMin || 0;
  const deviation = options?.deviation || 20;
  const precision = options?.precision || 0.1;

  return {
    mnemonicId: faker.string.alpha({ length: 7, casing: 'upper' }),
    status: shuffle<Status>(dataOption.statuses),
    unit: shuffle(dataOption.units),
    threshold: faker.number.float({ max, min, precision }),
    currentValue: faker.number.float({
      max: max + deviation,
      min: min - deviation,
      precision,
    }),
    subsystem: shuffle(dataOption.subsystems),
    contactRefId,
  };
};