import { getMonthRange, isWithinDateRange } from './dateUtils';
import { 
  calculateMonthlyStats, 
  calculatePropertyFinancials 
} from './paymentUtils';

export const generateMonthlyReport = (property, payments, month, year) => {
  const { start, end } = getMonthRange(new Date(year, month - 1));
  const monthlyPayments = payments.filter(payment => 
    isWithinDateRange(payment.paymentDate, start, end)
  );

  const stats = calculateMonthlyStats(monthlyPayments, property.totalRent);
  const financials = calculatePropertyFinancials(property, monthlyPayments);

  return {
    month: start.toLocaleString('default', { month: 'long' }),
    year,
    stats,
    financials,
    payments: monthlyPayments.map(payment => ({
      ...payment,
      tenant: property.tenants.find(t => t._id === payment.tenantId)
    }))
  };
};

export const generateYearlyReport = (property, payments, year) => {
  const yearPayments = payments.filter(payment => 
    new Date(payment.paymentDate).getFullYear() === year
  );

  return {
    year,
    monthlyStats: Array(12).fill(0).map((_, month) => {
      const monthPayments = yearPayments.filter(payment => 
        new Date(payment.paymentDate).getMonth() === month
      );
      return generateMonthlyReport(property, monthPayments, month + 1, year);
    }),
    financials: calculatePropertyFinancials(property, yearPayments)
  };
};