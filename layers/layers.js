var wms_layers = [];


        var lyr_ESRIGraylight_0 = new ol.layer.Tile({
            'title': 'ESRI Gray (light)',
            'type':'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://{a-d}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
            })
        });
var format_DisadvantagedTracts_1 = new ol.format.GeoJSON();
var features_DisadvantagedTracts_1 = format_DisadvantagedTracts_1.readFeatures(json_DisadvantagedTracts_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_DisadvantagedTracts_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_DisadvantagedTracts_1.addFeatures(features_DisadvantagedTracts_1);
var lyr_DisadvantagedTracts_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_DisadvantagedTracts_1, 
                style: style_DisadvantagedTracts_1,
                popuplayertitle: 'Disadvantaged Tracts',
                interactive: false,
                title: '<img src="styles/legend/DisadvantagedTracts_1.png" /> Disadvantaged Tracts'
            });
var format_StateOutline_2 = new ol.format.GeoJSON();
var features_StateOutline_2 = format_StateOutline_2.readFeatures(json_StateOutline_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_StateOutline_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_StateOutline_2.addFeatures(features_StateOutline_2);
var lyr_StateOutline_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_StateOutline_2, 
                style: style_StateOutline_2,
                popuplayertitle: 'State Outline',
                interactive: false,
                title: '<img src="styles/legend/StateOutline_2.png" /> State Outline'
            });
var format_ActiveMinesJune2025_3 = new ol.format.GeoJSON();
var features_ActiveMinesJune2025_3 = format_ActiveMinesJune2025_3.readFeatures(json_ActiveMinesJune2025_3, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_ActiveMinesJune2025_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_ActiveMinesJune2025_3.addFeatures(features_ActiveMinesJune2025_3);
var lyr_ActiveMinesJune2025_3 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_ActiveMinesJune2025_3, 
                style: style_ActiveMinesJune2025_3,
                popuplayertitle: 'Active Mines June 2025',
                interactive: true,
    title: 'Active Mines June 2025<br />\
    <img src="styles/legend/ActiveMinesJune2025_3_0.png" /> Copper<br />\
    <img src="styles/legend/ActiveMinesJune2025_3_1.png" /> Lithium<br />\
    <img src="styles/legend/ActiveMinesJune2025_3_2.png" /> Nickel<br />' });

lyr_ESRIGraylight_0.setVisible(true);lyr_DisadvantagedTracts_1.setVisible(true);lyr_StateOutline_2.setVisible(true);lyr_ActiveMinesJune2025_3.setVisible(true);
var layersList = [lyr_ESRIGraylight_0,lyr_DisadvantagedTracts_1,lyr_StateOutline_2,lyr_ActiveMinesJune2025_3];
lyr_DisadvantagedTracts_1.set('fieldAliases', {'GEOID10': 'GEOID10', 'SF': 'SF', 'CF': 'CF', 'Area2': 'Area2', });
lyr_StateOutline_2.set('fieldAliases', {'STATEFP': 'STATEFP', 'STATENS': 'STATENS', 'AFFGEOID': 'AFFGEOID', 'GEOID': 'GEOID', 'STUSPS': 'STUSPS', 'NAME': 'NAME', 'LSAD': 'LSAD', 'ALAND': 'ALAND', 'AWATER': 'AWATER', });
lyr_ActiveMinesJune2025_3.set('fieldAliases', {'Name': 'Name', 'Operator': 'Operator', 'State': 'State', 'County': 'County', 'Latitude': 'Latitude', 'Longitude': 'Longitude', 'Commodity': 'Commodity', 'Primary Product': 'Primary Product', 'Primary  Production (kt)': 'Primary  Production (kt)', 'Secondary Product': 'Secondary Product', 'Secondary Production (kt)': 'Secondary Production (kt)', 'TRI Total Air Emissions (kg)': 'TRI Total Air Emissions (kg)', 'NEI Total Air Emissions (kg)': 'NEI Total Air Emissions (kg)', 'Total Air Emissions (kg)': 'Total Air Emissions (kg)', 'Total Water Emissions (kg)': 'Total Water Emissions (kg)', 'Total Land Emissions (kg)': 'Total Land Emissions (kg)', 'Total OffSite Emissions (kg)': 'Total OffSite Emissions (kg)', 'TRI Total Emissions (kg)': 'TRI Total Emissions (kg)', 'Total All Emissions (kg)': 'Total All Emissions (kg)', });
lyr_DisadvantagedTracts_1.set('fieldImages', {'GEOID10': 'TextEdit', 'SF': 'TextEdit', 'CF': 'TextEdit', 'Area2': 'TextEdit', });
lyr_StateOutline_2.set('fieldImages', {'STATEFP': 'TextEdit', 'STATENS': 'TextEdit', 'AFFGEOID': 'TextEdit', 'GEOID': 'TextEdit', 'STUSPS': 'TextEdit', 'NAME': 'TextEdit', 'LSAD': 'TextEdit', 'ALAND': 'TextEdit', 'AWATER': 'TextEdit', });
lyr_ActiveMinesJune2025_3.set('fieldImages', {'Name': 'TextEdit', 'Operator': 'TextEdit', 'State': 'TextEdit', 'County': 'TextEdit', 'Latitude': 'TextEdit', 'Longitude': 'TextEdit', 'Commodity': 'TextEdit', 'Primary Product': 'TextEdit', 'Primary  Production (kt)': 'TextEdit', 'Secondary Product': 'TextEdit', 'Secondary Production (kt)': 'TextEdit', 'TRI Total Air Emissions (kg)': 'TextEdit', 'NEI Total Air Emissions (kg)': 'TextEdit', 'Total Air Emissions (kg)': 'TextEdit', 'Total Water Emissions (kg)': 'TextEdit', 'Total Land Emissions (kg)': 'TextEdit', 'Total OffSite Emissions (kg)': 'TextEdit', 'TRI Total Emissions (kg)': 'TextEdit', 'Total All Emissions (kg)': 'TextEdit', });
lyr_DisadvantagedTracts_1.set('fieldLabels', {'GEOID10': 'no label', 'SF': 'no label', 'CF': 'no label', 'Area2': 'no label', });
lyr_StateOutline_2.set('fieldLabels', {'STATEFP': 'no label', 'STATENS': 'no label', 'AFFGEOID': 'no label', 'GEOID': 'no label', 'STUSPS': 'no label', 'NAME': 'no label', 'LSAD': 'no label', 'ALAND': 'no label', 'AWATER': 'no label', });
lyr_ActiveMinesJune2025_3.set('fieldLabels', {'Name': 'inline label - always visible', 'Operator': 'inline label - always visible', 'State': 'inline label - always visible', 'County': 'inline label - always visible', 'Latitude': 'inline label - always visible', 'Longitude': 'inline label - always visible', 'Commodity': 'inline label - always visible', 'Primary Product': 'inline label - always visible', 'Primary  Production (kt)': 'inline label - always visible', 'Secondary Product': 'inline label - always visible', 'Secondary Production (kt)': 'inline label - always visible', 'TRI Total Air Emissions (kg)': 'hidden field', 'NEI Total Air Emissions (kg)': 'hidden field', 'Total Air Emissions (kg)': 'inline label - always visible', 'Total Water Emissions (kg)': 'inline label - always visible', 'Total Land Emissions (kg)': 'inline label - always visible', 'Total OffSite Emissions (kg)': 'inline label - always visible', 'TRI Total Emissions (kg)': 'hidden field', 'Total All Emissions (kg)': 'inline label - always visible', });
lyr_ActiveMinesJune2025_3.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});