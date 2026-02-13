const { Cart, CartItem, Product } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { sequelize } = require('../config/database');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'price', 'image', 'stock'],
            },
          ],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        totalPrice: 0,
        totalItems: 0,
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
exports.addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return next(new ErrorResponse('Please provide valid product ID and quantity', 400));
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (product.stock < quantity) {
      return next(new ErrorResponse('Insufficient stock available', 400));
    }

    // Get or create cart
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
    });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        totalPrice: 0,
        totalItems: 0,
      });
    }

    // Check if item already in cart
    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    const subtotal = parseFloat(product.price) * quantity;

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.subtotal = parseFloat(product.price) * cartItem.quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
        subtotal,
      });
    }

    // Update cart totals
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
    });

    const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    cart.totalPrice = totalPrice;
    cart.totalItems = totalItems;
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: cartItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:id
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return next(new ErrorResponse('Please provide valid quantity', 400));
    }

    const cartItem = await CartItem.findByPk(req.params.id, {
      include: [
        {
          model: Cart,
          where: { userId: req.user.id },
        },
      ],
    });

    if (!cartItem) {
      return next(new ErrorResponse('Cart item not found', 404));
    }

    // Check stock
    const product = await Product.findByPk(cartItem.productId);
    if (product.stock < quantity) {
      return next(new ErrorResponse('Insufficient stock available', 400));
    }

    cartItem.quantity = quantity;
    cartItem.subtotal = parseFloat(cartItem.price) * quantity;
    await cartItem.save();

    // Update cart totals
    const cart = cartItem.Cart;
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
    });

    const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    cart.totalPrice = totalPrice;
    cart.totalItems = totalItems;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cartItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:id
// @access  Private
exports.removeCartItem = async (req, res, next) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id, {
      include: [
        {
          model: Cart,
          where: { userId: req.user.id },
        },
      ],
    });

    if (!cartItem) {
      return next(new ErrorResponse('Cart item not found', 404));
    }

    const cart = cartItem.Cart;
    await cartItem.destroy();

    // Update cart totals
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
    });

    const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    cart.totalPrice = totalPrice;
    cart.totalItems = totalItems;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
    });

    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    await CartItem.destroy({
      where: { cartId: cart.id },
    });

    cart.totalPrice = 0;
    cart.totalItems = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};
