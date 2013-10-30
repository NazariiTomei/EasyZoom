﻿(function ($) {

    var dw, dh, rw, rh, lx, ly;

    var defaults = {
        loadingNotice: 'Loading image',
        errorNotice:   'The image could not be loaded',
        preventClicks: true
    };

    /**
     * EasyZoom
     * @constructor
     * @param {Object} target
     * @param {Object} options
     */
    function EasyZoom(target, options) {

        this.$target = $(target);
        this.opts = $.extend({}, defaults, options);

        if ( this.isOpen === undefined ) {
            this._init();
        }

        return this;
    }

    /**
     * Init
     * @private
     */
    EasyZoom.prototype._init = function() {
        var self = this;

        // Components
        this.$link   = this.$target.find('a');
        this.$image  = this.$target.find('img');

        this.$flyout = $('<div class="easyzoom-flyout" />');
        this.$notice = $('<div class="easyzoom-notice" />');

        // Setup target events
        this.$target
            .on('mouseenter touchstart', function(e) {
                if ( ! e.originalEvent.touches || e.originalEvent.touches.length === 1) {
                    e.preventDefault();
                    self._show(e);
                }
            })
            .on('mousemove touchmove', function(e) {
                if (self.isOpen) {
                    e.preventDefault();
                    self._move(e);
                }
            })
            .on('mouseleave touchend', function() {
                if (self.isOpen) {
                    self.hide();
                }
            });

        if (this.opts.preventClicks) {
            this.$link.on('click', function(e) {
                e.preventDefault();
            });
        }
    };

    /**
     * Show
     * @private
     * @param {Event} e
     */
    EasyZoom.prototype._show = function(e) {
        var w1, h1, w2, h2;
        var self = this;

        if (! this.isReady) {
            this._load(this.$link.attr('href'), function() {
                self._show(e);
            });

            return;
        }

        this.$target.append(this.$flyout);

        w1 = this.$target.width();
        h1 = this.$target.height();

        w2 = this.$flyout.width();
        h2 = this.$flyout.height();

        dw = this.$zoom.width() - w2;
        dh = this.$zoom.height() - h2;

        rw = dw / w1;
        rh = dh / h1;

        this.isOpen = true;

        this._move(e);
    };

    /**
     * Load
     * @private
     * @param {String} href
     * @param {Function} callback
     */
    EasyZoom.prototype._load = function(href, callback) {
        var self = this;
        var zoom = new Image();

        this.$target.addClass('is-loading').append(this.$notice.text(this.opts.loadingNotice));

        zoom.onerror = function() {
            self.$notice.text(self.opts.errorNotice);
            self.$target.removeClass('is-loading').addClass('is-error');
        };

        zoom.onload = function() {
            self.isReady = true;

            self.$notice.detach();
            self.$flyout.append(self.$zoom);
            self.$target.removeClass('is-loading').addClass('is-ready');

            callback();
        };

        zoom.style.position = 'absolute';
        zoom.src = href;

        this.$zoom = $(zoom);
    };

    /**
     * Move
     * @private
     * @param {Event} e
     */
    EasyZoom.prototype._move = function(e) {

        if (e.type.indexOf('touch') === 0) {
            lx = e.originalEvent.touches[0].pageX;
            ly = e.originalEvent.touches[0].pageY;
        }
        else {
            lx = e.pageX || lx;
            ly = e.pageY || ly;
        }

        var offset  = this.$target.position();
        var pt = ly - offset.top;
        var pl = lx - offset.left;
        var xt = pt * rh;
        var xl = pl * rw;

        xt = (xt > dh) ? dh : xt;
        xl = (xl > dw) ? dw : xl;

        // Do not move the image if the event is outside
        if (xl > 0 && xt > 0) {
            this.$zoom.css({
                top:  '' + (Math.ceil(xt) * -1) + 'px',
                left: '' + (Math.ceil(xl) * -1) + 'px'
            });
        }
    };

    /**
     * Hide
     */
    EasyZoom.prototype.hide = function() {
        if (this.isOpen) {
            this.$flyout.detach();
            this.isOpen = false;
        }
    };

    // jQuery plugin wrapper
    $.fn.easyZoom = function( options ) {
        return this.each(function() {
            if ( ! $.data(this, 'easyZoom') ) {
                $.data(this, 'easyZoom', new EasyZoom(this, options));
            }
        });
    };

    // AMD and CommonJS module compatibility
    if ( typeof define === 'function' && define.amd ){
        define(function() {
            return EasyZoom;
        });
    }
    else if ( typeof module !== 'undefined' && module.exports ) {
        module.exports = EasyZoom;
    }

})(jQuery);
