document.addEventListener('DOMContentLoaded', function () {
    var legend = document.getElementById('legend');
    var header = document.getElementById('legend-header');
    var list = document.getElementById('legend-list');
    var toggle = document.getElementById('legend-toggle');

    function repositionSwitcher() {
        var switcher = document.querySelector('.layer-switcher');
        if (switcher) {
            switcher.style.top = (legend.getBoundingClientRect().height + 16) + 'px';
        }
    }

    header.addEventListener('click', function () {
        var collapsed = list.style.display === 'none';
        list.style.display = collapsed ? 'block' : 'none';
        toggle.textContent = collapsed ? '«' : '»';
        repositionSwitcher();
    });

    window.addEventListener('load', repositionSwitcher);
});
