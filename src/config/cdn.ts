import path from 'path';
import fs from 'fs';

/**
 * CDN Configuration Utility
 * Manages the CDN root directory and provides utility methods
 */
export class CdnConfig {
  private static CDN_ROOT = path.resolve(process.cwd(), 'cdn');

  /**
   * Get the absolute path to the CDN root directory
   * @returns {string} Absolute path to CDN root
   */
  static getCdnRoot(): string {
    return this.CDN_ROOT;
  }

  /**
   * Ensure CDN directory exists, creating it if necessary
   * @throws {Error} If directory cannot be created
   */
  static ensureCdnDirectoryExists(): void {
    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(this.CDN_ROOT)) {
        fs.mkdirSync(this.CDN_ROOT, { recursive: true });
      }

      // Verify directory is writable
      fs.accessSync(this.CDN_ROOT, fs.constants.W_OK);
    } catch (error) {
      throw new Error(`Cannot access or create CDN directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate if a given path is within the CDN root directory
   * Prevents directory traversal attacks
   * @param {string} filePath - Path to validate
   * @returns {boolean} Whether the path is within CDN root
   */
  static isPathInCdnRoot(filePath: string): boolean {
    const absoluteFilePath = path.resolve(filePath);
    const cdnRootPath = path.resolve(this.CDN_ROOT);
    
    return absoluteFilePath.startsWith(cdnRootPath);
  }
}

// Ensure CDN directory exists on module import
CdnConfig.ensureCdnDirectoryExists();