const { Order, OrderItem, Cart, CartItem, Product } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// Generate unique order number
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// @desc    Get all orders (admin) / user orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let where = {};
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'image'],
            },
          ],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'image', 'category'],
            },
          ],
        },
      ],
    });

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if user is owner or admin
    if (req.user.role !== 'admin' && req.user.id !== order.userId) {
      return next(new ErrorResponse('Not authorized to view this order', 403));
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, notes } = req.body;

    if (!shippingAddress) {
      return next(new ErrorResponse('Shipping address is required', 400));
    }

    // Get user cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          include: [Product],
        },
      ],
    });

    if (!cart || cart.CartItems.length === 0) {
      return next(new ErrorResponse('Cart is empty', 400));
    }

    // Create order
    const orderNumber = generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      userId: req.user.id,
      totalAmount: cart.totalPrice,
      totalItems: cart.totalItems,
      shippingAddress,
      notes: notes || null,
      status: 'pending',
      paymentStatus: 'pending',
    });

    // Create order items
    for (const cartItem of cart.CartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: cartItem.productId,
        productName: cartItem.Product.name,
        quantity: cartItem.quantity,
        price: cartItem.price,
        subtotal: cartItem.subtotal,
      });
    }

    // Clear cart
    await CartItem.destroy({
      where: { cartId: cart.id },
    });
    cart.totalPrice = 0;
    cart.totalItems = 0;
    await cart.save();

    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return next(new ErrorResponse('Invalid order status', 400));
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status (admin only)
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;

    if (!['pending', 'completed', 'failed'].includes(paymentStatus)) {
      return next(new ErrorResponse('Invalid payment status', 400));
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if user is owner or admin
    if (req.user.role !== 'admin' && req.user.id !== order.userId) {
      return next(new ErrorResponse('Not authorized to cancel this order', 403));
    }

    // Can only cancel pending or processing orders
    if (!['pending', 'processing'].includes(order.status)) {
      return next(new ErrorResponse('Cannot cancel this order', 400));
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics (admin only)
// @route   GET /api/orders/stats/dashboard
// @access  Private/Admin
exports.getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({
      where: { status: 'pending' },
    });
    const completedOrders = await Order.count({
      where: { status: 'delivered' },
    });
    const totalRevenue = await Order.sum('totalAmount', {
      where: { paymentStatus: 'completed' },
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
