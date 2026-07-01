const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {admin} = require('../middleware/adminMiddleware');
const { getAdminStats } = require('../controllers/analyticController.js');

const router = express.Router();

router.get('/', protect, admin, getAdminStats);

module.exports = router;