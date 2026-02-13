const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Wishlist = require('./Wishlist');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// User associations
User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Wishlist, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });

// Product associations
Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
Product.hasMany(Wishlist, { foreignKey: 'productId', onDelete: 'CASCADE' });
Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'CASCADE' });

// Cart associations
Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });

// CartItem associations
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

// Wishlist associations
Wishlist.belongsTo(User, { foreignKey: 'userId' });
Wishlist.belongsTo(Product, { foreignKey: 'productId' });

// Order associations
Order.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });

// OrderItem associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  User,
  Product,
  Cart,
  CartItem,
  Wishlist,
  Order,
  OrderItem,
};
