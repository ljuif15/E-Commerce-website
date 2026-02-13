const { Wishlist, Product } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const wishlistItems = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'image', 'category', 'stock'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: wishlistItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return next(new ErrorResponse('Please provide product ID', 400));
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Check if already in wishlist
    const exists = await Wishlist.findOne({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    if (exists) {
      return next(new ErrorResponse('Product already in wishlist', 400));
    }

    const wishlistItem = await Wishlist.create({
      userId: req.user.id,
      productId,
    });

    res.status(201).json({
      success: true,
      message: 'Item added to wishlist',
      data: wishlistItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      where: {
        userId: req.user.id,
        productId: req.params.id,
      },
    });

    if (!wishlistItem) {
      return next(new ErrorResponse('Item not found in wishlist', 404));
    }

    await wishlistItem.destroy();

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if product in wishlist
// @route   GET /api/wishlist/check/:id
// @access  Private
exports.checkWishlist = async (req, res, next) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      where: {
        userId: req.user.id,
        productId: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      inWishlist: !!wishlistItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res, next) => {
  try {
    await Wishlist.destroy({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};
