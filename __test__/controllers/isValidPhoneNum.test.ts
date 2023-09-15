import { IsValidPhoneNumber } from '../../src/function/function'

describe('IsValidPhoneNumber', () => {
  it('should return true for valid Indonesian phone numbers', () => {
    expect(IsValidPhoneNumber('081234567890', 'ID')).toBe(true);
    expect(IsValidPhoneNumber('6281234567890', 'ID')).toBe(true);
    expect(IsValidPhoneNumber('+6281234567890', 'ID')).toBe(true);
  });

  it('should return false for invalid Indonesian phone numbers', () => {
    expect(IsValidPhoneNumber('0812abcd5678', 'ID')).toBe(false); // Contains non-digits
    expect(IsValidPhoneNumber('62812345678909999999', 'ID')).toBe(false); // Too long
    expect(IsValidPhoneNumber('6281', 'ID')).toBe(false); // Too short
  });
});
