import {
    resolveWithPrefix,
    PrefixOptions,
    ResolveOptions,
} from './resolve-with-prefix';

function createResolver(options: PrefixOptions & ResolveOptions = {}) {
    return (packageId: string, { dirname }: ResolveOptions = {}) => {
        return resolveWithPrefix(packageId, {
            ...options,
            dirname,
        });
    };
}

export { createResolver };
