
import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { fetchPayments } from '../../utils/api';
import PaymentModal from '../modals/PaymentModal';

const PaymentSection = ({ property }) => {
  const [payments, setPayments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, [property._id]);

  const loadPayments = async () => {
    try {
      const response = await fetchPayments(property._id);
      setPayments(response.data.data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    await loadPayments();
    setShowPaymentModal(false);
    setSelectedUnit(null);
  };

  // Calculate statistics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.paymentDate);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear;
  });

  const totalExpectedRent = property.floors.reduce((acc, floor) => 
    acc + floor.units.reduce((sum, unit) => 
      unit.isOccupied ? sum + unit.monthlyRent : sum, 0), 0);

  const totalCollected = monthlyPayments.reduce((acc, payment) => 
    acc + payment.amount, 0);

  const statistics = {
    totalExpectedRent,
    totalCollected,
    outstanding: totalExpectedRent - totalCollected,
    collectionRate: totalExpectedRent > 0 
      ? Math.round((totalCollected / totalExpectedRent) * 100)
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payments</h3>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
          <button 
            className="btn-primary"
            onClick={() => setShowPaymentModal(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Expected Rent</p>
          <p className="text-2xl font-bold">
            ${statistics.totalExpectedRent.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Collected</p>
          <p className="text-2xl font-bold text-green-600">
            ${statistics.totalCollected.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Outstanding</p>
          <p className="text-2xl font-bold text-red-600">
            ${statistics.outstanding.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Collection Rate</p>
          <p className="text-2xl font-bold">
            {statistics.collectionRate}%
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Unit/Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Method
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment, index) => (
              <tr key={index}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">Unit {payment.unitNumber}</div>
                    <div className="text-sm text-gray-500">
                      {payment.tenant?.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  ${payment.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${payment.status === 'FULL' 
                      ? 'bg-green-100 text-green-800'
                      : payment.status === 'PARTIAL'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {payment.paymentMethod}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          property={property}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
};

export default PaymentSection;
