import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { FileUploadService } from '../src/services/fileUploadService';

describe('FileUploadService', () => {
  let fileUploadService: FileUploadService;
  const testUploadDir = 'uploads';

  beforeEach(() => {
    fileUploadService = new FileUploadService(testUploadDir);
  });

  it('should validate file correctly', () => {
    const validFile = {
      buffer: Buffer.from('test'),
      size: 1024,
      mimetype: 'image/jpeg',
      originalname: 'test.jpg'
    } as Express.Multer.File;

    const invalidSizeFile = {
      buffer: Buffer.from('test'),
      size: 20 * 1024 * 1024, // 20MB
      mimetype: 'image/jpeg',
      originalname: 'test.jpg'
    } as Express.Multer.File;

    const invalidTypeFile = {
      buffer: Buffer.from('test'),
      size: 1024,
      mimetype: 'application/x-executable',
      originalname: 'test.exe'
    } as Express.Multer.File;

    expect(fileUploadService.validateFile(validFile)).toBe(true);
    expect(fileUploadService.validateFile(invalidSizeFile)).toBe(false);
    expect(fileUploadService.validateFile(invalidTypeFile)).toBe(false);
  });

  it('should upload file successfully', () => {
    const file = {
      buffer: Buffer.from('test content'),
      size: 1024,
      mimetype: 'image/jpeg',
      originalname: 'test.jpg'
    } as Express.Multer.File;

    const result = fileUploadService.uploadFile(file);

    expect(result.success).toBe(true);
    expect(result.fileId).toBeDefined();

    // Check if file was saved
    const filePath = path.join(testUploadDir, `${result.fileId}.jpg`);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('should handle invalid file upload', () => {
    const invalidFile = {
      buffer: Buffer.from('test'),
      size: 20 * 1024 * 1024, // 20MB
      mimetype: 'application/x-executable',
      originalname: 'test.exe'
    } as Express.Multer.File;

    const result = fileUploadService.uploadFile(invalidFile);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});