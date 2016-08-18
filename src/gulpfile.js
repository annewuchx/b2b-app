var gulp = require('gulp');
var px2rem = require('gulp-px3rem');
var notify = require('gulp-notify');

var options = {
	baseDpr: 1, // base device pixel ratio (default: 2)
	threeVersion: false, // whether to generate @1x, @2x and @3x version (default: false)
	remVersion: true, // whether to generate rem version (default: true)
	remUnit: 37.5, // rem unit value (default: 75)
	remPrecision: 6 // rem precision (default: 6)
};

gulp.task('px2rem', function() {
	gulp.src('./styles/*.css')
		.pipe(px2rem(options))
		.pipe(notify("Found file: <%= file.relative %>!"))
		.pipe(gulp.dest('./styleflex'))

});

gulp.task('test', function() {
	console.log("gulp is ok");
});

gulp.task('default', ['px2rem'], function() {

});