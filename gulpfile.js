const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass")); //load gulp-sass with the Dart Sass compiler
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
const cssnano = require("cssnano");

// COMPILE SASS

function compileToCSS() {
  return src("scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." }));
}

function startServer(cb) {
  browserSync.init({
    server: {
      baseDir: ".",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
  });
  cb();
}

function reloadBrowser(cb) {
  browserSync.reload();
  cb();
}

function watchTask() {
  watch("*.html", reloadBrowser);
  watch("scss/**/*.scss", series(compileToCSS, reloadBrowser));
}

exports.default = series(compileToCSS, startServer, watchTask);
