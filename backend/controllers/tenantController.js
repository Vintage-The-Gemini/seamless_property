/ controllers/tenantController.js
const Tenant = require('../models/Tenant');
const Property = require('../models/Property');

exports.createTenant = async (req, res) => {
  try {
    const { propertyId, unitNumber, ...tenantData } = req.body;

    // Verify property and unit exist
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    // Find and update unit occupancy
    let unitFound = false;
    property.floors.forEach(floor => {
      floor.units.forEach(unit => {
        if (unit.unitNumber === unitNumber) {
          if (unit.isOccupied) {
            throw new Error('Unit is already occupied');
          }
          unit.isOccupied = true;
          unitFound = true;
        }
      });
    });

    if (!unitFound) {
      return res.status(404).json({
        success: false,
        error: 'Unit not found'
      });
    }

    await property.save();

    // Create tenant
    const tenant = await Tenant.create({
      ...tenantData,
      propertyId,
      unitNumber
    });

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
};