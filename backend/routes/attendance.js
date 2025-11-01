const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

// @route   GET /api/attendance
// @desc    Get attendance records
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};

    // Students can only view their own attendance
    if (req.user.role === 'student') {
      query.student = req.user.userId;
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name email')
      .populate('markedBy', 'name email');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/attendance
// @desc    Mark attendance
// @access  Private (Teacher/Admin)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only teachers and admins can mark attendance' });
    }

    const { student, date, status, subject } = req.body;

    const attendance = await Attendance.create({
      student,
      date,
      status,
      subject,
      markedBy: req.user.userId
    });

    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Attendance already marked for this student on this date' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
