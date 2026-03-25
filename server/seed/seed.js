import { Organization } from '../src/models/Organization.js';
import { User } from '../src/models/User.js';
import { AIUsage } from '../src/models/AIUsage.js';
import { InfrastructureUsage } from '../src/models/InfrastructureUsage.js';
import { VectorUsage } from '../src/models/VectorUsage.js';
import { Alert } from '../src/models/Alert.js';
import { connectDB } from '../src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Organization.deleteMany({});
    await User.deleteMany({});
    await AIUsage.deleteMany({});
    await InfrastructureUsage.deleteMany({});
    await VectorUsage.deleteMany({});
    await Alert.deleteMany({});

    // Create organizations
    console.log('📦 Creating organizations...');
    const org1 = await Organization.create({
      name: 'Acme Corp',
      slug: 'acme-corp',
      plan: 'enterprise',
      budgets: {
        monthlyAiBudget: 10000,
        monthlyInfraBudget: 5000
      }
    });

    const org2 = await Organization.create({
      name: 'Tech Startup',
      slug: 'tech-startup',
      plan: 'pro',
      budgets: {
        monthlyAiBudget: 2000,
        monthlyInfraBudget: 1000
      }
    });

    // Create admin users
    console.log('👤 Creating users...');
    const admin1 = await User.create({
      organizationId: org1._id,
      fullName: 'John Admin',
      email: 'admin@acme.com',
      password: 'SecurePassword123',
      role: 'admin',
      subscriptionTier: 'enterprise',
      subscriptionStatus: 'active',
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isActive: true
    });

    const manager1 = await User.create({
      organizationId: org1._id,
      fullName: 'Jane Manager',
      email: 'manager@acme.com',
      password: 'SecurePassword123',
      role: 'finops_manager',
      subscriptionTier: 'pro',
      subscriptionStatus: 'active',
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true
    });

    const engineer1 = await User.create({
      organizationId: org1._id,
      fullName: 'Bob Engineer',
      email: 'engineer@acme.com',
      password: 'SecurePassword123',
      role: 'engineer',
      subscriptionTier: 'starter',
      subscriptionStatus: 'trial',
      subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      isActive: true
    });

    // Create AI usage records
    console.log('🤖 Creating AI usage records...');
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      await AIUsage.create({
        organizationId: org1._id,
        provider: ['openai', 'anthropic', 'google'][Math.floor(Math.random() * 3)],
        model: ['gpt-4', 'claude-3', 'gemini-pro'][Math.floor(Math.random() * 3)],
        tokens_input: Math.floor(Math.random() * 10000) + 1000,
        tokens_output: Math.floor(Math.random() * 5000) + 500,
        cost: Math.random() * 50 + 5,
        team: ['Data Science', 'Engineering', 'Product'][Math.floor(Math.random() * 3)],
        application: ['Analytics', 'Chat', 'Search'][Math.floor(Math.random() * 3)],
        agent: 'agent-' + Math.floor(Math.random() * 10),
        request_id: `req-${Date.now()}-${i}`,
        timestamp: date
      });
    }

    // Create infrastructure usage records
    console.log('🖥️  Creating infrastructure usage records...');
    const chipTypes = ['nvidia_gpu', 'inferentia2', 'trainium', 'tpu'];
    const instanceTypes = ['p3.2xlarge', 'p3.8xlarge', 'p4d.24xlarge', 'inf2.xlarge', 'trn1.2xlarge'];
    const clusters = ['gpu-cluster-1', 'gpu-cluster-2', 'cpu-cluster-1', 'mixed-cluster'];
    const workloads = ['model-training', 'inference', 'data-processing', 'batch-jobs'];

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      await InfrastructureUsage.create({
        organizationId: org1._id,
        provider: ['aws', 'gcp', 'azure'][Math.floor(Math.random() * 3)],
        chip_type: chipTypes[Math.floor(Math.random() * chipTypes.length)],
        instance_type: instanceTypes[Math.floor(Math.random() * instanceTypes.length)],
        cluster: clusters[Math.floor(Math.random() * clusters.length)],
        gpu_utilization: Math.floor(Math.random() * 100) + 1,
        cost_per_hour: Math.random() * 10 + 1,
        workload: workloads[Math.floor(Math.random() * workloads.length)],
        timestamp: date
      });
    }

    // Create vector usage records
    console.log('📊 Creating vector usage records...');
    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      await VectorUsage.create({
        organizationId: org1._id,
        database_provider: ['pinecone', 'weaviate', 'qdrant'][Math.floor(Math.random() * 3)],
        index_name: `index-${i + 1}`,
        storage_gb: Math.random() * 500 + 50,
        io_operations: Math.floor(Math.random() * 100000) + 10000,
        embedding_tokens: Math.floor(Math.random() * 50000) + 5000,
        cost: Math.random() * 200 + 20,
        avg_context_tokens: Math.floor(Math.random() * 2000) + 1000,
        threshold_context_tokens: 4000,
        timestamp: date
      });
    }

    // Create alerts
    console.log('🚨 Creating alerts...');
    await Alert.insertMany([
      {
        organizationId: org1._id,
        type: 'budget',
        severity: 'high',
        title: 'AI budget trending high',
        message: 'AI spend is accelerating this month. Review top teams and providers for optimization opportunities.',
        status: 'open',
        metadata: { thresholdPct: 80 }
      },
      {
        organizationId: org1._id,
        type: 'context_hygiene',
        severity: 'medium',
        title: 'Context window pressure detected',
        message: 'Several requests exceeded recommended context size. Consider summarization or retrieval chunking adjustments.',
        status: 'open'
      },
      {
        organizationId: org1._id,
        type: 'optimization',
        severity: 'low',
        title: 'Model mix optimization available',
        message: 'Some workloads may be able to switch to cheaper models without quality impact.',
        status: 'open'
      }
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📌 Sample credentials:');
    console.log('   Email: admin@acme.com');
    console.log('   Password: SecurePassword123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
