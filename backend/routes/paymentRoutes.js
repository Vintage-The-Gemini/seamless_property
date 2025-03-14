
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Property = require('../models/Property');

// Create payment
router.post('/', async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get payments by property
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find({ 
      propertyId: req.query.propertyId 
    })
    .populate('tenantId')
    .sort('-paymentDate');

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get monthly report
router.get('/monthly', async (req, res) => {
  try {
    const { propertyId, month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const payments = await Payment.find({
      propertyId,
      paymentMonth: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('tenantId');

    const property = await Property.findById(propertyId);
    const totalExpectedRent = property.floors.reduce((acc, floor) => 
      acc + floor.units.reduce((sum, unit) => 
        unit.isOccupied ? sum + unit.monthlyRent : sum, 0), 0);

    const totalCollected = payments.reduce((acc, payment) => acc + payment.amount, 0);
    const collectionRate = (totalCollected / totalExpectedRent) * 100;

    res.status(200).json({
      success: true,
      data: {
        payments,
        summary: {
          totalExpectedRent,
          totalCollected,
          outstanding: totalExpectedRent - totalCollected,
          collectionRate: Math.round(collectionRate)
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
