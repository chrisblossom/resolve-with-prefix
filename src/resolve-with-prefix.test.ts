import path from 'path';
import { platform } from 'os';

import { resolveWithPrefix } from './resolve-with-prefix';

const cwd = process.cwd();

afterEach(() => {
    process.chdir(cwd);
});

test('resolves full preset without prefix set', () => {
    const dir = path.resolve(__dirname, '__sandbox__/app1/');
    process.chdir(dir);

    const resolved = resolveWithPrefix('one-preset-test');

    const expected = path.resolve(dir, 'node_modules/one-preset-test/index.js');
    expect(resolved).toEqual(expected);
});

test('resolves full preset with prefix set', () => {
    const dir = path.resolve(__dirname, '__sandbox__/app1/');
    process.chdir(dir);

    const resolved = resolveWithPrefix('one-preset-test', {
        prefix: 'one-preset',
    });

    const expected = path.resolve(dir, 'node_modules/one-preset-test/index.js');
    expect(resolved).toEqual(expected);
});

test('resolves leading preset with prefix', () => {
    const dir = path.resolve(__dirname, '__sandbox__/app1/');
    process.chdir(dir);

    const resolved = resolveWithPrefix('test', {
        prefix: 'one-preset',
    });

    const expected = path.resolve(dir, 'node_modules/one-preset-test/index.js');
    expect(resolved).toEqual(expected);
});

test('resolves other without preset', () => {
    const dir = path.resolve(__dirname, '__sandbox__/app1/');
    process.chdir(dir);

    const resolved = resolveWithPrefix('other');

    const expected = path.resolve(dir, 'node_modules/other/index.js');
    expect(resolved).toEqual(expected);
});

test('resolves leading preset with prefix over matching module', () => {
    const dir = path.resolve(__dirname, '__sandbox__/app1/');
    process.chdir(dir);

    const resolved = resolveWithPrefix('other', { prefix: 'one-preset' });

    const expected = path.resolve(
        dir,
        'node_modules/one-preset-other/index.js',
    );
    expect(resolved).toEqual(expected);
});

test('strict:true, module: works', () => {
    const dir = path.resolve(__dirname, '__sandbox__/app1/');
    process.chdir(dir);

    const resolved = resolveWithPrefix('module:explicit-name-test', {
        prefix: 'one-preset',
        strict: true,
    });

    const expected = path.resolve(
        dir,
        'node_modules/explicit-name-test/index.js',
    );
    expect(resolved).toEqual(expected);
});

test('default strict:true, require module:', () => {
    const dir = path.resolve(__dirname, '__sandbox__/app1/');
    process.chdir(dir);

    try {
        expect.hasAssertions();

        resolveWithPrefix('explicit-name-test', { prefix: 'one-preset' });
    } catch (error) {
        expect(error.code).toEqual('MODULE_NOT_FOUND');
        expect(error.message).toMatchInlineSnapshot(`
            "Cannot find module 'one-preset-explicit-name-test' from '<PROJECT_ROOT>'
            - If you want to resolve \\"explicit-name-test\\", use \\"module:explicit-name-test\\""
        `);
    }
});

test('strict:true, require module:', () => {
    const dir = path.resolve(__dirname, '__sandbox__/app1/');
    process.chdir(dir);

    try {
        expect.hasAssertions();

        resolveWithPrefix('explicit-name-test', {
            prefix: 'one-preset',
            strict: true,
        });
    } catch (error) {
        expect(error.code).toEqual('MODULE_NOT_FOUND');
        expect(error.message).toMatchInlineSnapshot(`
            "Cannot find module 'one-preset-explicit-name-test' from '<PROJECT_ROOT>'
            - If you want to resolve \\"explicit-name-test\\", use \\"module:explicit-name-test\\""
        `);
    }
});

test('strict:true, allow other errors', () => {
    const dir = path.resolve(__dirname, '__sandbox__/app1/');
    process.chdir(dir);

    try {
        expect.hasAssertions();
        resolveWithPrefix('one-preset-scoped', {
            prefix: 'one-preset',
            org: '@example',
            strict: true,
        });
    } catch (error) {
        expect(error.code).toEqual('MODULE_NOT_FOUND');
        expect(error.message).toMatchInlineSnapshot(`
            "Cannot find module 'one-preset-scoped' from '<PROJECT_ROOT>'
            - Did you mean \\"@example/one-preset-scoped\\"?"
        `);
    }
});

test('strict:true, do not require module: when prefix not set', () => {
    const dir = path.resolve(__dirname, '__sandbox__/app1/');
    process.chdir(dir);

    const resolved = resolveWithPrefix('explicit-name-test', {
        strict: true,
    });

    const expected = path.resolve(
        dir,
        'node_modules/explicit-name-test/index.js',
    );
    expect(resolved).toEqual(expected);
});

test('if module not found but it looks like @org missing, add error', () => {
    const dir = path.resolve(__dirname, '__sandbox__/app1/');
    process.chdir(dir);

    try {
        expect.hasAssertions();
        resolveWithPrefix('one-preset-scoped', {
            prefix: 'one-preset',
            org: '@example',
        });
    } catch (error) {
        expect(error.code).toEqual('MODULE_NOT_FOUND');
        expect(error.message).toMatchInlineSnapshot(`
            "Cannot find module 'one-preset-scoped' from '<PROJECT_ROOT>'
            - Did you mean \\"@example/one-preset-scoped\\"?"
        `);
    }
});

test('works with NODE_PATH', () => {
    const nodePath = process.env.NODE_PATH;
    const dir = path.resolve(__dirname, '__sandbox__/app1/node_modules');

    const sep = platform() === 'win32' ? ';' : ':';
    if (process.env.NODE_PATH) {
        const splitNodePath = process.env.NODE_PATH.split(sep);
        splitNodePath.push(dir);

        process.env.NODE_PATH = splitNodePath.join(':');
    } else {
        process.env.NODE_PATH = dir;
    }

    const resolved = resolveWithPrefix('one-preset-test', {
        prefix: 'one-preset',
    });

    const expected = path.resolve(dir, 'one-preset-test/index.js');

    expect(resolved).toEqual(expected);
    process.env.NODE_PATH = nodePath;
});
