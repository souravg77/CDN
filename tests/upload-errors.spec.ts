import { describe, it, expect, vi } from 'vitest';
import { 
  UploadError, 
  FileSizeLimitError, 
  FileTypeError, 
  FileCountLimitError,
  fileFilter,
  uploadErrorHandler
} from '../src/upload-errors';

describe('Upload Error Handling', () => {
  describe('Error Classes', () => {
    it('should create UploadError with correct properties', () => {
      const error = new UploadError('Test error', 400);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('UploadError');
    });

    it('should create FileSizeLimitError with correct message', () => {
      const error = new FileSizeLimitError(10 * 1024 * 1024);
      expect(error.message).toContain('10MB');
      expect(error.statusCode).toBe(413);
    });

    it('should create FileTypeError with correct message', () => {
      const error = new FileTypeError(['image/jpeg', 'image/png']);
      expect(error.message).toContain('image/jpeg, image/png');
      expect(error.statusCode).toBe(415);
    });

    it('should create FileCountLimitError with correct message', () => {
      const error = new FileCountLimitError(5);
      expect(error.message).toContain('5');
      expect(error.statusCode).toBe(400);
    });
  });

  describe('File Filter', () => {
    const mockRequest = {} as any;
    const mockNext = (err?: any) => err;

    it('should reject files with invalid mime type', () => {
      const filter = fileFilter(['image/jpeg'], 10 * 1024 * 1024);
      const mockFile = { 
        mimetype: 'image/png', 
        size: 5 * 1024 * 1024 
      } as any;

      const result = filter(mockRequest, mockFile, mockNext);
      expect(result).toBeInstanceOf(FileTypeError);
    });

    it('should reject files exceeding size limit', () => {
      const filter = fileFilter(['image/jpeg'], 5 * 1024 * 1024);
      const mockFile = { 
        mimetype: 'image/jpeg', 
        size: 10 * 1024 * 1024 
      } as any;

      const result = filter(mockRequest, mockFile, mockNext);
      expect(result).toBeInstanceOf(FileSizeLimitError);
    });
  });

  describe('Upload Error Handler', () => {
    const mockReq = {} as any;
    const mockNext = vi.fn();
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any;

    it('should handle custom UploadError', () => {
      const error = new UploadError('Custom error', 400);
      
      uploadErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: true,
        message: 'Custom error'
      });
    });

    it('should handle Multer file size error', () => {
      const error = { code: 'LIMIT_FILE_SIZE' } as any;
      
      uploadErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: true,
        message: 'File size exceeds the maximum limit'
      });
    });
  });
});