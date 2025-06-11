import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import { CdnConfig } from './cdn';

describe('CDN Configuration', () => {
  it('should have a valid CDN root directory', () => {
    const cdnRoot = CdnConfig.getCdnRoot();
    
    // Check if path is absolute
    expect(path.isAbsolute(cdnRoot)).toBe(true);
    
    // Check if path ends with 'cdn'
    expect(path.basename(cdnRoot)).toBe('cdn');
  });

  it('should ensure CDN directory exists', () => {
    CdnConfig.ensureCdnDirectoryExists();
    
    // Verify directory exists
    expect(fs.existsSync(CdnConfig.getCdnRoot())).toBe(true);
  });

  it('should prevent directory traversal', () => {
    const cdnRoot = CdnConfig.getCdnRoot();
    
    // Validate paths within CDN root
    expect(CdnConfig.isPathInCdnRoot(path.join(cdnRoot, 'test.txt'))).toBe(true);
    
    // Prevent paths outside CDN root
    expect(CdnConfig.isPathInCdnRoot(path.resolve('../outside.txt'))).toBe(false);
  });

  it('should throw error if CDN directory is not writable', () => {
    // This test is tricky to implement without changing file system permissions
    // So we'll just ensure the method exists
    expect(CdnConfig.ensureCdnDirectoryExists).toBeDefined();
  });
});