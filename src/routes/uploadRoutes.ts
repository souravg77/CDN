import express from 'express';
import multer from 'multer';
import { FileStorageService } from '../services/fileStorageService';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const fileStorageService = new FileStorageService();

/**
 * POST /upload endpoint for file uploads
 * Handles file upload with validation and storage
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // If no file is uploaded, multer will pass null
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded', 
        success: false 
      });
    }

    // Validate file
    try {
      fileStorageService.validateFile(req.file);
    } catch (validationError) {
      return res.status(400).json({ 
        error: validationError instanceof Error ? validationError.message : 'File validation failed', 
        success: false 
      });
    }

    // Save file
    const filename = await fileStorageService.saveFile(req.file);

    // Respond with success and filename
    res.status(200).json({ 
      message: 'File uploaded successfully', 
      filename,
      success: true 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      success: false 
    });
  }
});

export default router;