import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

import upload from './multer-config';

describe('Multer Configuration', () => {
  it('should have correct storage configuration', () => {
    const storage = upload.storage as multer.StorageEngine;
    expect(storage).toBeDefined();
  });

  it('should have file size limit of 5MB', () => {
    expect(upload.limits?.fileSize).toBe(5 * 1024 * 1024);
  });

  it('should limit uploads to 1 file', () => {
    expect(upload.limits?.files).toBe(1);
  });

  it('should create uploads directory', () => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    expect(fs.existsSync(uploadDir)).toBeTruthy();
  });

  it('should generate unique filenames', () => {
    const mockFile = {
      fieldname: 'test', 
      originalname: 'image.jpg',
      mimetype: 'image/jpeg'
    } as any;

    const callback = (err: any, filename?: string) => {
      if (err) throw err;
    };

    const filename1 = new Promise((resolve) => {
      upload.storage.filename({} as any, mockFile, (err, filename) => resolve(filename));
    });

    const filename2 = new Promise((resolve) => {
      upload.storage.filename({} as any, mockFile, (err, filename) => resolve(filename));
    });

    Promise.all([filename1, filename2]).then(([f1, f2]) => {
      expect(f1).not.toEqual(f2);
    });
  });
});