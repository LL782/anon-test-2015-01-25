/*global CS_DICTIONARY:false, console:true, CS:true, Modernizr:false, $:false, define:false*/
define(function(require){
    /*jshint maxstatements:20*/

    /** 
    * @module controllers/app
    * @desc Handles common events and module initialisation
    */
    'use strict';

    var _hasRun = false;

    /**
    * @function
    * @private
    * @desc Initialises the application controller
    * @memberof module:controllers/app
    */
    var init = function(){
        /*jshint maxstatements:19*/

        if (_hasRun){ return; }

        // initialise required modules
        Mods.identify();

        // don't let this init method run again
        _hasRun = true;
    };

    var Mods = {
        /**
        * @function
        * @private
        * @desc Identifies required modules for each mod class element
        * @alias Mods:identify
        * @memberof module:controllers/app
        */
        identify : function(){
            $('.mod').each(function(){
                // identify the modules required by each container and request a load for them
                var $container = $(this);
                var modules = ($container.data('mods') || '').split(',');
                var i = 0;
                var total = modules.length;

                for (i; i<total; i=i+1){
                    if (!modules[i]){ continue; }
                    Mods.load(modules[i], $container);
                }
            });
        },

        /**
        * @function
        * @private
        * @desc Loads and initialises an instance of a module
        * @alias Mods:load
        * @memberof module:controllers/app
        *
        * @param {String} name - Module name
        * @param {Object} $container - (jQuery object) single container element requiring an instance of this module
        */
        load : function(name, $container){
            require(['mods/' + name], function(Module){
                if (!Module){ return; }
                if (typeof Module.init !== undefined){ Module.init($container, $container.data(name) || {}); }
            }); 
        }
    };
    
    // export these methods
    return { init : init };
});