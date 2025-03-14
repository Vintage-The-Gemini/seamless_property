// Date formatting and manipulation utilities
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  export const getMonthYear = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };
  
  export const getMonthRange = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  };
  
  export const isWithinDateRange = (date, start, end) => {
    const checkDate = new Date(date);
    return checkDate >= start && checkDate <= end;
  };
  
  export const addMonths = (date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  };
  
  export const getPreviousMonths = (count) => {
    const months = [];
    const today = new Date();
    
    for (let i = 0; i < count; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date);
    }
    
    return months;
  };