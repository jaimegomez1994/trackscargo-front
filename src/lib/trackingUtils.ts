/**
 * Frontend utility functions for tracking numbers
 */

/**
 * Generate organization initials from organization name
 * This should match the backend logic exactly
 */
export function generateOrgInitials(organizationName: string): string {
  if (!organizationName || organizationName.trim().length === 0) {
    return '';
  }

  // Clean the organization name and split into words
  const words = organizationName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z\s]/g, '') // Remove non-alphabetic characters except spaces
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 0); // Remove empty strings

  if (words.length === 0) {
    return '';
  }

  // Generate initials
  let initials = '';
  
  if (words.length === 1) {
    // Single word: take first 2-3 characters
    const word = words[0];
    initials = word.length >= 3 ? word.substring(0, 3) : word;
  } else if (words.length === 2) {
    // Two words: take first letter of each
    initials = words[0][0] + words[1][0];
  } else {
    // Three or more words: take first letter of each, max 4 characters
    initials = words.map(word => word[0]).join('').substring(0, 4);
  }

  return initials;
}

/**
 * Generate a preview of what the full tracking number will look like
 */
export function generateTrackingNumberPreview(organizationName: string, userInput: string): string {
  const initials = generateOrgInitials(organizationName);
  const cleanInput = userInput.trim();
  
  if (!initials) {
    return cleanInput || '';
  }
  
  if (!cleanInput) {
    return `${initials}-`;
  }

  return `${initials}-${cleanInput}`;
}

/**
 * Parse a prefixed tracking number back to its components
 */
export function parseTrackingNumber(fullTrackingNumber: string): {
  orgInitials: string;
  userInput: string;
} {
  const parts = fullTrackingNumber.split('-');
  
  if (parts.length < 2) {
    return {
      orgInitials: '',
      userInput: fullTrackingNumber
    };
  }

  return {
    orgInitials: parts[0],
    userInput: parts.slice(1).join('-') // In case user input contains dashes
  };
}