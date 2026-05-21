// Utility to calculate days left for a student in a program
// duration: number of months (can be fractional)
// enrollmentDate: ISO string or Date
export function calculateDaysLeft(enrollmentDate: string | Date, duration: number): number {
  if (!enrollmentDate || !duration) return 0;
  const start = new Date(enrollmentDate);
  const now = new Date();
  // Calculate expiry date
  const expiry = new Date(start);
  const wholeMonths = Math.floor(duration);
  expiry.setMonth(expiry.getMonth() + wholeMonths);
  const fractionalMonths = duration - wholeMonths;
  if (fractionalMonths > 0) {
    // 1 month = 30 days for fractional part
    expiry.setDate(expiry.getDate() + Math.round(fractionalMonths * 30));
  }
  // Days left
  const msLeft = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
}
