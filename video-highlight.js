$.fn.videoHighlight = function (options) {
    options = $.extend({
        'timeUpdate': 300,
        'debug': false
    }, options);

    var plugin = {};
    var CANVAS_WIDTH = 1;
    var CANVAS_HEIGHT = 1;
    var DEBUG = options.debug;

    plugin.$video = this;
    plugin.video = this[0];
    plugin.$canvas = $('<canvas></canvas>');
    plugin.canvas = plugin.$canvas[0];
    plugin.ctx = plugin.canvas.getContext('2d');
    plugin.getColorPoll = null;

    plugin.log = function () {
        var args;

        if (!DEBUG) {
            return;
        }

        args = Array.prototype.slice.call(arguments);
        args.unshift('videoHighlight >');

        console.log.apply(console, args);
    };

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
        plugin.log('addEventListeners');
        plugin.$video.one('timeupdate', function () {
            plugin.log('fire event "timeupdate" once');
            plugin.getMiddleColor();
            plugin.getColorPoll = setInterval(function () {
                plugin.getMiddleColor();
            }, options.timeUpdate);
        });
    };

    plugin.init = function () {
        plugin.canvas.width = CANVAS_WIDTH;
        plugin.canvas.height = CANVAS_HEIGHT;
        plugin.log('init:', CANVAS_WIDTH, CANVAS_HEIGHT);
        plugin.addEventListeners();
    };

    plugin.init.call(this);

    return this;
};