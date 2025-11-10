const { sequelize } = require('./config/db');
const { User, Product, Cart, CartItem } = require('./models');

const initDatabase = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Sync all models with the database
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');

    // Create a test admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });
    console.log('Admin user created:', adminUser.toJSON());

    // Create some test products
    const products = await Product.bulkCreate([
      {
        name: 'Sample Product 1',
        price: 99.99,
        description: 'This is a sample product',
        category: 'Electronics',
        countInStock: 10,
        userId: adminUser.id,
      },
      {
        name: 'Sample Product 2',
        price: 49.99,
        description: 'Another sample product',
        category: 'Home',
        countInStock: 5,
        userId: adminUser.id,
      },
    ]);
    console.log('Test products created:', products.map(p => p.toJSON()));

    // Create a cart for the admin user
    const cart = await Cart.create({
      userId: adminUser.id,
      totalPrice: 0,
      totalItems: 0,
    });

    // Add items to the cart
    await CartItem.bulkCreate([
      {
        cartId: cart.id,
        productId: products[0].id,
        quantity: 2,
        price: products[0].price,
        name: products[0].name,
        image: 'sample1.jpg',
      },
      {
        cartId: cart.id,
        productId: products[1].id,
        quantity: 1,
        price: products[1].price,
        name: products[1].name,
        image: 'sample2.jpg',
      },
    ]);

    // Update cart totals
    await cart.calculateTotals();
    console.log('Test cart created:', cart.toJSON());

    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
