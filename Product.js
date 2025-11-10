const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a product name' },
      len: {
        args: [1, 100],
        msg: 'Name cannot be more than 100 characters',
      },
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a price' },
      min: {
        args: [0],
        msg: 'Price must be a positive number',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a description' },
      len: {
        args: [1, 1000],
        msg: 'Description cannot be more than 1000 characters',
      },
    },
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: 'no-photo.jpg',
  },
  category: {
    type: DataTypes.ENUM(
      'Electronics',
      'Clothing',
      'Books',
      'Home',
      'Beauty',
      'Sports',
      'Other'
    ),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a category' },
    },
  },
  countInStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Stock cannot be negative',
      },
    },
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Rating must be at least 0',
      },
      max: {
        args: [5],
        msg: 'Rating cannot be more than 5',
      },
    },
  },
  numReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'user_id',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at',
  },
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
});

// Associations will be defined in a separate file

module.exports = Product;
