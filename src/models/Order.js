const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../config/constants');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalItems: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(...ORDER_STATUS),
    defaultValue: 'pending',
  },
  paymentStatus: {
    type: DataTypes.ENUM(...PAYMENT_STATUS),
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'orders',
});

module.exports = Order;
