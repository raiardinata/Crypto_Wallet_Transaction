import { IsAlphabetString } from '../../src/function/function'

describe('IsAlphabetString', () => {
  it('should return true for valid alphabet strings within the specified length range', () => {
    expect(IsAlphabetString('abc', 1, 5)).toBe(true);
    expect(IsAlphabetString('AbCdEf', 3, 6)).toBe(true);
    expect(IsAlphabetString('xyzXYZ', 4, 7)).toBe(true);
  });

  it('should return false for invalid alphabet strings', () => {
    expect(IsAlphabetString('123', 1, 3)).toBe(false);
    expect(IsAlphabetString('abc123', 2, 5)).toBe(false);
    expect(IsAlphabetString('AB CD', 1, 4)).toBe(false);
    expect(IsAlphabetString('', 0, 10)).toBe(false);
  });

  it('should return false for alphabet strings with length outside the specified range', () => {
    expect(IsAlphabetString('abc', 4, 6)).toBe(false);
    expect(IsAlphabetString('xyzXYZ', 2, 4)).toBe(false);
  });
});
