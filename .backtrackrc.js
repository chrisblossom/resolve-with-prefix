'use strict';

module.exports = {
    presets: [['@backtrack/node', { mode: 'module', syntax: 'typescript' }]],

    config: {
        wallaby: (config) => {
            config.files = config.files.filter((pattern) => {
                return pattern !== '!**/node_modules/**';
            });

            config.files.push('!node_modules/**');

            return config;
        },

        babel: (config) => {
            delete config.overrides;

            return config;
        },
    },
};
