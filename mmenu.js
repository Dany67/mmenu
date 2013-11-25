;(function ( $, window, undefined ) {
    var pluginName = 'mobileMenu',
    document = window.document,
    defaults = {
        /**
         * Use a sliding effect.
         */
        slideEffect:true,
        /**
         * Slide top of browser to currently selected item.
         */
        scrollTo:true,
        scrollCntr:"html, body",
        scrollToEasing:true,
        duration:400,
        //once the 'open' transition has started
        onOpenStart:function(listItem) {},
        /**
         * once the 'close' transition has started
         * only called when item is toggled closed
         **/
        onCloseStart:function(listItem) {},
        /**
         * This event is called for after each
         * item is opened. Contextual method
         * called for each ul being opened.
         */
        onOpen:function(listItem) {},
        /**
         * This event is called for after each
         * item is closed. Contextual method
         * called for each ul being closed.
         */
        onClose:function(listItem) {}
    };
    var privateMethods = {
        onClose:function(el, o) {
            o.onClose(el.parent('li').find('> a'));
        },
        scrollTo:function(el, o) {
            if (o.scrollTo) {
                // get top coordinate to scroll to
                var top = el.parent('li').position().top - $(o.scrollCntr).find('*:first-child').position().top;
                if (o.scrollToEasing) $(o.scrollCntr).animate({ scrollTop: top }, o.duration);
                else $(o.scrollCntr).scrollTop(top);
            }
            o.onOpen(el.parent('li').find('> a'));
        },
        execute: function(action, id, callback) {
            if ($(id).length) {
                var o  = $(id).data('options');
                if('close' === action) {
                    if (o.slideEffect) $(id).find('ul').removeClass('active').slideUp(o.duration, function(){privateMethods.onClose($(this), o)});
                    else $(id).find('ul').find('.active').removeClass('active').hide(0, function(){privateMethods.onClose($(this), o)});
                }   
            }
        }
    };
    // Sidr public methods
    var methods = {
        close: function(id, callback) {
            privateMethods.execute('close', id, callback);
        },
    };
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype.init = function () {
        var el = $(this.element);
        var o = this.options;
        el.data('options', o);
        el.find('li').each(function() {
            if ($(this).find('> ul').length) {
                var submenu = $(this);
                submenu.find('> ul').hide();
                submenu.find('> a').on('click', function() {
                    /**
                     * collapse all other siblings on same level.
                     */
                    if (o.slideEffect) $(this).parent('li').siblings().find('.active').removeClass('active').slideUp(o.duration, function(){privateMethods.onClose($(this), o)});
                    else $(this).parent('li').siblings().find('.active').removeClass('active').hide(0, function(){privateMethods.onClose($(this), o)});
                    /**
                     * Close submenu if already open
                     */
                    if ($(this).parent('li').find('> ul').is(':visible')) {
                        o.onCloseStart($(this));
                        // close all applicable children of items beings closed.
                        if (o.slideEffect) $(this).parent('li').find('ul').removeClass('active').slideUp(o.duration, function(){privateMethods.onClose($(this), o)});
                        else $(this).parent('li').find('ul').find('.active').removeClass('active').hide(0, function(){privateMethods.onClose($(this), o)});
                    /**
                     * Open submenu if closed
                     */
                    } else {
                        o.onOpenStart($(this));
                        if (o.slideEffect) $(this).parent('li').find('> ul').addClass('active').slideDown(o.duration, function(){ privateMethods.scrollTo($(this), o); });
                        else $(this).parent('li').find('> ul').addClass('active').show(0, function(){ privateMethods.scrollTo($(this), o); });
                    }
                    return false;
                });
            }
        });   
    };
    $[pluginName] = function( method, id ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.sidr' );
        }    
    };
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    }
}(jQuery, window));