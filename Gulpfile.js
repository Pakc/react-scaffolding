var gulp = require('gulp'),
	path = require('path'),
	del = require('del'),
	historyApiFallback = require('connect-history-api-fallback');

var $ = require('gulp-load-plugins')({
	scope: ['devDependencies'],
	camelize: true,
	lazy: true
});


const ROOT = path.join(__dirname),
	APP = path.join(ROOT, 'app'),
	PUBLIC = path.join(ROOT, 'public'),
	DIST = path.join(ROOT, 'dist'),
	FILES = {
		entry: path.join(APP, 'app.js'),
		index: path.join(PUBLIC, 'index.html'),
		style: path.join(PUBLIC, 'app.css'),
		serveHTML: path.join(DIST, 'index.html')
	};

gulp.task('clean', function(done) {
	del.sync([DIST]);
	done();
});

gulp.task('copy', function() {
	gulp.src(FILES.index)
		.pipe(gulp.dest(DIST))
		.pipe($.connect.reload());
	gulp.src(FILES.style)
		.pipe(gulp.dest(DIST))
		.pipe($.connect.reload());
});

gulp.task('scripts:build', function() {
	gulp.src(FILES.entry)
		.pipe($.webpack({
			output: {
				filename: '[name].js'
			},
			devtool: 'eval',
			watch: true,
			module: {
				loaders: [{
					test: /\.js$/,
					exclude: /node_modules/,
					loaders: ['babel-loader?experimental&optional=runtime']
				}]
			}
		}))
		.pipe(gulp.dest(DIST))
		.pipe($.connect.reload());
});

gulp.task('connect:start', function() {
	$.connect.server({
		root: DIST,
		port: 9000,
		livereload: true,
		middleware: function(connect, opt) {
			return [ historyApiFallback ];
		}
	});
	gulp.src(FILES.serveHTML)
		.pipe($.open('', {
			url: 'http://localhost:9000'
		}));
});

gulp.task('watch:html', function() {
	gulp.watch(FILES.index, ['copy']);
});

gulp.task('dev', [
	'copy',
	'scripts:build',
	'connect:start',
	'watch:html'
]);

gulp.task('tasks', $.taskListing);
gulp.task('default', ['dev']);
