
// Payment Status Calculations
export const calculatePaymentStatus = (amountPaid, monthlyRent) => {
  if (amountPaid >= monthlyRent) {
    return amountPaid > monthlyRent ? 'OVERPAID' : 'PAID';
  }
  return 'PARTIAL';
};

export const calculateBalance = (amountPaid, monthlyRent) => {
  const difference = monthlyRent - amountPaid;
  return difference > 0 ? difference : 0;
};

export const calculateOverpayment = (amountPaid, monthlyRent) => {
  const difference = amountPaid - monthlyRent;
  return difference > 0 ? difference : 0;
};

// Monthly Statistics
export const calculateMonthlyStats = (payments, monthlyRent) => {
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const balance = calculateBalance(totalPaid, monthlyRent);
  const overpayment = calculateOverpayment(totalPaid, monthlyRent);
  
  return {
    totalPaid,
    balance,
    overpayment,
    status: calculatePaymentStatus(totalPaid, monthlyRent)
  };
};

// Property Level Calculations
export const calculatePropertyStats = (property, payments) => {
  const totalUnits = property.floors.reduce((acc, floor) => 
    acc + floor.units.length, 0);
  
  const occupiedUnits = property.floors.reduce((acc, floor) => 
    acc + floor.units.filter(unit => unit.isOccupied).length, 0);
  
  const totalRent = property.floors.reduce((acc, floor) => 
    acc + floor.units.reduce((sum, unit) => 
      unit.isOccupied ? sum + unit.monthlyRent : sum, 0), 0);
  
  const totalCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return {
    totalUnits,
    occupiedUnits,
    vacantUnits: totalUnits - occupiedUnits,
    occupancyRate: Math.round((occupiedUnits / totalUnits) * 100),
    totalRent,
    totalCollected,
    outstanding: totalRent - totalCollected,
    collectionRate: Math.round((totalCollected / totalRent) * 100)
  };
};

// Historical Calculations
export const calculateHistoricalStats = (payments, startDate, endDate) => {
  const filteredPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.paymentDate);
    return paymentDate >= startDate && paymentDate <= endDate;
  });

  const monthlyBreakdown = filteredPayments.reduce((acc, payment) => {
    const month = new Date(payment.paymentDate).toLocaleString('default', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    if (!acc[month]) {
      acc[month] = {
        total: 0,
        count: 0,
        payments: []
      };
    }
    
    acc[month].total += payment.amount;
    acc[month].count += 1;
    acc[month].payments.push(payment);
    
    return acc;
  }, {});

  return {
    totalCollected: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
    paymentCount: filteredPayments.length,
    monthlyBreakdown
  };
};

// Annual Reports
export const calculateAnnualReport = (property, payments, year) => {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  const yearStats = calculateHistoricalStats(payments, yearStart, yearEnd);
  const monthlyStats = Array.from({ length: 12 }, (_, month) => {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    return calculateHistoricalStats(payments, monthStart, monthEnd);
  });

  return {
    year,
    ...yearStats,
    monthlyBreakdown: monthlyStats,
    averageMonthlyCollection: yearStats.totalCollected / 12
  };
};

// Payment Tracking
export const trackPaymentHistory = (payments, unitNumber) => {
  return payments
    .filter(payment => payment.unitNumber === unitNumber)
    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
    .map(payment => ({
      ...payment,
      month: new Date(payment.paymentDate).toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
      })
    }));
};
