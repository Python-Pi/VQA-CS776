const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

router.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

router.post('/vqa', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image uploaded' 
      });
    }
    
    const { model, question } = req.body;
    
    if (!model) {
      return res.status(400).json({ 
        success: false, 
        message: 'Model type is required' 
      });
    }
    
    if (!question || question.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Question is required' 
      });
    }
    
    const imagePath = req.file.path;
    
    let scriptPath;
    switch(model) {
      case 'radiology-open':
        scriptPath = path.join(__dirname, '../models/radiology_open.py');
        break;
      case 'radiology-closed':
        scriptPath = path.join(__dirname, '../models/radiology_closed.py');
        break;
      case 'pathology-open':
        scriptPath = path.join(__dirname, '../models/pathology_open.py');
        break;
      case 'pathology-closed':
        scriptPath = path.join(__dirname, '../models/pathology_closed.py');
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid model type' 
        });
    }
    
    const python = spawn('python3', [
      scriptPath,
      '--image', imagePath,
      '--question', question
    ]);
    
    let pythonData = '';
    let pythonError = '';
    
    python.stdout.on('data', (data) => {
      pythonData += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      pythonError += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        console.error(`Python error output: ${pythonError}`);
        return res.status(500).json({ 
          success: false, 
          message: 'Error processing image with the model' 
        });
      }
      
      try {
        const result = JSON.parse(pythonData);
        
        res.json({
          success: true,
          model,
          question,
          answer: result.answer
        });
      } catch (error) {
        console.error('Error parsing Python output:', error);
        res.status(500).json({ 
          success: false, 
          message: 'Error processing response from model' 
        });
      }
    });
    
  } catch (error) {
    console.error('Error processing VQA request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error processing your request' 
    });
  }
});

module.exports = router;