'use strict';

module.exports = {
    presets: [['@backtrack/node-module', { flow: true }]],

    config: {
        wallaby: (config) => {
            config.files = config.files.filter((pattern) => {
                return pattern !== '!**/node_modules/**';
            });

            config.files.push('!node_modules/**');

            return config;
        },
    },
};
