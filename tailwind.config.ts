import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				corporate: {
					50: '#f0f4fa',
					100: '#dce7f3',
					200: '#c2d5ea',
					300: '#9bbada',
					400: '#6d98c7',
					500: '#4c7ab3',
					600: '#3a6195',
					700: '#304f7a',
					800: '#2a4365',
					900: '#1a365d',
				},
				coral: {
					50: '#fdf2f1',
					100: '#fbe7e5',
					200: '#f8d5d1',
					300: '#f3b9b2',
					400: '#ef9a8f',
					500: '#E88D83',
					600: '#d56e61',
					700: '#bf504a',
					800: '#9e4440',
					900: '#83403c',
				},
				navy: {
					50: '#ebeef0',
					100: '#d0d6dd',
					200: '#b3bfc9',
					300: '#94a7b5',
					400: '#7990a1',
					500: '#5f798d',
					600: '#4f667a',
					700: '#3e5367',
					800: '#2C3E50',
					900: '#1e2a3c',
				},
				cream: '#FAF7F0',
				darkgray: '#333333',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				"pulse-gentle": {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
				},
				"message-transform": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				"pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
				"message-transform": "message-transform 0.5s ease-out forwards"
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				playfair: ['Playfair Display', 'serif'],
				freight: ['Freight Text Pro', 'Playfair Display', 'serif'],
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
