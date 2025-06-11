import path from 'path';
import fs from 'fs';

/**
 * CDN Configuration Management
 * Handles CDN directory setup and validation
 */
export class CdnConfig {
  private static CDN_ROOT = path.resolve(process.cwd(), 'cdn-files');

  /**
   * Get the absolute path to the CDN root directory
   * @returns {string} Absolute path to CDN directory
   */
  static getCdnRoot(): string {
    return this.CDN_ROOT;
  }

  /**
   * Validate and ensure CDN directory exists
   * @throws {Error} If directory cannot be created or accessed
   */
  static ensureCdnDirectoryExists(): void {
    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(this.CDN_ROOT)) {
        fs.mkdirSync(this.CDN_ROOT, { recursive: true });
      }

      // Check directory permissions
      fs.accessSync(this.CDN_ROOT, fs.constants.R_OK | fs.constants.W_OK);
    } catch (error) {
      throw new Error(`Cannot access or create CDN directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}