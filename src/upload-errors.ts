import { Request } from 'express';
import multer from 'multer';

// Custom error types for upload scenarios
export class UploadError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'UploadError';
    this.statusCode = statusCode;
  }
}

// File size limit error
export class FileSizeLimitError extends UploadError {
  constructor(maxSize: number) {
    super(`File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB`, 413);
  }
}

// File type mismatch error
export class FileTypeError extends UploadError {
  constructor(allowedTypes: string[]) {
    super(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, 415);
  }
}

// File count limit error
export class FileCountLimitError extends UploadError {
  constructor(maxCount: number) {
    super(`Maximum file count of ${maxCount} exceeded`, 400);
  }
}

// Upload middleware configuration
export const uploadConfig = {
  // Maximum file size (10MB)
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  
  // Allowed file types
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  
  // Maximum number of files
  MAX_FILE_COUNT: 5
};

// Multer file filter for type and size validation
export const fileFilter = (allowedTypes: string[], maxSize: number) => 
  (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new FileTypeError(allowedTypes));
    }

    // Additional size check (Multer has its own size limit, but this provides more control)
    if (file.size > maxSize) {
      return cb(new FileSizeLimitError(maxSize));
    }

    cb(null, true);
  };

// Error handling middleware for upload errors
export const uploadErrorHandler = (err: any, req: Request, res: any, next: Function) => {
  // Handle custom UploadError instances
  if (err instanceof UploadError) {
    return res.status(err.statusCode).json({
      error: true,
      message: err.message
    });
  }

  // Handle Multer-specific errors
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(413).json({
          error: true,
          message: 'File size exceeds the maximum limit'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          error: true,
          message: 'Maximum file count exceeded'
        });
      default:
        return res.status(500).json({
          error: true,
          message: 'Upload error occurred'
        });
    }
  }

  // For any other unexpected errors
  next(err);
};