// backend/models/Tenant.js
const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  unitNumber: { type: String, required: true },
  floorNumber: { type: Number, required: true },
  leaseStartDate: { type: Date, required: true },
  leaseEndDate: { type: Date, required: true },
  depositAmount: { type: Number, required: true },
  monthlyRent: { type: Number, required: true },
  emergencyContact: String,
  idNumber: String
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);