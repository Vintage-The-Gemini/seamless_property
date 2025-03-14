export const getPaymentStatusDisplay = (payment) => {
    const statusClasses = {
      FULL: 'bg-green-100 text-green-800',
      PARTIAL: 'bg-yellow-100 text-yellow-800',
      OVERPAID: 'bg-blue-100 text-blue-800'
    };
  
    const statusText = {
      FULL: 'Paid in Full',
      PARTIAL: `Partial (Balance: $${payment.balance?.toLocaleString()})`,
      OVERPAID: `Overpaid (+$${Math.abs(payment.balance)?.toLocaleString()})`
    };
  
    return {
      className: statusClasses[payment.status],
      text: statusText[payment.status]
    };
  };