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

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to SQLite has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;
