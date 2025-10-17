const express = require('express');
const { body, validationResult } = require('express-validator');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all candidates for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const candidates = await Candidate.find({ referredBy: req.user.id }).sort({ createdAt: -1 });
        res.json(candidates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new candidate
router.post('/', [
    auth,
    upload.single('resume'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('jobTitle').notEmpty().withMessage('Job title is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, jobTitle } = req.body;

        // Check if candidate with same email already exists for this user
        const existingCandidate = await Candidate.findOne({
            email,
            referredBy: req.user.id
        });

        if (existingCandidate) {
            return res.status(400).json({ message: 'Candidate with this email already referred by you' });
        }

        const candidateData = {
            name,
            email,
            phone,
            jobTitle,
            referredBy: req.user.id
        };

        if (req.file) {
            candidateData.resume = {
                filename: req.file.filename,
                path: req.file.path,
                originalName: req.file.originalname
            };
        }

        const candidate = new Candidate(candidateData);
        await candidate.save();

        res.status(201).json(candidate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update candidate status
router.put('/:id/status', [
    auth,
    body('status').isIn(['Pending', 'Reviewed', 'Hired']).withMessage('Invalid status')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const candidate = await Candidate.findOne({
            _id: req.params.id,
            referredBy: req.user.id
        });

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        candidate.status = req.body.status;
        await candidate.save();

        res.json(candidate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete candidate
router.delete('/:id', auth, async (req, res) => {
    try {
        const candidate = await Candidate.findOne({
            _id: req.params.id,
            referredBy: req.user.id
        });

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        await Candidate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;