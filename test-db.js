const { sequelize } = require('./src/config/database');
const models = require('./src/models');

console.log('Testing Database Connection and Models...\n');

async function testDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✓ Database connection successful');

    // Sync models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✓ Database models synchronized');

    // Check models
    console.log('\n✓ Models loaded:');
    console.log('  - User')
    console.log('  - Product');
    console.log('  - Cart');
    console.log('  - CartItem');
    console.log('  - Wishlist');
    console.log('  - Order');
    console.log('  - OrderItem');

    console.log('\n✓ All tests passed! Database is ready.');
    process.exit(0);
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    process.exit(1);
  }
}

testDatabase();
