import path from 'path';

/**
 * Configuration for CDN file storage
 */
export const CDN_CONFIG = {
  /**
   * Root directory for CDN files
   * Uses an absolute path resolved from the project root
   */
  ROOT_DIR: path.resolve(process.cwd(), 'cdn_files'),

  /**
   * Validate if the provided path is within the CDN directory
   * @param filePath - Path to validate
   * @returns boolean indicating if the path is valid
   */
  isValidPath(filePath: string): boolean {
    const normalizedPath = path.normalize(filePath);
    const resolvedPath = path.resolve(this.ROOT_DIR, normalizedPath);
    return resolvedPath.startsWith(this.ROOT_DIR);
  },

  /**
   * Get the full path for a file in the CDN
   * @param relativePath - Relative path within the CDN directory
   * @returns Full absolute path to the file
   */
  getFullPath(relativePath: string): string {
    if (!this.isValidPath(relativePath)) {
      throw new Error('Invalid file path');
    }
    return path.resolve(this.ROOT_DIR, relativePath);
  }
};