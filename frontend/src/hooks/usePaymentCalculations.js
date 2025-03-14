export const usePaymentCalculations = (payments = [], property = null) => {
    const calculateStats = () => {
      if (!property || !payments) {
        return {
          expectedRent: 0,
          monthlyCollected: 0,
          outstanding: 0,
          quarterlyCollected: 0,
          annualCollected: 0,
          monthlyPayments: [],
          quarterlyPayments: [],
          annualPayments: []
        };
      }
  
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
  
      // Monthly calculations
      const monthlyPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear;
      });
  
      const monthlyCollected = monthlyPayments.reduce((acc, payment) => 
        acc + payment.amount, 0
      );
  
      // Expected monthly rent (from all occupied units)
      const expectedRent = property.floors?.reduce((acc, floor) => 
        acc + (floor.units?.reduce((sum, unit) => 
          unit.isOccupied ? sum + (unit.monthlyRent || 0) : sum, 0
        ) || 0), 0
      ) || 0;
  
      // Outstanding amount
      const outstanding = expectedRent - monthlyCollected;
  
      // Quarterly calculations
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      const quarterlyPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.getMonth() >= quarterStartMonth && 
               paymentDate.getMonth() < quarterStartMonth + 3 &&
               paymentDate.getFullYear() === currentYear;
      });
  
      const quarterlyCollected = quarterlyPayments.reduce((acc, payment) => 
        acc + payment.amount, 0
      );
  
      // Annual calculations
      const annualPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.getFullYear() === currentYear;
      });
  
      const annualCollected = annualPayments.reduce((acc, payment) => 
        acc + payment.amount, 0
      );
  
      // Calculate collection rates
      const monthlyCollectionRate = expectedRent > 0 
        ? (monthlyCollected / expectedRent) * 100 
        : 0;
  
      const annualExpectedRent = expectedRent * 12;
      const annualCollectionRate = annualExpectedRent > 0 
        ? (annualCollected / annualExpectedRent) * 100 
        : 0;
  
      // Get current quarter
      const currentQuarter = Math.floor(currentMonth / 3) + 1;
  
      // Calculate quarterly expected rent
      const quarterlyExpectedRent = expectedRent * 3;
      const quarterlyCollectionRate = quarterlyExpectedRent > 0 
        ? (quarterlyCollected / quarterlyExpectedRent) * 100 
        : 0;
  
      // Payment trends (last 6 months)
      const lastSixMonths = [];
      for (let i = 0; i < 6; i++) {
        const month = currentMonth - i;
        const year = currentYear + Math.floor(month / 12);
        const adjustedMonth = ((month % 12) + 12) % 12;
  
        const monthPayments = payments.filter(payment => {
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate.getMonth() === adjustedMonth && 
                 paymentDate.getFullYear() === year;
        });
  
        const monthTotal = monthPayments.reduce((acc, payment) => 
          acc + payment.amount, 0
        );
  
        lastSixMonths.unshift({
          month: adjustedMonth,
          year,
          total: monthTotal,
          collectionRate: expectedRent > 0 ? (monthTotal / expectedRent) * 100 : 0
        });
      }
  
      return {
        expectedRent,
        monthlyCollected,
        outstanding,
        quarterlyCollected,
        annualCollected,
        monthlyPayments,
        quarterlyPayments,
        annualPayments,
        monthlyCollectionRate,
        quarterlyCollectionRate,
        annualCollectionRate,
        currentQuarter,
        lastSixMonths,
        paymentTrends: {
          lastSixMonths
        },
        summary: {
          totalUnits: property.floors?.reduce((acc, floor) => 
            acc + (floor.units?.length || 0), 0
          ) || 0,
          occupiedUnits: property.floors?.reduce((acc, floor) => 
            acc + (floor.units?.filter(unit => unit.isOccupied).length || 0), 0
          ) || 0,
          vacantUnits: property.floors?.reduce((acc, floor) => 
            acc + (floor.units?.filter(unit => !unit.isOccupied).length || 0), 0
          ) || 0
        }
      };
    };
  
    return calculateStats();
  };