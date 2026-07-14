document.addEventListener('DOMContentLoaded', function () {
    var legend = document.getElementById('legend');
    var header = document.getElementById('legend-header');

    function repositionSwitcher() {
        var switcher = document.querySelector('.layer-switcher');
        if (switcher) {
            switcher.style.top = (legend.getBoundingClientRect().height + 16) + 'px';
        }
    }

    header.addEventListener('click', function () {
        legend.classList.toggle('collapsed');
        repositionSwitcher();
    });

    window.addEventListener('load', repositionSwitcher);
});