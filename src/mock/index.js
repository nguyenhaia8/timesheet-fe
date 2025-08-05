// Main export file for mock database and API
export * from './data';
export * from './api';

// Configuration for mock behavior
export const mockConfig = {
  enableNetworkDelay: true,
  delayMs: 500,
  errorRate: 0.05, // 5% chance of random errors
  enableLogging: true
};

// Enable/disable mock logging
export const setMockLogging = (enabled) => {
  mockConfig.enableLogging = enabled;
};

// Set network delay
export const setMockDelay = (ms) => {
  mockConfig.delayMs = ms;
};

// Set error rate (0-1)
export const setMockErrorRate = (rate) => {
  mockConfig.errorRate = Math.max(0, Math.min(1, rate));
};

// Mock utilities
export const mockUtils = {
  generateId: () => Date.now() + Math.random(),
  formatDate: (date) => new Date(date).toISOString(),
  getCurrentWeekDates: () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    return { startOfWeek, endOfWeek };
  }
};

// Development helper to reset all mock data
export const resetMockData = () => {
  console.warn('Mock data reset - all changes will be lost');
  // This would reload the original data in a real implementation
  window.location.reload();
};
