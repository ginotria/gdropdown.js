(function($){
  var methods = {

        init : function(options) {

            return this.each(function() {
                var settings = {
                    position: 'bottom right',
                    contentClassName: '',
                    show: function() {},
                    hide: function() {},
                    width: '222'
                };
  
                if(options) {
                    $.extend(settings, options);
                }

                var plugin = this;
                var $plugin = $(this);
                $plugin.settings = settings;
                plugin.type = 'options';
                var classList = $plugin.attr('class').split(/\s+/);
                for (var i=0; i < classList.length; i++) {
                    if (classList[i] === 'dropdown') {
                        plugin.type = 'dropdown';
                        plugin.content = $plugin.next('nav.dropdown-menu').clone();
                    }
                    if (classList[i] === 'poptip') {
                        plugin.type = 'poptip';
                        plugin.content = $plugin.next('nav.poptip-menu').clone();
                    }
                    if (classList[i] === 'options') {
                        plugin.type = 'options';
                        plugin.content = $plugin.next('nav.options-menu').clone();
                    }
                    if (plugin.content) {
                        plugin.content.appendTo($('body'));
                    }
                }
                plugin.content.addClass('gdropdown ' + settings.contentClassName);
                plugin.position = function() {
                    var elementHeight = $plugin.height();
                    var elementPosition = $plugin.offset();
                    var left = elementPosition.left;
                    var top = elementPosition.top + elementHeight;

                    if (plugin.type === 'poptip') {
                        top += 9;
                    }
                    if (settings.position.indexOf('right') > -1 ) {
                        left = (elementPosition.left - plugin.content.outerWidth()) + $plugin.outerWidth();
                    }

                    if (settings.position.indexOf('top') > -1) {
                        top = elementPosition.top - plugin.content.outerHeight();
                    }
                    plugin.content.css({
                        'top': top,
                        'left': left,
                        'width': settings.width + 'px'
                    });

                };
                plugin.show = function() {
                    // hide other gdropdown that might be showing
                    $('.gdropdown').removeClass('active');
                    plugin.content.addClass('active');
                    plugin.position();
                    $plugin.settings.show(plugin.content);
                };
        
                plugin.hide = function() {
                    $('.gddm-open').removeClass('gddm-open');
                    plugin.content.removeClass('active');
                    $plugin.settings.hide();
                };

                $plugin.unbind('click').click(function(e) {
                    e.preventDefault();
                    $plugin.toggleClass('gddm-open')
                    if($plugin.hasClass('gddm-open')) {
                        plugin.show();
                    } else {
                        plugin.hide();
                    }
                    e.stopPropagation();
                });

                $(document).click(function(ev) {
                   if($(ev.target).closest('.gdropdown').length === 0 && !$(ev.target).hasClass('.gddm-open')) {
                        $('.gddm-open').gdropdown('hide');
                   }

                });

            });

        },
        hide: function() {
            return this.each(function() {
                this.hide();
            });   
        }

    };

    $.fn.gdropdown = function(method) {
        if(methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if(typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error("Method " +  method + " does not exist on jQuery.example");
        }
    };
    
})(jQuery);