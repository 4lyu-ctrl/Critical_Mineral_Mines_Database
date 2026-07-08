document.addEventListener('DOMContentLoaded', function () {
    var header = document.getElementById('legend-header');
    var list = document.getElementById('legend-list');
    var toggle = document.getElementById('legend-toggle');

    header.addEventListener('click', function () {
        var collapsed = list.style.display === 'none';
        list.style.display = collapsed ? 'block' : 'none';
        toggle.textContent = collapsed ? '»' : '«';
    });
});