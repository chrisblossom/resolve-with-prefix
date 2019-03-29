import { normalizeOrg, parsePackageId } from './utils';

describe('normalizeOrg', () => {
    test('handles undefined', () => {
        const result = normalizeOrg();
        expect(result).toEqual(undefined);
    });

    test('adds @', () => {
        const org = 'example/';

        const result = normalizeOrg(org);
        expect(result).toEqual('@example/');
    });

    test('adds /', () => {
        const org = '@example';

        const result = normalizeOrg(org);
        expect(result).toEqual('@example/');
    });

    test('adds @/', () => {
        const org = 'example';

        const result = normalizeOrg(org);
        expect(result).toEqual('@example/');
    });
});

describe('parsePackageId', () => {
    test('handles undefined', () => {
        const result = parsePackageId();

        expect(result).toEqual({
            scope: '',
            id: '',
        });
    });

    test('handles no scope', () => {
        const packageId = 'example-package';

        const result = parsePackageId(packageId);

        expect(result).toEqual({
            scope: '',
            id: 'example-package',
        });
    });

    test('handles scope', () => {
        const packageId = '@example/package';

        const result = parsePackageId(packageId);

        expect(result).toEqual({
            scope: '@example/',
            id: 'package',
        });
    });

    test('handles package with deep / with scope', () => {
        const packageId = '@example/package/deep/inside';

        const result = parsePackageId(packageId);

        expect(result).toEqual({
            scope: '@example/',
            id: 'package/deep/inside',
        });
    });
    test('handles package with deep / without scope', () => {
        const packageId = 'package/deep/inside';

        const result = parsePackageId(packageId);

        expect(result).toEqual({
            scope: '',
            id: 'package/deep/inside',
        });
    });
});
