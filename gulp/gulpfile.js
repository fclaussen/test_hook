var gulp = require('gulp');
var	$ = require('gulp-load-plugins')();
var	del = require('del');

var paths = {
	src: {
		php: '../**/*.php',
		img: 'src/img/**/*.{png,jpg,gif,svg}',
		js: [
			'bower_components/what-input/dist/what-input.js',
			'bower_components/foundation-sites/dist/js/foundation.js',
			'src/js/**/*.js',
		],
		scss: 'src/scss/app.scss',
		scssWatch: 'src/scss/**/*.scss'
	},
	dest: {
		img: '../assets/img/',
		js: '../assets/js/',
		css: '../'
	}
};

function errorLog(error) {
    console.log(error.message);
    this.emit('end');
}

gulp.task('sass', function() {
	return gulp.src( paths.src.scss )
		.pipe( $.sass( {
			includePaths: [
				'bower_components/normalize.scss/sass',
				'bower_components/foundation-sites/scss',
				'bower_components/motion-ui/src'
			],
			outputStyle: 'compressed'
		} ) )
		.on('error', errorLog)
		.pipe( $.autoprefixer( 'last 4 versions' ) )
		.pipe( $.headerComment(`
			Theme Name: Test Hook
			Theme URI: http://trewknowledge.com
			Author: Trew Knowledge
			Author URI: http://trewknowledge.com
			Description: A local development starter pack.
			Version: 1.0.0
			License: GNU General Public License v2 or later
			License URI: LICENSE
			Text Domain: test_hook
			Tags:
		`) )
		.pipe( $.rename( 'style.css' ) )
		.pipe( gulp.dest( paths.dest.css ) )
		.pipe( $.livereload() )
		.pipe( $.notify( {
			message: 'SASS style task complete'
		} ) );
});

gulp.task('js', function() {
	return gulp.src( paths.src.js )
		.pipe( $.concat( 'app.min.js' ) )
		.pipe( $.uglify() )
		.on('error', errorLog)
		.pipe( gulp.dest( paths.dest.js ) )
		.pipe($.livereload())
		.pipe( $.notify( {
			message: 'JS script task complete'
		} ) );
});

gulp.task('img:build', function() {
	return gulp.src( paths.src.img )
		.pipe( $.imagemin( {
			optimizationLevel: 7,
			progressive: true,
			interlaced: true
		} ) )
		.on('error', errorLog)
		.pipe( gulp.dest( paths.dest.img ) )
		.pipe( $.livereload() )
		.pipe( $.notify( {
			message: 'IMG minimize task complete'
		} ) );
});

gulp.task('img', ['img:build'], function() {
	return del( paths.src.img );
});


gulp.task('watch', function(){
	$.livereload.listen();

	gulp.watch( paths.src.php, ['bs-reload']);
	gulp.watch( paths.src.scssWatch, ['sass']);
	gulp.watch( paths.src.js, ['js']);
	gulp.watch( paths.src.img, ['img', 'bs-reload']);
});

gulp.task('default', ['sass', 'js', 'img', 'watch']);
