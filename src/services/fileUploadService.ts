import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadResult {
  success: boolean;
  fileId?: string;
  error?: string;
}

export class FileUploadService {
  private uploadDir: string;

  constructor(uploadDir: string = 'uploads') {
    this.uploadDir = path.resolve(uploadDir);
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  validateFile(file: Express.Multer.File): boolean {
    if (!file) {
      return false;
    }

    // Add file type, size, and other validations
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const allowedMimeTypes = [
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'application/pdf'
    ];

    return file.size <= maxSizeBytes && 
           allowedMimeTypes.includes(file.mimetype);
  }

  uploadFile(file: Express.Multer.File): FileUploadResult {
    try {
      if (!this.validateFile(file)) {
        return { 
          success: false, 
          error: 'Invalid file type or size' 
        };
      }

      const fileId = uuidv4();
      const fileName = `${fileId}${path.extname(file.originalname)}`;
      const filePath = path.join(this.uploadDir, fileName);

      fs.writeFileSync(filePath, file.buffer);

      return { 
        success: true, 
        fileId 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }
}