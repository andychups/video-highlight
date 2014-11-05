$.fn.videoHighlight = function () {
    var CANVAS_WIDTH = 1;
    var CANVAS_HEIGHT = 1;

    /**
     * @param {Object} options
     * @param {Object} options.$video – jQuery object with video tag
     * @constructor
     */
    function Plugin (options) {
        this.$video = options.$video;
        this.video = this.$video[0];
        this.$canvas = $('<canvas></canvas>');
        this.canvas = this.$canvas[0];
        this.ctx = this.canvas.getContext('2d');
        this.getColorPoll = null;
        this.timeUpdate = options.timeUpdate || 300;

        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this._addEventListeners();
    }

    /**
     * @private
     * Grab to canvas for pixel array
     * @returns {CanvasPixelArray}
     */
    Plugin.prototype._getMiddleColor = function () {
        if (!this.video) {
            clearInterval(this.getColorPoll);
            this.getColorPoll = null;
        }

        this.ctx.drawImage(this.video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        return this.ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
    };

    /**
     * @private
     * Add event listeners
     */
    Plugin.prototype._addEventListeners = function () {
        var _this = this;

        this.$video.one('timeupdate', function () {
            _this._publishColorData();
            _this._setColorPoll();
        });
    };

    /**
     * @private
     * Trigger event with color data
     */
    Plugin.prototype._publishColorData = function () {
        var frameData = this._getMiddleColor();
        this.$video.trigger('videohl-update', [frameData[0], frameData[1], frameData[2]])
    };

    /**
     * @private
     * Set a poll for getting color every N ms
     */
    Plugin.prototype._setColorPoll = function () {
        var _this = this;

        clearInterval(this.getColorPoll);

        this.getColorPoll = setInterval(function () {
            _this._publishColorData();
        }, this.timeUpdate);
    };

    /**
     * @public
     * Set a time update
     * @param {Number} [time=300]
     */
    Plugin.prototype.setTimeUpdate = function (time) {
        this.timeUpdate = Number(time) || 300;
        this._setColorPoll();
    };

    /**
     * @public
     * Return a time update
     * @returns {Number}
     */
    Plugin.prototype.getTimeUpdate = function () {
        return this.timeUpdate;
    };

    /**
     * @public
     * Destroy instance
     */
    Plugin.prototype.destroy = function () {
        clearInterval(this.getColorPoll);
        this.getColorPoll = null;
        this.canvas = null;
        this.$video.removeData('videohl-api');
        this.$video.removeData('videohl-timeupdate');
    };

    this.each(function () {
        var pluginApi,
            $video = $(this);

        pluginApi = new Plugin({
            '$video': $video,
            'timeUpdate': $video.data('videohl-timeupdate')
        });

        $video.data('videohl-api', pluginApi);
    });

    return this;
};