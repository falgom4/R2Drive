import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a14',
        foreground: '#fafafa',
        primary: '#fafafa',
        'primary-foreground': '#191923',
        secondary: '#262630',
        'secondary-foreground': '#fafafa',
        muted: '#262630',
        'muted-foreground': '#a5a5af',
        accent: '#262630',
        'accent-foreground': '#fafafa',
        destructive: '#b42828',
        'destructive-foreground': '#fafafa',
        card: '#0a0a14',
        'card-foreground': '#fafafa',
        border: '#262630',
        input: '#262630',
        ring: '#d4d5d7',
      },
    },
  },
  plugins: [],
};

export default config; 