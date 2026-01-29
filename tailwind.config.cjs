import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				muted: '#e2e8f0',
				'muted-foreground': '#475569',
				'primary-foreground': '#f8fafc',
				primary: '#020617',
				secondary: '#f8fafc',
				'secondary-foreground': '#020617',
				card: '#ffffff',
				'card-foreground': '#1f2937'
			}
		}
	},

	plugins: [forms]
};

module.exports = config;
