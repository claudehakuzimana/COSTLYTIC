import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import { AIUsage } from '../models/AIUsage.js';
import { connectDB } from '../config/db.js';

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Organization.deleteMany({});
    await AIUsage.deleteMany({});

    // Create organization
    const organization = new Organization({
      name: 'Demo Corp',
      description: 'Demo organization for Costlytic'
    });
    await organization.save();

    // Create users
    const users = [
      {
        fullName: 'Admin User',
        email: 'admin@demo.com',
        password: 'password123',
        organizationId: organization._id,
        role: 'admin'
      },
      {
        fullName: 'FinOps Manager',
        email: 'finops@demo.com',
        password: 'password123',
        organizationId: organization._id,
        role: 'finops_manager'
      },
      {
        fullName: 'Engineer',
        email: 'engineer@demo.com',
        password: 'password123',
        organizationId: organization._id,
        role: 'engineer'
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }

    // Create sample AI usage data
    const usageData = [];
    const providers = ['openai', 'anthropic', 'google'];
    const models = {
      openai: ['gpt-4o', 'gpt-3.5-turbo'],
      anthropic: ['claude-3-5-sonnet'],
      google: ['gemini-1.5-pro']
    };
    const teams = ['support', 'engineering', 'sales', 'marketing'];
    const applications = ['chatbot', 'code-review', 'data-analysis', 'content-gen'];

    for (let i = 0; i < 100; i++) {
      const provider = providers[Math.floor(Math.random() * providers.length)];
      const model = models[provider][Math.floor(Math.random() * models[provider].length)];
      const team = teams[Math.floor(Math.random() * teams.length)];
      const application = applications[Math.floor(Math.random() * applications.length)];

      const tokensInput = Math.floor(Math.random() * 2000) + 100;
      const tokensOutput = Math.floor(Math.random() * 1000) + 50;

      // Calculate cost (simplified)
      const costPerToken = 0.00002; // Average cost per token
      const cost = (tokensInput + tokensOutput) * costPerToken;

      const usage = new AIUsage({
        organizationId: organization._id,
        provider,
        model,
        tokens_input: tokensInput,
        tokens_output: tokensOutput,
        cost,
        team,
        application,
        agent: `agent-${Math.floor(Math.random() * 5) + 1}`,
        request_id: `req-${Date.now()}-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
      });

      usageData.push(usage);
    }

    await AIUsage.insertMany(usageData);

    console.log('Seed data created successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${usageData.length} AI usage records`);
    console.log('Organization ID:', organization._id);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();