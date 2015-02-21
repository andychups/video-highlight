$.fn.videoHighlight = function () {
    /**
     * @param {Object} options
     * @param {Object} options.$video – jQuery object with video tag
     * @param {Boolean} [options.gradient = false] – Generate colors for gradient
     * @constructor
     */
    function Plugin (options) {
        this.$video = options.$video;
        this.video = this.$video[0];
        this.$canvas = $('<canvas></canvas>');
        this.canvas = this.$canvas[0];
        this.isGradient = Boolean(options.gradient) || false;
        this.ctx = this.canvas.getContext('2d');
        this.getColorPoll = null;
        this.timeUpdate = Number(options.timeUpdate) || 300;

        this.canvas.width = 1;
        this.canvas.height = this.isGradient ? 2 : 1;
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

        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    };

    /**
     * @private
     * Return single color
     * @return {Array} – [R,G,B]
     */
    Plugin.prototype._getSingleMiddleColor = function () {
        var middleColor = this._getMiddleColor();
        return [ middleColor[0], middleColor[1], middleColor[2] ];
    };

    /**
     * @private
     * Return several colors
     * @return {Array} – [[R,G,B], [R,G,B]]
     */
    Plugin.prototype._getSeveralMiddleColor = function () {
        var middleColor = this._getMiddleColor();
        return [
            [ middleColor[0], middleColor[1], middleColor[2] ],
            [ middleColor[4], middleColor[5], middleColor[6] ]
        ];
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
        var frameData = (this.isGradient) ? this._getSeveralMiddleColor() : this._getSingleMiddleColor();

        this.$video.trigger('videohl-update', frameData);
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
        this.$video.removeData('videohl-gradient');
    };

    this.each(function () {
        var pluginApi,
            $video = $(this);

        pluginApi = new Plugin({
            '$video': $video,
            'timeUpdate': $video.data('videohl-timeupdate'),
            'gradient': $video.data('videohl-gradient')
        });

        $video.data('videohl-api', pluginApi);
    });

    return this;
};