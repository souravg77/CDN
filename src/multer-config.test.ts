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
    const filename1 = upload.storage.getFilename(
      {} as any, 
      { fieldname: 'test', originalname: 'image.jpg' } as any, 
      () => {}
    );
    const filename2 = upload.storage.getFilename(
      {} as any, 
      { fieldname: 'test', originalname: 'image.jpg' } as any, 
      () => {}
    );

    expect(filename1).not.toEqual(filename2);
  });
});