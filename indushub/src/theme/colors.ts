// Paleta INDUSHUB — usada donde Tailwind no aplica (SVG, iconos, navegación).
export const colors = {
  primary: '#0F2B48',
  primaryLight: '#1C4670',
  primaryDark: '#0A1F35',
  accent: '#FF6B35',
  accentLight: '#FF8A5E',
  accentDark: '#E4551F',
  surface: '#FFFFFF',
  background: '#F4F6F9',
  muted: '#6B7A90',
  line: '#E5EAF1',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#EF4444',
  white: '#FFFFFF',
} as const;

export type ColorKey = keyof typeof colors;
