// src/components/payments/PaymentStatusBadge.jsx
import React from "react";

/**
 * Payment Status Badge Component
 * Displays a styled badge for different payment statuses
 *
 * @param {Object} props - Component props
 * @param {string} props.status - Payment status (FULL, PARTIAL, OVERPAID)
 * @param {number} props.balance - Amount due (for PARTIAL) or overpaid (for OVERPAID)
 * @returns {JSX.Element} Styled status badge
 */
const PaymentStatusBadge = ({ status, balance = 0 }) => {
  const { className, text } = getPaymentStatusDisplay({ status, balance });

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {text}
    </span>
  );
};

export default PaymentStatusBadge;

/**
 * Helper function to get status display information
 * Can be used independently of the component
 *
 * @param {Object} payment - Payment data object with status and balance
 * @returns {Object} Object with className and text for the status
 */
export const getPaymentStatusDisplay = (payment) => {
  const statusClasses = {
    FULL: "bg-green-100 text-green-800",
    PARTIAL: "bg-yellow-100 text-yellow-800",
    OVERPAID: "bg-blue-100 text-blue-800",
  };

  const statusText = {
    FULL: "Paid in Full",
    PARTIAL: `Partial (Balance: $${payment.balance?.toLocaleString() || 0})`,
    OVERPAID: `Overpaid (+$${Math.abs(
      payment.balance || 0
    )?.toLocaleString()})`,
  };

  return {
    className: statusClasses[payment.status] || "bg-gray-100 text-gray-800",
    text: statusText[payment.status] || payment.status || "Unknown",
  };
};
