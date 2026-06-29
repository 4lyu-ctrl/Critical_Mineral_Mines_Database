var size = 100;
var placement = 'point';
// Define a color mapping for commodities
var commodityColors = {
    'Copper': 'rgba(213,121,93,1.0)',
    'Lithium': 'rgba(191,11,41,1.0)',
    'Nickel': 'rgba(42,135,217,1.0)',
    'Rare Earth Elements': 'rgba(155,89,182,1.0)',
    'Gold': 'rgba(218,165,32,1.0)',
    'Iron': 'rgba(139,69,19,1.0)',
    'Zinc': 'rgba(112,128,144,1.0)',
    'Cobalt': 'rgba(0,71,171,1.0)'
};
// Incase commodity doesn't match a predefined color, 
// we still want it to appear on the map.
var defaultCommodityColor = 'rgba(150,150,150,1.0)'; 

/**
 * Get the color for a given commodity value.
 * @param {string} valueStr
 * @returns {string}
 */
function getCommodityColor(valueStr) {
    for (var key in commodityColors) {
        if (valueStr.indexOf(key) !== -1) {
            return commodityColors[key];
        }
    }
    return defaultCommodityColor;
}

/**
 * Map "Estimated Total Resources (Mt)" to a size category (1-6).
 * @param {number} resources
 * @returns {number}
 */
function getSizeCategory(resources) {
    var val = (resources !== null && resources !== undefined) ? resources : 0;
    switch (true) {
        case (val < 25):
            return 1;
        case (val < 100):
            return 2;
        case (val < 500):
            return 3;
        case (val < 2500):
            return 4;
        case (val < 9000):
            return 5;
        default:
            return 6;
    }
}

// Circle radius (px) for each size category, indexed [category - 1]
var sizeCategoryRadii = [4, 6, 8, 10, 13, 16];
 
function categories_mines(feature, value, size, resolution, labelText,
                       labelFont, labelFill, bufferColor, bufferWidth,
                       placement) {
    var valueStr = (value !== null && value !== undefined) ? value.toString() : 'default';
    var color = getCommodityColor(valueStr);
 
    var resources = feature.get("Estimated Total Resources (Mt)");
    var radius = sizeCategoryRadii[getSizeCategory(resources) - 1];

    return [ new ol.style.Style({
        image: new ol.style.Circle({
            radius: radius,
            displacement: [0, 0],
            stroke: new ol.style.Stroke({color: 'rgba(35,35,35,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 2.28}),
            fill: new ol.style.Fill({color: color})
        }),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
}

var mines_style = function(feature, resolution){
    var labelText = "";
    var value = feature.get("Commodity");
    var labelFont = "10px, sans-serif";
    var labelFill = "#000000";
    var bufferColor = "";
    var bufferWidth = 0;
    var placement = 'point';
 
    return categories_mines(feature, value, size, resolution, labelText,
                            labelFont, labelFill, bufferColor,
                            bufferWidth, placement);
};
var style_ActiveMinesJune2025_3 = mines_style;
var style_Chile = mines_style;
var style_Australia = mines_style;