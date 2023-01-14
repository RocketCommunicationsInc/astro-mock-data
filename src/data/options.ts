const options = {
  grounds: ['CTS', 'DGS', 'GTS', 'TCS', 'VTS', 'NHS', 'TTS', 'HTS'],
  resolutions: ['complete', 'failed', 'pass', 'prepass', 'scheduled'],
  resolutionStatuses: ['normal', 'critical', 'off', 'standby'],
  states: ['executing', 'failed', 'ready', 'updating'],
  statuses: ['caution', 'critical', 'normal', 'off', 'serious', 'standby'],
  steps: [
    'AOS',
    'Command',
    'Configure Operation',
    'Critical Health',
    'DCC',
    'Downlink',
    'Lock',
    'LOS',
    'SARM',
    'Uplink',
  ],
};

export default options;
