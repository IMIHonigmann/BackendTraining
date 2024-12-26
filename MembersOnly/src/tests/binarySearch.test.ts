import { binarySearch } from "../utils/binarySearch";

describe('Binary Search', () => {
    test('works correctly', () => {
        expect(binarySearch([200, 235, 854, 1239], 235)).toBe(1)
        expect(binarySearch([200, 235, 854, 1239], 235)).not.toBe(235)
        expect(binarySearch([1, 2, 3, 4], 5)).toBe(-1);
        expect(typeof binarySearch([], 1)).toBe('number');
    });
    test('correctly works on edge cases', () => {
        expect(binarySearch([], 1)).toBe(-1)

        const result: number = binarySearch([1], 1);
        expect(result).toBe(0);
    });
})