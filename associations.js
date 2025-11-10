const User = require('./User');
const Product = require('./Product');
const { Cart, CartItem } = require('./Cart');

function associateAll() {
  // User has one Cart (one-to-one)
  User.hasOne(Cart, {
    foreignKey: 'userId',
    as: 'cart'
  });

  // Cart belongs to User
  Cart.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // User has many Products (one-to-many)
  User.hasMany(Product, {
    foreignKey: 'userId',
    as: 'products',
    onDelete: 'CASCADE'
  });

  // Product belongs to User
  Product.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // Cart has many CartItems
  Cart.hasMany(CartItem, {
    foreignKey: 'cartId',
    as: 'items',
    onDelete: 'CASCADE'
  });

  // CartItem belongs to Cart
  CartItem.belongsTo(Cart, {
    foreignKey: 'cartId',
    as: 'cart'
  });

  // Product has many CartItems
  Product.hasMany(CartItem, {
    foreignKey: 'productId',
    as: 'cartItems',
    onDelete: 'CASCADE'
  });

  // CartItem belongs to Product
  CartItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
  });
}

module.exports = {
  User,
  Product,
  Cart,
  CartItem,
  associateAll,
};
