const { extractDominantColor, classifyColorFamily, isNeutral } = require('./colorAnalyzer');
const {
    isComplementary,
    isAnalogous,
    isMonochromatic,
    hasNeutralAnchor,
    isBalancedSilhouette,
    isSummerAppropriate,
    isWinterAppropriate,
    getColorHarmonyType
} = require('../utils/stylingRules');

/**
 * Fashion Matrix Agent - Advanced AI Stylist
 * Generates outfit recommendations based on color theory, silhouette balance, and seasonal rules
 */
class FashionMatrixAgent {

    /**
     * Analyze a single clothing item image
     * @param {string} imagePath - Path to clothing image
     * @param {string} itemName - Name of the item
     * @param {string} category - Item category (Top, Bottom, etc.)
     * @returns {Promise<object>} Analysis results
     */
    async analyzeClothingImage(imagePath, itemName, category) {
        try {
            // Extract color
            const colorData = await extractDominantColor(imagePath);

            // Detect formality based on item name and category
            const formality = this.detectFormality(itemName, category);

            // Classify seasonality
            const seasonalityScore = this.classifySeasonality(category, itemName);

            // Detect garment type
            const detectedType = this.detectGarmentType(itemName, category);

            return {
                color_hex: colorData.hex,
                color_family: colorData.family,
                formality,
                seasonality_score: seasonalityScore,
                detected_type: detectedType,
                analyzed: true
            };
        } catch (error) {
            console.error('Error analyzing clothing image:', error);
            return null;
        }
    }

    /**
     * Detect formality level of a garment
     * @param {string} itemName - Name of the item
     * @param {string} category - Item category
     * @returns {string} Formality level (Casual, Smart-Casual, Formal)
     */
    detectFormality(itemName, category) {
        const name = itemName.toLowerCase();

        // Formal keywords
        if (name.includes('suit') || name.includes('blazer') || name.includes('dress shirt') ||
            name.includes('oxford') || name.includes('tie') || name.includes('formal') ||
            name.includes('tuxedo') || name.includes('evening')) {
            return 'Formal';
        }

        // Smart-casual keywords
        if (name.includes('chinos') || name.includes('polo') || name.includes('loafer') ||
            name.includes('chelsea') || name.includes('button') || name.includes('cardigan') ||
            name.includes('khaki')) {
            return 'Smart-Casual';
        }

        // Default to Casual for most items
        return 'Casual';
    }

    /**
     * Classify seasonality score (0=Summer, 10=Winter)
     * @param {string} category - Item category
     * @param {string} itemName - Item name
     * @returns {number} Seasonality score 0-10
     */
    classifySeasonality(category, itemName) {
        const name = itemName.toLowerCase();

        // Summer materials/items (0-3)
        if (name.includes('linen') || name.includes('cotton') || name.includes('sheer') ||
            name.includes('tank') || name.includes('shorts') || name.includes('sandal') ||
            name.includes('flip') || name.includes('light')) {
            return 2;
        }

        // Winter materials/items (7-10)
        if (name.includes('wool') || name.includes('fleece') || name.includes('leather') ||
            name.includes('coat') || name.includes('jacket') || name.includes('boot') ||
            name.includes('sweater') || name.includes('knit') || name.includes('thermal') ||
            name.includes('puffer') || name.includes('heavy')) {
            return 8;
        }

        // Category-based defaults
        if (category === 'Outerwear') return 7;
        if (category === 'Shoes') return 5;

        // Default: All-season
        return 5;
    }

    /**
     * Detect specific garment type from name
     * @param {string} itemName - Item name
     * @param {string} category - Item category
     * @returns {string} Detected garment type
     */
    detectGarmentType(itemName, category) {
        const name = itemName.toLowerCase();

        // Detect specific types
        if (name.includes('t-shirt') || name.includes('tee')) return 'T-shirt';
        if (name.includes('jeans')) return 'Jeans';
        if (name.includes('chinos')) return 'Chinos';
        if (name.includes('dress') && category === 'Full-body') return 'Dress';
        if (name.includes('sneaker') || name.includes('trainer')) return 'Sneakers';
        if (name.includes('boot')) return 'Boots';
        if (name.includes('blazer')) return 'Blazer';
        if (name.includes('jacket')) return 'Jacket';

        // Return category as default
        return category;
    }

    /**
   * Generate 3 distinct outfit recommendations
   * @param {Array<object>} wardrobe - User's clothing items
   * @param {string} season - "Summer" or "Winter"
   * @returns {object} Outfit recommendations with analysis
   */
    generateOutfits(wardrobe, season = 'Summer') {
        // Filter by season
        const seasonalItems = season === 'Summer'
            ? wardrobe.filter(isSummerAppropriate)
            : wardrobe.filter(isWinterAppropriate);

        // Group by category
        const tops = seasonalItems.filter(item => item.category === 'Top');
        const bottoms = seasonalItems.filter(item => item.category === 'Bottom');
        const fullBody = seasonalItems.filter(item => item.category === 'Full-body');
        const shoes = seasonalItems.filter(item => item.category === 'Shoes');
        const outerwear = seasonalItems.filter(item => item.category === 'Outerwear');

        const recommendations = [];
        const usedCombinations = new Set(); // Track used top+bottom combos

        // Generate "The Safe Bet" outfit
        const safeBet = this.generateSafeBetOutfit(tops, bottoms, fullBody, shoes, outerwear, season, usedCombinations);
        if (safeBet) {
            recommendations.push(safeBet);
            // Mark this combination as used
            if (safeBet.items.top && safeBet.items.bottom) {
                usedCombinations.add(`${safeBet.items.top.id}-${safeBet.items.bottom.id}`);
            }
        }

        // Generate "The Color Pop" outfit - MUST BE DIFFERENT
        const colorPop = this.generateColorPopOutfit(tops, bottoms, fullBody, shoes, outerwear, season, usedCombinations);
        if (colorPop) {
            recommendations.push(colorPop);
            if (colorPop.items.top && colorPop.items.bottom) {
                usedCombinations.add(`${colorPop.items.top.id}-${colorPop.items.bottom.id}`);
            }
        }

        // Generate "The Trend Setter" outfit - MUST BE DIFFERENT FROM BOTH
        const trendSetter = this.generateTrendSetterOutfit(tops, bottoms, fullBody, shoes, outerwear, season, usedCombinations);
        if (trendSetter) {
            recommendations.push(trendSetter);
        }

        // Wardrobe analysis
        const analysis = wardrobe.map(item => ({
            id: `item_${item.id}`,
            detected_name: item.item_name,
            category: item.category,
            color_family: item.color_family || 'Unknown',
            season_suitability: season
        }));

        return {
            analysis,
            recommendations
        };
    }

    /**
   * Generate "Safe Bet" outfit - neutral colors, standard silhouettes
   */
    generateSafeBetOutfit(tops, bottoms, fullBody, shoes, outerwear, season, usedCombinations) {
        // Prefer neutral colors
        const neutralTops = tops.filter(t => t.color_hex && isNeutral(t.color_hex));
        const neutralBottoms = bottoms.filter(b => b.color_hex && isNeutral(b.color_hex));

        let selectedItems = {};
        let reasoning = [];

        // Try neutral combinations first
        let foundUnique = false;
        for (const top of neutralTops) {
            for (const bottom of neutralBottoms) {
                const combo = `${top.id}-${bottom.id}`;
                if (!usedCombinations.has(combo)) {
                    selectedItems.top = top;
                    selectedItems.bottom = bottom;
                    reasoning.push(`Neutral ${top.item_name} pairs safely with ${bottom.item_name}`);
                    foundUnique = true;
                    break;
                }
            }
            if (foundUnique) break;
        }

        // Fallback to any available combination
        if (!foundUnique && tops.length > 0 && bottoms.length > 0) {
            for (const top of tops) {
                for (const bottom of bottoms) {
                    const combo = `${top.id}-${bottom.id}`;
                    if (!usedCombinations.has(combo)) {
                        selectedItems.top = top;
                        selectedItems.bottom = bottom;
                        reasoning.push(`Classic combination of ${top.item_name} with ${bottom.item_name}`);
                        foundUnique = true;
                        break;
                    }
                }
                if (foundUnique) break;
            }
        }

        if (!foundUnique) return null;

        // Add shoes
        if (shoes.length > 0) {
            selectedItems.shoes = shoes[0];
            reasoning.push(`${shoes[0].item_name} completes the look`);
        }

        // Add outerwear for winter
        if (season === 'Winter' && outerwear.length > 0) {
            selectedItems.outerwear = outerwear[0];
            reasoning.push(`${outerwear[0].item_name} keeps you warm`);
        }

        if (Object.keys(selectedItems).length < 2) return null;

        // Generate visualization prompt
        const visualPrompt = this.generateVisualizationPrompt(selectedItems, season, 'safe and neutral');

        return {
            outfit_name: `${season} Safe Bet`,
            style_logic: 'Neutral Color Scheme with Classic Silhouettes',
            season,
            items: selectedItems,
            reasoning: reasoning.join('. ') + '.',
            visualization_prompt: visualPrompt
        };
    }

    /**
   * Generate "Color Pop" outfit - complementary colors for high contrast
   * MUST BE DIFFERENT from Safe Bet
   */
    generateColorPopOutfit(tops, bottoms, fullBody, shoes, outerwear, season, usedCombinations) {
        let selectedItems = {};
        let reasoning = [];
        let foundUnique = false;

        // Find complementary color pairs that haven't been used
        for (const top of tops) {
            for (const bottom of bottoms) {
                const combo = `${top.id}-${bottom.id}`;
                if (!usedCombinations.has(combo) && top.color_hex && bottom.color_hex && isComplementary(top.color_hex, bottom.color_hex)) {
                    selectedItems.top = top;
                    selectedItems.bottom = bottom;
                    reasoning.push(`Bold complementary pairing: ${top.item_name} and ${bottom.item_name} create high contrast`);
                    foundUnique = true;
                    break;
                }
            }
            if (foundUnique) break;
        }

        // Fallback to any colorful items NOT YET USED
        if (!foundUnique && tops.length > 0 && bottoms.length > 0) {
            const colorfulTops = tops.filter(t => t.color_family && t.color_family !== 'Neutrals');
            const colorfulBottoms = bottoms.filter(b => b.color_family && b.color_family !== 'Neutrals');

            // Try colorful combinations first
            const searchTops = colorfulTops.length > 0 ? colorfulTops : tops;
            const searchBottoms = colorfulBottoms.length > 0 ? colorfulBottoms : bottoms;

            for (const top of searchTops) {
                for (const bottom of searchBottoms) {
                    const combo = `${top.id}-${bottom.id}`;
                    if (!usedCombinations.has(combo)) {
                        selectedItems.top = top;
                        selectedItems.bottom = bottom;
                        reasoning.push(`Colorful combination featuring ${top.item_name} and ${bottom.item_name}`);
                        foundUnique = true;
                        break;
                    }
                }
                if (foundUnique) break;
            }
        }

        if (!foundUnique) return null;

        // Add shoes - try different shoes if possible
        if (shoes.length > 1) {
            selectedItems.shoes = shoes[1]; // Use second shoe option
        } else if (shoes.length > 0) {
            selectedItems.shoes = shoes[0];
        }

        // Winter outerwear
        if (season === 'Winter' && outerwear.length > 0) {
            selectedItems.outerwear = outerwear[0];
        }

        if (Object.keys(selectedItems).length < 2) return null;

        // Generate visualization prompt
        const visualPrompt = this.generateVisualizationPrompt(selectedItems, season, 'bold and colorful');

        return {
            outfit_name: `${season} Color Pop`,
            style_logic: 'Complementary Color Theory for Bold Contrast',
            season,
            items: selectedItems,
            reasoning: reasoning.join('. ') + '.',
            visualization_prompt: visualPrompt
        };
    }

    /**
   * Generate "Trend Setter" outfit - monochromatic or high-fashion styling
   * MUST BE DIFFERENT from both Safe Bet and Color Pop
   */
    generateTrendSetterOutfit(tops, bottoms, fullBody, shoes, outerwear, season, usedCombinations) {
        let selectedItems = {};
        let reasoning = [];
        let foundUnique = false;

        // Try monochromatic scheme with unused combinations
        for (const top of tops) {
            if (!top.color_hex) continue;

            const matchingBottoms = bottoms.filter(b => {
                if (!b.color_hex) return false;
                const combo = `${top.id}-${b.id}`;
                if (usedCombinations.has(combo)) return false;

                const topHue = require('tinycolor2')(top.color_hex).toHsl().h;
                const bottomHue = require('tinycolor2')(b.color_hex).toHsl().h;
                return Math.abs(topHue - bottomHue) <= 15;
            });

            if (matchingBottoms.length > 0) {
                selectedItems.top = top;
                selectedItems.bottom = matchingBottoms[0];
                reasoning.push(`Monochromatic sophistication with ${top.item_name} and ${matchingBottoms[0].item_name} in similar tones`);
                foundUnique = true;
                break;
            }
        }

        // Fallback to ANY unused combination
        if (!foundUnique) {
            for (const top of tops) {
                for (const bottom of bottoms) {
                    const combo = `${top.id}-${bottom.id}`;
                    if (!usedCombinations.has(combo)) {
                        selectedItems.top = top;
                        selectedItems.bottom = bottom;
                        reasoning.push(`Fashion-forward pairing of ${top.item_name} with ${bottom.item_name}`);
                        foundUnique = true;
                        break;
                    }
                }
                if (foundUnique) break;
            }
        }

        if (!foundUnique) return null;

        // Add shoes - try third option if available
        if (shoes.length > 2) {
            selectedItems.shoes = shoes[2];
        } else if (shoes.length > 0) {
            selectedItems.shoes = shoes[0];
        }

        // Winter outerwear
        if (season === 'Winter' && outerwear.length > 0) {
            selectedItems.outerwear = outerwear[0];
        }

        if (Object.keys(selectedItems).length < 2) return null;

        // Generate visualization prompt
        const visualPrompt = this.generateVisualizationPrompt(selectedItems, season, 'trendy and sophisticated');

        return {
            outfit_name: `${season} Trend Setter`,
            style_logic: 'Monochromatic or High-Contrast Modern Styling',
            season,
            items: selectedItems,
            reasoning: reasoning.join('. ') + '.',
            visualization_prompt: visualPrompt
        };
    }

    /**
     * Generate AI visualization prompt for Stable Diffusion / DALL-E
     * @param {object} items - Selected outfit items
     * @param {string} season - Season
     * @param {string} vibe - Style vibe description
     * @returns {string} Visualization prompt
     */
    generateVisualizationPrompt(items, season, vibe) {
        let description = `A photorealistic shot of a fit male model standing against a clean white background, wearing a ${vibe} ${season.toLowerCase()} outfit. `;

        const garments = [];

        if (items.top) {
            const color = items.top.color_family || items.top.color_hex || 'colored';
            garments.push(`${color} ${items.top.item_name}`);
        }

        if (items.bottom) {
            const color = items.bottom.color_family || items.bottom.color_hex || 'colored';
            garments.push(`${color} ${items.bottom.item_name}`);
        }

        if (items.shoes) {
            garments.push(`${items.shoes.item_name}`);
        }

        if (items.outerwear) {
            garments.push(`${items.outerwear.item_name} layered on top`);
        }

        description += `He is wearing: ${garments.join(', ')}. `;
        description += `Commercial fashion photography, 8k resolution, sharp focus, professional lighting, ${season === 'Summer' ? 'bright and airy atmosphere' : 'warm studio lighting'}.`;

        return description;
    }
}

module.exports = FashionMatrixAgent;
