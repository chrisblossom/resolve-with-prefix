import { createResolver, createResolverSync } from './create-resolver';
import { resolveWithPrefixSync } from './resolve-with-prefix-sync';
import { resolveWithPrefixAsync as resolveWithPrefix } from './resolve-with-prefix-async';

export interface PrefixOptions {
	prefix?: string | string[];
	org?: string;
	orgPrefix?: string | string[];
	strict?: boolean;
}

export interface ResolveOptions {
	dirname?: string;
}

export type Options = PrefixOptions & ResolveOptions;

export {
	resolveWithPrefix,
	resolveWithPrefixSync,
	createResolver,
	createResolverSync,
};
