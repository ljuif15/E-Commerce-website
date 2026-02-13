const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name is required' },
      len: [1, 100],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email already in use',
    },
    validate: {
      isEmail: { msg: 'Please add a valid email' },
    },
    lowercase: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Phone number already in use',
    },
    validate: {
      len: [10, 15],
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    select: false, // Don't return password by default
    validate: {
      notEmpty: { msg: 'Password is required' },
      len: [8],
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Address is required' },
    },
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    select: false,
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
    select: false,
  },
}, {
  timestamps: true,
  tableName: 'users',
});

// Hash password before saving
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Hash password before updating if password is changed
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Method to compare passwords
User.prototype.comparePassword = async function(inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// Method to generate JWT token
User.prototype.getSignedJwtToken = function() {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = User;
