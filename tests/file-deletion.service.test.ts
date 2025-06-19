import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { FileDeletionService } from '../src/services/file-deletion.service';

describe('FileDeletionService', () => {
  const testUploadDir = 'test-uploads';
  let fileDeletionService: FileDeletionService;

  beforeEach(() => {
    // Ensure test upload directory exists
    fs.mkdirSync(testUploadDir, { recursive: true });
    fileDeletionService = new FileDeletionService(testUploadDir);
  });

  afterEach(() => {
    // Clean up test directory
    fs.removeSync(testUploadDir);
  });

  it('should delete an existing file', async () => {
    const testFileName = 'test-file.txt';
    const testFilePath = path.join(testUploadDir, testFileName);
    
    // Create a test file
    fs.writeFileSync(testFilePath, 'Test content');

    const result = await fileDeletionService.deleteFile(testFileName);
    
    expect(result).toBe(true);
    expect(fs.existsSync(testFilePath)).toBe(false);
  });

  it('should throw error when deleting non-existent file', async () => {
    await expect(fileDeletionService.deleteFile('non-existent.txt'))
      .rejects.toThrow('File not found');
  });

  it('should delete multiple files', async () => {
    const testFiles = ['file1.txt', 'file2.txt', 'file3.txt'];
    
    // Create test files
    testFiles.forEach(fileName => {
      fs.writeFileSync(path.join(testUploadDir, fileName), 'Test content');
    });

    const results = await fileDeletionService.deleteFiles(testFiles);
    
    expect(Object.keys(results)).toHaveLength(3);
    testFiles.forEach(fileName => {
      expect(results[fileName]).toBe(true);
      expect(fs.existsSync(path.join(testUploadDir, fileName))).toBe(false);
    });
  });

  it('should handle partial file deletion in batch', async () => {
    const testFiles = ['file1.txt', 'non-existent.txt', 'file3.txt'];
    
    // Create some test files
    ['file1.txt', 'file3.txt'].forEach(fileName => {
      fs.writeFileSync(path.join(testUploadDir, fileName), 'Test content');
    });

    const results = await fileDeletionService.deleteFiles(testFiles);
    
    expect(results['file1.txt']).toBe(true);
    expect(results['non-existent.txt']).toBe(false);
    expect(results['file3.txt']).toBe(true);
  });

  it('should throw error for invalid input', async () => {
    await expect(fileDeletionService.deleteFile('')).rejects.toThrow('Invalid file identifier');
    await expect(fileDeletionService.deleteFiles(null as any)).rejects.toThrow('File IDs must be an array');
  });
});