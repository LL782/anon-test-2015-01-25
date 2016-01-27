// setup require
// requirejs.config({
//  paths: {
//      // define plugin paths (enable each as required)
//      async: 'libs/require-plugins/async'
//      // font: 'libs/require-plugins/font',
//      // goog: 'libs/require-plugins/goog',
//      // image: 'libs/require-plugins/image',
//      // json: 'libs/require-plugins/json',
//      // noext: 'libs/require-plugins/noext',
//      // mdown: 'libs/require-plugins/mdown',
//  },
//  shim: {
//      'libs/handlebars': {
//          exports: 'Handlebars'
//      }
//  }
// });

// load jquery and controller
require(['libs/jquery', 'controllers/app'], function(j, App){
    $(App.init);
});
