import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchPayments } from '../../utils/api';

const PaymentModal = ({ property, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    unitNumber: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMonth: new Date().toISOString().slice(0, 7),
    paymentMethod: 'CASH',
    notes: ''
  });

  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  // Let's debug what units are available
  console.log('Property data:', property);

  const occupiedUnits = property?.floors?.flatMap(floor => 
    floor.units.filter(unit => unit.isOccupied)
  ) || [];

  console.log('Occupied units:', occupiedUnits);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Find the unit info
    const unit = occupiedUnits.find(u => u.unitNumber === formData.unitNumber);
    if (!unit) {
      setError('Invalid unit selected');
      return;
    }

    try {
      const paymentData = {
        tenantId: unit.tenantId, // Get tenantId from the unit
        propertyId: property._id,
        unitNumber: formData.unitNumber,
        amount: parseFloat(formData.amount),
        paymentMonth: new Date(formData.paymentMonth),
        paymentDate: new Date(formData.paymentDate),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      console.log('Payment data being submitted:', paymentData);
      await onSubmit(paymentData);
    } catch (error) {
      setError('Failed to submit payment. Please try again.');
      console.error('Error submitting payment:', error);
    }
  };

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await fetchPayments(property._id);
        setPayments(response.data);
      } catch (error) {
        console.error('Error loading payments:', error);
      }
    };

    if (property?._id) {
      loadPayments();
    }
  }, [property]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Record Payment</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <select
              required
              className="w-full p-2 border rounded-lg"
              value={formData.unitNumber}
              onChange={(e) => {
                console.log('Selected unit:', e.target.value);
                setFormData(prev => ({
                  ...prev,
                  unitNumber: e.target.value
                }));
              }}
            >
              <option value="">Select Unit</option>
              {occupiedUnits.map((unit, index) => (
                <option 
                  key={unit.unitNumber || index} 
                  value={unit.unitNumber}
                >
                  Unit {unit.unitNumber} (Rent: ${unit.monthlyRent})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full p-2 border rounded-lg"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                amount: e.target.value
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Payment Date</label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.paymentDate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentDate: e.target.value
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment For</label>
              <input
                type="month"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.paymentMonth}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentMonth: e.target.value
                }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              required
              className="w-full p-2 border rounded-lg"
              value={formData.paymentMethod}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                paymentMethod: e.target.value
              }))}
            >
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CHECK">Check</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-lg"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                notes: e.target.value
              }))}
              rows="3"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
            >
              Record Payment
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PaymentModal;