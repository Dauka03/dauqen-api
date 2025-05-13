import { format, addDays, addHours, addMinutes, differenceInMinutes, isAfter, isBefore, parseISO } from 'date-fns';

// Function to format date
export const formatDate = (date: Date | string, formatStr: string = 'yyyy-MM-dd'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

// Function to format time
export const formatTime = (date: Date | string, formatStr: string = 'HH:mm'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

// Function to format date and time
export const formatDateTime = (date: Date | string, formatStr: string = 'yyyy-MM-dd HH:mm'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

// Function to add days to a date
export const addDaysToDate = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addDays(dateObj, days);
};

// Function to add hours to a date
export const addHoursToDate = (date: Date | string, hours: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addHours(dateObj, hours);
};

// Function to add minutes to a date
export const addMinutesToDate = (date: Date | string, minutes: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addMinutes(dateObj, minutes);
};

// Function to calculate time difference in minutes
export const getTimeDifferenceInMinutes = (date1: Date | string, date2: Date | string): number => {
  const dateObj1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const dateObj2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return differenceInMinutes(dateObj2, dateObj1);
};

// Function to check if a date is after another date
export const isDateAfter = (date1: Date | string, date2: Date | string): boolean => {
  const dateObj1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const dateObj2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isAfter(dateObj1, dateObj2);
};

// Function to check if a date is before another date
export const isDateBefore = (date1: Date | string, date2: Date | string): boolean => {
  const dateObj1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const dateObj2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isBefore(dateObj1, dateObj2);
};

// Function to get current date
export const getCurrentDate = (): Date => {
  return new Date();
};

// Function to get current date string
export const getCurrentDateString = (formatStr: string = 'yyyy-MM-dd'): string => {
  return formatDate(getCurrentDate(), formatStr);
};

// Function to get current time string
export const getCurrentTimeString = (formatStr: string = 'HH:mm'): string => {
  return formatTime(getCurrentDate(), formatStr);
};

// Function to get current date and time string
export const getCurrentDateTimeString = (formatStr: string = 'yyyy-MM-dd HH:mm'): string => {
  return formatDateTime(getCurrentDate(), formatStr);
};

// Function to check if a date is valid
export const isValidDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Function to get start of day
export const getStartOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return new Date(dateObj.setHours(0, 0, 0, 0));
};

// Function to get end of day
export const getEndOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return new Date(dateObj.setHours(23, 59, 59, 999));
};

// Function to get start of week
export const getStartOfWeek = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const day = dateObj.getDay();
  const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(dateObj.setDate(diff));
};

// Function to get end of week
export const getEndOfWeek = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const day = dateObj.getDay();
  const diff = dateObj.getDate() - day + (day === 0 ? 0 : 7);
  return new Date(dateObj.setDate(diff));
};

// Function to get start of month
export const getStartOfMonth = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
};

// Function to get end of month
export const getEndOfMonth = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
};

// Function to get age from birth date
export const getAge = (birthDate: Date | string): number => {
  const birthDateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  return age;
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  addDaysToDate,
  addHoursToDate,
  addMinutesToDate,
  getTimeDifferenceInMinutes,
  isDateAfter,
  isDateBefore,
  getCurrentDate,
  getCurrentDateString,
  getCurrentTimeString,
  getCurrentDateTimeString,
  isValidDate,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  getAge,
}; 