const { Product, User } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { validateProductData } = require('../utils/validators');
const path = require('path');
const fs = require('fs');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = req.query.category;

    let where = { isActive: true };
    if (category) {
      where.category = category;
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product || !product.isActive) {
      return next(new ErrorResponse('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Validate input
    const validation = validateProductData({ name, description, price, category, stock });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    let image = null;
    if (req.file) {
      image = req.file.filename;
    }

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      image,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;

    let product = await Product.findByPk(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock);

    if (req.file) {
      // Delete old image if exists
      if (product.image && product.image !== 'no-photo.jpg') {
        const oldImagePath = path.join(__dirname, '../../uploads', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.image = req.file.filename;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Delete image if exists
    if (product.image && product.image !== 'no-photo.jpg') {
      const imagePath = path.join(__dirname, '../../uploads', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where: { category, isActive: true },
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

// @desc    Search products
// @route   GET /api/products/search/:query
// @access  Public
exports.searchProducts = async (req, res, next) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where: {
        isActive: true,
        [require('sequelize').Op.or]: [
          {
            name: {
              [require('sequelize').Op.like]: `%${query}%`,
            },
          },
          {
            description: {
              [require('sequelize').Op.like]: `%${query}%`,
            },
          },
        ],
      },
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
