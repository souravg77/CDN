import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { CdnConfig } from './cdn.config';

describe('CdnConfig', () => {
  const testCdnPath = path.resolve(process.cwd(), 'cdn-files');

  beforeEach(() => {
    // Clean up test directory before each test
    if (fs.existsSync(testCdnPath)) {
      fs.rmSync(testCdnPath, { recursive: true, force: true });
    }
  });

  it('should return the correct CDN root path', () => {
    const cdnRoot = CdnConfig.getCdnRoot();
    expect(cdnRoot).toBe(testCdnPath);
  });

  it('should create CDN directory if it does not exist', () => {
    CdnConfig.ensureCdnDirectoryExists();
    expect(fs.existsSync(testCdnPath)).toBe(true);
  });

  it('should have read and write permissions on CDN directory', () => {
    CdnConfig.ensureCdnDirectoryExists();
    
    // Check read permission
    expect(() => {
      fs.accessSync(testCdnPath, fs.constants.R_OK);
    }).not.toThrow();

    // Check write permission
    expect(() => {
      fs.accessSync(testCdnPath, fs.constants.W_OK);
    }).not.toThrow();
  });

  it('should throw an error if directory cannot be created', () => {
    // Mock fs.mkdirSync to simulate failure
    const originalMkdirSync = fs.mkdirSync;
    fs.mkdirSync = () => { throw new Error('Permission denied'); };

    expect(() => {
      CdnConfig.ensureCdnDirectoryExists();
    }).toThrow('Cannot access or create CDN directory');

    // Restore original implementation
    fs.mkdirSync = originalMkdirSync;
  });
});