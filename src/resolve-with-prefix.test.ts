/* eslint-disable jest/expect-expect */

import path from 'path';
import { platform } from 'os';
import {
	resolveWithPrefix,
	resolveWithPrefixSync,
} from './resolve-with-prefix';

const cwd = process.cwd();
const dir = path.resolve(__dirname, '__sandbox__/app1/');

beforeEach(() => {
	process.chdir(dir);
});

afterEach(() => {
	process.chdir(cwd);
});

describe('resolves full preset without prefix set', () => {
	const checkResult = (result: string) => {
		const expected = path.resolve(
			dir,
			'node_modules/one-preset-test/index.js',
		);
		expect(result).toEqual(expected);
	};

	const packageId = 'one-preset-test';

	test('async', async () => {
		const resolved = await resolveWithPrefix(packageId);

		checkResult(resolved);
	});

	test('sync', () => {
		const resolved = resolveWithPrefixSync(packageId);

		checkResult(resolved);
	});
});

describe('resolves full preset with prefix set', () => {
	const checkResult = (result: string) => {
		const expected = path.resolve(
			dir,
			'node_modules/one-preset-test/index.js',
		);
		expect(result).toEqual(expected);
	};

	const packageId = 'one-preset-test';
	const options = { prefix: 'one-preset' };

	test('async', async () => {
		const resolved = await resolveWithPrefix(packageId, options);

		checkResult(resolved);
	});

	test('sync', () => {
		const resolved = resolveWithPrefixSync(packageId, options);

		checkResult(resolved);
	});
});

describe('resolves leading preset with prefix', () => {
	const checkResult = (result: string) => {
		const expected = path.resolve(
			dir,
			'node_modules/one-preset-test/index.js',
		);

		expect(result).toEqual(expected);
	};

	const packageId = 'test';
	const options = { prefix: 'one-preset' };

	test('async', async () => {
		const resolved = await resolveWithPrefix(packageId, options);

		checkResult(resolved);
	});

	test('sync', () => {
		const resolved = resolveWithPrefixSync(packageId, options);

		checkResult(resolved);
	});
});

describe('resolves other without preset', () => {
	const checkResult = (result: string) => {
		const expected = path.resolve(dir, 'node_modules/other/index.js');

		expect(result).toEqual(expected);
	};

	const packageId = 'other';

	test('async', async () => {
		const resolved = await resolveWithPrefix(packageId);

		checkResult(resolved);
	});

	test('sync', () => {
		const resolved = resolveWithPrefixSync(packageId);

		checkResult(resolved);
	});
});

describe('resolves other without preset and empty string prefix & org', () => {
	const checkResult = (result: string) => {
		const expected = path.resolve(dir, 'node_modules/other/index.js');

		expect(result).toEqual(expected);
	};

	const packageId = 'other';
	const prefix = '';
	const org = '';

	test('async', async () => {
		const resolved = await resolveWithPrefix(packageId, { prefix, org });

		checkResult(resolved);
	});

	test('sync', () => {
		const resolved = resolveWithPrefixSync(packageId);

		checkResult(resolved);
	});
});

describe('resolves leading preset with prefix over matching module', () => {
	const checkResult = (result: string) => {
		const expected = path.resolve(
			dir,
			'node_modules/one-preset-other/index.js',
		);

		expect(result).toEqual(expected);
	};

	const packageId = 'other';
	const options = { prefix: 'one-preset' };

	test('async', async () => {
		const resolved = await resolveWithPrefix(packageId, options);

		checkResult(resolved);
	});

	test('sync', () => {
		const resolved = resolveWithPrefixSync(packageId, options);

		checkResult(resolved);
	});
});

describe('strict:true, module: works', () => {
	const checkResult = (result: string) => {
		const expected = path.resolve(
			dir,
			'node_modules/explicit-name-test/index.js',
		);

		expect(result).toEqual(expected);
	};

	const packageId = 'module:explicit-name-test';
	const options = { prefix: 'one-preset', strict: true };

	test('async', async () => {
		const resolved = await resolveWithPrefix(packageId, options);

		checkResult(resolved);
	});

	test('sync', () => {
		const resolved = resolveWithPrefixSync(packageId, options);

		checkResult(resolved);
	});
});

describe('strict:true, do not require module: when prefix not set', () => {
	const checkResult = (result: string) => {
		const expected = path.resolve(
			dir,
			'node_modules/explicit-name-test/index.js',
		);

		expect(result).toEqual(expected);
	};

	const packageId = 'explicit-name-test';
	const options = { strict: true };

	test('async', async () => {
		const resolved = await resolveWithPrefix(packageId, options);

		checkResult(resolved);
	});

	test('sync', () => {
		const resolved = resolveWithPrefixSync(packageId, options);

		checkResult(resolved);
	});
});

describe('default strict:true, require module:', () => {
	const checkError = (error: any) => {
		expect(error.code).toEqual('MODULE_NOT_FOUND');
		expect(error.message).toMatchInlineSnapshot(`
            "Cannot find module 'one-preset-explicit-name-test' from '<PROJECT_ROOT>'
            - If you want to resolve "explicit-name-test", use "module:explicit-name-test""
        `);
	};

	const packageId = 'explicit-name-test';
	const options = { prefix: 'one-preset' };

	test('async', async () => {
		expect.hasAssertions();

		try {
			await resolveWithPrefix(packageId, options);
		} catch (error) {
			checkError(error);
		}
	});

	test('sync', () => {
		expect.hasAssertions();

		try {
			resolveWithPrefixSync(packageId, options);
		} catch (error) {
			checkError(error);
		}
	});
});

describe('strict:true, require module:', () => {
	const checkError = (error: any) => {
		expect(error.code).toEqual('MODULE_NOT_FOUND');
		expect(error.message).toMatchInlineSnapshot(`
            "Cannot find module 'one-preset-explicit-name-test' from '<PROJECT_ROOT>'
            - If you want to resolve "explicit-name-test", use "module:explicit-name-test""
        `);
	};

	const packageId = 'explicit-name-test';
	const options = { prefix: 'one-preset', strict: true };

	test('async', async () => {
		expect.hasAssertions();

		try {
			await resolveWithPrefix(packageId, options);
		} catch (error) {
			checkError(error);
		}
	});

	test('sync', () => {
		expect.hasAssertions();

		try {
			resolveWithPrefixSync(packageId, options);
		} catch (error) {
			checkError(error);
		}
	});
});

describe('strict:true, allow other errors', () => {
	const checkError = (error: any) => {
		expect(error.code).toEqual('MODULE_NOT_FOUND');
		expect(error.message).toMatchInlineSnapshot(`
            "Cannot find module 'one-preset-scoped' from '<PROJECT_ROOT>'
            - Did you mean "@example/one-preset-scoped"?"
        `);
	};

	const packageId = 'one-preset-scoped';
	const options = { prefix: 'one-preset', org: '@example', strict: true };

	test('async', async () => {
		expect.hasAssertions();

		try {
			await resolveWithPrefix(packageId, options);
		} catch (error) {
			checkError(error);
		}
	});

	test('sync', () => {
		expect.hasAssertions();

		try {
			resolveWithPrefixSync(packageId, options);
		} catch (error) {
			checkError(error);
		}
	});
});

describe('if module not found but it looks like @org missing, add error', () => {
	const checkError = (error: any) => {
		expect(error.code).toEqual('MODULE_NOT_FOUND');
		expect(error.message).toMatchInlineSnapshot(`
            "Cannot find module 'one-preset-scoped' from '<PROJECT_ROOT>'
            - Did you mean "@example/one-preset-scoped"?"
        `);
	};

	const packageId = 'one-preset-scoped';
	const options = { prefix: 'one-preset', org: '@example' };

	test('async', async () => {
		expect.hasAssertions();

		try {
			await resolveWithPrefix(packageId, options);
		} catch (error) {
			checkError(error);
		}
	});

	test('sync', () => {
		expect.hasAssertions();

		try {
			resolveWithPrefixSync(packageId, options);
		} catch (error) {
			checkError(error);
		}
	});
});

describe('works with NODE_PATH', () => {
	const nodePath = process.env.NODE_PATH;
	const dirNodeModules = path.resolve(dir, 'node_modules');

	beforeEach(() => {
		process.chdir(cwd);

		const sep = platform() === 'win32' ? ';' : ':';
		if (process.env.NODE_PATH != null) {
			const splitNodePath = process.env.NODE_PATH.split(sep);
			splitNodePath.push(dirNodeModules);

			process.env.NODE_PATH = splitNodePath.join(sep);
		} else {
			process.env.NODE_PATH = dirNodeModules;
		}
	});

	afterEach(() => {
		process.env.NODE_PATH = nodePath;
	});

	const checkResult = (result: string) => {
		const expected = path.resolve(
			dirNodeModules,
			'one-preset-test/index.js',
		);

		expect(result).toEqual(expected);
	};

	const packageId = 'one-preset-test';
	const options = { prefix: 'one-preset' };

	test('async', async () => {
		const resolved = await resolveWithPrefix(packageId, options);

		checkResult(resolved);
	});

	test('sync', () => {
		const resolved = resolveWithPrefixSync(packageId, options);

		checkResult(resolved);
	});
});
