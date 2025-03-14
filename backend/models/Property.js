const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Property name is required']
  },
  address: {
    type: String,
    required: [true, 'Property address is required']
  },
  floors: [{
    floorNumber: {
      type: Number,
      required: [true, 'Floor number is required']
    },
    units: [{
      unitNumber: {
        type: String,
        required: [true, 'Unit number is required']
      },
      isOccupied: {
        type: Boolean,
        default: false
      },
      monthlyRent: {
        type: Number,
        required: [true, 'Monthly rent is required']
      },
      tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant'
      }
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);