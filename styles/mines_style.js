var size = 0;
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
 
function categories_mines(feature, value, size, resolution, labelText,
                       labelFont, labelFill, bufferColor, bufferWidth,
                       placement) {
    var valueStr = (value !== null && value !== undefined) ? value.toString() : 'default';
    var color = getCommodityColor(valueStr);
 
    return [ new ol.style.Style({
        image: new ol.style.Circle({
            radius: 12.0 + size,
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
var style_chile_mines = mines_style;