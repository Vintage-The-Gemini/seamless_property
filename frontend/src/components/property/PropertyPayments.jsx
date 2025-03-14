import { useState, useEffect } from 'react';
import { Plus, Download, Filter, FileText } from 'lucide-react';
import { fetchPayments, createPayment, generateReport } from '../../utils/api';
import AddPaymentModal from '../modals/AddPaymentModal';

const PropertyPayments = ({ property, onUpdate }) => {
  const [payments, setPayments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState({
    totalCollected: 0,
    outstanding: 0,
    collectionRate: 0
  });

  useEffect(() => {
    loadPayments();
  }, [property._id]);

  const loadPayments = async () => {
    try {
      const response = await fetchPayments(property._id);
      setPayments(response.data);
      calculateMonthlyStats(response.data);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const calculateMonthlyStats = (paymentData) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyPayments = paymentData.filter(payment => {
      const paymentDate = new Date(payment.paymentDate);
      return paymentDate.getMonth() === currentMonth && 
             paymentDate.getFullYear() === currentYear;
    });

    const totalRent = property.floors.reduce((acc, floor) => 
      acc + floor.units.reduce((sum, unit) => sum + unit.monthlyRent, 0), 0);

    const collected = monthlyPayments.reduce((acc, payment) => acc + payment.amount, 0);
    const outstanding = totalRent - collected;
    const collectionRate = (collected / totalRent) * 100;

    setMonthlyStats({
      totalCollected: collected,
      outstanding,
      collectionRate: Math.round(collectionRate)
    });
  };

  const handleAddPayment = async (paymentData) => {
    try {
      await createPayment({
        ...paymentData,
        propertyId: property._id
      });
      loadPayments();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await generateReport(property._id);
      // Handle PDF download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${property.name}_payments_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payments</h3>
        <div className="flex gap-2">
          <button 
            className="btn-secondary"
            onClick={handleDownloadReport}
          >
            <Download className="h-5 w-5 mr-2" />
            Download Report
          </button>
          <button 
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-sm font-medium text-gray-500">Total Collected</h4>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ${monthlyStats.totalCollected.toLocaleString()}
          </p>
        </div>
        <div className="card">
          <h4 className="text-sm font-medium text-gray-500">Outstanding</h4>
          <p className="mt-2 text-3xl font-bold text-red-600">
            ${monthlyStats.outstanding.toLocaleString()}
          </p>
        </div>
        <div className="card">
          <h4 className="text-sm font-medium text-gray-500">Collection Rate</h4>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {monthlyStats.collectionRate}%
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
                Payment Method
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    Unit {payment.unitNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.tenantName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    ${payment.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.month} Rent
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                    payment.status === 'PAID' 
                      ? 'bg-green-100 text-green-800'
                      : payment.status === 'PARTIAL'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {payment.paymentMethod}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-900">
                    <FileText className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddPaymentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPayment}
          property={property}
        />
      )}
    </div>
  );
};

export default PropertyPayments;