$.fn.videoHighlight = function (options) {
    var plugin = {};
    var CANVAS_WIDTH = 1;
    var CANVAS_HEIGHT = 1;

    options = $.extend({
        'timeUpdate': 300
    }, options);

    plugin.$video = this;
    plugin.video = this[0];
    plugin.$canvas = $('<canvas></canvas>');
    plugin.canvas = plugin.$canvas[0];
    plugin.ctx = plugin.canvas.getContext('2d');
    plugin.getColorPoll = null;

    plugin.getMiddleColor = function () {
        var frameData;

        if (!plugin.video) {
            clearInterval(plugin.getColorPoll);
            plugin.getColorPoll = null;
        }

        plugin.ctx.drawImage(plugin.video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        frameData = plugin.ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;

        options.callback([frameData[0], frameData[1], frameData[2]]);
    };

    plugin.addEventListeners = function () {
        plugin.$video.on('play', function () {
            plugin.getMiddleColor();
            plugin.getColorPoll = setInterval(function () {
                plugin.getMiddleColor();
            }, options.timeUpdate);
        });
    };

    plugin.init = function () {
        plugin.canvas.width = CANVAS_WIDTH;
        plugin.canvas.height = CANVAS_HEIGHT;
        plugin.addEventListeners();
    };

    plugin.init.call(this);

    return this;
};