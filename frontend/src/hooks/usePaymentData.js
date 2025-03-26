import { useState, useEffect } from "react";
import { fetchPayments, createPayment, deletePayment } from "../utils/api";

export const usePaymentData = (propertyId) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentFilters, setPaymentFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: "all",
  });

  useEffect(() => {
    const loadPayments = async () => {
      if (!propertyId) return;

      try {
        setLoading(true);
        const response = await fetchPayments(propertyId);
        setPayments(response.data?.data || []);
        setError(null);
      } catch (err) {
        console.error("Error loading payments:", err);
        setError("Failed to load payment data");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [propertyId]);

  // Filter payments based on criteria
  const filteredPayments = payments.filter((payment) => {
    // Filter by month and year if applicable
    if (paymentFilters.month && paymentFilters.year) {
      const paymentDate = new Date(payment.paymentDate);
      const paymentMonth = paymentDate.getMonth() + 1;
      const paymentYear = paymentDate.getFullYear();

      if (
        paymentMonth !== paymentFilters.month ||
        paymentYear !== paymentFilters.year
      ) {
        return false;
      }
    }

    // Filter by status if applicable
    if (
      paymentFilters.status !== "all" &&
      payment.status !== paymentFilters.status
    ) {
      return false;
    }

    return true;
  });

  // Payment actions
  const handleAddPayment = async (paymentData) => {
    try {
      const response = await createPayment({
        ...paymentData,
        propertyId,
      });

      // Refresh payments list
      const updatedPayments = [...payments, response.data];
      setPayments(updatedPayments);

      return response.data;
    } catch (error) {
      console.error("Error adding payment:", error);
      throw error;
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await deletePayment(paymentId);

      // Remove deleted payment from list
      const updatedPayments = payments.filter((p) => p._id !== paymentId);
      setPayments(updatedPayments);
    } catch (error) {
      console.error("Error deleting payment:", error);
      throw error;
    }
  };

  return {
    payments: filteredPayments,
    loading,
    error,
    paymentFilters,
    setPaymentFilters,
    handlePaymentActions: {
      addPayment: handleAddPayment,
      deletePayment: handleDeletePayment,
    },
  };
};
