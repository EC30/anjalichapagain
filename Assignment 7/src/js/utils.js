/**
 * Return a random number between a range
 * @param {number} min 
 * @param {number} max 
 * @returns number
 */
function getRandom(min=0, max=1) {
    // return Math.floor(Math.random() * (max - min + 1) + min);
    return min+Math.random()*(max-min);
}
/**
 * Calculates the Euclidean distance between two points.
 * 
 * @param {number} x1 - The x-coordinate of the first point.
 * @param {number} y1 - The y-coordinate of the first point.
 * @param {number} x2 - The x-coordinate of the second point.
 * @param {number} y2 - The y-coordinate of the second point.
 * @returns {number} The Euclidean distance between the two points.
 */
function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Using the Pythagorean theorem to calculate distance
  return Math.sqrt(dx * dx + dy * dy);
}
/**
 * Generates a random color in hexadecimal format.
 * 
 * @returns {string} A hexadecimal color code
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }