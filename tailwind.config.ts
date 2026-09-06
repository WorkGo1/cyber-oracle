import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        surface2: 'rgb(var(--c-surface2) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        acid: 'rgb(var(--c-acid) / <alpha-value>)',
        magenta: 'rgb(var(--c-magenta) / <alpha-value>)',
        violet: 'rgb(var(--c-violet) / <alpha-value>)',
        cyan: 'rgb(var(--c-cyan) / <alpha-value>)',
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
        t1: 'rgb(var(--c-t1) / <alpha-value>)',
        t2: 'rgb(var(--c-t2) / <alpha-value>)',
        t3: 'rgb(var(--c-t3) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"ZCOOL QingKe HuangYou"', 'Orbitron', 'system-ui', 'sans-serif'],
        cyber: ['Orbitron', '"ZCOOL QingKe HuangYou"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        body: [
          'system-ui',
          '-apple-system',
          '"PingFang SC"',
          '"HarmonyOS Sans SC"',
          'MiSans',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
        hud: '4px',
        pill: '999px',
      },
      boxShadow: {
        'glow-acid': '0 0 24px rgb(var(--c-acid) / 0.45)',
        'glow-magenta': '0 0 24px rgb(var(--c-magenta) / 0.45)',
        'glow-violet': '0 0 24px rgb(var(--c-violet) / 0.45)',
        'glow-cyan': '0 0 24px rgb(var(--c-cyan) / 0.45)',
        'glow-gold': '0 0 24px rgb(var(--c-gold) / 0.45)',
      },
      spacing: {
        'safe-b': 'env(safe-area-inset-bottom)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        blink: 'blink 1.2s steps(2) infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
