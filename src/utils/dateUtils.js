// Date utilities for timesheet application

/**
 * Get the week number of the month for a given date
 * Week 1 starts on the 1st of the month, Week 2 on the 8th, etc.
 * @param {Date|string} date - The date to check
 * @returns {Object} - Week information with week number, start date, and end date
 */
export const getWeekOfMonth = (date) => {
  const inputDate = new Date(date);
  
  // Ensure we're working with the correct date by setting time to noon to avoid timezone issues
  const normalizedDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 12, 0, 0, 0);
  
  // Get the last day of the month
  const lastDayOfMonth = new Date(normalizedDate.getFullYear(), normalizedDate.getMonth() + 1, 0);
  
  // Get the day of the month (1-31)
  const dayOfMonth = normalizedDate.getDate();
  
  // Calculate which week the date falls into
  // Week 1: days 1-7, Week 2: days 8-14, Week 3: days 15-21, Week 4: days 22-28, Week 5: days 29+
  const weekNumber = Math.ceil(dayOfMonth / 7);
  
  // Calculate start date of the week
  const weekStartDay = (weekNumber - 1) * 7 + 1;
  const weekStartDate = new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), weekStartDay, 12, 0, 0, 0);
  
  // Calculate end date of the week (7 days later or end of month)
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

/**
 * Get all weeks of a specific month
 * Each week starts on the 1st, 8th, 15th, 22nd, 29th of the month
 * @param {number} year - The year
 * @param {number} month - The month (0-11, where 0 is January)
 * @returns {Array} - Array of week objects for the entire month
 */
export const getAllWeeksOfMonth = (year, month) => {
  const weeks = [];
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  
  let weekNumber = 1;
  let startDay = 1;
  
  while (startDay <= lastDayOfMonth) {
    const endDay = Math.min(startDay + 6, lastDayOfMonth);
    
    // Use noon time to avoid timezone issues
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

/**
 * Get the current week information
 * @returns {Object} - Current week information
 */
export const getCurrentWeek = () => {
  return getWeekOfMonth(new Date());
};

/**
 * Get week information for a specific date string
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Object} - Week information
 */
export const getWeekForDate = (dateString) => {
  // Use the same date parsing logic as getWeekFromDatePicker to avoid timezone issues
  let date;
  
  if (typeof dateString === 'string' && dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
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

/**
 * Get week information from a date picker selection
 * Handles Date objects, date strings, or any date format from date picker components
 * @param {Date|string|any} selectedDate - Selected date from date picker
 * @returns {Object} - Week information with weekNumber, startDate, endDate
 */
export const getWeekFromDatePicker = (selectedDate) => {
  // Handle different date formats that might come from date pickers
  let date;
  
  if (!selectedDate) {
    // If no date selected, use current date
    date = new Date();
  } else if (selectedDate instanceof Date) {
    // If it's already a Date object, create a new date at noon to avoid timezone issues
    date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 12, 0, 0, 0);
  } else if (typeof selectedDate === 'string') {
    // If it's a string, parse it carefully to avoid timezone issues
    if (selectedDate.includes('T') || selectedDate.includes(' ')) {
      // If it already has time info, use it directly
      date = new Date(selectedDate);
    } else {
      // If it's just a date string (YYYY-MM-DD), parse it as local date
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
        const day = parseInt(parts[2], 10);
        date = new Date(year, month, day, 12, 0, 0, 0);
      } else {
        // Fallback to regular parsing
        date = new Date(selectedDate);
      }
    }
  } else if (selectedDate.getTime && typeof selectedDate.getTime === 'function') {
    // If it has getTime method (like moment.js or other date libraries)
    const timestamp = selectedDate.getTime();
    date = new Date(timestamp);
    // Normalize to noon to avoid timezone issues
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
  } else {
    // Try to convert to string first, then to Date
    date = new Date(String(selectedDate));
  }
  
  // Validate the date
  if (isNaN(date.getTime())) {
    console.warn('Invalid date provided to getWeekFromDatePicker:', selectedDate);
    date = new Date(); // Fallback to current date
  }
  
  // Ensure we're working with a normalized date (noon time to avoid timezone issues)
  if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
  }
  
  return getWeekOfMonth(date);
};

/**
 * Format date object to YYYY-MM-DD string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
export const formatDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date for display
 */
export const formatDisplayDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get week range string for display
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {string} - Formatted week range
 */
export const formatWeekRange = (startDate, endDate) => {
  // Parse dates carefully to avoid timezone issues
  const parseDate = (dateString) => {
    if (typeof dateString === 'string' && dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
        const day = parseInt(parts[2], 10);
        return new Date(year, month, day, 12, 0, 0, 0);
      }
    }
    return new Date(dateString);
  };
  
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    // Same month and year
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.getDate()}, ${end.getFullYear()}`;
  } else {
    // Different months or years
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
};

/**
 * Check if two dates are in the same week
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} - True if dates are in the same week
 */
export const areDatesInSameWeek = (date1, date2) => {
  const week1 = getWeekOfMonth(date1);
  const week2 = getWeekOfMonth(date2);
  
  return week1.startDate === week2.startDate && week1.endDate === week2.endDate;
};

/**
 * Get the Monday of the week for a given date
 * @param {Date|string} date - The date
 * @returns {Date} - Monday of that week
 */
export const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

/**
 * Get the Sunday of the week for a given date
 * @param {Date|string} date - The date
 * @returns {Date} - Sunday of that week
 */
export const getSunday = (date) => {
  const monday = getMonday(date);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return sunday;
};

/**
 * Generate week options for dropdown
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {Array} - Array of week options for dropdown
 */
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

/**
 * Get timesheet period suggestions based on current date
 * @returns {Array} - Array of suggested periods
 */
export const getTimesheetPeriodSuggestions = () => {
  const now = new Date();
  const currentWeek = getCurrentWeek();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Get all weeks of current month
  const currentMonthWeeks = getAllWeeksOfMonth(currentYear, currentMonth);
  
  // Get previous month weeks if we're early in the month
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
  
  // Add other weeks from current month
  currentMonthWeeks.forEach(week => {
    if (week.startDate !== currentWeek.startDate) {
      suggestions.push({
        label: `Week ${week.weekNumber} - ${formatWeekRange(week.startDate, week.endDate)}`,
        value: week,
        isCurrent: false
      });
    }
  });
  
  // Add some weeks from previous month
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
