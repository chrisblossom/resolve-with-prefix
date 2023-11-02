'use strict';

module.exports = {
	presets: [
		[
			'@backtrack/node',
			{ mode: 'module', syntax: 'typescript' },
		],
	],

	config: {
		wallaby: (config) => {
			config.files = config.files.filter((pattern) => {
				return pattern !== '!**/node_modules/**';
			});

			config.files.push('!node_modules/**');

			return config;
		},

		eslint: {
			rules: {
				'import/no-cycle': 'off',
			},
		},

		/**
		 * Jest v29 does not support prettier v3.
		 *
		 * Remove this and the prettier-2 package when Jest v30 is released.
		 *
		 * https://jestjs.io/docs/configuration/#prettierpath-string
		 */
		jest: {
			prettierPath: require.resolve('prettier-2'),
		},
	},
};
