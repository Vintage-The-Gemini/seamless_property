import React, { useMemo } from "react";

const PaymentSummary = ({ payments = [], expectedTotal = 0 }) => {
  // Calculate payment statistics
  const stats = useMemo(() => {
    // Calculate totals
    const totalPaid = payments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );
    const outstanding = Math.max(0, expectedTotal - totalPaid);
    const overpayment =
      totalPaid > expectedTotal ? totalPaid - expectedTotal : 0;
    const collectionRate =
      expectedTotal > 0 ? (totalPaid / expectedTotal) * 100 : 0;

    return {
      totalPaid,
      outstanding,
      overpayment,
      collectionRate: Math.round(collectionRate * 10) / 10, // Round to 1 decimal place
      paymentCount: payments.length,
    };
  }, [payments, expectedTotal]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="text-sm text-gray-500">Total Collected</h4>
        <p className="text-2xl font-bold text-green-600">
          ${stats.totalPaid.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          Collection Rate: {stats.collectionRate}%
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="text-sm text-gray-500">Outstanding Balance</h4>
        <p className="text-2xl font-bold text-red-600">
          ${stats.outstanding.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">From partial payments</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="text-sm text-gray-500">Overpayments</h4>
        <p className="text-2xl font-bold text-blue-600">
          ${stats.overpayment.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">Available as credit</p>
      </div>
    </div>
  );
};

export default PaymentSummary;
