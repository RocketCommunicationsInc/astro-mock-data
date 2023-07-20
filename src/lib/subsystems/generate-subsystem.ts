import { Subsystem } from '../../types/subsystems';
import dataOption from '../../data/options';
import { shuffle } from '../../utils';
import { generateChildSubsystems } from './generate-child-subsystems';
import { getMostSevereStatus } from '../../utils';

export const generateSubsystem = (
  contactRefId: string,
  desiredSubSystem?: string,
): Subsystem => {
  const name = desiredSubSystem || shuffle(dataOption.subsystems);
  const childSubsystems = generateChildSubsystems(contactRefId, name);
  const status = getMostSevereStatus(childSubsystems);

  return {
    name,
    status: status,
    childSubsystems: childSubsystems,
  };
};
