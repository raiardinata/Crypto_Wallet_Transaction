import { IsValidUsername } from '../../src/function/function'

describe('isValidUsername', () => {
  it('should return true for a unique username', async () => {
    let res1: Boolean = await IsValidUsername('uniqueUsername');
    expect(res1).toBe(true);
  });

  it('should return false for a non-unique username', async () => {
    let res2: Boolean = await IsValidUsername('user');
    expect(res2).toBe(false);
  });
});
