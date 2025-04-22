/**
 * Removes the specified character from both the beginning and end of a string
 *
 * @param {string} str - The input string to trim
 * @param {string} ch - The character to remove from both ends
 * @returns {string} The trimmed string
 */
export function trimChar(str: string, ch: string): string {
  let start = 0,
    end = str.length;

  while (start < end && str[start] === ch)
    ++start;

  while (end > start && str[end - 1] === ch)
    --end;

  return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

/**
 * Removes the specified character from the end of a string
 *
 * @param {string} str - The input string to trim
 * @param {string} ch - The character to remove from the end
 * @returns {string} The string with the character removed from the end
 */
export function trimTrailingChar(str: string, ch: string): string {
  let end = str.length;

  while (end > 0 && str[end - 1] === ch)
    --end;

  return (end < str.length) ? str.substring(0, end) : str;
}

/**
 * Removes the specified character from the beginning of a string
 *
 * @param {string} str - The input string to trim
 * @param {string} ch - The character to remove from the beginning
 * @returns {string} The string with the character removed from the beginning
 */
export function trimLeadingChar(str: string, ch: string): string {
  let start = 0;

  while (start < str.length && str[start] === ch)
    ++start;

  return (start > 0) ? str.substring(start, str.length) : str;
}