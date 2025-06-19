import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export class FileStorageService {
  private uploadDir: string;

  constructor(uploadDir: string = path.join(process.cwd(), 'uploads')) {
    this.uploadDir = uploadDir;
  }

  /**
   * Generate a unique filename
   * @param originalName Original filename
   * @returns Unique filename
   */
  private generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(originalName);
    return `${timestamp}-${randomString}${extension}`;
  }

  /**
   * Save uploaded file
   * @param file File to save
   * @returns Path to saved file
   */
  async saveFile(file: Express.Multer.File): Promise<string> {
    // Ensure upload directory exists
    await fs.mkdir(this.uploadDir, { recursive: true });

    const uniqueFilename = this.generateUniqueFilename(file.originalname);
    const filePath = path.join(this.uploadDir, uniqueFilename);

    await fs.writeFile(filePath, file.buffer);

    return uniqueFilename;
  }

  /**
   * Validate file size and type
   * @param file File to validate
   * @param maxSizeInBytes Maximum allowed file size
   * @param allowedTypes Allowed file types
   */
  validateFile(
    file: Express.Multer.File, 
    maxSizeInBytes: number = 5 * 1024 * 1024, // 5MB default
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']
  ): void {
    if (!file) {
      throw new Error('No file uploaded');
    }

    if (file.size > maxSizeInBytes) {
      throw new Error(`File size exceeds ${maxSizeInBytes / 1024 / 1024}MB`);
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type');
    }
  }
}