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

  it('should allow specific file types', async () => {
    const allowedTypes = [
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'application/pdf',
      'text/plain'
    ];

    const mockFiles = [
      { mimetype: 'image/jpeg' },
      { mimetype: 'image/png' },
      { mimetype: 'application/pdf' },
      { mimetype: 'text/plain' }
    ];

    const rejectedFiles = [
      { mimetype: 'video/mp4' },
      { mimetype: 'audio/mpeg' },
      { mimetype: 'application/zip' }
    ];

    const checkFile = (file: any): Promise<boolean> => {
      return new Promise((resolve) => {
        upload.fileFilter({} as any, file as any, (error) => {
          resolve(error === null);
        });
      });
    };

    const allowedResults = await Promise.all(
      mockFiles.map(file => checkFile(file))
    );

    const rejectedResults = await Promise.all(
      rejectedFiles.map(file => checkFile(file))
    );

    expect(allowedResults.every(result => result === true)).toBe(true);
    expect(rejectedResults.every(result => result === false)).toBe(true);
  });
});