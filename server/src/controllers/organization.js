import { validationResult } from 'express-validator';
import { Organization } from '../models/Organization.js';

export const createOrganization = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    // Check if organization already exists
    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) {
      return res.status(400).json({ error: 'Organization with this name already exists' });
    }

    const organization = new Organization({
      name,
      description,
      createdBy: req.user.userId
    });

    await organization.save();

    res.status(201).json({
      message: 'Organization created successfully',
      organization
    });
  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({ organizations });
  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await Organization.findById(id)
      .populate('createdBy', 'fullName email');

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json({ organization });
  } catch (error) {
    console.error('Get organization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description } = req.body;

    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Check if name is being changed and if it conflicts
    if (name !== organization.name) {
      const existingOrg = await Organization.findOne({ name });
      if (existingOrg) {
        return res.status(400).json({ error: 'Organization with this name already exists' });
      }
    }

    organization.name = name;
    organization.description = description;

    await organization.save();

    res.json({
      message: 'Organization updated successfully',
      organization
    });
  } catch (error) {
    console.error('Update organization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};