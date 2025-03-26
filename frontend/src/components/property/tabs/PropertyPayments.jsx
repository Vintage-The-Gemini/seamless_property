import React, { useState } from "react";
import { Plus, Download, FileText } from "lucide-react";

export const PropertyPayments = ({
  property,
  payments = [],
  filters,
  onFilterChange,
  onAddPayment,
  onViewPayment,
  onEditPayment,
  onDeletePayment,
}) => {
  const [paymentMonth, setPaymentMonth] = useState(
    new Date().toISOString().slice(0, 7) // Default to current month (YYYY-MM)
  );

  // Calculate payment statistics
  const calculateStats = () => {
    if (!property || !property.floors) {
      return {
        expectedRent: 0,
        collected: 0,
        outstanding: 0,
        collectionRate: 0,
      };
    }

    // Calculate total expected rent from occupied units
    const expectedRent = property.floors.reduce(
      (acc, floor) =>
        acc +
        floor.units.reduce(
          (sum, unit) =>
            unit.isOccupied ? sum + (unit.monthlyRent || 0) : sum,
          0
        ),
      0
    );

    // Calculate total collected from payments
    const collected = payments.reduce(
      (acc, payment) => acc + (payment.amount || 0),
      0
    );

    // Calculate outstanding amount
    const outstanding = Math.max(0, expectedRent - collected);

    // Calculate collection rate
    const collectionRate =
      expectedRent > 0 ? Math.round((collected / expectedRent) * 100) : 0;

    return {
      expectedRent,
      collected,
      outstanding,
      collectionRate,
    };
  };

  const stats = calculateStats();

  // Get payment status display
  const getPaymentStatusDisplay = (status) => {
    switch (status) {
      case "FULL":
        return {
          text: "Paid in Full",
          className: "bg-green-100 text-green-800",
        };
      case "PARTIAL":
        return {
          text: "Partial",
          className: "bg-yellow-100 text-yellow-800",
        };
      case "OVERPAID":
        return {
          text: "Overpaid",
          className: "bg-blue-100 text-blue-800",
        };
      default:
        return {
          text: status || "Unknown",
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payments</h3>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={() => {
              /* Handle download */
            }}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          {onAddPayment && (
            <button
              className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              onClick={onAddPayment}
            >
              <Plus className="h-4 w-4" />
              Record Payment
            </button>
          )}
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Expected Rent</p>
          <p className="text-2xl font-bold">
            ${stats.expectedRent.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Collected</p>
          <p className="text-2xl font-bold text-green-600">
            ${stats.collected.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Outstanding</p>
          <p className="text-2xl font-bold text-red-600">
            ${stats.outstanding.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Collection Rate</p>
          <p className="text-2xl font-bold">{stats.collectionRate}%</p>
        </div>
      </div>

      {/* Payments Filter */}
      <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Month
          </label>
          <input
            type="month"
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={paymentMonth}
            onChange={(e) => setPaymentMonth(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select className="px-3 py-2 border border-gray-300 rounded-md">
            <option value="all">All</option>
            <option value="FULL">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="OVERPAID">Overpaid</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No payments recorded yet</p>
          {onAddPayment && (
            <button
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              onClick={onAddPayment}
            >
              Record Your First Payment
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit/Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => {
                const statusDisplay = getPaymentStatusDisplay(payment.status);
                return (
                  <tr key={payment._id || index}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        Unit {payment.unitNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.tenantName || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        ${payment.amount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.className}`}
                      >
                        {statusDisplay.text}
                      </span>
                      {payment.balance > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          Due: ${payment.balance?.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {payment.paymentMethod?.replace("_", " ") || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {onViewPayment && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => onViewPayment(payment)}
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        )}
                        {onEditPayment && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => onEditPayment(payment)}
                          >
                            Edit
                          </button>
                        )}
                        {onDeletePayment && (
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => onDeletePayment(payment._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
