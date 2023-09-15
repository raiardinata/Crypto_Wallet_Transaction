import { IsValidEmail } from '../../src/function/function'

describe('IsValidEmail', () => {
  it('should return true for valid email addresses', () => {
    expect(IsValidEmail('test@example.com')).toBe(true);
    expect(IsValidEmail('john.doe12345@example.co.uk')).toBe(true);
    expect(IsValidEmail('user@subdomain.domain.com')).toBe(true);
  });

  it('should return false for invalid email addresses', () => {
    expect(IsValidEmail('invalid-email')).toBe(false);
    expect(IsValidEmail('missing-at.com')).toBe(false);
    expect(IsValidEmail('no-domain@')).toBe(false);
    expect(IsValidEmail('spaces in@email.com')).toBe(false);
    expect(IsValidEmail('12345@12345')).toBe(false);
    expect(IsValidEmail('test@')).toBe(false);
    expect(IsValidEmail('test@.com')).toBe(false);
  });
});
