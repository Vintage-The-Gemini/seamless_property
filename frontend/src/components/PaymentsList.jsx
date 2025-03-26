import React from "react";
import { FileText, Download } from "lucide-react";
import PaymentStatusBadge from "./PaymentStatusBadge";

const PaymentsList = ({ payments = [] }) => {
  // Mock payment data for demonstration
  const demoPayments = [
    {
      id: 1,
      unitNumber: "101",
      tenantName: "John Doe",
      amount: 1200,
      balance: 0,
      status: "FULL",
      paymentDate: "2025-03-15",
      paymentMethod: "BANK_TRANSFER",
    },
    {
      id: 2,
      unitNumber: "202",
      tenantName: "Jane Smith",
      amount: 800,
      balance: 400,
      status: "PARTIAL",
      paymentDate: "2025-03-14",
      paymentMethod: "CASH",
    },
    {
      id: 3,
      unitNumber: "305",
      tenantName: "Robert Johnson",
      amount: 1500,
      balance: -100,
      status: "OVERPAID",
      paymentDate: "2025-03-12",
      paymentMethod: "CHECK",
    },
  ];

  // Use demo data if no payments are provided
  const displayPayments = payments.length > 0 ? payments : demoPayments;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Payments</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

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
            {displayPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    Unit {payment.unitNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.tenantName}
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <PaymentStatusBadge
                    status={payment.status}
                    balance={payment.balance}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {payment.paymentMethod.replace("_", " ")}
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
    </div>
  );
};

export default PaymentsList;
