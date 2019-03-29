/**
 * normalize org to equal npm scope format @org/
 */
function normalizeOrg(org?: string) {
    if (!org) {
        return org;
    }

    let normalized = org;

    if (normalized.substring(0, 1) !== '@') {
        normalized = `@${normalized}`;
    }

    if (normalized.substring(normalized.length - 1) !== '/') {
        normalized += '/';
    }

    return normalized;
}

function parsePackageId(packageId: string = '') {
    const splitPackageId = packageId.split('/');
    const scope =
        splitPackageId.length > 1 && splitPackageId[0].substring(0, 1) === '@'
            ? `${splitPackageId[0]}/`
            : '';

    const justPackageId =
        scope === '' ? packageId : splitPackageId.splice(1).join('/');

    return {
        scope,
        id: justPackageId,
    };
}

export { parsePackageId, normalizeOrg };
