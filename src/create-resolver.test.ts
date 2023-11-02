import path from 'path';
import { createResolver, createResolverSync } from './create-resolver';
import { ResolveOptions } from './resolve-with-prefix';

describe('createResolver', () => {
	const cwd = process.cwd();
	const dir = path.resolve(__dirname, '__sandbox__/app1/');

	beforeEach(() => {
		process.chdir(dir);
	});

	afterEach(() => {
		process.chdir(cwd);
	});

	describe('creates multiple resolvers', () => {
		const checkResult = (
			presetResolved: string,
			pluginResolved: string,
		) => {
			const presetExpected = path.resolve(
				dir,
				'node_modules/one-preset-test/index.js',
			);
			const pluginExpected = path.resolve(
				dir,
				'node_modules/one-plugin-test/index.js',
			);

			expect(presetResolved).toEqual(presetExpected);
			expect(pluginResolved).toEqual(pluginExpected);
		};

		const packageId = 'test';
		const presetOptions = { prefix: 'one-preset' };
		const pluginOptions = { prefix: 'one-plugin' };

		test('async', async () => {
			const resolvePreset = createResolver(presetOptions);
			const resolvePlugin = createResolver(pluginOptions);

			const pluginResolved = await resolvePlugin(packageId);
			const presetResolved = await resolvePreset(packageId);

			checkResult(presetResolved, pluginResolved);
		});

		test('sync', () => {
			const resolvePreset = createResolverSync(presetOptions);
			const resolvePlugin = createResolverSync(pluginOptions);

			const pluginResolved = resolvePlugin(packageId);
			const presetResolved = resolvePreset(packageId);

			checkResult(presetResolved, pluginResolved);
		});
	});

	describe('cannot overwrite resolve options', () => {
		const checkResult = (presetResolved: string) => {
			const presetExpected = path.resolve(
				dir,
				'node_modules/one-preset-test/index.js',
			);

			expect(presetResolved).toEqual(presetExpected);
		};

		const packageId = 'test';
		const presetOptions = { prefix: 'one-preset' };
		const resolveOptions: ResolveOptions = {
			// @ts-ignore
			prefix: 'one-plugin',
		};

		test('async', async () => {
			const resolvePreset = createResolver(presetOptions);

			const presetResolved = await resolvePreset(
				packageId,
				resolveOptions,
			);

			checkResult(presetResolved);
		});

		test('sync', () => {
			const resolvePreset = createResolverSync(presetOptions);

			const presetResolved = resolvePreset(packageId, resolveOptions);

			checkResult(presetResolved);
		});
	});
});
