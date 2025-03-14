// controllers/paymentController.js
const Payment = require('../models/Payment');
const Tenant = require('../models/Tenant');

exports.createPayment = async (req, res) => {
  try {
    const { tenantId, amount, paymentMonth } = req.body;

    // Get tenant and associated property details
    const tenant = await Tenant.findById(tenantId).populate('propertyId');
    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found'
      });
    }

    // Find unit's monthly rent
    let monthlyRent = 0;
    tenant.propertyId.floors.forEach(floor => {
      floor.units.forEach(unit => {
        if (unit.unitNumber === tenant.unitNumber) {
          monthlyRent = unit.monthlyRent;
        }
      });
    });

    // Calculate payment status and balance
    let status;
    let balance = 0;

    if (amount === monthlyRent) {
      status = 'FULL';
    } else if (amount > monthlyRent) {
      status = 'OVERPAID';
      balance = amount - monthlyRent;
    } else {
      status = 'PARTIAL';
      balance = monthlyRent - amount;
    }

    const payment = await Payment.create({
      tenantId,
      propertyId: tenant.propertyId._id,
      unitNumber: tenant.unitNumber,
      amount,
      paymentMonth,
      status,
      balance
    });

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
};

exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const payments = await Payment.find({
      paymentMonth: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('tenantId propertyId');

    // Calculate monthly statistics
    const totalRevenue = payments.reduce((acc, payment) => acc + payment.amount, 0);
    const totalDue = payments.reduce((acc, payment) => {
      const unit = payment.propertyId.floors
        .flatMap(floor => floor.units)
        .find(unit => unit.unitNumber === payment.unitNumber);
      return acc + (unit ? unit.monthlyRent : 0);
    }, 0);

    const report = {
      totalRevenue,
      totalDue,
      collectionRate: Math.round((totalRevenue / totalDue) * 100),
      payments: payments.map(payment => ({
        tenant: payment.tenantId.name,
        unit: payment.unitNumber,
        amount: payment.amount,
        status: payment.status,
        balance: payment.balance,
        date: payment.paymentMonth
      }))
    };

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getYearlyReport = async (req, res) => {
  try {
    const { year } = req.query;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const payments = await Payment.find({
      paymentMonth: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('tenantId propertyId');

    // Calculate yearly statistics
    const monthlyStats = Array(12).fill(0).map((_, index) => {
      const monthPayments = payments.filter(payment => 
        payment.paymentMonth.getMonth() === index
      );

      const revenue = monthPayments.reduce((acc, payment) => 
        acc + payment.amount, 0
      );

      return {
        month: index + 1,
        revenue,
        paymentCount: monthPayments.length
      };
    });

    const totalRevenue = monthlyStats.reduce((acc, month) => 
      acc + month.revenue, 0
    );

    const yearlyReport = {
      year,
      totalRevenue,
      monthlyBreakdown: monthlyStats,
      averageMonthlyRevenue: totalRevenue / 12
    };

    res.status(200).json({
      success: true,
      data: yearlyReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};