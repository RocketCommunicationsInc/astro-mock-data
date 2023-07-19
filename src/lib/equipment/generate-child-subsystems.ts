import { ChildSubsystem } from '../../types/subsystems';
import dataOption from '../../data/options';
import { generateChildSubsystem } from './generate-child-subsystem';

export const generateChildSubsystems = (
  contactRefId: string,
  subsystem: string,
): ChildSubsystem[] => {
  const childSubsystemArray = Array.from(
    { length: dataOption.childSubSystems.length },
    () => generateChildSubsystem(contactRefId, subsystem),
  );

  return childSubsystemArray.filter(
    (value, index, self) =>
      self.findIndex((v) => v.name === value.name) === index,
  );
};
