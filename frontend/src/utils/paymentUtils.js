// Payment calculation utilities
export const calculatePaymentStatus = (amountPaid, monthlyRent) => {
    if (amountPaid >= monthlyRent) {
      return amountPaid > monthlyRent ? 'OVERPAID' : 'PAID';
    }
    return 'PARTIAL';
  };
  
  export const calculateBalance = (amountPaid, monthlyRent) => {
    return monthlyRent - amountPaid;
  };
  
  export const calculateOverpayment = (amountPaid, monthlyRent) => {
    return amountPaid > monthlyRent ? amountPaid - monthlyRent : 0;
  };
  
  export const calculateMonthlyStats = (payments, totalRent) => {
    const totalCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const outstanding = Math.max(0, totalRent - totalCollected);
    const collectionRate = (totalCollected / totalRent) * 100;
    
    return {
      totalCollected,
      outstanding,
      collectionRate: Math.round(collectionRate)
    };
  };
  
  export const aggregatePaymentsByMonth = (payments) => {
    return payments.reduce((acc, payment) => {
      const monthYear = getMonthYear(payment.paymentDate);
      if (!acc[monthYear]) {
        acc[monthYear] = {
          total: 0,
          count: 0,
          payments: []
        };
      }
      acc[monthYear].total += payment.amount;
      acc[monthYear].count += 1;
      acc[monthYear].payments.push(payment);
      return acc;
    }, {});
  };
  
  export const calculateAnnualStats = (payments, year) => {
    const yearPayments = payments.filter(payment => 
      new Date(payment.paymentDate).getFullYear() === year
    );
  
    const monthlyStats = Array(12).fill(0).map((_, month) => {
      const monthPayments = yearPayments.filter(payment => 
        new Date(payment.paymentDate).getMonth() === month
      );
  
      return {
        month: new Date(year, month).toLocaleString('default', { month: 'long' }),
        revenue: monthPayments.reduce((sum, payment) => sum + payment.amount, 0),
        count: monthPayments.length
      };
    });
  
    const totalRevenue = monthlyStats.reduce((sum, month) => sum + month.revenue, 0);
    const totalPayments = monthlyStats.reduce((sum, month) => sum + month.count, 0);
  
    return {
      monthlyStats,
      totalRevenue,
      totalPayments,
      averageMonthlyRevenue: totalRevenue / 12
    };
  };
  
  export const calculatePropertyFinancials = (property, payments, expenses = []) => {
    const totalPotentialRent = property.floors.reduce((acc, floor) => 
      acc + floor.units.reduce((sum, unit) => sum + unit.monthlyRent, 0), 0);
  
    const actualRevenue = payments.reduce((acc, payment) => acc + payment.amount, 0);
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const netIncome = actualRevenue - totalExpenses;
    const occupancyRate = calculateOccupancyRate(property);
    const collectionEfficiency = (actualRevenue / totalPotentialRent) * 100;
  
    return {
      potentialRevenue: totalPotentialRent,
      actualRevenue,
      totalExpenses,
      netIncome,
      occupancyRate,
      collectionEfficiency: Math.round(collectionEfficiency),
      cashFlow: netIncome
    };
  };
  
  const calculateOccupancyRate = (property) => {
    const totalUnits = property.floors.reduce((acc, floor) => 
      acc + floor.units.length, 0);
    
    const occupiedUnits = property.floors.reduce((acc, floor) => 
      acc + floor.units.filter(unit => unit.isOccupied).length, 0);
  
    return Math.round((occupiedUnits / totalUnits) * 100);
  };