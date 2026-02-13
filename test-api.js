const http = require('http');

let authToken = '';
let userId = 1;
let productId = 1;
let cartItemId = 1;
let orderId = 1;

const API_BASE = 'http://localhost:5001/api';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 5001,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: responseData });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Register User
    console.log('Test 1: Register User');
    const registerRes = await makeRequest('POST', '/auth/register', {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'SecurePass@123',
      address: '123 Main Street',
    });
    if (registerRes.status === 201 && registerRes.body.success) {
      authToken = registerRes.body.token;
      userId = registerRes.body.user.id;
      console.log('✓ User registered successfully\n');
    } else {
      console.log(
        `✗ Failed: ${registerRes.status} - ${JSON.stringify(registerRes.body.message)}\n`
      );
    }

    // Test 2: Login User
    console.log('Test 2: Login User');
    const loginRes = await makeRequest('POST', '/auth/login', {
      email: 'john@example.com',
      password: 'SecurePass@123',
    });
    if (loginRes.status === 200 && loginRes.body.success) {
      console.log('✓ User logged in successfully\n');
    } else {
      console.log(`✗ Failed: ${loginRes.status}\n`);
    }

    // Test 3: Get Current User
    console.log('Test 3: Get Current User');
    const meRes = await makeRequest('GET', '/auth/me');
    if (meRes.status === 200 && meRes.body.success) {
      console.log(`✓ Retrieved current user: ${meRes.body.user.name}\n`);
    } else {
      console.log(`✗ Failed: ${meRes.status}\n`);
    }

    // Test 4: Update Profile
    console.log('Test 4: Update User Profile');
    const updateRes = await makeRequest('PUT', '/auth/update', {
      phone: '9876543210',
      address: '456 Oak Street',
    });
    if (updateRes.status === 200 && updateRes.body.success) {
      console.log('✓ Profile updated successfully\n');
    } else {
      console.log(`✗ Failed: ${updateRes.status}\n`);
    }

    // Test 5: Get All Products
    console.log('Test 5: Get All Products (without auth)');
    const productsRes = await makeRequest('GET', '/products');
    if (productsRes.status === 200 && productsRes.body.success) {
      console.log(
        `✓ Retrieved ${productsRes.body.pagination.total} products\n`
      );
    } else {
      console.log(`✗ Failed: ${productsRes.status}\n`);
    }

    // Test 6: Get Cart
    console.log('Test 6: Get User Cart');
    const getCartRes = await makeRequest('GET', '/cart');
    if (getCartRes.status === 200 && getCartRes.body.success) {
      console.log(
        `✓ Retrieved cart with ${getCartRes.body.data.totalItems || 0} items\n`
      );
    } else {
      console.log(`✗ Failed: ${getCartRes.status}\n`);
    }

    // Test 7: Get Wishlist
    console.log('Test 7: Get Wishlist');
    const getWishlistRes = await makeRequest('GET', '/wishlist');
    if (getWishlistRes.status === 200 && getWishlistRes.body.success) {
      console.log(`✓ Retrieved wishlist\n`);
    } else {
      console.log(`✗ Failed: ${getWishlistRes.status}\n`);
    }

    // Test 8: Get Orders
    console.log('Test 8: Get Orders');
    const getOrdersRes = await makeRequest('GET', '/orders');
    if (getOrdersRes.status === 200 && getOrdersRes.body.success) {
      console.log(
        `✓ Retrieved ${getOrdersRes.body.pagination.total || 0} orders\n`
      );
    } else {
      console.log(`✗ Failed: ${getOrdersRes.status}\n`);
    }

    console.log('✓ All tests completed!');
  } catch (error) {
    console.error('Test error:', error.message);
  }

  process.exit(0);
}

// Wait for server to start then run tests
setTimeout(runTests, 2000);
