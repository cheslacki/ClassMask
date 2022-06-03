const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js([
    'src/js/components/docs.js',
    'src/js/app.js'
], 'demo/assets/js/app.min.js').options({processCssUrls: false});

mix.styles('src/css/app.css', 'demo/assets/css/app.min.css');

mix.js('src/js/components/helpers/HelpersMask.js', 'dist/class-mask.min.js');

mix.js('src/js/app.js', 'dist/class-mask-app.min.js');