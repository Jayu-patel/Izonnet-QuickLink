const express = require('express');
const router = express.Router();
const { checkoutSession, verifyPayment } = require('../controller/paymentController')
const authUser = require('../middleware/userAuth').userAuth

router.post('/create-checkout-session', authUser, checkoutSession);
router.post('/verify-payment', authUser, verifyPayment);

module.exports = router;