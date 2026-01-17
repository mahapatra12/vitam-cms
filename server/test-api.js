const test = async () => {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'superadmin@vitam.edu.in',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    
    if (!loginRes.ok) {
        console.error('Login failed:', loginData);
        return;
    }

    const tempToken = loginData.tempToken;
    console.log('Got temp token');

    // 2. Verify MFA (Bypass)
    console.log('Verifying MFA...');
    const verifyRes = await fetch('http://localhost:5000/api/auth/mfa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tempToken,
        code: '123456',
        method: 'authenticator'
      })
    });
    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
        console.error('MFA failed:', verifyData);
        return;
    }

    const token = verifyData.token;
    console.log('Got real token');

    // 3. Hit Setup Endpoint
    console.log('Hitting /authenticator/setup...');
    const setupRes = await fetch('http://localhost:5000/api/auth/authenticator/setup', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Status:', setupRes.status);
    const setupData = await setupRes.json();
    console.log('Data:', setupData);

  } catch (error) {
    console.error('Error:', error);
  }
};

test();
