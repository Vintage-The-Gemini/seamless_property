// backend/routes/tenantRoutes.js
const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const Property = require('../models/Property');

// Create tenant
router.post('/', async (req, res) => {
  try {
    const tenant = await Tenant.create(req.body);
    
    // Update property unit status
    const property = await Property.findById(req.body.propertyId);
    if (property) {
      property.floors = property.floors.map(floor => {
        if (floor.floorNumber === req.body.floorNumber) {
          floor.units = floor.units.map(unit => {
            if (unit.unitNumber === req.body.unitNumber) {
              unit.isOccupied = true;
              unit.tenantId = tenant._id;
            }
            return unit;
          });
        }
        return floor;
      });
      await property.save();
    }

    res.status(201).json({
      success: true,
      data: tenant
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get tenants by property
router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.find({ propertyId: req.query.propertyId });
    res.status(200).json({
      success: true,
      data: tenants
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;