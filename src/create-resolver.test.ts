import path from 'path';
import { createResolver } from './create-resolver';

describe('createResolver', () => {
    const cwd = process.cwd();

    afterEach(() => {
        process.chdir(cwd);
    });

    test('creates multiple resolvers', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolvePreset = createResolver({ prefix: 'one-preset' });
        const resolvePlugin = createResolver({ prefix: 'one-plugin' });

        const pluginResolved = resolvePlugin('test');
        const presetResolved = resolvePreset('test');

        const pluginExpected = path.resolve(
            dir,
            'node_modules/one-plugin-test/index.js',
        );
        const presetExpected = path.resolve(
            dir,
            'node_modules/one-preset-test/index.js',
        );

        expect(pluginResolved).toEqual(pluginExpected);
        expect(presetResolved).toEqual(presetExpected);
    });

    test('cannot overwrite resolve options', () => {
        const dir = path.resolve(__dirname, '__sandbox__/app1/');
        process.chdir(dir);

        const resolvePreset = createResolver({ prefix: 'one-preset' });
        const presetResolved = resolvePreset('test', {
            // @ts-ignore
            prefix: 'one-plugin',
        });

        const presetExpected = path.resolve(
            dir,
            'node_modules/one-preset-test/index.js',
        );

        expect(presetResolved).toEqual(presetExpected);
    });
});
