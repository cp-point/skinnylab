const { src, dest, watch, series, parallel } = require('gulp');
const path = require('path');
const gulpif = require('gulp-if');
const through = require('through2');
const browserSync = require('browser-sync');
const del = require('del');
const data = require('gulp-data');
const nunjucksRender = require('gulp-nunjucks-render');
const indent = require('indent.js');
const htmlhint = require("gulp-htmlhint");
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const cleanCSS = require('gulp-clean-css');
// const pxtorem = require('gulp-pxtorem');
const replace = require('gulp-replace');
const dgbl = require('del-gulpsass-blank-lines');
const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
const reporter = require('postcss-reporter');
const syntax_scss = require('postcss-scss');
const mqpacker = require('css-mqpacker');
const sortCSSmq = require('sort-css-media-queries');
const inlineCss = require('gulp-inline-css');
const stylelint = require('stylelint');
const merge = require('merge-stream');
const spritesmith = require('gulp.spritesmith-multi');
const listFilepaths = require('list-filepaths');
const w3cjs = require('gulp-w3cjs');

/* ---------------------------------------------------------------------------------- */

// Settings
const distPath = './dist';
const exportPath = `${distPath}/email/export`;

/* ---------------------------------------------------------------------------------- */

function server(done) {
  browserSync.init({
    https: false,
    open: true,
    port: 7010,
    ui: { port: 7011 },
    ghostMode: { clicks: true, forms: true, scroll: false },
    files: [
      `${distPath}/html-list.html`,
      `${distPath}/css/**/*`,
      `${distPath}/html/**/*`,
      `${distPath}/email/**/*`,
      `${distPath}/img/**/*`,
      `${distPath}/js/**/*`,
    ],
    server: {
      baseDir: distPath,
      directory: true,
    },
  }, done);
}

function delHtml() {
  return del(`${distPath}/html`);
}

function buildHtml(filepath) {
  const isSingleFileBuild = typeof filepath === 'string';

  return src(isSingleFileBuild ? filepath : [
    `./src/html/**/*.html`,
    `!./src/html/**/@inc/**/*.html`,
    `!./src/html/**/@inc*.html`,
  ], {
    base: './src',
    allowEmpty: true
  })
  .pipe(data(file => {
    const relPath = path.relative('./src', file.path);
    const depth = relPath.split(path.sep).length - 1;
    const base = '../'.repeat(depth).slice(0,-1);
	  return {
      path: relPath,
      base: base,
      site: relPath.replace(new RegExp('\\'+path.sep, 'g'), '/').split(/\/(pc|mob)\//)[1],
      htmlBase: `${base}/html`,
      cssBase: `${base}/css`,
      imgBase: `${base}/img`,
      jsBase: `${base}/js`
    };
  }))
  .pipe(nunjucksRender({
    envOptions: {
      autoescape: false
    },
    manageEnv: environment => {
      environment.addFilter('tabIndent', (str, numOfIndents, firstLine) => {
        str = str.replace(/^(?=.)/gm, new Array(numOfIndents + 1).join('\t'));
        if(!firstLine) {
          str = str.replace(/^\s+/,"");
        }
        return str;
      });
    },
    path: [
      './src/html'
    ],
  }))
  .on('error', console.log)

  // htmlhint: HTML 컨벤션 검증
  .pipe(htmlhint('.htmlhintrc'))
  .pipe(htmlhint.reporter())

  // auto indent
  .pipe(gulpif(true, through.obj((file, enc, cb) => {
    // <!-- disableAutoIndent --> 주석이 있는 파일은 auto indent 제외
    if(file.contents.includes('<!-- disableAutoIndent -->')) {
      return cb(null, file);
    }

    var beforeHTML = String(file.contents)
      .replace(/'/g, '&&apos&&')
      .replace(/"/g, '&&quot&&')
      .replace(/(<!--)/g, '&&cmt&&;')
    var afterHTML = indent.html(beforeHTML, { tabString: '	' })
      .replace(/(&&apos&&)/g, '\'')
      .replace(/(&&quot&&)/g, '\"')
      .replace(/(&&cmt&&);/g, '<!--')

    file.contents = Buffer.from(afterHTML);
    return cb(null, file);
  })))

  .pipe(dest(distPath))
  .on('end', () => {
    if(isSingleFileBuild) {
      console.log('\x1b[36m%s\x1b[0m', 'buildHtml', `Finished : ${filepath}`);
    } else {
      console.log('\x1b[36m%s\x1b[0m', 'buildHtml', `Finished : ./src/**/*.html`);
    }
  });
}

const html = series(delHtml, buildHtml);

function w3c() {
  return src([
    `${distPath}/html/**/*.html`,
    `!${distPath}/html/**/@guide/**/*`,
  ])
  .pipe(w3cjs());
}

function delSprite() {
  return del([
    `${distPath}/img/sprite`,
    `./src/scss/**/vendors/*-sprite.scss`,
  ]);
}

function createSprite() {
  const stream = merge();

  listFilepaths('./src/img-sprites')
    .then(filepaths => {
      const dirs = [
        // get unique array 
        ...new Set(
          // filepath map loop
          // [ ~~/dir/two/one/file.png, ... ]
          // => [ ~~/dir/two, ... ]
          filepaths && filepaths.map(v => {
            let dir = v.split(path.sep);
            dir.pop();
            dir.pop();
            dir = dir.join(path.sep);
            dir = path.relative('./src/img-sprites', dir);

            return dir;
          })
        )
      ];

      return dirs;
    })
    .catch(console.error)
    .then(dirs => {
      dirs.forEach((dir, index) => {
        const spriteData = src(`./src/img-sprites/${dir}/**/*.png`)
          .pipe(spritesmith({
            spritesmith: (options, sprite, icons) => {
              options.imgPath = `@@img/sprite/${options.imgName}`;
              options.cssName = `_${sprite}-sprite.scss`;
              options.cssTemplate = null;
              options.cssSpritesheetName = sprite;
              options.padding = 10;
              options.cssVarMap = function(sp) {
                sp.name = `${sprite}-${sp.name}`;
              };

              return options;
            }
          }))
          .on('error', err => {
            console.log(err)
          });

        const imgStream = spriteData.img.pipe(dest(`${distPath}/img/${dir}/sprite`));
        const cssStream = spriteData.css.pipe(dest(`./src/scss/${dir}/vendors`));

        stream.add(imgStream);
        stream.add(cssStream);
      });
    });

  return stream;
}

const sprite = series(delSprite, createSprite);

function delStyle() {
  return del(`${distPath}/css`);
}

function buildStyle(filepath) {
  return src(`./src/scss/${typeof filepath === "function"? '' : filepath.split(path.sep)[2] + '/'}**/*.scss`, { sourcemaps: true })


  // use glob imports
  .pipe(sassGlob())

  .pipe(sass({
    errLogToConsole: true,
    outputStyle: 'compact' // nested, expanded, compact, or compressed.
  }).on('error', sass.logError))
        
  // replacement : @@img
  .pipe(replace('@@img', function() {
    const relPath = path.relative('./src/scss', this.file.path);
    const paths = relPath.split(path.sep);
    const depth = paths.length;
    const base = '../'.repeat(depth).slice(0,-1);

    return `${base}/img` + (depth > 2 ? `/${paths[1]}` : ``);
  }))

  // 브라우저 범위 설정 => .browserlistrc
  .pipe(autoprefixer({
    cascade: true,
    remove: false
  }))

  // px to rem 변환
  // .pipe(pxtorem({
  //   rootValue: 10,
  //   propList: ['*'],
  //   selectorBlackList: [/^html$/],
  // }))

  // minify CSS
  // gulp-sass에서 outputStyle: compressed 일때 px to rem 변환 사용시 소스맵 문제가 있어서 별도로 minify 처리
  .pipe(cleanCSS({
    rebase: false
  }))

  // 미디어 쿼리 그루핑
  // .pipe(postcss([
  //     mqpacker({
  //     sort: sortCSSmq.desktopFirst
  //   })
  // ]))

  // del-gulpsass-blank-lines
  // .pipe(dgbl())

  .pipe(dest(`${distPath}/css${typeof filepath === "function"? '' : '/' + filepath.split(path.sep)[2]}`, { sourcemaps: '.' }))
  .on('end', () => {
    if(typeof filepath === 'string') {
      console.log('\x1b[36m%s\x1b[0m', 'buildStyle', `Finished : ${filepath}`);
    }
  });
}

const style = series(delStyle, buildStyle);

const spriteAndStyle = series(sprite, style);

function delEmailHtml() {
  return del(`${distPath}/email`);
}

function buildEmailHtml(filepath) {
	const isSingleFileBuild = typeof filepath === 'string';

  return src(isSingleFileBuild ? filepath : [
    `./src/email/**/*.html`,
		// `./src/email/**/*.css`,
    `!./src/email/**/@inc/**/*.html`,
    `!./src/email/**/@inc*.html`,
  ], {
    base: './src',
    allowEmpty: true
  })
	.pipe(data(file => {
    const relPath = path.relative('./src', file.path);
    const depth = relPath.split(path.sep).length - 1;
    const base = '../'.repeat(depth).slice(0,-1);
    
    return {
      path: relPath,
      base: base,
      site: relPath.replace(new RegExp('\\'+path.sep, 'g'), '/').split(/\/(html)\//)[1],
      htmlBase: `${base}/html`,
      cssBase: `${base}/css`,
      imgBase: `${base}/img`,
    };
  }))
  .pipe(nunjucksRender({
    envOptions: {
      autoescape: false
    },
    manageEnv: environment => {
      environment.addFilter('tabIndent', (str, numOfIndents, firstLine) => {
        str = str.replace(/^(?=.)/gm, new Array(numOfIndents + 1).join('\t'));
        if(!firstLine) {
          str = str.replace(/^\s+/,"");
        }
        return str;
      });
    },
    path: [
      './src/email'
    ],
  }))
  .on('error', console.log)
	// auto indent
  .pipe(gulpif(true, through.obj((file, enc, cb) => {
    // <!-- disableAutoIndent --> 주석이 있는 파일은 auto indent 제외
    if(file.contents.includes('<!-- disableAutoIndent -->')) {
      return cb(null, file);
    }

    var beforeHTML = String(file.contents)
      .replace(/'/g, '&&apos&&')
      .replace(/"/g, '&&quot&&')
      .replace(/(<!--)/g, '&&cmt&&;')
    var afterHTML = indent.html(beforeHTML, { tabString: '	' })
      .replace(/(&&apos&&)/g, '\'')
      .replace(/(&&quot&&)/g, '\"')
      .replace(/(&&cmt&&);/g, '<!--')

    file.contents = Buffer.from(afterHTML);
    return cb(null, file);
  })))
	.pipe(dest(`${distPath}`))
	.on('end', () => {
    if(isSingleFileBuild) {
      console.log('\x1b[36m%s\x1b[0m', 'buildEmailHtml', `Finished : ${filepath}`);
    } else {
      console.log('\x1b[36m%s\x1b[0m', 'buildEmailHtml', `Finished : ./src/**/*.html`);
    }
  });
}

function delEmailStyle() {
  return del(`${distPath}/email`);
}

function buildEmailStyle(filepath) {
  
  return src([
    `./src/email/**/*.css`,
  ])
  .pipe(dest(`${distPath}/email`));
}

const emailHtml = series(delEmailHtml, buildEmailHtml)
const emailStyle = series(delEmailStyle, buildEmailStyle);

function watchFiles() {
  function htmlChange(file) {
    if(file.indexOf('@inc') > -1) {
      buildHtml();
    } else {
      buildHtml(file);
    }
  }

	function emailHtmlChange(file) {
    if(file.indexOf('@inc') > -1) {
      buildEmailHtml();
    } else {
      buildEmailHtml(file);
    }
  }

	function cssChange(file) {
    if(file.indexOf('@inc') > -1) {
      buildEmailStyle();
    } else {
      buildEmailStyle(file);
    }
  }

  watch(`./src/html/**/*.html`)
    .on('add', htmlChange)
    .on('change', htmlChange)
    .on('unlink', buildHtml);

  watch(`./src/email/**/*.html`)
		.on('add', emailHtmlChange)
		.on('change', emailHtmlChange)
		.on('unlink', buildEmailHtml);

	watch(`./src/email/**/*.css`)
		.on('add', cssChange)
		.on('change', cssChange)
		.on('unlink', cssChange);

  // style lint
  const stylelintrc = require('./.stylelintrc.json');

  function scssChange(file) {
    const srcPath = path.relative('./', file);
    buildStyle(srcPath);

    if(arguments[1] !== undefined) {
      src(file).pipe(postcss([
        stylelint(stylelintrc),
        reporter({
          clearReportedMessages: true,
          clearMessages: true,
          throwError: false
        })
      ], { syntax: syntax_scss }))
    }
  }

  watch([
    './src/scss/**/*.scss',
    '!./src/scss/**/vendors/**',
  ])
    .on('add', scssChange)
    .on('change', scssChange)
    .on('unlink', scssChange);

  watch('./src/img-sprites/**/*', spriteAndStyle);
}

// 기존 인라인으로 빌드된 HTML 삭제
function delInlineBuildHtml() {
  return del(`${exportPath}`);
}

// 새로운 인라인 HTML 빌드
function inlineBuildHtml() {
  
  return src([
    `./dist/email/**/*.html`,
    `./dist/email/**/*.css`,
  ])
  .pipe(inlineCss({
    applyStyleTags: true,
    applyLinkTags: true,
    removeStyleTags: true,
    removeLinkTags: true,
    removeHtmlSelectors: true,
    preserveMediaQueries: true,
    // extraCss: true,
  }))
  .pipe(dest(exportPath));
}

const convertHtml = parallel(series(delInlineBuildHtml, inlineBuildHtml));

exports.w3c = w3c;
exports.build = series(parallel(emailHtml, emailStyle, html, spriteAndStyle));
exports.inlineBuild = convertHtml;
exports.watch = parallel(server, watchFiles);
exports.default = parallel(series(html, server), emailHtml, emailStyle, spriteAndStyle, watchFiles);