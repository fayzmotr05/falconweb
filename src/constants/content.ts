export const COMPANY_INFO = {
  name: 'Falcon Team',
  tagline: 'Your Partner in the World of Trucking and Compliance',
  ceo: 'Jasur Saynazimov',
  phone: '+1 (773) 832-7323',
  phoneLink: 'tel:+17738327323',
  instagram: '@eld.falconplatinum',
  instagramLink: 'https://instagram.com/eld.falconplatinum',
  googleSheetsEndpoint: '', // Will be set after creating Google Apps Script
} as const

export const STATS = [
  { key: 'clients', value: 300, suffix: '+' },
  { key: 'trucks', value: 1500, suffix: '+' },
  { key: 'years', value: 7, suffix: '+' },
  { key: 'team', value: 50, suffix: '+' },
] as const

export const TIMELINE = [
  { year: '2018', key: '2018' },
  { year: '2020', key: '2020' },
  { year: '2021', key: '2021' },
  { year: '2024', key: '2024' },
  { year: '2025', key: '2025' },
] as const

export const SERVICES = [
  { key: 'eld', icon: 'eld' },
  { key: 'safety', icon: 'shield' },
  { key: 'dispatch', icon: 'dispatch' },
  { key: 'fleet', icon: 'fleet' },
  { key: 'ifta', icon: 'document' },
  { key: 'integrations', icon: 'integration' },
] as const

export const PLATFORMS = [
  { key: 'sba', name: 'Clear Path ELD' },
  { key: 'securePath', name: 'Secure Path ELD' },
] as const

export const INTEGRATIONS = [
  'Highway',
  'Macropoint',
  'Trucker Tools',
  'Project44',
] as const

export const CLIENT_SEGMENTS = [
  { key: 'ownerOperator', icon: 'truck' },
  { key: 'fleet', icon: 'fleet' },
  { key: 'centralAsian', icon: 'globe' },
] as const

export const VALUES = [
  { key: 'speed', icon: 'clock' },
  { key: 'honesty', icon: 'heart' },
  { key: 'responsibility', icon: 'shield' },
  { key: 'innovation', icon: 'lightbulb' },
] as const

export const ADVANTAGES = [
  { key: 'support', icon: 'headset' },
  { key: 'platforms', icon: 'server' },
  { key: 'automation', icon: 'cog' },
  { key: 'security', icon: 'lock' },
  { key: 'experience', icon: 'award' },
  { key: 'quality', icon: 'check' },
] as const
