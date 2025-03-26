import React, { useState } from "react";
import { X } from "lucide-react";

const PaymentForm = ({ onSubmit, onCancel, unit = {}, tenant = {} }) => {
  const [formData, setFormData] = useState({
    unitNumber: unit.unitNumber || "",
    tenantId: tenant._id || "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMonth: new Date().toISOString().slice(0, 7),
    paymentMethod: "CASH",
    notes: "",
  });

  // Utility functions for payment calculations (included inline)
  const calculatePaymentStatus = (amountPaid, monthlyRent) => {
    if (amountPaid === monthlyRent) {
      return "FULL";
    } else if (amountPaid > monthlyRent) {
      return "OVERPAID";
    } else {
      return "PARTIAL";
    }
  };

  const calculateBalance = (amountPaid, monthlyRent) => {
    return monthlyRent - amountPaid;
  };

  // Process payment data for display
  const processPayment = (amountPaid, monthlyRent) => {
    const status = calculatePaymentStatus(amountPaid, monthlyRent);
    const balance = calculateBalance(amountPaid, monthlyRent);

    return {
      status,
      balance,
      isFullyPaid: status === "FULL" || status === "OVERPAID",
      hasCredit: status === "OVERPAID",
    };
  };

  // Custom Payment Status Badge component (included inline)
  const PaymentStatusBadge = ({ status, balance = 0 }) => {
    const getStatusDisplay = () => {
      const statusConfig = {
        FULL: {
          className: "bg-green-100 text-green-800",
          text: "Paid in Full",
        },
        PARTIAL: {
          className: "bg-yellow-100 text-yellow-800",
          text: `Partial (Balance: $${balance?.toLocaleString()})`,
        },
        OVERPAID: {
          className: "bg-blue-100 text-blue-800",
          text: `Overpaid (+$${Math.abs(balance)?.toLocaleString()})`,
        },
      };

      return (
        statusConfig[status] || {
          className: "bg-gray-100 text-gray-800",
          text: status || "Unknown",
        }
      );
    };

    const { className, text } = getStatusDisplay();

    return (
      <span
        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${className}`}
      >
        {text}
      </span>
    );
  };

  // Calculate payment details based on current form data
  const getPaymentDetails = () => {
    const amountPaid = parseFloat(formData.amount) || 0;
    const monthlyRent = unit.monthlyRent || 0;
    return processPayment(amountPaid, monthlyRent);
  };

  const paymentDetails = getPaymentDetails();

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountPaid = parseFloat(formData.amount) || 0;
    const monthlyRent = unit.monthlyRent || 0;

    // Add payment status and balance to form data
    const paymentData = {
      ...formData,
      amount: amountPaid,
      ...processPayment(amountPaid, monthlyRent),
    };

    onSubmit(paymentData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Record Payment</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <input
              type="text"
              value={formData.unitNumber}
              readOnly={!!unit.unitNumber}
              className="w-full p-2 border rounded-lg bg-gray-50"
            />
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
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Date
              </label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.paymentDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentDate: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Payment For
              </label>
              <input
                type="month"
                required
                className="w-full p-2 border rounded-lg"
                value={formData.paymentMonth}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMonth: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Payment Method
            </label>
            <select
              required
              className="w-full p-2 border rounded-lg"
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentMethod: e.target.value,
                }))
              }
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
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              rows="3"
            />
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Rent:</span>
              <span className="font-medium">
                ${(unit.monthlyRent || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-medium">
                ${(parseFloat(formData.amount) || 0).toLocaleString()}
              </span>
            </div>
            {paymentDetails.balance > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Balance Due:</span>
                <span className="font-medium">
                  ${paymentDetails.balance.toLocaleString()}
                </span>
              </div>
            )}
            {paymentDetails.balance < 0 && (
              <div className="flex justify-between text-blue-600">
                <span>Overpayment:</span>
                <span className="font-medium">
                  ${Math.abs(paymentDetails.balance).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t">
              <span className="font-medium">Payment Status:</span>
              <PaymentStatusBadge
                status={paymentDetails.status}
                balance={paymentDetails.balance}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Record Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
