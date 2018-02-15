/* @flow */

/* eslint-disable no-empty */

import { sync as resolveSync } from 'resolve';
import { getPossiblePackageIds } from './get-list-of-package-ids';
import { normalizeOrg, parsePackageId } from './utils';

type ResolveOptions = {
    dirname?: string,
};

function resolveWithPrefix(packageId: string, opts?: ResolveOptions = {}) {
    const { prefix, org, orgPrefix, strict = true } = this.options;

    const { dirname = process.cwd() } = opts;

    /**
     * If nothing to prefix, pass directly to resolve
     */
    if (prefix === undefined && org === undefined && orgPrefix === undefined) {
        return resolveSync(packageId, {
            basedir: dirname,
        });
    }

    const packageIds = getPossiblePackageIds({
        packageId,
        prefix,
        org,
        orgPrefix,
        strict,
    });

    let resolved;
    let error;
    for (const id of packageIds) {
        try {
            resolved = resolveSync(id, {
                basedir: dirname,
            });
        } catch (e) {
            /**
             * Throw immediately if something unexpected has gone wrong
             */
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }

            /**
             * Original packageId is always last if included
             *
             * Check for error messages on last possible packageId
             */
            if (packageIds.indexOf(id) === packageIds.length - 1) {
                /**
                 * Custom error messages
                 *
                 * Be sure to check if error is already set before adding custom error messages
                 */

                /**
                 * With strict mode, the original packageId is not returned.
                 */
                if (!error && strict === true) {
                    try {
                        resolveSync(packageId, {
                            basedir: dirname,
                        });

                        e.message += `\n- If you want to resolve "${packageId}", use "module:${packageId}"`;
                        error = e;
                    } catch (e2) {}
                }

                if (!error && org) {
                    /**
                     * Check if user forgot to add @org
                     */
                    const { scope } = parsePackageId(packageId);
                    if (scope === '') {
                        const scopedPackageId = org + packageId;

                        try {
                            resolveSync(scopedPackageId, {
                                basedir: dirname,
                            });

                            e.message += `\n- Did you mean "${scopedPackageId}"?`;
                            error = e;
                        } catch (e2) {}
                    }
                }

                /**
                 * ensure error is set
                 */
                error = e;
            }
        }

        /**
         * Immediately return resolved in for loop to stop excess checks
         */
        if (resolved) {
            return resolved;
        }
    }

    /**
     * Fail safe if neither resolved or error has been set
     */
    if (!error) {
        error = new Error(`Unable to resolve: ${packageId}`);
    }

    throw error;
}

export type ResolveWithPrefixOptions = {
    prefix?: string | Array<string>,
    org?: string,
    orgPrefix?: string | Array<string>,
    strict?: boolean,
};

function ResolveWithPrefix(options?: ResolveWithPrefixOptions = {}) {
    const org = normalizeOrg(options.org);

    this.options = {
        ...options,
        org,
    };

    return resolveWithPrefix.bind(this);
}

export type Resolve = typeof resolveWithPrefix;
export default ResolveWithPrefix;
