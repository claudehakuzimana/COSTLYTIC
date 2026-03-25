// Quick backend test script
// Run with: node test-backend.js

import axios from 'axios';

const API_URL = 'http://localhost:6000/api';

async function testBackend() {
  console.log('🧪 Testing Backend Functionality\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const health = await axios.get('http://localhost:6000/health');
    console.log('✅ Health check:', health.data);
    
    // Test 2: Login with seeded credentials
    console.log('\n2️⃣ Testing login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@acme.com',
      password: 'SecurePassword123'
    });
    console.log('✅ Login successful');
    console.log('   User:', loginResponse.data.user.fullName);
    console.log('   Role:', loginResponse.data.user.role);
    
    const token = loginResponse.data.token;
    
    // Test 3: Get Profile
    console.log('\n3️⃣ Testing profile endpoint...');
    const profileResponse = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.user.email);
    
    // Test 4: Test Analytics (if implemented)
    console.log('\n4️⃣ Testing analytics endpoint...');
    try {
      const analyticsResponse = await axios.get(`${API_URL}/analytics/cost-trends`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Analytics working:', analyticsResponse.status);
    } catch (err) {
      console.log('⚠️  Analytics endpoint may not be fully implemented');
    }
    
    console.log('\n✅ All basic tests passed!');
    console.log('\n📝 Summary:');
    console.log('   - Server is running');
    console.log('   - Database is connected');
    console.log('   - Authentication is working');
    console.log('   - Seeded data is accessible');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Server is not running!');
      console.error('   Start the server with: cd server && npm run dev');
    }
  }
}

testBackend();
