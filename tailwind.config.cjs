const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Poppins', ...fontFamily.sans],
			},
			colors: {
				background: '#232631',
				card: '#272A36',
				primary: '#FF79C6',
				text: '#F8F8F2',
			},
		},
	},
	plugins: [],
};
