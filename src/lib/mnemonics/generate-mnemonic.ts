import { faker } from '@faker-js/faker';

import dataOption from '../../data/options';
import { shuffle, evaluateStatus } from '../../utils';
import type { MnemonicOptions, Mnemonic } from '../../types/index';

export const generateMnemonic = (options: MnemonicOptions): Mnemonic => {
  const max = options?.thresholdMax || 110;
  const min = options?.thresholdMin || 0;
  const deviation = options?.deviation || 10;
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
  const currentValue = faker.number.float({
    max: max + deviation,
    min: min - deviation,
    precision,
  });
  const status = evaluateStatus(currentValue, min, max, 5, 10);

  return {
    id: faker.string.uuid(),
    type: 'mnemonic',
    mnemonicId: faker.string.alpha({ length: 7, casing: 'upper' }),
    status,
    unit: unit,
    thresholdMax: max,
    thresholdMin: min,
    currentValue,
    subsystem,
    childSubsystem,
    assemblyDevice,
    measurement,
    contactRefId: options?.contactRefId || '',
    watched: false,
  };
};
