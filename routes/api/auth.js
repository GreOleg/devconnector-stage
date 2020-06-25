const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const authMiddleware = require('../../middleware/auth')

// @route GET api/auth
// @desc Get a user
// @access Private

router.get('/', authMiddleware, async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch (err) {

        console.error(err.message);
        res.status(500).send('Server error');

    }

});

module.exports = router;