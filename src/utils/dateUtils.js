import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

// Extend plugins once - this ensures consistency across the entire app
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

/**
 * Parse a date string to UTC dayjs object
 * @param {string|Date|dayjs.Dayjs} date - Date to parse
 * @returns {dayjs.Dayjs} UTC dayjs object
 */
export const parseDate = (date) => {
  return dayjs(date).utc()
}

/**
 * Check if a date is within a period (inclusive)
 * @param {string|Date|dayjs.Dayjs} date - Date to check
 * @param {dayjs.Dayjs} startDate - Start date of period
 * @param {dayjs.Dayjs} endDate - End date of period
 * @returns {boolean} True if date is within period
 */
export const isInPeriod = (date, startDate, endDate) => {
  const parsedDate = parseDate(date)
  const inPeriod = parsedDate.isSameOrAfter(startDate, 'day') &&
                   parsedDate.isSameOrBefore(endDate, 'day')

  return inPeriod
}

/**
 * Check if a date is before or equal to another date
 * @param {string|Date|dayjs.Dayjs} date - Date to check
 * @param {dayjs.Dayjs} endDate - End date
 * @returns {boolean} True if date is before or equal to end date
 */
export const isBeforeOrEqual = (date, endDate) => {
  const parsedDate = parseDate(date)
  return parsedDate.isSameOrBefore(endDate, 'day')
}

/**
 * Get start of day in UTC
 * @param {string|Date|dayjs.Dayjs} date - Date to get start of day for
 * @returns {dayjs.Dayjs} Start of day in UTC
 */
export const startOfDay = (date) => {
  return parseDate(date).startOf('day')
}

/**
 * Get end of day in UTC
 * @param {string|Date|dayjs.Dayjs} date - Date to get end of day for
 * @returns {dayjs.Dayjs} End of day in UTC
 */
export const endOfDay = (date) => {
  return parseDate(date).endOf('day')
}

/**
 * Format a date consistently across the app
 * @param {string|Date|dayjs.Dayjs} date - Date to format
 * @param {string} format - Format string (default: 'MMM DD, YYYY')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return ''
  return parseDate(date).format(format)
}

/**
 * Format a date range as a string
 * @param {dayjs.Dayjs} start - Start date
 * @param {dayjs.Dayjs} end - End date
 * @returns {string} Formatted date range string
 */
export const formatDateRange = (start, end) => {
  return `${start.format('MMM D')} – ${end.format('MMM D')}`
}

/**
 * Get current time in UTC
 * @returns {dayjs.Dayjs} Current time in UTC
 */
export const now = () => {
  return dayjs().utc()
}

/**
 * Get week range for a specific date
 * @param {string|Date|dayjs.Dayjs} date - Date to get week range for
 * @returns {Object} Object containing start and end dates as dayjs objects
 */
export const getWeekRange = (date) => {
  const parsedDate = parseDate(date)
  return {
    start: parsedDate.startOf('week'),
    end: parsedDate.endOf('week')
  }
}

/**
 * Get date range for a specific time period
 * @param {string} timeFilter - Time filter ('week', 'month', 'year')
 * @param {number} offset - Period offset (0 = current, 1 = previous, etc.)
 * @returns {Object} Object containing start and end dates as dayjs objects
 */
export const getDateRange = (timeFilter, offset = 0) => {
  const currentTime = now()
  
  let start, end
  
  switch (timeFilter) {
    case 'week':
      // Use calendar weeks like dashboard display
      const targetWeek = currentTime.subtract(7 * offset, 'day')
      start = targetWeek.startOf('week')
      end = targetWeek.endOf('week')
      break
    case 'month':
      // Use calendar months
      const targetMonth = currentTime.subtract(1 * offset, 'month')
      start = targetMonth.startOf('month')
      end = targetMonth.endOf('month')
      break
    case 'year':
      // Use calendar years
      const targetYear = currentTime.subtract(1 * offset, 'year')
      start = targetYear.startOf('year')
      end = targetYear.endOf('year')
      break
    default:
      // Default to calendar week
      const defaultWeek = currentTime.subtract(7 * offset, 'day')
      start = defaultWeek.startOf('week')
      end = defaultWeek.endOf('week')
  }

  return { start, end }
} 