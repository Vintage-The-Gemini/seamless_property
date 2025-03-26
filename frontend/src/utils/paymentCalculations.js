// src/utils/paymentCalculations.js

/**
 * Calculate payment status based on amount paid and monthly rent
 *
 * @param {number} amountPaid - Amount paid by the tenant
 * @param {number} monthlyRent - Monthly rent amount for the unit
 * @returns {string} Status of the payment (FULL, PARTIAL, OVERPAID)
 */
export const calculatePaymentStatus = (amountPaid, monthlyRent) => {
  if (amountPaid >= monthlyRent) {
    return amountPaid > monthlyRent ? "OVERPAID" : "FULL";
  }
  return "PARTIAL";
};

/**
 * Calculate the balance due after a payment
 *
 * @param {number} amountPaid - Amount paid by the tenant
 * @param {number} monthlyRent - Monthly rent amount for the unit
 * @returns {number} The balance due (positive) or overpaid amount (negative)
 */
export const calculateBalance = (amountPaid, monthlyRent) => {
  return monthlyRent - amountPaid;
};

/**
 * Process payment and return payment details
 *
 * @param {number} amountPaid - Amount paid by the tenant
 * @param {number} monthlyRent - Monthly rent for the unit
 * @returns {Object} Payment details including status and balance
 */
export const processPayment = (amountPaid, monthlyRent) => {
  const status = calculatePaymentStatus(amountPaid, monthlyRent);
  const balance = calculateBalance(amountPaid, monthlyRent);

  return {
    status,
    balance,
    isFullyPaid: status === "FULL" || status === "OVERPAID",
    hasCredit: status === "OVERPAID",
  };
};

/**
 * Calculate monthly payment statistics
 *
 * @param {Array} payments - Array of payment objects for the month
 * @param {number} totalExpectedRent - Total expected rent for the property
 * @returns {Object} Statistics including collection rate, total collected, etc.
 */
export const calculateMonthlyStats = (payments, totalExpectedRent) => {
  const totalCollected = payments.reduce(
    (acc, payment) => acc + (payment.amount || 0),
    0
  );
  const outstanding = Math.max(0, totalExpectedRent - totalCollected);
  const collectionRate =
    totalExpectedRent > 0 ? (totalCollected / totalExpectedRent) * 100 : 0;

  return {
    totalCollected,
    outstanding,
    collectionRate: Math.round(collectionRate),
    paymentCount: payments.length,
  };
};

/**
 * Get payments for specific month and year
 *
 * @param {Array} payments - Array of all payment objects
 * @param {number} month - Month (0-11)
 * @param {number} year - Year (e.g., 2024)
 * @returns {Array} Filtered payments for the specified month and year
 */
export const getPaymentsForMonth = (payments, month, year) => {
  return payments.filter((payment) => {
    const paymentDate = new Date(payment.paymentDate);
    return (
      paymentDate.getMonth() === month && paymentDate.getFullYear() === year
    );
  });
};

/**
 * Calculate property wide financial overview
 *
 * @param {Object} property - Property object with floors and units
 * @returns {Object} Property financial overview
 */
export const calculatePropertyFinancials = (property) => {
  if (!property || !property.floors) {
    return {
      totalUnits: 0,
      occupiedUnits: 0,
      vacantUnits: 0,
      occupancyRate: 0,
      expectedRent: 0,
    };
  }

  const totalUnits = property.floors.reduce(
    (acc, floor) => acc + floor.units.length,
    0
  );

  const occupiedUnits = property.floors.reduce(
    (acc, floor) => acc + floor.units.filter((unit) => unit.isOccupied).length,
    0
  );

  const vacantUnits = totalUnits - occupiedUnits;

  const occupancyRate =
    totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  const expectedRent = property.floors.reduce(
    (acc, floor) =>
      acc +
      floor.units.reduce(
        (sum, unit) => (unit.isOccupied ? sum + (unit.monthlyRent || 0) : sum),
        0
      ),
    0
  );

  return {
    totalUnits,
    occupiedUnits,
    vacantUnits,
    occupancyRate,
    expectedRent,
  };
};
