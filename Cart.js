const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define CartItem as a separate model for many-to-many relationship
const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: 'Quantity must be at least 1',
      },
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'id',
    },
    field: 'product_id',
  },
  cartId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'carts',
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'cart_id',
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
  tableName: 'cart_items',
  timestamps: true,
  underscored: true,
});

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'total_price',
  },
  totalItems: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'total_items',
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
    unique: true,
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
  tableName: 'carts',
  timestamps: true,
  underscored: true,
  hooks: {
    afterUpdate: async (cart) => {
      // Recalculate totals after cart items are updated
      const cartItems = await CartItem.findAll({
        where: { cartId: cart.id },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
          [sequelize.fn('SUM', sequelize.literal('quantity * price')), 'totalPrice']
        ],
        raw: true,
      });

      const totals = cartItems[0] || { totalQuantity: 0, totalPrice: 0 };
      
      await cart.update({
        totalItems: parseInt(totals.totalQuantity) || 0,
        totalPrice: parseFloat(totals.totalPrice) || 0,
      });
    }
  }
});

// Define associations
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

// Add instance method to calculate totals
Cart.prototype.calculateTotals = async function() {
  const cartItems = await CartItem.findAll({
    where: { cartId: this.id },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
      [sequelize.fn('SUM', sequelize.literal('quantity * price')), 'totalPrice']
    ],
    raw: true,
  });

  const totals = cartItems[0] || { totalQuantity: 0, totalPrice: 0 };
  
  this.totalItems = parseInt(totals.totalQuantity) || 0;
  this.totalPrice = parseFloat(totals.totalPrice) || 0;
  
  return this.save();
};

module.exports = { Cart, CartItem };
