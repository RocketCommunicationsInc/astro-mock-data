import { faker } from '@faker-js/faker';

import dataOption from '../../data/options';
import { shuffle } from '../../utils';
import type { MnemonicOptions, Mnemonic, Status } from '../../types/index';

export const generateMnemonic = (options: MnemonicOptions): Mnemonic => {
  const max = options?.thresholdMax || 110;
  const min = options?.thresholdMin || 0;
  const deviation = options?.deviation || 20;
  const precision = options?.precision || 0.1;
  const subsystem = options.subsystem || shuffle(dataOption.subsystems);
  const childSubsystem =
    options.childSubsystem || shuffle(dataOption.childSubSystems);
  const assemblyDevice =
    options.assemblyDevice || shuffle(dataOption.assemblyDevices);
  const childSubSystemNum = faker.number.int({ min: 1, max: 2 });
  const unit = shuffle(dataOption.units);
  const assembly = unit === 'Volts' ? 'Voltage Monitor' : `Heater Switch Power`;
  const measurement = `${childSubsystem} ${childSubSystemNum} ${assembly}`;

  return {
    id: faker.string.uuid(),
    type: 'mnemonic',
    mnemonicId: faker.string.alpha({ length: 7, casing: 'upper' }),
    status: shuffle<Status>(dataOption.statuses),
    unit: unit,
    thresholdMax: max,
    thresholdMin: min,
    currentValue: faker.number.float({
      max: max + deviation,
      min: min - deviation,
      precision,
    }),
    subsystem,
    childSubsystem,
    assemblyDevice,
    measurement,
    contactRefId: options?.contactRefId || '',
  };
};
