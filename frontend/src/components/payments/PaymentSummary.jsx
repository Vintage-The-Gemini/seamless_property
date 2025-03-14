import { useMemo } from 'react';

const PaymentSummary = ({ payments, property }) => {
  const summary = useMemo(() => {
    const total = payments.reduce((acc, payment) => acc + payment.amount, 0);
    const totalExpected = property.floors?.reduce((acc, floor) => 
      acc + floor.units.reduce((sum, unit) => 
        unit.isOccupied ? sum + unit.monthlyRent : sum, 0
      ), 0
    ) || 0;
    
    const overdue = payments
      .filter(p => p.status === 'PARTIAL')
      .reduce((acc, p) => acc + p.balance, 0);
    
    const overpaid = payments
      .filter(p => p.status === 'OVERPAID')
      .reduce((acc, p) => acc + Math.abs(p.balance), 0);

    return {
      totalCollected: total,
      totalExpected,
      overdue,
      overpaid,
      collectionRate: (total / totalExpected * 100).toFixed(1)
    };
  }, [payments, property]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm text-gray-500">Total Collected</h4>
        <p className="text-2xl font-bold text-green-600">
          ${summary.totalCollected.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          Collection Rate: {summary.collectionRate}%
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm text-gray-500">Outstanding Balance</h4>
        <p className="text-2xl font-bold text-red-600">
          ${summary.overdue.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          From partial payments
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm text-gray-500">Overpayments</h4>
        <p className="text-2xl font-bold text-blue-600">
          ${summary.overpaid.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          Available as credit
        </p>
      </div>
    </div>
  );
};

export default PaymentSummary;