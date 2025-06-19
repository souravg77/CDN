import express, { Request, Response } from 'express';
import multer from 'multer';
import { FileUploadService } from '../services/fileUploadService';

const router = express.Router();
const upload = multer();
const fileUploadService = new FileUploadService();

router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const uploadResult = fileUploadService.uploadFile(req.file);

    if (uploadResult.success) {
      return res.status(201).json({
        success: true,
        fileId: uploadResult.fileId
      });
    } else {
      return res.status(400).json({
        success: false,
        message: uploadResult.error
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

export default router;