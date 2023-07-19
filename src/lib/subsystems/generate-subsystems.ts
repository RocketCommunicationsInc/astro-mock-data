import { Subsystem } from '../../types/subsystems';
import dataOption from '../../data/options';
import { generateSubsystem } from './generate-subsystem';

export const generateSubsystems = (
  contactRefId: string,
  desiredSubSystems?: string[],
): Subsystem[] => {
  if (desiredSubSystems) {
    return desiredSubSystems.map((subSystemString) =>
      generateSubsystem(contactRefId, subSystemString),
    );
  } else {
    //generate random subsystems
    const subsystemArray = Array.from(
      { length: dataOption.subsystems.length },
      () => generateSubsystem(contactRefId),
    );

    return subsystemArray.filter(
      (value, index, self) =>
        self.findIndex((v) => v.name === value.name) === index,
    );
  }
};
