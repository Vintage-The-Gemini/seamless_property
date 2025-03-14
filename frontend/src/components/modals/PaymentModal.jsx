import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchPayments, fetchTenants } from '../../utils/api';

const PaymentModal = ({ property, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    unitNumber: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMonth: new Date().toISOString().slice(0, 7),
    paymentMethod: 'CASH',
    notes: ''
  });

  const [error, setError] = useState('');
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);

  // Load tenants when component mounts
  useEffect(() => {
    const loadTenants = async () => {
      try {
        const response = await fetchTenants(property._id);
        console.log('Tenants response:', JSON.stringify({
          fullResponse: response,
          data: response.data,
          tenants: response.data.data
        }, null, 2));
        setTenants(response.data.data || []);
      } catch (error) {
        console.error('Error loading tenants:', error);
        setError('Failed to load tenants');
      }
    };
  
    if (property?._id) {
      loadTenants();
    }
  }, [property]);useEffect(() => {
    const loadTenants = async () => {
      try {
        const response = await fetchTenants(property._id);
        console.log('Tenants response:', JSON.stringify({
          fullResponse: response,
          data: response.data,
          tenants: response.data.data
        }, null, 2));
        setTenants(response.data.data || []);
      } catch (error) {
        console.error('Error loading tenants:', error);
        setError('Failed to load tenants');
      }
    };
  
    if (property?._id) {
      loadTenants();
    }
  }, [property]);

  // Get occupied units
  const occupiedUnits = property?.floors?.flatMap(floor => 
    floor.units.filter(unit => unit.isOccupied)
  ) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tenant = tenants.find(t => t.unitNumber === formData.unitNumber);
      
      // Calculate payment status
      let status;
      if (parseFloat(formData.amount) === tenant.monthlyRent) {
        status = 'FULL';
      } else if (parseFloat(formData.amount) > tenant.monthlyRent) {
        status = 'OVERPAID';
      } else {
        status = 'PARTIAL';
      }
  
      const paymentData = {
        tenantId: tenant._id,
        propertyId: property._id,
        unitNumber: formData.unitNumber,
        amount: parseFloat(formData.amount),
        paymentMonth: new Date(formData.paymentMonth),
        paymentDate: new Date(formData.paymentDate),
        paymentMethod: formData.paymentMethod,
        status, // Add this
        notes: formData.notes
      };
  
      console.log('Submitting payment data:', paymentData);
      await onSubmit(paymentData);
    } catch (error) {
      setError('Failed to submit payment');
      console.error('Error submitting payment:', error);
    }
  };

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
                const unit = occupiedUnits.find(u => u.unitNumber === e.target.value);
                setFormData(prev => ({
                  ...prev,
                  unitNumber: e.target.value,
                  amount: unit ? unit.monthlyRent.toString() : ''
                }));
              }}
            >
              <option value="">Select Unit</option>
              {occupiedUnits.map((unit) => {
                const tenant = tenants.find(t => t.unitNumber === unit.unitNumber);
                return (
                  <option key={unit.unitNumber} value={unit.unitNumber}>
                    Unit {unit.unitNumber} {tenant ? `- ${tenant.name}` : ''} (Rent: ${unit.monthlyRent})
                  </option>
                );
              })}
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
