const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Create upload middleware
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

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// VQA endpoint that handles all four models
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
    
    // Path to the uploaded image
    const imagePath = req.file.path;
    
    // Process with the appropriate model
    let answer;
    switch(model) {
      case 'radiology-open':
        answer = await processRadiologyOpenEnded(imagePath, question);
        break;
      case 'radiology-closed':
        answer = await processRadiologyClosedEnded(imagePath, question);
        break;
      case 'pathology-open':
        answer = await processPathologyOpenEnded(imagePath, question);
        break;
      case 'pathology-closed':
        answer = await processPathologyClosedEnded(imagePath, question);
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid model type' 
        });
    }
    
    // Return success response with the answer
    res.status(200).json({
      success: true,
      model,
      question,
      answer
    });
  } catch (error) {
    console.error('Error processing VQA request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error processing your request' 
    });
  }
});

// Mock implementations of model processing functions
// Replace these with actual model implementations
async function processRadiologyOpenEnded(imagePath, question) {
  // Simulate model processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response for demonstration
  return "The image shows signs of pulmonary infiltrates in the lower right lobe, which may indicate pneumonia. There are no visible nodules or masses.";
}

async function processRadiologyClosedEnded(imagePath, question) {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // For closed-ended, respond with Yes/No and explanation
  return "Yes. The image confirms the presence of an abnormality in the right lung field.";
}

async function processPathologyOpenEnded(imagePath, question) {
  await new Promise(resolve => setTimeout(resolve, 1700));
  
  return "The tissue sample shows irregular cell formations with hyperchromatism and nuclear pleomorphism, suggesting a moderately differentiated carcinoma.";
}

async function processPathologyClosedEnded(imagePath, question) {
  await new Promise(resolve => setTimeout(resolve, 1300));
  
  return "No. The tissue does not show evidence of malignant transformation based on the visible cell morphology.";
}

module.exports = router;