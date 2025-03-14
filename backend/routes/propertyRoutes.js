const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

// Mount routes
router.route('/')
  .get(getAllProperties)
  .post(createProperty);

router.route('/:id')
  .get(getProperty)
  .put(updateProperty)
  .delete(deleteProperty);

module.exports = router;