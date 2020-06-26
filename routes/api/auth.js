const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

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


// @route POST api/auth
// @desc Authenticate user & get token
// @access Public

router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        //res.status(200).json(req.body);

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });  // email:email

            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid credantials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid credantials' }] });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 36000 }, (err, token) => {
                if (err) {
                    throw err
                };
                res.json({ token });
            });

        } catch (err) {
            console.log(err.message);

            res.status(200).send('Send error');
        }
    });

module.exports = router;