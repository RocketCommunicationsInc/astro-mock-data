import { Subsystem } from '../../types/equipment';
import dataOption from '../../data/options';
import { shuffle } from '../../utils';
import { generateChildSubsystems } from './generate-child-subsystems';
import { getMostSevereStatus } from '../../utils';

export const generateSubsystem = (contactRefId: string): Subsystem => {
  const childSubsystems = generateChildSubsystems(contactRefId);
  const status = getMostSevereStatus(childSubsystems);

  return {
    name: shuffle(dataOption.subsystems),
    status: status,
    childSubsystems: childSubsystems,
  };
};
