import { useState } from 'react';
import { calculatePaymentStatus } from '../../utils/calculations';

const PaymentCalculator = ({ unit, onSubmit }) => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
    paymentMethod: 'CASH',
    notes: ''
  });

  const calculateBalance = () => {
    const amount = parseFloat(paymentData.amount) || 0;
    const monthlyRent = unit.monthlyRent;
    
    if (amount >= monthlyRent) {
      return {
        status: 'PAID',
        balance: 0,
        overpayment: amount - monthlyRent
      };
    } else {
      return {
        status: 'PARTIAL',
        balance: monthlyRent - amount,
        overpayment: 0
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const calculation = calculateBalance();
    onSubmit({
      ...paymentData,
      ...calculation,
      unitNumber: unit.unitNumber,
      tenantId: unit.tenant?._id
    });
  };

  const { status, balance, overpayment } = calculateBalance();

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              required
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              step="0.01"
              value={paymentData.amount}
              onChange={(e) => setPaymentData(prev => ({
                ...prev,
                amount: e.target.value
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Date
            </label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={paymentData.paymentDate}
              onChange={(e) => setPaymentData(prev => ({
                ...prev,
                paymentDate: e.target.value
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment For Month
            </label>
            <input
              type="month"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={paymentData.paymentMonth}
              onChange={(e) => setPaymentData(prev => ({
                ...prev,
                paymentMonth: e.target.value
              }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={paymentData.paymentMethod}
            onChange={(e) => setPaymentData(prev => ({
              ...prev,
              paymentMethod: e.target.value
            }))}
          >
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CHEQUE">Cheque</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            rows="3"
            value={paymentData.notes}
            onChange={(e) => setPaymentData(prev => ({
              ...prev,
              notes: e.target.value
            }))}
          ></textarea>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Monthly Rent:</span>
            <span className="font-medium">${unit.monthlyRent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount Paid:</span>
            <span className="font-medium">${(parseFloat(paymentData.amount) || 0).toLocaleString()}</span>
          </div>
          {balance > 0 && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Balance:</span>
              <span className="font-medium">${balance.toLocaleString()}</span>
            </div>
          )}
          {overpayment > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Overpayment:</span>
              <span className="font-medium">${overpayment.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-medium">
            <span>Status:</span>
            <span className={`
              ${status === 'PAID' ? 'text-green-600' : 'text-yellow-600'}
            `}>
              {status}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Record Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentCalculator;