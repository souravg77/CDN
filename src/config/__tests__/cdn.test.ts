import { describe, it, expect } from 'vitest';
import path from 'path';
import { CDN_CONFIG } from '../cdn';

describe('CDN Configuration', () => {
  const rootDir = CDN_CONFIG.ROOT_DIR;

  it('should have a valid root directory', () => {
    expect(rootDir).toBeTruthy();
    expect(path.isAbsolute(rootDir)).toBe(true);
    expect(path.basename(rootDir)).toBe('cdn_files');
  });

  describe('isValidPath', () => {
    it('should allow paths within the CDN directory', () => {
      expect(CDN_CONFIG.isValidPath('file.txt')).toBe(true);
      expect(CDN_CONFIG.isValidPath('subdir/file.txt')).toBe(true);
    });

    it('should prevent directory traversal', () => {
      expect(CDN_CONFIG.isValidPath('../outside.txt')).toBe(false);
      expect(CDN_CONFIG.isValidPath('/etc/passwd')).toBe(false);
      expect(CDN_CONFIG.isValidPath('../../sensitive.txt')).toBe(false);
    });
  });

  describe('getFullPath', () => {
    it('should return full path for valid relative paths', () => {
      const fullPath = CDN_CONFIG.getFullPath('example.txt');
      expect(fullPath).toBe(path.resolve(rootDir, 'example.txt'));
    });

    it('should throw error for invalid paths', () => {
      expect(() => CDN_CONFIG.getFullPath('../outside.txt'))
        .toThrow('Invalid file path');
    });
  });
});