
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  unitNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  paymentMonth: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'BANK_TRANSFER', 'CHECK', 'MOBILE_MONEY'],
    required: true
  },
  status: {
    type: String,
    enum: ['FULL', 'PARTIAL', 'OVERPAID'],
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  notes: String,
  reference: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
