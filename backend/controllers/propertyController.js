const Property = require('../models/Property');

// Get all properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new property
const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get single property
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update property
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty
};