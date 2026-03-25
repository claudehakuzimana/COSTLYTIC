import mongoose from 'mongoose';

const models = {
  User: require('../src/models/User.js').User,
  Organization: require('../src/models/Organization.js').Organization,
  AIUsage: require('../src/models/AIUsage.js').AIUsage,
  InfrastructureUsage: require('../src/models/InfrastructureUsage.js').InfrastructureUsage,
  VectorUsage: require('../src/models/VectorUsage.js').VectorUsage,
  Alert: require('../src/models/Alert.js').Alert,
  APIKey: require('../src/models/APIKey.js').APIKey,
  ShadowAI: require('../src/models/ShadowAI.js').ShadowAI,
  Role: require('../src/models/Role.js').Role
};

export default models;
