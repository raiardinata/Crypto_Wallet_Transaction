import { ParseDate } from '../../src/function/function'

describe('ParseDate', () => {
  it('should parse valid date strings in different formats', () => {
    // Test various valid date strings and formats
    expect(ParseDate('2021-09-08')).toEqual(new Date(new Date(Date.UTC(2021, 8, 8))));
    expect(ParseDate('08/09/2021')).toEqual(new Date(new Date(Date.UTC(2021, 8, 8))));

    // Test additional valid date strings and formats
    expect(ParseDate('08/09/2021')).toEqual(new Date(new Date(Date.UTC(2021, 8, 8))));
  });

  it('should return undefined for invalid date strings', () => {
    // Test invalid date strings
    expect(ParseDate('invalid-date')).toBeUndefined();
    expect(ParseDate('12345')).toBeUndefined();
  });
});
