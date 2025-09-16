const { sanitize } = require('../server.js'); // Assuming sanitize is exported

describe('sanitize', () => {
  test('should remove special characters and replace with underscores', () => {
    expect(sanitize('My Sequence Name!@#')).toBe('My_Sequence_Name___');
  });

  test('should handle spaces correctly', () => {
    expect(sanitize('Another Sequence')).toBe('Another_Sequence');
  });

  test('should return the same string if no special characters', () => {
    expect(sanitize('SimpleName')).toBe('SimpleName');
  });

  test('should handle empty string', () => {
    expect(sanitize('')).toBe('');
  });
});