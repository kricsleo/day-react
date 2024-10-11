import remToPx from '@unocss/preset-rem-to-px'
import {
  defineConfig,
  presetIcons,
  presetUno,
} from 'unocss'

export default defineConfig({
  theme: {
    fontSize: {
      'xs': ['12px', '16px'],
      'sm': ['14px', '20px'],
      'md': ['16px', '24px'],
      'lg': ['18px', '28px'],
      'xl': ['20px', '28px'],
      '2xl': ['24px', '32px'],
    },
    colors: {
      foreground: 'hsl(var(--foreground))',
      card: 'hsl(var(--card-foreground))',
      popover: 'hsl(var(--popover-foreground))',
      primary: 'hsl(var(--primary-foreground))',
      secondary: 'hsl(var(--secondary-foreground))',
      muted: 'hsl(var(--muted-foreground))',
      accent: 'hsl(var(--accent-foreground))',
      destructive: 'hsl(var(--destructive-foreground))',
    },
    backgroundColor: {
      background: 'hsl(var(--background))',
      card: 'hsl(var(--card))',
      popover: 'hsl(var(--popover))',
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      muted: 'hsl(var(--muted))',
      accent: 'hsl(var(--accent))',
      destructive: 'hsl(var(--destructive))',
    },
    spacing: {
      'xs': '4px',
      'sm': '8px',
      'md': '12px',
      'lg': '16px',
      'xl': '24px',
      '2xl': '40px',
      '3xl': '64px',
    },
    borderRadius: {
      xs: '4px',
      sm: '6px',
      DEFAULT: '8px',
    },
  },

  shortcuts: [
    ['center', 'flex justify-center items-center'],
    ['x-center', 'flex justify-center'],
    ['x-between', 'flex justify-between'],
    ['y-center', 'flex items-center'],
    [/^expand-?(.*)$/, ([,size]) => `relative before:content-[""] before:absolute before:inset--${size || 2}`],
  ],

  content: {
    filesystem: ['./src/**/*.{ts,tsx}'],
  },
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      extraProperties: { display: 'inline-block' },
    }),
    remToPx({ baseFontSize: 4 }),
  ],
})
