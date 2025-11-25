/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animation: {
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      colors: {
        background: 'hsl(209, 40%, 96%)',
        foreground: 'hsl(222, 47%, 11%)',
        card: 'hsl(210, 40%, 98%)',
        'card-foreground': 'hsl(222, 47%, 11%)',
        primary: 'hsl(216, 19%, 26%)',
        'primary-foreground': 'hsl(210, 19%, 98%)',
        secondary: 'hsl(215, 19%, 34%)',
        'secondary-foreground': 'hsl(210, 40%, 98%)',
        muted: 'hsl(215, 20%, 65%)',
        'muted-foreground': 'hsl(222, 47%, 11%)',
        accent: 'hsl(210, 40%, 98%)',
        'accent-foreground': 'hsl(215, 16%, 46%)',
        destructive: 'hsl(0, 72%, 50%)',
        'destructive-foreground': 'hsl(0, 85%, 97%)',
        border: 'hsl(212, 26%, 83%)',
        input: 'hsl(212, 26%, 83%)',
        ring: 'hsl(216, 19%, 26%)',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Crimson Pro', 'ui-serif', 'Georgia', 'serif'],
        mono: ['SF Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
