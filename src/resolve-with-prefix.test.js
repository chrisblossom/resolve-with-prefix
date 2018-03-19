/* @flow */

import path from 'path';
import { platform } from 'os';

import ResolveWithPrefix from './resolve-with-prefix';

describe('ResolveWithPrefix', () => {
    const cwd = process.cwd();

    afterEach(() => {
        process.chdir(cwd);
    });

    it('resolves full preset without prefix set', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolve = new ResolveWithPrefix();

        const resolved = resolve('one-preset-test');

        const expected = path.resolve(
            dir,
            'node_modules/one-preset-test/index.js',
        );
        expect(resolved).toEqual(expected);
    });

    it('resolves full preset with prefix set', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolve = new ResolveWithPrefix({ prefix: 'one-preset' });

        const resolved = resolve('one-preset-test');

        const expected = path.resolve(
            dir,
            'node_modules/one-preset-test/index.js',
        );
        expect(resolved).toEqual(expected);
    });

    it('resolves leading preset with prefix', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolve = new ResolveWithPrefix({ prefix: 'one-preset' });

        const resolved = resolve('test');

        const expected = path.resolve(
            dir,
            'node_modules/one-preset-test/index.js',
        );
        expect(resolved).toEqual(expected);
    });

    it('resolves other without preset', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolve = new ResolveWithPrefix();

        const resolved = resolve('other');

        const expected = path.resolve(dir, 'node_modules/other/index.js');
        expect(resolved).toEqual(expected);
    });

    it('resolves leading preset with prefix over matching module', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolve = new ResolveWithPrefix({ prefix: 'one-preset' });

        const resolved = resolve('other');

        const expected = path.resolve(
            dir,
            'node_modules/one-preset-other/index.js',
        );
        expect(resolved).toEqual(expected);
    });

    it('strict:true, module: works', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolve = new ResolveWithPrefix({
            prefix: 'one-preset',
            strict: true,
        });

        const resolved = resolve('module:explicit-name-test');

        const expected = path.resolve(
            dir,
            'node_modules/explicit-name-test/index.js',
        );
        expect(resolved).toEqual(expected);
    });

    it('default strict:true, require module:', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolve = new ResolveWithPrefix({
            prefix: 'one-preset',
        });

        try {
            expect.hasAssertions();

            resolve('explicit-name-test');
        } catch (error) {
            expect(error.code).toEqual('MODULE_NOT_FOUND');
            expect(error.message).toMatch(
                /Cannot find module 'one-preset-explicit-name-test'/,
            );
            expect(error.message).toMatch(
                /If you want to resolve "explicit-name-test", use "module:explicit-name-test"/,
            );
        }
    });

    it('strict:true, require module:', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolve = new ResolveWithPrefix({
            prefix: 'one-preset',
            strict: true,
        });

        try {
            expect.hasAssertions();

            resolve('explicit-name-test');
        } catch (error) {
            expect(error.code).toEqual('MODULE_NOT_FOUND');
            expect(error.message).toMatch(
                /Cannot find module 'one-preset-explicit-name-test'/,
            );
            expect(error.message).toMatch(
                /If you want to resolve "explicit-name-test", use "module:explicit-name-test"/,
            );
        }
    });

    it('strict:true, allow other errors', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolve = new ResolveWithPrefix({
            prefix: 'one-preset',
            org: '@example',
            strict: true,
        });

        try {
            expect.hasAssertions();
            resolve('one-preset-scoped');
        } catch (error) {
            expect(error.code).toEqual('MODULE_NOT_FOUND');
            expect(error.message).toMatch(
                /Cannot find module 'one-preset-scoped'/,
            );
            expect(error.message).toMatch(
                /Did you mean "@example\/one-preset-scoped"/,
            );
        }
    });

    it('strict:true, do not require module: when prefix not set', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolve = new ResolveWithPrefix({
            strict: true,
        });

        const resolved = resolve('explicit-name-test');

        const expected = path.resolve(
            dir,
            'node_modules/explicit-name-test/index.js',
        );
        expect(resolved).toEqual(expected);
    });

    it('if module not found but it looks like @org missing, add error', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolve = new ResolveWithPrefix({
            prefix: 'one-preset',
            org: '@example',
        });

        try {
            expect.hasAssertions();
            resolve('one-preset-scoped');
        } catch (error) {
            expect(error.code).toEqual('MODULE_NOT_FOUND');
            expect(error.message).toMatch(
                /Cannot find module 'one-preset-scoped'/,
            );
            expect(error.message).toMatch(
                /Did you mean "@example\/one-preset-scoped"/,
            );
        }
    });

    it('works with NODE_PATH', () => {
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

        const resolve = new ResolveWithPrefix({ prefix: 'one-preset' });

        const resolved = resolve('one-preset-test');
        const expected = path.resolve(dir, 'one-preset-test/index.js');

        expect(resolved).toEqual(expected);
        process.env.NODE_PATH = nodePath;
    });
});
