import { getPossiblePackageIds } from './get-list-of-package-ids';

describe('getPossiblePackageIds', () => {
	test('returns packageId with no prefix', () => {
		const packageId = 'one-preset-test';

		const packageIds = getPossiblePackageIds(packageId);

		expect(packageIds).toEqual(['one-preset-test']);
	});

	test('returns packageId with empty prefix and org', () => {
		const packageId = 'one-preset-test';
		const prefix = '';
		const org = '';

		const packageIds = getPossiblePackageIds(packageId, { prefix, org });

		expect(packageIds).toEqual(['one-preset-test']);
	});

	test('@org - returns packageId with no prefix', () => {
		const packageId = '@example/one-preset-test';

		const packageIds = getPossiblePackageIds(packageId);

		expect(packageIds).toEqual(['@example/one-preset-test']);
	});

	test('if prefix is set, return packageId', () => {
		const packageId = 'one-preset-test';
		const prefix = 'one-preset';

		const packageIds = getPossiblePackageIds(packageId, { prefix });

		expect(packageIds).toEqual(['one-preset-test']);
	});

	test('@org - if prefix is set, return packageId', () => {
		const packageId = '@example/one-preset-test';
		const prefix = 'one-preset';

		const packageIds = getPossiblePackageIds(packageId, { prefix });

		expect(packageIds).toEqual(['@example/one-preset-test']);
	});

	test('if prefix is not set, return packageId and prefixed', () => {
		const packageId = 'test';
		const prefix = 'one-preset';

		const packageIds = getPossiblePackageIds(packageId, { prefix });

		expect(packageIds).toEqual([
			'one-preset-test',
			'test',
		]);
	});

	test('if package is equal to prefix, search prefix-prefix first', () => {
		const packageId = 'preset';
		const prefix = 'preset';

		const packageIds = getPossiblePackageIds(packageId, { prefix });

		expect(packageIds).toEqual([
			'preset-preset',
			'preset',
		]);
	});

	test('outside @org - if package is equal to prefix, search prefix-prefix first', () => {
		const packageId = '@example/preset';
		const prefix = 'preset';

		const packageIds = getPossiblePackageIds(packageId, { prefix });

		expect(packageIds).toEqual([
			'@example/preset-preset',
			'@example/preset',
		]);
	});

	test('inside @org - if package is equal to prefix, search prefix-prefix first', () => {
		const packageId = '@example/preset';
		const prefix = 'example-preset';
		const org = '@example';
		const orgPrefix = [
			'preset',
			'example-preset',
		];

		const packageIds = getPossiblePackageIds(packageId, {
			prefix,
			org,
			orgPrefix,
		});

		expect(packageIds).toEqual([
			'@example/preset-preset',
			'@example/example-preset-preset',
			'@example/preset',
		]);
	});

	test('outside @org - if prefix is not set, return packageId and prefixed', () => {
		const packageId = '@example/test';
		const prefix = 'one-preset';

		const packageIds = getPossiblePackageIds(packageId, { prefix });

		expect(packageIds).toEqual([
			'@example/one-preset-test',
			'@example/test',
		]);
	});

	test('returns packageId when module:', () => {
		const packageId = 'module:test';
		const prefix = 'one-preset';

		const packageIds = getPossiblePackageIds(packageId, { prefix });

		expect(packageIds).toEqual(['test']);
	});

	test('returns packageId when absolute path', () => {
		const packageId = '/path/to/module';
		const prefix = 'one-preset';

		const packageIds = getPossiblePackageIds(packageId, { prefix });

		expect(packageIds).toEqual(['/path/to/module']);
	});

	test('returns packageId when ./relative path', () => {
		const packageId = './path/to/module';
		const prefix = 'one-preset';

		const packageIds = getPossiblePackageIds(packageId, { prefix });

		expect(packageIds).toEqual(['./path/to/module']);
	});

	test('returns packageId when ../relative path', () => {
		const packageId = '../path/to/module';
		const prefix = 'one-preset';

		const packageIds = getPossiblePackageIds(packageId, { prefix });

		expect(packageIds).toEqual(['../path/to/module']);
	});

	test('adds orgPrefixes and ignores prefix', () => {
		const packageId = '@example/test';
		const prefix = 'other-preset';
		const org = '@example';
		const orgPrefix = [
			'preset',
			'example-preset',
		];

		const packageIds = getPossiblePackageIds(packageId, {
			prefix,
			org,
			orgPrefix,
		});

		expect(packageIds).toEqual([
			'@example/preset-test',
			'@example/example-preset-test',
			'@example/test',
		]);
	});

	test('with multiple prefixes and when a prefix is matched, return only original packageId', () => {
		const packageId = '@example/preset-test';
		const prefix = 'other-preset';
		const org = '@example';
		const orgPrefix = [
			'preset',
			'example-preset',
		];

		const packageIds = getPossiblePackageIds(packageId, {
			prefix,
			org,
			orgPrefix,
		});

		expect(packageIds).toEqual(['@example/preset-test']);
	});

	test('org falls back to prefix when orgPrefix not set', () => {
		const packageId = '@example/test';
		const prefix = 'other-preset';
		const org = '@example';

		const packageIds = getPossiblePackageIds(packageId, {
			prefix,
			org,
		});

		expect(packageIds).toEqual([
			'@example/other-preset-test',
			'@example/test',
		]);
	});

	test('ignores org when different @scope and ignores orgPrefix', () => {
		const packageId = '@other/test';
		const prefix = 'other-preset';
		const org = '@example';
		const orgPrefix = 'example-preset';

		const packageIds = getPossiblePackageIds(packageId, {
			prefix,
			org,
			orgPrefix,
		});

		expect(packageIds).toEqual([
			'@other/other-preset-test',
			'@other/test',
		]);
	});

	test('handles only orgPrefix', () => {
		const org = '@example';
		const orgPrefix = 'preset';

		const packageIds1 = getPossiblePackageIds('@other/test', {
			org,
			orgPrefix,
			strict: true,
		});

		expect(packageIds1).toEqual(['@other/test']);

		const packageIds2 = getPossiblePackageIds('@example/test', {
			org,
			orgPrefix,
		});

		expect(packageIds2).toEqual([
			'@example/preset-test',
			'@example/test',
		]);
	});

	test('strict: true, do not return original package name', () => {
		const packageId = 'local-module';
		const prefix = 'preset';
		const strict = true;

		const packageIds = getPossiblePackageIds(packageId, {
			prefix,
			strict,
		});

		expect(packageIds).toEqual(['preset-local-module']);
	});
});
