import fs from 'fs-extra';
import path from 'path';

export class FileDeletionService {
  private baseUploadDir: string;

  constructor(baseUploadDir: string = 'uploads') {
    this.baseUploadDir = baseUploadDir;
  }

  /**
   * Delete a file from the filesystem
   * @param fileId - Unique identifier of the file to delete
   * @throws {Error} If file deletion fails
   */
  async deleteFile(fileId: string): Promise<boolean> {
    // Validate input
    if (!fileId || typeof fileId !== 'string') {
      throw new Error('Invalid file identifier');
    }

    // Construct full file path
    const filePath = path.join(this.baseUploadDir, fileId);

    try {
      // Check if file exists before attempting deletion
      await fs.access(filePath);

      // Remove the file
      await fs.unlink(filePath);

      return true;
    } catch (error) {
      // Handle different error scenarios
      if (error instanceof Error) {
        if (error.message.includes('no such file or directory')) {
          throw new Error(`File not found: ${fileId}`);
        }
        throw new Error(`Failed to delete file: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Delete multiple files from the filesystem
   * @param fileIds - Array of file identifiers to delete
   * @returns Array of results for each file deletion attempt
   */
  async deleteFiles(fileIds: string[]): Promise<{ [fileId: string]: boolean }> {
    // Validate input
    if (!Array.isArray(fileIds)) {
      throw new Error('File IDs must be an array');
    }

    const deletionResults: { [fileId: string]: boolean } = {};

    for (const fileId of fileIds) {
      try {
        deletionResults[fileId] = await this.deleteFile(fileId);
      } catch (error) {
        deletionResults[fileId] = false;
      }
    }

    return deletionResults;
  }
}