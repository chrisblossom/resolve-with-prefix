import path from 'path';
import { normalizeOrg, parsePackageId } from './utils';
import { PrefixOptions } from './resolve-with-prefix';

function getPossiblePackageIds(
	packageId: string,
	prefixOptions: PrefixOptions = {},
) {
	const { prefix: standardPrefix, orgPrefix, strict } = prefixOptions;

	const org = normalizeOrg(prefixOptions.org);

	/**
	 * Get package scope
	 */
	const { scope, id: justId } = parsePackageId(packageId);

	const isOrg = org === scope;
	const matchedPrefix =
		isOrg === true && orgPrefix ? orgPrefix : standardPrefix;

	const prefixes = Array.isArray(matchedPrefix)
		? matchedPrefix
		: [matchedPrefix].reduce((acc: string[], prefix) => {
				if (!prefix) {
					return acc;
				}

				return [
					...acc,
					prefix,
				];
		  }, []);

	if (prefixes.length === 0) {
		return [packageId];
	}

	/**
	 * Handle absolute and relative paths
	 */
	if (path.isAbsolute(packageId) || packageId.substring(0, 1) === '.') {
		return [packageId];
	}

	/**
	 * Handle explicitly set as module
	 */
	const moduleIdentifier = 'module:';
	const isModule =
		packageId.substring(0, moduleIdentifier.length) === moduleIdentifier;
	if (isModule) {
		return [packageId.substring(moduleIdentifier.length)];
	}

	const packageIds = [];
	for (const prefix of prefixes) {
		/**
		 * Return packageId if any of the prefixes match the packageId
		 */
		const hasPrefix =
			`${justId.substring(0, prefix.length)}-` === `${prefix}-`;

		if (hasPrefix && prefix !== justId) {
			return [packageId];
		}

		const prefixedId = `${scope}${prefix}-${justId}`;
		packageIds.push(prefixedId);
	}

	/**
	 * Strict mode requires modules to be explicitly set with module:
	 */
	if (strict !== true) {
		packageIds.push(packageId);
	}

	return packageIds;
}

export { getPossiblePackageIds };
