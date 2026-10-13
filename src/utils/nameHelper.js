// Helper function to format full names and filter out "NA" variations

/**
 * Check if a middle name is considered "NA" (not applicable)
 * @param {string} middleName - The middle name to check
 * @returns {boolean} - True if the middle name should be hidden
 */
export const isMiddleNameNA = (middleName) => {
  if (!middleName) return true;
  
  const cleaned = middleName.trim().toUpperCase().replace(/[\s.-]/g, '');
  const naVariations = ['NA', 'N/A', 'NONE', 'NOTAPPLICABLE', 'NULL'];
  
  return naVariations.includes(cleaned);
};

/**
 * Format a full name with suffix, excluding middle name if it's "NA"
 * @param {string} firstName - First name
 * @param {string} middleName - Middle name (optional)
 * @param {string} lastName - Last name
 * @param {string} suffix - Name suffix (optional, e.g., Jr., Sr., II, III)
 * @returns {string} - Formatted full name with suffix
 */
export const formatFullName = (firstName, middleName, lastName, suffix = '') => {
  const parts = [firstName];
  
  // Only include middle name if it's not "NA"
  if (middleName && !isMiddleNameNA(middleName)) {
    parts.push(middleName);
  }
  
  parts.push(lastName);
  
  // Add suffix if provided
  if (suffix && suffix.trim()) {
    parts.push(suffix);
  }
  
  return parts.filter(Boolean).join(' ');
};

/**
 * Get display name from user object with suffix
 * @param {object} user - User object with first_name, middle_name, last_name, suffix
 * @returns {string} - Formatted display name with suffix
 */
export const getUserDisplayName = (user) => {
  if (!user) return '';
  
  return formatFullName(
    user.first_name || '',
    user.middle_name || '',
    user.last_name || '',
    user.suffix || ''
  );
};
