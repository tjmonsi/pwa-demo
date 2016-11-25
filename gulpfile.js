var gulp = require('gulp');
var gulpif = require('gulp-if');
var watch = require('gulp-watch');
var path = require('path');
var injectSass = require('./gulp-tasks/inject-sass.js');
var swPrecacheConfig = require('./sw-precache-config.js');

global.config = {
  polymerJsonPath: path.join(process.cwd(), 'polymer.json'),
  build: {
    rootDirectory: 'build',
    bundledDirectory: 'bundled',
    unbundledDirectory: 'unbundled',
    // Accepts either 'bundled', 'unbundled', or 'both'
    // A bundled version will be vulcanized and sharded. An unbundled version
    // will not have its files combined (this is for projects using HTTP/2
    // server push). Using the 'both' option will create two output projects,
    // one for bundled and one for unbundled
    bundleType: 'both'
  },
  // Path to your service worker, relative to the build root directory
  serviceWorkerPath: 'service-worker.js',
  // Service Worker precache options based on
  // https://github.com/GoogleChrome/sw-precache#options-parameter
  swPrecacheConfig: swPrecacheConfig
};
/**
 * This is a three part gulpfile. 
 * 
 * 1. SASS Strategy
 * 2. Page Building Strategy
 * 3. Production Building Strategy
 */  

/**
 * SASS STRATEGY
 */ 

gulp.task('watch-all', function(){
  injectSass();
  watch(['pages/**/*.scss', 'web-components/**/*.scss', 'styles/**/*.scss'], injectSass);
});

gulp.task('injectSass', injectSass);


/**
 * PRODUCTION BUILD STRATEGY
 */ 
 
//   Got problems? Try logging 'em
// const logging = require('plylog');
// logging.setVerbose();

// Add your own custom gulp tasks to the gulp-tasks directory
// A few sample tasks are provided for you
// A task should return either a WriteableStream or a Promise
var clean = require('./gulp-tasks/clean.js');
var images = require('./gulp-tasks/images.js');
var project = require('./gulp-tasks/project.js');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var cssSlam = require('css-slam').gulp;
var htmlMinifier = require('gulp-html-minifier');

// The source task will split all of your source files into one
// big ReadableStream. Source files are those in src/** as well as anything
// added to the sourceGlobs property of polymer.json.
// Because most HTML Imports contain inline CSS and JS, those inline resources
// will be split out into temporary files. You can use gulpif to filter files
// out of the stream and run them through specific tasks. An example is provided
// which filters all images and runs them through imagemin
function source() {
  return project.splitSource()
    // Add your own build tasks here!
    .pipe(gulpif('**/*.{png,gif,jpg,svg}', images.minify()))
    .pipe(gulpif(/\.js$/, babel({presets: ['es2015'], compact: true, minified: true})))
    .pipe(gulpif(/\.js$/, uglify({compress: true})))
    .pipe(gulpif(/\.css$/, cssSlam()))
    .pipe(gulpif(/\.html$/, htmlMinifier({collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments: true})))
    .pipe(project.rejoin()); // Call rejoin when you're finished
}

// The dependencies task will split all of your bower_components files into one
// big ReadableStream
// You probably don't need to do anything to your dependencies but it's here in
// case you need it :)
function dependencies() {
  return project.splitDependencies()
    .pipe(gulpif(function(file) {
      return file.path.indexOf('firebase') < 0 && file.path.indexOf('web-animations') < 0 && /\.js$/.test(file.path);
    }, babel({presets: ['es2015'], compact: true, minified: true})))
    .pipe(gulpif(/\.js$/, uglify({compress: true})))
    .pipe(gulpif(/\.css$/, cssSlam()))
    .pipe(gulpif(/\.html$/, htmlMinifier({collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments: true})))
    .pipe(project.rejoin());
}

// Clean the build directory, split all source and dependency files into streams
// and process them, and output bundled and unbundled versions of the project
// with their own service workers
gulp.task('default', gulp.series([
  'injectSass',
  clean([global.config.build.rootDirectory]),
  project.merge(source, dependencies),
  project.serviceWorker
]));