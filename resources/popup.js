var SLIDE_GROUPS = [
    {
        title: 'Identity',
        fields: ['Operator', 'State', 'Years of Operation', 'Estimated Total Resources (Mt)']
    },
    {
        title: 'Production',
        fields: ['Primary Product', 'Primary  Production (kt)', 'Secondary Product', 'Secondary Production (kt)']
    },
    {
        title: 'Emissions',
        fields: ['Total Air Emissions (kg)', 'Total Water Emissions (kg)', 'Total Land Emissions (kg)', 'Total All Emissions (kg)']
    }
];

var MISSING_VALUES = [null, undefined, "None reported", "Not reported", "Not Reported", ""];

function hasRealValue(value) {
    return MISSING_VALUES.indexOf(value) === -1;
}

function buildAvailableSlides(feature, layer) {
    var aliases = layer.get('fieldAliases') || {};
    var available = [];

    for (var i = 0; i < SLIDE_GROUPS.length; i++) {
        var group = SLIDE_GROUPS[i];
        var rows = [];

        for (var j = 0; j < group.fields.length; j++) {
            var fieldName = group.fields[j];
            var value = feature.get(fieldName);
            if (hasRealValue(value)) {
                rows.push({
                    label: aliases[fieldName] || fieldName,
                    value: value.toLocaleString ? value.toLocaleString() : value
                });
            }
        }

        if (rows.length > 0) {
            available.push({ title: group.title, rows: rows });
        }
    }

    return available;
}

function createSlidePopup(feature, layer, slideIndex, slides) {
    var slide = slides[slideIndex];
    var name = feature.get('Name') || 'Unknown';

    var html = '<div class="slider-popup">';
    html += '<div class="slider-dots">';
    for (var d = 0; d < slides.length; d++) {
        html += '<span class="slider-dot' + (d === slideIndex ? ' active' : '') + '"></span>';
    }
    html += '</div>';
    html += '<div class="slider-name">' + name + '</div>';
    for (var r = 0; r < slide.rows.length; r++) {
        html += '<div class="slider-row">';
        html += '<span class="slider-label">' + slide.rows[r].label + '</span>';
        html += '<span class="slider-value">' + slide.rows[r].value + '</span>';
        html += '</div>';
    }
    html += '<div class="slider-controls">';
    html += '<a href="#" class="slider-prev">‹</a>';
    html += '<a href="#" class="slider-next">›</a>';
    html += '</div>';
    html += '</div>';
    return html;
}

var currentSlideIndex = 0;
var currentSlideFeature = null;
var currentSlideLayer = null;
var currentSlides = [];

function renderSlide() {
    if (!currentSlideFeature) return;
    content.innerHTML = createSlidePopup(currentSlideFeature, currentSlideLayer, currentSlideIndex, currentSlides);
    container.style.display = 'block';
    overlayPopup.setPosition(popupCoord);

    content.querySelector('.slider-prev').onclick = function(e) {
        e.preventDefault();
        currentSlideIndex = (currentSlideIndex - 1 + currentSlides.length) % currentSlides.length;
        renderSlide();
    };
    content.querySelector('.slider-next').onclick = function(e) {
        e.preventDefault();
        currentSlideIndex = (currentSlideIndex + 1) % currentSlides.length;
        renderSlide();
    };
}

var SLIDER_LAYER_TITLES = ['Active Mines June 2025', 'Chile Mines'];

function onSingleClickFeatures(evt) {
    if (doHover || sketch) {
        return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var found = false;

    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer && feature instanceof ol.Feature && SLIDER_LAYER_TITLES.indexOf(layer.get("popuplayertitle")) !== -1) {
            var slides = buildAvailableSlides(feature, layer);
            if (slides.length === 0) return;
            currentSlideFeature = feature;
            currentSlideLayer = layer;
            currentSlides = slides;
            currentSlideIndex = 0;
            popupCoord = coord;
            found = true;
            return true;
        }
    });

    if (found) {
        renderSlide();
    } else {
        container.style.display = 'none';
        closer.blur();
        currentSlideFeature = null;
    }
}