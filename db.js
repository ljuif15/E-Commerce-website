const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '..', config.storage),
  logging: config.logging === true ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const { Cart, CartItem } = require('../models/Cart');

// Initialize models
User.init(sequelize);
Product.init(sequelize);
Cart.init(sequelize);
CartItem.init(sequelize);

// Import and set up associations
const { associateAll } = require('../models/associations');
associateAll();

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to SQLite has been established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = {
  sequelize,
  User,
  Product,
  Cart,
  CartItem,
};
