const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { PRODUCT_CATEGORIES } = require('../config/constants');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Product name is required' },
      len: [1, 100],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Description is required' },
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Price is required' },
      min: 0,
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [PRODUCT_CATEGORIES],
    },
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'products',
});

module.exports = Product;
