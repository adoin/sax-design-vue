import path from 'path'
import { dest, parallel, series, src } from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import rename from 'gulp-rename'
import { vsOutput } from '@vuesax-alpha/build-utils'
import type { TaskFunction } from 'gulp'

const distFolder = path.resolve(__dirname, 'dist')
const distBundle = path.resolve(vsOutput, 'theme-chalk')

/**
 * compile theme-chalk scss & minify
 * not use sass.sync().on('error', sass.logError) to throw exception
 * @returns
 */
function buildThemeChalk() {
  const sass = gulpSass(dartSass)
  const noElPrefixFile = /(index|base|display)/
  return (
    src(path.resolve(__dirname, 'src/*.scss'))
      // Sass compression preserves modern at-rules. clean-css 4 drops @container
      // wrappers and turns responsive query rules into unconditional overrides.
      .pipe(sass.sync({ style: 'compressed' }))
      .pipe(autoprefixer({ cascade: false }))
      .pipe(
        rename((path) => {
          if (!noElPrefixFile.test(path.basename)) {
            path.basename = `vs-${path.basename}`
          }
        }),
      )
      .pipe(dest(distFolder))
  )
}

/**
 * Build dark Css Vars
 * @returns
 */
function buildDarkCssVars() {
  const sass = gulpSass(dartSass)
  return src(path.resolve(__dirname, 'src/dark/css-vars.scss'))
    .pipe(sass.sync({ style: 'compressed' }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(dest(`${distFolder}/dark`))
}

/**
 * copy from packages/theme-chalk/dist to dist/vuesax-alpha/theme-chalk
 */
export function copyThemeChalkBundle() {
  return src(`${distFolder}/**`).pipe(dest(distBundle))
}

/**
 * copy source file to packages
 */

export function copyThemeChalkSource() {
  return src(path.resolve(__dirname, 'src/**')).pipe(
    dest(path.resolve(distBundle, 'src')),
  )
}

export const build: TaskFunction = parallel(
  copyThemeChalkSource,
  series(buildThemeChalk, buildDarkCssVars, copyThemeChalkBundle),
)

export default build
