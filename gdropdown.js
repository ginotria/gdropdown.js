(function($){
  var methods = {

        init : function(options) {

            return this.each(function() {
                var settings = {
                    position: 'bottom right',
                    offset: {x:0, y:0},
                    contentClassName: '',
                    show: function() {},
                    hide: function() {},
                    width: '100'
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
                        settings.width = options.width || settings.width;
                        plugin.content.appendTo($('body'));
                    }
                }
                $plugin.addClass('gdd-parent');
                var curr_id = (new Date()).getTime() + Math.floor(Math.random() * 20339481);
                $plugin.attr('data-gdd-id', curr_id);
                plugin.content.attr('id', curr_id);

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
                        'top': top + settings.offset.y,
                        'left': left + settings.offset.x,
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

                plugin.remove = function() {
                    console.log('removing ' + plugin.content.attr('id'));
                    plugin.content.remove();
                };

                $plugin.unbind('click').click(function(e) {
                    e.preventDefault();
                    $plugin.toggleClass('gddm-open');
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
        },
        remove: function() {
            return this.each(function() {
                this.remove();
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
    
    if (!window.gdd_observer) {
        window.gdd_observer = new MutationSummary({
            callback: function(summary) {
                var gdd_elements = summary[0];
                for (var i = 0; i < gdd_elements.removed.length; i++) {
                    var t = $(gdd_elements.removed[i]);
                    var id_to_remove = '#' + t.attr('data-gdd-id');
                    console.log('removing ' + id_to_remove);
                    $(id_to_remove).remove();
                }

            },
            queries: [{ attribute: 'data-gdd-id' }]
        });

    }
})(jQuery);