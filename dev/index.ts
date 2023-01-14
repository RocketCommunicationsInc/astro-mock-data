import { faker } from '@faker-js/faker';
import options from '../src/data/options';

type RangeOptions = number | { start: number; stop: number; step?: number };
const range = (options: RangeOptions): number[] => {
  if (typeof options === 'number') {
    return Array.from({ length: options }, (_, i) => 0 + i);
  }
  const { start, stop, step = 1 } = options;
  const length = (stop - start) / step + 1;
  return Array.from({ length }, (_, i) => start + i * step);
};

type MinMaxPrecision = { min?: number; max?: number; precision?: number };
type BetweenOptions = number | MinMaxPrecision;
const between = (options?: BetweenOptions) => faker.datatype.number(options);

const shuffle = <T>(arr: T[]) => {
  const shuffled = faker.helpers.shuffle<T>(arr);
  return shuffled[between(arr.length - 1)];
};

type ChuncksOptions = { count: number; length: MinMaxPrecision };
const generateAlphaNumericChuncks = ({ count, length }: ChuncksOptions) => {
  return range(count).map(() => faker.random.alphaNumeric(between(length)));
};

const generateContact = (index: number) => {
  const contactId = faker.datatype.uuid();
  const alphaNumericChuncks = generateAlphaNumericChuncks({
    count: between({ min: 5, max: 7 }),
    length: { min: 5, max: 12 },
  });

  const is10Percent = index % 10 === 0;
  const is2Percent = index > 0 && index % 50 === 0;
  const alertsRange = is10Percent ? { start: 0, stop: is2Percent ? 1 : 0 } : 0;

  return {
    id: contactId,
    status: shuffle(options.statuses),
    name: faker.datatype.number(),
    ground: shuffle(options.grounds),
    satellite: 'USA-' + faker.random.alphaNumeric(5).toUpperCase(),
    equipment: alphaNumericChuncks.join(' ').toUpperCase(),
    state: shuffle(options.states),
    step: shuffle(options.steps),
    detail: faker.lorem.sentence(between({ min: 8, max: 20 })),
    beginTimestamp: 0,
    endTimestamp: 0,
    aos: 0,
    los: 0,
    latitude: faker.address.latitude(),
    longitude: faker.address.longitude(),
    azimuth: faker.address.longitude(),
    elevation: faker.datatype.float({ max: 90 }),
    resolution: shuffle(options.resolutions),
    resolutionStatus: shuffle(options.resolutionStatuses),
    alerts: range(alertsRange).map(() => ({
      id: faker.datatype.uuid(),
      contactId,
    })),
  };
};

const generateContacts = (length: number) => {
  return Array.from({ length }, (_, i) => generateContact(i));
};

// createdAt: faker.datatype.datetime({ max: new Date().getTime() }),

console.log(generateContacts(101).flatMap(({ alerts }) => alerts));
