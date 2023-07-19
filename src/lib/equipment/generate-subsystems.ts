import { Subsystem } from '../../types/subsystems';
import dataOption from '../../data/options';
import { generateSubsystem } from './generate-subsystem';

export const generateSubsystems = (contactRefId: string): Subsystem[] => {
  const subsystemArray = Array.from(
    { length: dataOption.subsystems.length },
    () => generateSubsystem(contactRefId),
  );

  return subsystemArray.filter(
    (value, index, self) =>
      self.findIndex((v) => v.name === value.name) === index,
  );
};
