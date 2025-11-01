const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const auth = require('../middleware/auth');

// @route   GET /api/materials
// @desc    Get all materials
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const materials = await Material.find().populate('uploadedBy', 'name email');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/materials
// @desc    Upload new material
// @access  Private (Teacher/Admin)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only teachers and admins can upload materials' });
    }

    const { title, description, fileUrl, fileName, fileType, subject } = req.body;

    const material = await Material.create({
      title,
      description,
      fileUrl,
      fileName,
      fileType,
      subject,
      uploadedBy: req.user.userId
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/materials/:id
// @desc    Delete material
// @access  Private (Teacher/Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    if (material.uploadedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await material.deleteOne();
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
