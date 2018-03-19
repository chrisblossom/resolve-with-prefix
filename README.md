# resolve-with-prefix

Resolve configuration files with a predefined prefix.

## About

Add a predefined prefix to find resolvable modules. This is meant to be used with configuration files.

For example, `@babel/env` --> `@babel/preset-env`.

## Installation

`npm install --save resolve-with-prefix`

## Usage

```js
import ResolveWithPrefix from 'resolve-with-prefix';

const resolvePreset = new ResolveWithPrefix({
    prefix: 'babel-preset',
    org: '@babel',
    orgPrefix: 'preset',
});

const resolvePlugin = new ResolveWithPrefix({
    prefix: 'babel-plugin',
    org: '@babel',
    orgPrefix: 'plugin',
});

// resolve @babel/preset-env, @babel/env
const matchedPreset = resolvePreset('@babel/env');

// resolve babel-plugin-transform-object-rest-spread, transform-object-rest-spread
const matchedPlugin = resolvePlugin('transform-object-rest-spread');
```

## Options

```js
const resolve = new ResolveWithPrefix({
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
     * Explicit modules can be required by prepending module:
     * For example, module:local-module
     *
     * Default: true
     * Optional
     */
    strict: false,
});

/**
 * Matches the first matched packages
 * example-prefix-one , one
 */
resolve('one');

/**
 * Matches the first matched packages
 * @other/example-prefix-one , @other/one
 */
resolve('@other/one');

/**
 * Matches the first matched packages
 * @example/prefix-one , @example/example-prefix-one , @example/one
 */
resolve('@example/one');

/**
 * Use the dirname option to specify where to search for node_modules
 *
 * Default is process.cwd()
 */
resolve('one', { dirname: __dirname });

/**
 * Explictly resolve a module
 *
 * See configuration option: strict
 */
resolve('module:local-module');

/**
 * Absolute and relative paths allowed
 */
resolve('/path/to/module');
resolve('./path/to/module');
```

## Thanks To

This package was created with the great work / lessons learned from:

*   [babel](https://github.com/babel/babel/)
*   [eslint](https://github.com/eslint/eslint)
