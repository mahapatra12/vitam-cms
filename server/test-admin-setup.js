const axios = require('axios');

const testSetup = async () => {
  try {
    // Step 1: Login as admin
    console.log('Logging in as admin...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@vitam.edu.in',
      password: 'password123'
    });

    console.log('Login response:', loginRes.data);

    // Step 2: Verify MFA with bypass code
    console.log('\nVerifying MFA with 123456...');
    const mfaRes = await axios.post('http://localhost:5000/api/auth/verify-mfa', {
      tempToken: loginRes.data.tempToken,
      code: '123456',
      method: 'authenticator'
    });

    console.log('MFA response:', mfaRes.data);
    const token = mfaRes.data.token;

    // Step 3: Get authenticator setup
    console.log('\nFetching authenticator setup...');
    const setupRes = await axios.get('http://localhost:5000/api/auth/authenticator/setup', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Setup response:');
    console.log('- Has qrCode:', !!setupRes.data.qrCode);
    console.log('- QR Code length:', setupRes.data.qrCode?.length);
    console.log('- QR Code starts with:', setupRes.data.qrCode?.substring(0, 50));
    console.log('- Secret:', setupRes.data.secret);
    console.log('- Setup Complete:', setupRes.data.setupComplete);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testSetup();
