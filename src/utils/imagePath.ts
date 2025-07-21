/**
 * Utility function to transform image paths for production mode
 * In production, prepends "../" to image paths to account for the /newsite/ base URL
 */
export function getImagePath(imagePath: string): string {
  // Check if we're in production mode
  if (process.env.NODE_ENV === 'production') {
    // In production, prepend "../" to image paths
    return `../${imagePath}`;
  }
  // In development, return the path as-is
  return imagePath;
} 

export function getFilePath(filePath: string): string {
  // Check if we're in production mode
  if (process.env.NODE_ENV === 'production') {
    // In production, prepend "../" to file paths
    return `../${filePath}`;
  }
  // In development, return the path as-is
  return filePath;
} 