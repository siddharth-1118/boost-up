const express = require('express');
const router = express.Router();
const Marks = require('../models/Marks');
const auth = require('../middleware/auth');

// @route   GET /api/marks
// @desc    Get marks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};

    // Students can only view their own marks
    if (req.user.role === 'student') {
      query.student = req.user.userId;
    }

    const marks = await Marks.find(query)
      .populate('student', 'name email')
      .populate('uploadedBy', 'name email');

    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/marks
// @desc    Add marks
// @access  Private (Teacher/Admin)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only teachers and admins can add marks' });
    }

    const { student, subject, examType, marks, totalMarks, date } = req.body;

    const marksRecord = await Marks.create({
      student,
      subject,
      examType,
      marks,
      totalMarks,
      date,
      uploadedBy: req.user.userId
    });

    res.status(201).json(marksRecord);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
