const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const authMiddleware = require('../../middleware/auth');

// @route POST api/profile
// @desc Create or update profile
// @access Private

router.post(
    '/',
    [authMiddleware, [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills are required').not().isEmpty(),
    ],
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
        } = req.body;

        const profileFields = {};
        profileFields.user = req.user.id;

    });

module.exports = router;