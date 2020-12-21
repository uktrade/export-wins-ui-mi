const { src, dest, series, watch } = require("gulp");
const { format } = require("date-fns");
const gulpClean = require("gulp-clean");
const sourcemaps = require("gulp-sourcemaps");
const gulpSass = require("gulp-sass");
const gulpFileRev = require("gulp-file-rev");
const gulpInject = require("gulp-inject");
const gulpConcat = require("gulp-concat");
const gulpUglify = require("gulp-uglify");
const gulpCleanCSS = require("gulp-clean-css");
const gulpInjectString = require("gulp-inject-string");

const { name, version } = require("./package.json");

const banner = `${name} ${version} ${format(new Date(), "dd-MM-yyyy")}`;

const clean = () => src("dist/*", { read: false }).pipe(gulpClean());

const copyRootFiles = () =>
	src(["server.js", "package.json"]).pipe(dest("dist/"));

const copyAppFiles = () =>
	src(["src/app/**/*", "!**/*.{js,es}hintrc"]).pipe(dest("dist/app"));

const copyPublicFiles = () =>
	src([
		"src/public/**/*",
		"!src/public/sass/**/*",
		"!src/public/js/**/*",
		"!src/**/*.map",
		"!src/public/css/main.css",
		"!src/public/css/investment.css",
	]).pipe(dest("dist/public"));

const sassDev = () =>
	src(["src/public/sass/main.scss", "src/public/sass/investment.scss"])
		.pipe(sourcemaps.init())
		.pipe(
			gulpSass({
				includePaths: "./node_modules/@uktrade/",
			}).on("error", gulpSass.logError)
		)
		.pipe(sourcemaps.write())
		.pipe(dest("src/public/css"));

const sassProd = () =>
	src(["src/public/sass/main.scss", "src/public/sass/investment.scss"])
		.pipe(
			gulpSass({
				outputStyle: "compressed",
				includePaths: "./node_modules/@uktrade/",
			}).on("error", gulpSass.logError)
		)
		.pipe(gulpInjectString.prepend(`/* ${banner} */`))
		.pipe(dest("dist/public/css"));

const minifyLayoutCss = () =>
	src("src/public/css/layout.css")
		.pipe(gulpCleanCSS())
		.pipe(gulpInjectString.prepend(`/* ${banner} */`))
		.pipe(dest("dist/public/css"));

const cssFileRevision = () =>
	src("dist/public/**/*.css").pipe(gulpFileRev()).pipe(dest("dist/public"));

const cleanCssFiles = () =>
	src(
		[
			"dist/public/css/investment.css",
			"dist/public/css/layout.css",
			"dist/public/css/main.css",
		],
		{ read: false }
	).pipe(gulpClean({ force: true }));

const injectBaseCss = () =>
	src("dist/app/views/base.html")
		.pipe(
			gulpInject(src("dist/public/css/layout*.css", { read: false }), {
				name: "layout",
				ignorePath: "/dist",
			})
		)
		.pipe(dest("./dist/app/views"));

const injectLayoutCss = () =>
	src("dist/app/views/layout.html")
		.pipe(
			gulpInject(src("dist/public/css/main*.css", { read: false }), {
				name: "main",
				ignorePath: "/dist",
			})
		)
		.pipe(dest("./dist/app/views"));

const injectInvestmentCss = () =>
	src("dist/app/views/layout-investment.html")
		.pipe(
			gulpInject(src("dist/public/css/investment*.css", { read: false }), {
				name: "investment",
				ignorePath: "/dist",
			})
		)
		.pipe(dest("./dist/app/views"));

const concatBaseTemplateJs = () =>
	src([
		"./node_modules/@uktrade/datahub-header/component/header.js",
		"src/public/js/layout.js",
	])
		.pipe(gulpUglify())
		.pipe(gulpConcat("base.js"))
		.pipe(gulpInjectString.prepend(`/* ${banner} */`))
		.pipe(dest("dist/public/js"));

const concatLayoutTemplateJs = () =>
	src([
		"src/public/js/mi.js",
		"src/public/js/components/*.js",
		"src/public/js/pages/*.js",
	])
		.pipe(gulpUglify())
		.pipe(gulpConcat("layout.js"))
		.pipe(gulpInjectString.prepend(`/* ${banner} */`))
		.pipe(dest("dist/public/js"));

const uglifyVendorJs = () =>
	src("src/public/js/vendor/jessie/jessie.js")
		.pipe(gulpUglify())
		.pipe(gulpInjectString.prepend(`/* ${banner} */`))
		.pipe(dest("dist/public/js"));

const jsFileRevision = () =>
	src("dist/public/**/*.js").pipe(gulpFileRev()).pipe(dest("dist/public"));

const cleanJsFiles = () =>
	src(
		[
			"dist/public/js/base.js",
			"dist/public/js/layout.js",
			"dist/public/js/jessie.js",
		],
		{ read: false }
	).pipe(gulpClean({ force: true }));

const injectBaseJs = () =>
	src(["dist/app/views/base.html"])
		.pipe(
			gulpInject(src("dist/public/js/base*.js", { read: false }), {
				name: "base",
				ignorePath: "/dist",
			})
		)
		.pipe(dest("./dist/app/views"));

const injectVendorJs = () =>
	src("dist/app/views/layout.html")
		.pipe(
			gulpInject(src("dist/public/js/jessie*.js", { read: false }), {
				name: "vendor",
				ignorePath: "/dist",
			})
		)
		.pipe(dest("./dist/app/views"));

const injectLayoutJs = () =>
	src(["dist/app/views/layout.html"])
		.pipe(
			gulpInject(src("dist/public/js/layout*.js", { read: false }), {
				name: "layout",
				ignorePath: "/dist",
			})
		)
		.pipe(dest("./dist/app/views"));

const dist = series(
	clean,
	sassProd,
	copyRootFiles,
	copyAppFiles,
	copyPublicFiles,
	minifyLayoutCss,
	cssFileRevision,
	cleanCssFiles,
	injectBaseCss,
	injectLayoutCss,
	injectInvestmentCss,
	concatBaseTemplateJs,
	concatLayoutTemplateJs,
	uglifyVendorJs,
	jsFileRevision,
	cleanJsFiles,
	injectBaseJs,
	injectVendorJs,
	injectLayoutJs
);

exports.clean = clean;
exports.copyRootFiles = copyRootFiles;
exports.copyAppFiles = copyAppFiles;
exports.copyPublicFiles = copyPublicFiles;
exports.minifyLayoutCss = minifyLayoutCss;
exports.sassDev = sassDev;
exports.sassProd = sassProd;
exports.cssFileRevision = cssFileRevision;
exports.cleanCssFiles = cleanCssFiles;
exports.injectBaseCss = injectBaseCss;
exports.injectLayoutCss = injectLayoutCss;
exports.injectInvestmentCss = injectInvestmentCss;
exports.concatBaseTemplateJs = concatBaseTemplateJs;
exports.concatLayoutTemplateJs = concatLayoutTemplateJs;
exports.injectBaseJs = injectBaseJs;
exports.uglifyVendorJs = uglifyVendorJs;
exports.jsFileRevision = jsFileRevision;
exports.cleanJsFiles = cleanJsFiles;
exports.injectVendorJs = injectVendorJs;
exports.injectLayoutJs = injectLayoutJs;
exports.dist = dist;
exports.default = () => {
	watch("./src/public/**/*.scss", sassDev);
};
