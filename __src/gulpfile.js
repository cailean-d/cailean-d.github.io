const
  { src, dest, parallel, series, watch } = require('gulp'),
  imagemin = require('gulp-imagemin'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  clean = require('gulp-clean'),
  cssnano = require('cssnano'),
  browserSync = require('browser-sync').create(),
  size = require('gulp-size'),
  usedcss = require('usedcss'),
  newer = require('gulp-newer'),
  smartgrid = require('smart-grid'),
  babel = require('gulp-babel'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'), 
  $if = require('gulp-if')

const prod = process.env.NODE_ENV == 'production' || false


const folder = '1'
const config = {
  src: `./${folder}/`,
  dist: `./../design/${folder}/`
}

// ****** POST CSS ******
let postcssPlugins = [
  autoprefixer({ cascade: false }),
  usedcss({ html: [config.src + 'index.html'], ignore: ['.slider__dot.active'] }),
]
if (prod) postcssPlugins.push(cssnano())
// **********************

const cleanDist = _ => {
  return src(config.dist, { read: false, allowEmpty: true })
    .pipe(clean({ force: true }))
}

const css = _ => {
  return src(config.src + 'css/+(style).scss', { sourcemaps: !prod })
    .pipe(sass())
    .pipe(postcss(postcssPlugins))
    .pipe(dest(prod? config.dist + 'css/': config.src + 'css/', { sourcemaps: !prod }))
}

const images = _ => {
  return src(config.src + 'images/*.+(png|jpg|gif|svg)')
    .pipe(newer(config.dist + 'images/'))
    .pipe(imagemin())
    .pipe(size({ showFiles:true }))
    .pipe(dest(config.dist + 'images/'))
}

const html = _ => {
  return src(config.src + 'index.html')
    .pipe(dest(config.dist))
}

const js = _ => {
  return src(config.src + 'js/+(app).js', { sourcemaps: !prod })
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe($if(prod, uglify())) 
    .pipe(rename('script.js')) 
    .pipe(dest(prod? config.dist + 'js/': config.src + 'js/'), { sourcemaps: !prod })
}

const build = prod ? series(cleanDist, html, images, css, js) : series(css, js)

const server = done => {

  browserSync.init({
    server:  {
      baseDir: config.src,
      index: 'index.html',
    },
    port: 3000,
    open: true
  })

  done()
}

const smartgridTask = done => {
  const settings = {
    outputStyle: 'scss',
    columns: 12,
    offset: '30px',
    mobileFirst: false,
    container: {
      maxWidth: '1200px', 
      fields: '30px'
    },
  }
  smartgrid(config.src + 'css', settings);
  done()
}

const reload = done => {
  browserSync.reload()
  done()
}

const watchTask = series(build, server, done => {
  watch(config.src + '*.html', reload)
  watch(config.src + 'css/*.scss', series(css, reload))
  watch(config.src + 'js/*.js', reload)
  watch(config.src + 'images/*', series(images, reload))
  done()
})

exports.default = build
exports.build = build
exports.watch = watchTask
exports.smartgrid = smartgridTask