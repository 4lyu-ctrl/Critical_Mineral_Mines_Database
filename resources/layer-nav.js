document.getElementById('top-right-container').addEventListener('click', function (evt) {
    var label = evt.target.closest('.layer-switcher li.layer > label');
    if (!label) return;

    evt.preventDefault();

    var title = label.textContent.trim();
    var layer = map.getLayers().getArray().find(function (l) {
        return (l.get('title') || '').trim() === title;
    });
    if (!layer || typeof layer.getSource !== 'function') return;

    var source = layer.getSource();
    if (!source || typeof source.getExtent !== 'function') return;

    var extent = source.getExtent();
    if (!extent || extent.some(function (n) { return !isFinite(n); })) return;

    map.getView().fit(extent, {
        padding: [40, 40, 40, 40],
        maxZoom: map.getView().getMaxZoom(),
        duration: 500
    });
});
