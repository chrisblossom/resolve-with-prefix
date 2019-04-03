# resolve-with-prefix

[![npm](https://img.shields.io/npm/v/resolve-with-prefix.svg?label=npm%20version)](https://www.npmjs.com/package/resolve-with-prefix)
[![Linux Build Status](https://img.shields.io/circleci/project/github/chrisblossom/resolve-with-prefix/master.svg?label=linux%20build)](https://circleci.com/gh/chrisblossom/resolve-with-prefix/tree/master)
[![Windows Build Status](https://img.shields.io/appveyor/ci/chrisblossom/resolve-with-prefix/master.svg?label=windows%20build)](https://ci.appveyor.com/project/chrisblossom/resolve-with-prefix/branch/master)
[![Code Coverage](https://img.shields.io/codecov/c/github/chrisblossom/resolve-with-prefix/master.svg)](https://codecov.io/gh/chrisblossom/resolve-with-prefix/branch/master)

Resolve configuration files with a predefined prefix.

## About

Add a predefined prefix to find resolvable modules. This is meant to be used with configuration files.

For example, `@babel/env` --> `@babel/preset-env`.

## Installation

`npm install --save resolve-with-prefix`

## Usage

```js
import {
    resolveWithPrefix,
    resolveWithPrefixSync,
    createResolver,
    createResolverSync,
} from 'resolve-with-prefix';

const presetOptions = {
    prefix: 'babel-preset',
    org: '@babel',
    orgPrefix: 'preset',
};

const pluginOptions = {
    prefix: 'babel-plugin',
    org: '@babel',
    orgPrefix: 'plugin',
};

const resolvePreset = createResolver(presetOptions);
const resolvePresetSync = createResolverSync(presetOptions);
const resolvePlugin = createResolver(pluginOptions);
const resolvePluginSync = createResolverSync(pluginOptions);

// resolve @babel/preset-env, @babel/env
await resolveWithPrefix('@babel/env', presetOptions);
resolveWithPrefixSync('@babel/env', presetOptions);
await resolvePreset('@babel/env');
resolvePresetSync('@babel/env');

// resolve babel-plugin-transform-object-rest-spread, transform-object-rest-spread
await resolveWithPrefix('transform-object-rest-spread', pluginOptions);
resolveWithPrefixSync('transform-object-rest-spread', pluginOptions);
await resolvePlugin('transform-object-rest-spread');
resolvePluginSync('transform-object-rest-spread');
```

## Options

```js
import { resolveWithPrefix, createResolver } from 'resolve-with-prefix';

const options = {
    /**
     * Prefix to add to packageId
     *
     * Optional
     *
     * Accepts a single or an array of prefixes
     */
    prefix: 'example-prefix',

    /**
     * NPM Scope of organization to override prefix
     *
     * Optional
     */
    org: '@example',

    /**
     * Org prefixes
     *
     * Optional
     *
     * Accepts a single or an array of prefixes
     */
    orgPrefix: ['prefix', 'example-prefix'],

    /**
     * Only allow prefixed module resolution.
     * Explicit modules can be required by pre-pending "module:"
     * For example, module:local-module
     *
     * Optional
     *
     * Default: true
     */
    strict: false,
};

const resolve = createResolver(options);

/**
 * Matches the first matched packages
 * example-prefix-one , one
 */
await resolveWithPrefix('one', options);
await resolve('one');

/**
 * Matches the first matched packages
 * @other/example-prefix-one , @other/one
 */
await resolveWithPrefix('@other/one', options);
await resolve('@other/one');

/**
 * Matches the first matched packages
 * @example/prefix-one , @example/example-prefix-one , @example/one
 */
await resolveWithPrefix('@example/one', options);
await resolve('@example/one');

/**
 * Use the dirname option to specify where to search for node_modules
 *
 * Default is process.cwd()
 */
await resolveWithPrefix('one', { ...options, dirname: __dirname });
await resolve('one', { dirname: __dirname });

/**
 * Explicitly resolve a module
 *
 * See configuration option: strict
 */
await resolveWithPrefix('module:local-module', options);
await resolve('module:local-module');

/**
 * Absolute and relative paths allowed
 */
await resolve('/path/to/module');
await resolve('./path/to/module');
```

## Thanks To

This package was created with the great work / lessons learned from:

-   [babel](https://github.com/babel/babel/)
-   [eslint](https://github.com/eslint/eslint)
