import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, sendOTPEmail } from '../services/emailService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Check if user exists and is verified
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Generate NEW OTP (this will replace any existing OTP)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (!user) {
      // Create new user (not verified yet)
      user = new User({
        name,
        email,
        password,
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        otp,
        otpExpiry,
        isVerified: false,
      });
      await user.save();
      
    } else {
      // Update existing unverified user with NEW OTP (deletes old one)
      user.name = name;
      // Don't update password if it's already set (to avoid re-hashing)
      if (password !== user.password) {
        user.password = password;
      }
      user.avatar = avatar || user.avatar;
      user.otp = otp; // This replaces the old OTP
      user.otpExpiry = otpExpiry; // This replaces the old expiry
      user.isVerified = false;
      await user.save();
      
    }

    // Verify OTP was saved by re-fetching from database
    const savedUser = await User.findById(user._id).select('+otp +otpExpiry');
    
    
    try {
      await sendOTPEmail(email, otp, 'verification');
    } catch (emailError) {
      console.error('Email error (OTP logged above):', emailError);
      // Continue anyway - OTP is logged in console for testing
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
      email: email,
      requiresOTP: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email. Please register first.',
      });
    }


    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email first. Register again to get a new OTP.',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }


    // Generate and send NEW OTP for login (replaces any existing OTP)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp; // This replaces any existing OTP
    user.otpExpiry = otpExpiry; // This replaces any existing expiry
    await user.save();

    // Verify OTP was saved by re-fetching from database
    const savedUser = await User.findById(user._id).select('+otp +otpExpiry');

    try {
      await sendOTPEmail(email, otp, 'login');
    } catch (emailError) {
      console.error('Email error (OTP logged above):', emailError);
      // Continue anyway - OTP is logged in console
    }

    res.json({
      success: true,
      message: 'OTP sent to your email',
      email: email,
      requiresOTP: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify OTP for registration
export const verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpiry');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if OTP exists
    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.',
      });
    }

    // Check if OTP is expired
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Verify OTP (convert both to strings for comparison)
    const receivedOTP = String(otp).trim();
    const storedOTP = String(user.otp).trim();
    
    if (storedOTP !== receivedOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Mark user as verified
    // Keep OTP until it expires naturally (10 minutes) or new OTP is requested
    user.isVerified = true;
    await user.save();

    const token = generateToken(user._id);

    const responseData = {
      success: true,
      message: 'Registration successful!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token,
      },
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify OTP for login
export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpiry');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }


    // Check if OTP exists
    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.',
      });
    }

    // Check if OTP is expired
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Verify OTP (convert both to strings for comparison)
    const receivedOTP = String(otp).trim();
    const storedOTP = String(user.otp).trim();
    
    if (storedOTP !== receivedOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Keep OTP until it expires naturally (10 minutes) or new OTP is requested
    // Don't delete immediately to allow retry if navigation fails
    await user.save();

    const token = generateToken(user._id);

    const responseData = {
      success: true,
      message: 'Login successful!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token,
      },
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate NEW OTP (replaces old one)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp; // This replaces the old OTP
    user.otpExpiry = otpExpiry; // This replaces the old expiry
    await user.save();


    // Send OTP email
    const type = user.isVerified ? 'login' : 'verification';
    try {
      await sendOTPEmail(email, otp, type);
    } catch (emailError) {
      console.error('Email error (OTP logged above):', emailError);
    }

    res.json({
      success: true,
      message: 'New OTP sent successfully. Previous OTP is now invalid.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('papers');
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
