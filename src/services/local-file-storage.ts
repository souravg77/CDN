import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface FileStorageOptions {
  baseDir?: string;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
}

export class LocalFileStorage {
  private baseDir: string;
  private maxFileSize: number;
  private allowedMimeTypes: string[];

  constructor(options: FileStorageOptions = {}) {
    this.baseDir = options.baseDir || path.join(process.cwd(), 'uploads');
    this.maxFileSize = options.maxFileSize || 10 * 1024 * 1024; // 10MB default
    this.allowedMimeTypes = options.allowedMimeTypes || [];

    // Ensure base directory exists
    fs.ensureDirSync(this.baseDir);
  }

  /**
   * Save a file to local storage with unique identifier
   * @param file Buffer or file path to save
   * @param originalName Original filename
   * @returns Unique file identifier and saved file path
   */
  async saveFile(file: Buffer | string, originalName: string): Promise<{ id: string, path: string }> {
    // Validate file size
    let fileBuffer: Buffer;
    if (typeof file === 'string') {
      fileBuffer = await fs.readFile(file);
    } else {
      fileBuffer = file;
    }

    if (fileBuffer.length > this.maxFileSize) {
      throw new Error('File size exceeds maximum limit');
    }

    // Generate unique identifier and filename
    const fileId = uuidv4();
    const fileExtension = path.extname(originalName);
    const fileName = `${fileId}${fileExtension}`;
    const filePath = path.join(this.baseDir, fileName);

    // Write file
    await fs.writeFile(filePath, fileBuffer);

    return { 
      id: fileId, 
      path: filePath 
    };
  }

  /**
   * Retrieve a file by its identifier
   * @param fileId Unique file identifier
   * @returns File buffer
   */
  async retrieveFile(fileId: string): Promise<Buffer> {
    const files = await fs.readdir(this.baseDir);
    const matchingFile = files.find(file => file.startsWith(fileId));

    if (!matchingFile) {
      throw new Error('File not found');
    }

    const filePath = path.join(this.baseDir, matchingFile);
    return fs.readFile(filePath);
  }

  /**
   * Delete a file by its identifier
   * @param fileId Unique file identifier
   */
  async deleteFile(fileId: string): Promise<void> {
    const files = await fs.readdir(this.baseDir);
    const matchingFile = files.find(file => file.startsWith(fileId));

    if (!matchingFile) {
      throw new Error('File not found');
    }

    const filePath = path.join(this.baseDir, matchingFile);
    await fs.unlink(filePath);
  }

  /**
   * List all stored files
   * @returns Array of file identifiers
   */
  async listFiles(): Promise<string[]> {
    const files = await fs.readdir(this.baseDir);
    return files.map(file => path.parse(file).name);
  }
}