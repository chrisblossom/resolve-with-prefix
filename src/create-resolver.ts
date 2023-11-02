import {
	resolveWithPrefix,
	resolveWithPrefixSync,
	ResolveOptions,
	Options,
} from './resolve-with-prefix';

function createResolver(options: Options = {}) {
	return (packageId: string, { dirname }: ResolveOptions = {}) => {
		return resolveWithPrefix(packageId, {
			...options,
			dirname,
		});
	};
}

function createResolverSync(options: Options = {}) {
	return (packageId: string, { dirname }: ResolveOptions = {}) => {
		return resolveWithPrefixSync(packageId, {
			...options,
			dirname,
		});
	};
}

export { createResolver, createResolverSync };
