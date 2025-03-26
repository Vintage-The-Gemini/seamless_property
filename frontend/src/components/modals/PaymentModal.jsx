// src/components/modals/PaymentModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchTenants, createPayment } from "../../utils/api";
import { processPayment } from "../../utils/paymentCalculations";
import { getPaymentStatusDisplay } from "../payments/PaymentStatusBadge";

const PaymentModal = ({ property, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    unitNumber: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMonth: new Date().toISOString().slice(0, 7),
    paymentMethod: "CASH",
    notes: "",
  });

  const [tenants, setTenants] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [error, setError] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    status: "",
    balance: 0,
    isFullyPaid: false,
  });

  // Load tenants when component mounts
  useEffect(() => {
    const loadTenants = async () => {
      if (!property?._id) return;

      try {
        const response = await fetchTenants(property._id);
        setTenants(response.data?.data || []);
      } catch (error) {
        console.error("Error loading tenants:", error);
        setError("Failed to load tenants");
      }
    };

    loadTenants();
  }, [property]);

  // Get occupied units
  const occupiedUnits =
    property?.floors?.flatMap((floor) =>
      floor.units.filter((unit) => unit.isOccupied)
    ) || [];

  // Update payment details when amount or selected unit changes
  useEffect(() => {
    if (selectedUnit && formData.amount) {
      const amountPaid = parseFloat(formData.amount);
      const monthlyRent = selectedUnit.monthlyRent;

      if (!isNaN(amountPaid) && monthlyRent) {
        setPaymentDetails(processPayment(amountPaid, monthlyRent));
      }
    }
  }, [formData.amount, selectedUnit]);

  const handleUnitChange = (e) => {
    const unitNumber = e.target.value;
    const unit = occupiedUnits.find((u) => u.unitNumber === unitNumber);

    setSelectedUnit(unit);
    setFormData((prev) => ({
      ...prev,
      unitNumber,
      amount: unit ? unit.monthlyRent.toString() : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedUnit) {
      setError("Please select a valid unit");
      return;
    }

    try {
      const tenant = tenants.find((t) => t.unitNumber === formData.unitNumber);

      if (!tenant) {
        setError("No tenant found for this unit");
        return;
      }

      // Calculate payment status and balance
      const amountPaid = parseFloat(formData.amount);
      const monthlyRent = selectedUnit.monthlyRent;
      const { status, balance } = processPayment(amountPaid, monthlyRent);

      const paymentData = {
        tenantId: tenant._id,
        propertyId: property._id,
        unitNumber: formData.unitNumber,
        amount: amountPaid,
        paymentMonth: new Date(formData.paymentMonth),
        paymentDate: new Date(formData.paymentDate),
        paymentMethod: formData.paymentMethod,
        status,
        balance,
        notes: formData.notes,
      };

      await onSubmit(paymentData);
      onClose();
    } catch (error) {
      setError("Failed to submit payment");
      console.error("Error submitting payment:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Record Payment</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <select
              required
              className="w-full p-2 border rounded-lg"
              value={formData.unitNumber}
              onChange={handleUnitChange}
            >
              <option value="">Select Unit</option>
              {occupiedUnits.map((unit) => {
                const tenant = tenants.find(
                  (t) => t.unitNumber === unit.unitNumber
                );
                return (
                  <option key={unit.unitNumber} value={unit.unitNumber}>
                    Unit {unit.unitNumber} {tenant ? `- ${tenant.name}` : ""}{" "}
                    (Rent: ${unit.monthlyRent})
                  </option>
                );
              })}
            </select>
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

          {/* Payment Summary */}
          {selectedUnit && formData.amount && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-medium text-sm mb-2">Payment Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Monthly Rent:</span>
                <span className="font-medium">
                  ${selectedUnit.monthlyRent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-medium">
                  ${parseFloat(formData.amount).toLocaleString()}
                </span>
              </div>
              {paymentDetails.balance > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Balance:</span>
                  <span className="font-medium">
                    ${paymentDetails.balance.toLocaleString()}
                  </span>
                </div>
              )}
              {paymentDetails.balance < 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Overpayment:</span>
                  <span className="font-medium">
                    ${Math.abs(paymentDetails.balance).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium border-t border-gray-200 pt-2 mt-2">
                <span>Status:</span>
                <span
                  className={`
                  ${
                    paymentDetails.status === "FULL"
                      ? "text-green-600"
                      : paymentDetails.status === "PARTIAL"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }
                `}
                >
                  {paymentDetails.status === "FULL"
                    ? "Paid in Full"
                    : paymentDetails.status === "PARTIAL"
                    ? "Partial Payment"
                    : "Overpaid"}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
