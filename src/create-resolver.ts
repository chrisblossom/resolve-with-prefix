import {
	resolveWithPrefix,
	resolveWithPrefixSync,
	ResolveOptions,
	Options,
} from './resolve-with-prefix';

function createResolver(options: Options = {}) {
	return async (
		packageId: string,
		{ dirname }: ResolveOptions = {},
	): Promise<ReturnType<typeof resolveWithPrefix>> => {
		return resolveWithPrefix(packageId, {
			...options,
			dirname,
		});
	};
}

function createResolverSync(options: Options = {}) {
	return (
		packageId: string,
		{ dirname }: ResolveOptions = {},
	): ReturnType<typeof resolveWithPrefixSync> => {
		return resolveWithPrefixSync(packageId, {
			...options,
			dirname,
		});
	};
}

export { createResolver, createResolverSync };
