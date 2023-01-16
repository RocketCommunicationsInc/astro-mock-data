export type Status =
  | 'caution'
  | 'critical'
  | 'normal'
  | 'off'
  | 'serious'
  | 'standby';

export type RangeOptions =
  | number
  | { start: number; stop: number; step?: number };

type MinMaxPrecision = {
  min?: number;
  max?: number;
  precision?: number;
};

export type BetweenOptions = number | MinMaxPrecision;

export type ChuncksOptions = {
  count: number;
  length: MinMaxPrecision;
};

export type AlertsPercentageOptions =
  | 0
  | 2
  | 3
  | 4
  | 5
  | 10
  | 12
  | 15
  | 20
  | 25
  | 34
  | 50;
