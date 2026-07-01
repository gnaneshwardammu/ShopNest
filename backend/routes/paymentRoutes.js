const express = require('express');
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController.js');
const router = express.Router();

router.post("/order", createPaymentOrder);
router.post("/verify", verifyPayment);

module.exports = router;