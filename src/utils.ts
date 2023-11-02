/**
 * normalize org to equal npm scope format @org/
 */
function normalizeOrg(org?: string): string {
	if (org === undefined || org === '') {
		return '';
	}

	let normalized = org;

	if (normalized.startsWith('@') === false) {
		normalized = `@${normalized}`;
	}

	if (normalized.endsWith('/') === false) {
		normalized += '/';
	}

	return normalized;
}

function parsePackageId(packageId: string = ''): { scope: string; id: string } {
	const splitPackageId = packageId.split('/');
	const scope =
		splitPackageId.length > 1 && splitPackageId[0].startsWith('@') === true
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
