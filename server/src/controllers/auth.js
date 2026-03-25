import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import { env } from '../config/env.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, organizationName, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Find or create organization
    let organization = await Organization.findOne({ name: organizationName });
    if (!organization) {
      organization = new Organization({
        name: organizationName,
        slug: organizationName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      });
      await organization.save();
    }

    // Create user
    const user = new User({
      fullName,
      email,
      password,
      organizationId: organization._id,
      role
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, organizationId: user.organizationId, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus,
        organizationId: user.organizationId,
        organizationName: organization.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (
      error?.name === 'MongoParseError' ||
      error?.name === 'MongooseServerSelectionError' ||
      error?.name === 'MongoServerSelectionError'
    ) {
      return res.status(503).json({
        error:
          'Database connection failed. Check MONGO_URI, Atlas network access, and whether the password is URL-encoded.'
      });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).populate('organizationId');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Generate JWT
    const organizationId =
      typeof user.organizationId === 'object' && user.organizationId?._id
        ? user.organizationId._id
        : user.organizationId;

    const token = jwt.sign(
      { userId: user._id, organizationId, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus,
        organizationId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    if (
      error?.name === 'MongoParseError' ||
      error?.name === 'MongooseServerSelectionError' ||
      error?.name === 'MongoServerSelectionError'
    ) {
      return res.status(503).json({
        error:
          'Database connection failed. Check MONGO_URI, Atlas network access, and whether the password is URL-encoded.'
      });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('organizationId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus,
        organizationId: user.organizationId,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
