const getColors = require('get-image-colors');
const tinycolor = require('tinycolor2');
const path = require('path');

/**
 * Extract dominant color from an uploaded clothing image
 * @param {string} imagePath - Full path to the image file
 * @returns {Promise<{hex: string, family: string, rgb: object}>}
 */
async function extractDominantColor(imagePath) {
    try {
        const colors = await getColors(imagePath, 'image/jpeg');
        const dominantColor = colors[0]; // Get the most dominant color

        const hex = dominantColor.hex();
        const rgb = dominantColor.rgb();
        const colorFamily = classifyColorFamily(hex);

        return {
            hex,
            rgb: { r: Math.round(rgb[0]), g: Math.round(rgb[1]), b: Math.round(rgb[2]) },
            family: colorFamily
        };
    } catch (error) {
        console.error('Error extracting color:', error);
        // Return default neutral if error
        return {
            hex: '#808080',
            rgb: { r: 128, g: 128, b: 128 },
            family: 'Neutrals'
        };
    }
}

/**
 * Classify a hex color into a color family
 * @param {string} hexColor - Hex color code (e.g., "#FF5733")
 * @returns {string} Color family name
 */
function classifyColorFamily(hexColor) {
    const color = tinycolor(hexColor);
    const hsl = color.toHsl();
    const hsv = color.toHsv();

    // Check if it's a neutral color (low saturation)
    if (isNeutral(hexColor)) {
        return 'Neutrals';
    }

    // Check based on saturation and lightness
    if (hsl.l > 0.85) {
        return 'Pastels';
    }

    if (hsl.l < 0.25 && hsl.s > 0.5) {
        return 'Jewel Tones';
    }

    if (hsl.s > 0.8 && hsl.l > 0.5) {
        return 'Neons';
    }

    // Earth tones: browns, tans, olives
    if ((hsl.h >= 20 && hsl.h <= 50) || (hsl.h >= 60 && hsl.h <= 90)) {
        if (hsl.s < 0.6 && hsl.l < 0.6) {
            return 'Earth Tones';
        }
    }

    // Default to color-based family
    if (hsl.h >= 0 && hsl.h < 30) return 'Warm Tones';
    if (hsl.h >= 30 && hsl.h < 90) return 'Earth Tones';
    if (hsl.h >= 90 && hsl.h < 165) return 'Cool Tones';
    if (hsl.h >= 165 && hsl.h < 260) return 'Cool Tones';
    if (hsl.h >= 260 && hsl.h < 330) return 'Jewel Tones';
    return 'Warm Tones';
}

/**
 * Check if a color is neutral
 * @param {string} hexColor - Hex color code
 * @returns {boolean}
 */
function isNeutral(hexColor) {
    const NEUTRAL_COLORS = [
        '#000000', '#FFFFFF', '#F5F5DC', '#808080', '#696969',
        '#A9A9A9', '#D3D3D3', '#DCDCDC', '#C0C0C0', '#000080',
        '#F5F5F0', '#E8E4DC', '#D4D0C8', '#A39B8B', '#3D3D3D', '#1A1A1A'
    ];

    // Check exact matches
    if (NEUTRAL_COLORS.includes(hexColor.toUpperCase())) {
        return true;
    }

    // Check saturation - neutral colors have very low saturation
    const color = tinycolor(hexColor);
    const hsl = color.toHsl();

    return hsl.s < 0.15; // Less than 15% saturation = neutral
}

/**
 * Convert RGB to Hex
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color code
 */
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

module.exports = {
    extractDominantColor,
    classifyColorFamily,
    isNeutral,
    rgbToHex
};
