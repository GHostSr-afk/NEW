const tinycolor = require('tinycolor2');

/**
 * Color Theory Rules for Fashion Matrix
 */

const NEUTRAL_COLORS = [
    '#000000', '#FFFFFF', '#F5F5DC', '#808080', '#000080',
    '#F5F5F0', '#E8E4DC', '#D4D0C8', '#A39B8B', '#3D3D3D', '#1A1A1A'
];

/**
 * Check if two colors are complementary (opposite on color wheel)
 * @param {string} hex1 - First color hex code
 * @param {string} hex2 - Second color hex code
 * @returns {boolean}
 */
function isComplementary(hex1, hex2) {
    const color1 = tinycolor(hex1);
    const color2 = tinycolor(hex2);

    const hue1 = color1.toHsl().h;
    const hue2 = color2.toHsl().h;

    const hueDiff = Math.abs(hue1 - hue2);

    // Complementary colors are 150-210 degrees apart on color wheel
    return (hueDiff >= 150 && hueDiff <= 210) || (hueDiff >= 330 || hueDiff <= 30);
}

/**
 * Check if two colors are analogous (adjacent on color wheel)
 * @param {string} hex1 - First color hex code
 * @param {string} hex2 - Second color hex code
 * @returns {boolean}
 */
function isAnalogous(hex1, hex2) {
    const color1 = tinycolor(hex1);
    const color2 = tinycolor(hex2);

    const hue1 = color1.toHsl().h;
    const hue2 = color2.toHsl().h;

    const hueDiff = Math.abs(hue1 - hue2);

    // Analogous colors are within 60 degrees
    return hueDiff <= 60 || hueDiff >= 300;
}

/**
 * Check if outfit uses monochromatic color scheme
 * @param {Array<string>} hexColors - Array of hex color codes
 * @returns {boolean}
 */
function isMonochromatic(hexColors) {
    if (hexColors.length < 2) return false;

    const baseHue = tinycolor(hexColors[0]).toHsl().h;

    // All colors should have similar hue (within 15 degrees)
    return hexColors.every(hex => {
        const hue = tinycolor(hex).toHsl().h;
        return Math.abs(hue - baseHue) <= 15;
    });
}

/**
 * Check if outfit has at least one neutral anchor color
 * @param {Array<string>} hexColors - Array of hex color codes
 * @returns {boolean}
 */
function hasNeutralAnchor(hexColors) {
    return hexColors.some(hex => {
        const color = tinycolor(hex);
        const hsl = color.toHsl();

        // Check if it's in predefined neutrals or has low saturation
        return NEUTRAL_COLORS.includes(hex.toUpperCase()) || hsl.s < 0.15;
    });
}

/**
 * Silhouette Compatibility Matrix
 * Defines which bottom silhouettes work with which top silhouettes
 */
const SILHOUETTE_COMPATIBILITY = {
    'Oversized': ['Slim', 'Structured', 'Fitted'],
    'Fitted': ['Loose', 'Wide', 'Oversized', 'Structured'],
    'Loose': ['Fitted', 'Slim', 'Structured'],
    'Structured': ['Slim', 'Fitted', 'Loose', 'Oversized'],
    'Slim': ['Oversized', 'Loose', 'Structured']
};

/**
 * Check if top and bottom silhouettes are balanced
 * @param {string} topSilhouette - Top garment silhouette
 * @param {string} bottomSilhouette - Bottom garment silhouette
 * @returns {boolean}
 */
function isBalancedSilhouette(topSilhouette, bottomSilhouette) {
    if (!topSilhouette || !bottomSilhouette) return true; // Allow if not specified

    const compatibleBottoms = SILHOUETTE_COMPATIBILITY[topSilhouette];
    if (!compatibleBottoms) return true; // Unknown silhouette, allow it

    return compatibleBottoms.includes(bottomSilhouette);
}

/**
 * Seasonal Constraints
 */

/**
 * Filter items appropriate for summer
 * @param {object} item - Clothing item with seasonality_score
 * @returns {boolean}
 */
function isSummerAppropriate(item) {
    return item.seasonality_score <= 6 || item.season === 'Summer' || item.season === 'All';
}

/**
 * Filter items appropriate for winter
 * @param {object} item - Clothing item with seasonality_score
 * @returns {boolean}
 */
function isWinterAppropriate(item) {
    return item.seasonality_score >= 4 || item.season === 'Winter' || item.season === 'All';
}

/**
 * Determine color harmony type for an outfit
 * @param {Array<string>} hexColors - Array of hex color codes
 * @returns {string} Harmony type name
 */
function getColorHarmonyType(hexColors) {
    if (hexColors.length < 2) return 'Single Color';

    if (isMonochromatic(hexColors)) return 'Monochromatic';

    // Check if any pair  is complementary
    for (let i = 0; i < hexColors.length; i++) {
        for (let j = i + 1; j < hexColors.length; j++) {
            if (isComplementary(hexColors[i], hexColors[j])) {
                return 'Complementary';
            }
        }
    }

    // Check if colors are analogous
    let allAnalogous = true;
    for (let i = 0; i < hexColors.length - 1; i++) {
        if (!isAnalogous(hexColors[i], hexColors[i + 1])) {
            allAnalogous = false;
            break;
        }
    }

    if (allAnalogous) return 'Analogous';

    return 'Mixed';
}

module.exports = {
    isComplementary,
    isAnalogous,
    isMonochromatic,
    hasNeutralAnchor,
    isBalancedSilhouette,
    isSummerAppropriate,
    isWinterAppropriate,
    getColorHarmonyType,
    SILHOUETTE_COMPATIBILITY
};
