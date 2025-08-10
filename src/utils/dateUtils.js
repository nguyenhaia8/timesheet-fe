 

// ...existing code...
export const getWeekOfMonth = (date) => {
  const inputDate = new Date(date);
  
  
  const normalizedDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 12, 0, 0, 0);
  
  
  const lastDayOfMonth = new Date(normalizedDate.getFullYear(), normalizedDate.getMonth() + 1, 0);
  
  
  const dayOfMonth = normalizedDate.getDate();
  
  
  
  const weekNumber = Math.ceil(dayOfMonth / 7);
  
  
  const weekStartDay = (weekNumber - 1) * 7 + 1;
  const weekStartDate = new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), weekStartDay, 12, 0, 0, 0);
  
  
  const weekEndDay = Math.min(weekNumber * 7, lastDayOfMonth.getDate());
  const weekEndDate = new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), weekEndDay, 12, 0, 0, 0);
  
  return {
    weekNumber,
    startDate: formatDateString(weekStartDate),
    endDate: formatDateString(weekEndDate),
    startDateObj: weekStartDate,
    endDateObj: weekEndDate,
    monthYear: `${normalizedDate.toLocaleDateString('en-US', { month: 'long' })} ${normalizedDate.getFullYear()}`,
    daysInWeek: weekEndDay - weekStartDay + 1
  };
};

// ...existing code...
export const getAllWeeksOfMonth = (year, month) => {
  const weeks = [];
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  
  let weekNumber = 1;
  let startDay = 1;
  
  while (startDay <= lastDayOfMonth) {
    const endDay = Math.min(startDay + 6, lastDayOfMonth);
    
    
    const weekStartDate = new Date(year, month, startDay, 12, 0, 0, 0);
    const weekEndDate = new Date(year, month, endDay, 12, 0, 0, 0);
    
    weeks.push({
      weekNumber,
      startDate: formatDateString(weekStartDate),
      endDate: formatDateString(weekEndDate),
      startDateObj: weekStartDate,
      endDateObj: weekEndDate,
      monthYear: `${weekStartDate.toLocaleDateString('en-US', { month: 'long' })} ${year}`,
      daysInWeek: endDay - startDay + 1
    });
    
    weekNumber++;
    startDay += 7;
  }
  
  return weeks;
};

// ...existing code...
export const getCurrentWeek = () => {
  return getWeekOfMonth(new Date());
};

// ...existing code...
export const getWeekForDate = (dateString) => {
  
  let date;
  
  if (typeof dateString === 'string' && dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      date = new Date(year, month, day, 12, 0, 0, 0);
    } else {
      date = new Date(dateString);
    }
  } else {
    date = new Date(dateString);
  }
  
  return getWeekOfMonth(date);
};

// ...existing code...
export const getWeekFromDatePicker = (selectedDate) => {
  
  let date;
  
  if (!selectedDate) {
    
    date = new Date();
  } else if (selectedDate instanceof Date) {
    
    date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 12, 0, 0, 0);
  } else if (typeof selectedDate === 'string') {
    
    if (selectedDate.includes('T') || selectedDate.includes(' ')) {
      
      date = new Date(selectedDate);
    } else {
      
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        date = new Date(year, month, day, 12, 0, 0, 0);
      } else {
        
        date = new Date(selectedDate);
      }
    }
  } else if (selectedDate.getTime && typeof selectedDate.getTime === 'function') {
    
    const timestamp = selectedDate.getTime();
    date = new Date(timestamp);

    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
  } else {
    
    date = new Date(String(selectedDate));
  }
  
  if (isNaN(date.getTime())) {
    console.warn('Invalid date provided to getWeekFromDatePicker:', selectedDate);
    date = new Date();
  }
  if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
  }
  return getWeekOfMonth(date);
};

// ...existing code...
export const formatDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ...existing code...
export const formatDisplayDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// ...existing code...
export const formatWeekRange = (startDate, endDate) => {
  
  const parseDate = (dateString) => {
    if (typeof dateString === 'string' && dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day, 12, 0, 0, 0);
      }
    }
    return new Date(dateString);
  };
  
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.getDate()}, ${end.getFullYear()}`;
  } else {
    
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
};

// ...existing code...
export const areDatesInSameWeek = (date1, date2) => {
  const week1 = getWeekOfMonth(date1);
  const week2 = getWeekOfMonth(date2);
  
  return week1.startDate === week2.startDate && week1.endDate === week2.endDate;
};

// ...existing code...
export const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// ...existing code...
export const getSunday = (date) => {
  const monday = getMonday(date);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return sunday;
};

// ...existing code...
export const getWeekOptionsForMonth = (year, month) => {
  const weeks = getAllWeeksOfMonth(year, month);
  
  return weeks.map(week => ({
    label: `Week ${week.weekNumber} (${formatWeekRange(week.startDate, week.endDate)})`,
    value: {
      weekNumber: week.weekNumber,
      startDate: week.startDate,
      endDate: week.endDate
    },
    startDate: week.startDate,
    endDate: week.endDate,
    weekNumber: week.weekNumber
  }));
};

// ...existing code...
export const getTimesheetPeriodSuggestions = () => {
  const now = new Date();
  const currentWeek = getCurrentWeek();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  
  const currentMonthWeeks = getAllWeeksOfMonth(currentYear, currentMonth);
  
  
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const previousMonthWeeks = getAllWeeksOfMonth(previousYear, previousMonth);
  
  const suggestions = [
    {
      label: 'Current Week',
      value: currentWeek,
      isCurrent: true
    }
  ];
  
  
  currentMonthWeeks.forEach(week => {
    if (week.startDate !== currentWeek.startDate) {
      suggestions.push({
        label: `Week ${week.weekNumber} - ${formatWeekRange(week.startDate, week.endDate)}`,
        value: week,
        isCurrent: false
      });
    }
  });
  

  previousMonthWeeks.slice(-2).forEach(week => {
    suggestions.push({
      label: `Previous Month - Week ${week.weekNumber} - ${formatWeekRange(week.startDate, week.endDate)}`,
      value: week,
      isCurrent: false,
      isPrevious: true
    });
  });
  
  return suggestions;
};

export default {
  getWeekOfMonth,
  getAllWeeksOfMonth,
  getCurrentWeek,
  getWeekForDate,
  getWeekFromDatePicker,
  formatDateString,
  formatDisplayDate,
  formatWeekRange,
  areDatesInSameWeek,
  getMonday,
  getSunday,
  getWeekOptionsForMonth,
  getTimesheetPeriodSuggestions
};
