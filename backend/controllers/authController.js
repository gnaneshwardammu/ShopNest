const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail'); 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const createOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register a new user  
const registerUser = async (req, res) => {
  let accountCreated = false;
  try {
    const { username, name, email, phone, password, role } = req.body;
    const displayName = username || name;
    const userRole = role === 'admin' ? 'admin' : 'user';
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = createOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      username: displayName,
      email,
      phone: phone || '',
      password: hashedPassword,
      otp,
      otpExpires,
      verified: false,
      role: userRole,
    });
    accountCreated = Boolean(user);
    if (user) {

      const message = `
        <h2>Welcome to ShopNest, ${displayName}!</h2>
        <p>Thank you for registering on our platform.</p>
        <p>Your verification OTP is: <strong>${otp}</strong></p>
        <p>This OTP expires in 10 minutes.</p>
      `;

      await sendEmail({
        to: user.email,
        subject: 'Welcome to ShopNest - Your OTP',
        html: message
      });

      res.status(201).json({
        message: 'Registration successful. Please verify your OTP.',
        _id: user._id,
        name: user.username,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verified: user.verified,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration email error:', error);
    if (accountCreated) {
      return res.status(503).json({
        message: 'Account created, but the verification email could not be sent. Please use Resend OTP.',
      });
    }
    res.status(500).json({ message: 'Unable to create the account.' });
  }
};

// Login user
const loginUser = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.verified) {
        return res.status(403).json({ message: 'Please verify your OTP before logging in.' });
      }
            res.json({
                _id: user._id,
              name: user.username,
              username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verified) {
      return res.status(200).json({
        message: 'User is already verified',
        verified: true,
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'OTP is not available. Please register again.' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.otp !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.verified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({
      message: 'OTP verified successfully',
      _id: user._id,
      name: user.username,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      verified: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    const otp = createOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Your new ShopNest OTP',
      html: `<p>Your new OTP is <strong>${otp}</strong></p><p>This OTP expires in 10 minutes.</p>`,
    });

    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('OTP resend email error:', error);
    res.status(503).json({ message: 'Unable to send the OTP email. Please try again shortly.' });
  }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from the response
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, verifyOtp, resendOtp, getUsers };
