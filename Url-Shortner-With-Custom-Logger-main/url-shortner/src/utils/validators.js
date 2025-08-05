// Validate URL format
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Validate shortcode format (alphanumeric)
export const isValidShortcode = (shortcode) => {
  // Shortcode should be alphanumeric with a reasonable length (e.g., 3-10 chars)
  const regex = /^[a-zA-Z0-9]{3,10}$/;
  return regex.test(shortcode);
};

// Validate validity period (must be a positive integer)
export const isValidValidity = (validity) => {
  if (validity === "") return true; // Allow empty for default value
  const parsedValidity = parseInt(validity, 10);
  return !isNaN(parsedValidity) && parsedValidity > 0;
};

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleString();
};
